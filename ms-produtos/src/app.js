const express = require('express')
const cors = require('cors')
const produtosRoutes = require('./routes/produto.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ms-produtos', timestamp: new Date().toISOString() })
})

app.use('/produtos', produtosRoutes)

module.exports = app
