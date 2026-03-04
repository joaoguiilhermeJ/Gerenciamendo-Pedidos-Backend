const express = require('express')
const cors = require('cors')

const routes = require('./routes/gateway.routes')
const loggerMiddleware = require('./middlewares/logger.middleware')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(express.json())

app.use(loggerMiddleware)

const corsOptions = {
  origin: [
    'https://gerenciamento-pedidos.vercel.app'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','x-api-key'],
  credentials: true
}

app.use(cors(corsOptions))

// responder corretamente preflight requests
app.options('*', cors(corsOptions))

app.use('/api', routes)

app.use(errorMiddleware)

module.exports = app