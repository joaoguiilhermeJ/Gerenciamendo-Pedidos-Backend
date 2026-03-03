const express = require('express')
const cors = require('cors')
const produtosRoutes = require('./routes/produto.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'ms-produtos',
        timestamp: new Date().toISOString()
    })
})

app.use('/produtos', produtosRoutes)

// Middleware 404 para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada'
    })
})

// Middleware de erro 500
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor'
    })
})

module.exports = app
