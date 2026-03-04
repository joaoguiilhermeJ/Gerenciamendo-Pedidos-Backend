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

// 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada'
  })
})

// erro 500
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  })
})

module.exports = app