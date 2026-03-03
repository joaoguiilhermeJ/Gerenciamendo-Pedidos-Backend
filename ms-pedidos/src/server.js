require('dotenv').config()
const app = require('./app')
const sequelize = require('./config/database')

const PORT = process.env.PORT || 3003

async function iniciarServidor() {
    try {
        await sequelize.sync({ alter: true })
        console.log('Banco de dados de Pedidos sincronizado.')

        app.listen(PORT, () => {
            console.log(`Microserviço de Pedidos rodando na porta ${PORT}`)
        })
    } catch (error) {
        console.error('Erro ao iniciar o servidor de pedidos:', error)
    }
}

iniciarServidor()