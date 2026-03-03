const express = require('express')
const axios = require('axios')
const { createProxyMiddleware } = require('http-proxy-middleware')
const env = require('../config/env')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

/**
 * Função auxiliar para gerar configuração de proxy explícita
 */
const createServiceProxy = (target, pathPattern, internalPath) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${pathPattern}`]: internalPath
        },
        onProxyReq: (proxyReq, req, res) => {
            // Garante que o log mostre o path original e o destino
            console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${target}${internalPath}`)
        },
        onError: (err, req, res) => {
            console.error(`[PROXY ERROR] Falha ao conectar com ${target}:`, err.message)
            res.status(503).json({
                error: true,
                message: 'O serviço de destino está offline ou indisponível no momento.',
                details: err.code === 'ECONNREFUSED' ? 'Service Down' : err.message
            })
        }
    })
}

// Rota de Check do Gateway (Público)
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'api-gateway',
        timestamp: new Date().toISOString()
    })
})

// Check de todos os microserviços (Público para monitoramento)
router.get('/health/services', async (req, res) => {
    const services = [
        { name: 'ms-clientes', url: `${env.CLIENTES_URL}/health` },
        { name: 'ms-produtos', url: `${env.PRODUTOS_URL}/health` },
        { name: 'ms-pedidos', url: `${env.PEDIDOS_URL}/health` }
    ]

    const results = await Promise.all(services.map(async (s) => {
        try {
            const response = await axios.get(s.url, { timeout: 2000 })
            return { service: s.name, status: 'online', data: response.data }
        } catch (error) {
            return { service: s.name, status: 'offline', error: error.message }
        }
    }))

    res.json({
        gateway: 'ok',
        services: results
    })
})

// Mapeamento Explícito dos Microserviços (Protegidos por API Key)
// /api/v1/customers -> MS_CLIENTES/clientes
router.use('/v1/customers', authMiddleware, createServiceProxy(env.CLIENTES_URL, '/api/v1/customers', '/clientes'))

// /api/v1/products -> MS_PRODUTOS/produtos
router.use('/v1/products', authMiddleware, createServiceProxy(env.PRODUTOS_URL, '/api/v1/products', '/produtos'))

// /api/v1/orders -> MS_PEDIDOS/pedidos
router.use('/v1/orders', authMiddleware, createServiceProxy(env.PEDIDOS_URL, '/api/v1/orders', '/pedidos'))

module.exports = router
