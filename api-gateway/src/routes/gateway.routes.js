const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const env = require('../config/env')

const router = express.Router()

/**
 * Configuração base para o Proxy
 * target: URL do microserviço
 * internalPath: O path que o microserviço espera (ex: /clientes)
 */
const proxyConfig = (target, internalPath) => ({
    target,
    changeOrigin: true,
    pathRewrite: (path) => {
        // Substitui o path amigável pelo path interno esperado pelo microserviço
        // Exemplo: /api/v1/customers/123 -> /clientes/123
        const newPath = path.replace(/^\/api\/v1\/(customers|products|orders)/, internalPath)
        return newPath
    },
    onError: (err, req, res) => {
        console.error(`[PROXY ERROR] Falha ao conectar com ${target}:`, err.message)

        res.status(503).json({
            error: true,
            message: 'O serviço de destino está offline ou indisponível no momento.',
            details: err.code === 'ECONNREFUSED' ? 'Connection refused (Service Down)' : err.message
        })
    }
})

// Rota de Check do Gateway
router.get('/health', (req, res) => {
    res.json({ status: 'API Gateway is running', version: 'v1' })
})

// Mapeamento dos Microserviços (Padrão Formal v1)
router.use('/v1/customers', createProxyMiddleware(proxyConfig(env.CLIENTES_URL, '/clientes')))
router.use('/v1/products', createProxyMiddleware(proxyConfig(env.PRODUTOS_URL, '/produtos')))
router.use('/v1/orders', createProxyMiddleware(proxyConfig(env.PEDIDOS_URL, '/pedidos')))

module.exports = router
