const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    PORT: process.env.PORT || 3000,
    CLIENTES_URL: (process.env.CLIENTES_URL || 'http://localhost:3001').replace(/\/$/, ''),
    PRODUTOS_URL: (process.env.PRODUTOS_URL || 'http://localhost:3002').replace(/\/$/, ''),
    PEDIDOS_URL: (process.env.PEDIDOS_URL || 'http://localhost:3003').replace(/\/$/, ''),
    FRONTEND_URL: (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
    API_KEY: process.env.API_KEY || 'default-api-key'
}
