const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    PORT: process.env.PORT || 3000,
    CLIENTES_URL: process.env.CLIENTES_URL || 'http://localhost:3001',
    PRODUTOS_URL: process.env.PRODUTOS_URL || 'http://localhost:3002',
    PEDIDOS_URL: process.env.PEDIDOS_URL || 'http://localhost:3003'
}
