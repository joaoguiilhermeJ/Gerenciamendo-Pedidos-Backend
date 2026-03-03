const express = require('express')
const cors = require('cors')
const clienteRoutes = require('./routes/cliente.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ms-clientes', timestamp: new Date().toISOString() })
})

app.use(clienteRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ erro: 'Algo deu errado no servidor de clientes!' })
})

module.exports = app