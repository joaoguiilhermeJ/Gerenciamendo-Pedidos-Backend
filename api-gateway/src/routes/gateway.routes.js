const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const env = require('../config/env')

const router = express.Router()

const fixRequestBody = (proxyReq, req) => {
  if (!req.body || !Object.keys(req.body).length) return

  const bodyData = JSON.stringify(req.body)

  proxyReq.setHeader('Content-Type', 'application/json')
  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))

  proxyReq.write(bodyData)
}

router.use('/customers',
  createProxyMiddleware({
    target: env.CLIENTES_URL,
    changeOrigin: true,
    pathRewrite: { '^/customers': '/clientes' },
    onProxyReq: fixRequestBody
  })
)

router.use('/products',
  createProxyMiddleware({
    target: env.PRODUTOS_URL,
    changeOrigin: true,
    pathRewrite: { '^/products': '/produtos' },
    onProxyReq: fixRequestBody
  })
)

router.use('/orders',
  createProxyMiddleware({
    target: env.PEDIDOS_URL,
    changeOrigin: true,
    pathRewrite: { '^/orders': '/pedidos' },
    onProxyReq: fixRequestBody
  })
)

module.exports = router