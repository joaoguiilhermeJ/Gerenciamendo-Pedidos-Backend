const express = require('express')
const cors = require('cors')
const loggerMiddleware = require('./middlewares/logger.middleware')
const errorMiddleware = require('./middlewares/error.middleware')
const gatewayRoutes = require('./routes/gateway.routes')

const app = express()

// Configurações Globais
app.use(cors())
app.use(loggerMiddleware)

// Roteamento
// Todas as rotas do gateway começam com /api
app.use('/api', gatewayRoutes)

// Fallback para rotas não encontradas no gateway
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Rota não encontrada no API Gateway'
    })
})

// Tratamento de Erros
app.use(errorMiddleware)

module.exports = app
