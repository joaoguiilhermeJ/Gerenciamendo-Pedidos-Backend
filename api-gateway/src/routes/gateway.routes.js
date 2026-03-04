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

router.use(
  '/v1/customers',
  createProxyMiddleware({
    target: env.CLIENTES_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/customers': '/clientes'
    },
    onProxyReq: fixRequestBody
  })
)

router.use(
  '/v1/products',
  createProxyMiddleware({
    target: env.PRODUTOS_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/products': '/produtos'
    },
    onProxyReq: fixRequestBody
  })
)

router.use(
  '/v1/orders',
  createProxyMiddleware({
    target: env.PEDIDOS_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/orders': '/pedidos'
    },
    onProxyReq: fixRequestBody
  })
)

module.exports = router