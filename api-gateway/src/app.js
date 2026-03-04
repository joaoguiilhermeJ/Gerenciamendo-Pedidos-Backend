const express = require('express')
const cors = require('cors')

const routes = require('./routes/gateway.routes')
const loggerMiddleware = require('./middlewares/logger.middleware')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

// Parser JSON
app.use(express.json())

// Logger de requisições
app.use(loggerMiddleware)

// CORS para permitir acesso do frontend no Vercel
app.use(cors({
  origin: [
    'https://gerenciamento-pedidos.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}))

// Permitir preflight requests
app.options('*', cors())

// Rotas do API Gateway
app.use('/api', routes)

// Middleware de erro global
app.use(errorMiddleware)

module.exports = app