const { createProxyMiddleware } = require('http-proxy-middleware')

const customersService = process.env.CUSTOMERS_SERVICE
const productsService = process.env.PRODUCTS_SERVICE
const ordersService = process.env.ORDERS_SERVICE

const fixRequestBody = (proxyReq, req) => {
  if (!req.body || !Object.keys(req.body).length) return

  const bodyData = JSON.stringify(req.body)

  proxyReq.setHeader('Content-Type', 'application/json')
  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))

  proxyReq.write(bodyData)
}

const customersProxy = createProxyMiddleware({
  target: customersService,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/customers': '/clientes'
  },
  onProxyReq: fixRequestBody
})

const productsProxy = createProxyMiddleware({
  target: productsService,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/products': '/produtos'
  },
  onProxyReq: fixRequestBody
})

const ordersProxy = createProxyMiddleware({
  target: ordersService,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/orders': '/pedidos'
  },
  onProxyReq: fixRequestBody
})

module.exports = {
  customersProxy,
  productsProxy,
  ordersProxy
}