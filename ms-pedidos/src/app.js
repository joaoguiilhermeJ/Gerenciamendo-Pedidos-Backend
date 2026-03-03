const express = require('express')
const cors = require('cors')
const pedidosRoutes = require('./routes/pedido.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-pedidos', timestamp: new Date().toISOString() })
})

app.use('/pedidos', pedidosRoutes)

// tratamento de erros genérico
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ erro: 'Algo deu errado no servidor de pedidos!' })
})

module.exports = app
