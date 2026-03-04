const express = require('express')
const cors = require('cors')
const loggerMiddleware = require('./middlewares/logger.middleware')
const errorMiddleware = require('./middlewares/error.middleware')
const gatewayRoutes = require('./routes/gateway.routes')
const env = require('./config/env')


const app = express()
app.use(express.json())

const allowedOrigins = [
  'http://localhost:5173',
  env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.use(express.json())
app.use(loggerMiddleware)

app.use('/api', gatewayRoutes)

app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Rota não encontrada no API Gateway'
  })
})

app.use(errorMiddleware)

module.exports = app