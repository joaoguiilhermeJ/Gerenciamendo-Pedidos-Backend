const express = require('express')
const cors = require('cors')
const pedidosRoutes = require('./routes/pedido.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ms-pedidos',
    timestamp: new Date()
  })
})

app.use('/pedidos', pedidosRoutes)

// Middleware 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada'
  })
})joao @fedora: ~/Downloads/squashfs - root / opt / pt / bin$ curl https://gp-ms-clientes.onrender.com/clientes
{ "erro": "API key inválida." }joao @fedora: ~/Downloads/squashfs - root / opt / pt / bin$ curl https://gp-ms-clientes.onrender.com/produtos
< !DOCTYPE html >
  <html lang="en">
    <head>
      <meta charset="utf-8">
        <title>Error</title>
    </head>
    <body>
      <pre>Cannot GET /produtos</pre>
    </body>
  </html>
joao @fedora: ~/Downloads/squashfs - root / opt / pt / bin$ curl https://gp-ms-clientes.onrender.com/pedidos
< !DOCTYPE html >
  <html lang="en">
    <head>
      <meta charset="utf-8">
        <title>Error</title>
    </head>
    <body>
      <pre>Cannot GET /pedidos</pre>
    </body>
  </html>
joao @fedora: ~/Downloads/squashfs - root / opt / pt / bin$



// Middleware de erro 500
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  })
})

module.exports = app
