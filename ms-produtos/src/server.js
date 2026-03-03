require('dotenv').config()
const app = require('./app')
const sequelize = require('./config/database')

const PORT = process.env.PORT || 3002

async function startServer() {
  try {
    await sequelize.sync({ force: false })
    console.log('Banco de dados de Produtos sincronizado.')

    app.listen(PORT, () => {
      console.log(`Microserviço de Produtos rodando na porta ${PORT}`)
    })
  } catch (error) {
    console.error('Falha ao iniciar o servidor de produtos:', error)
    process.exit(1)
  }
}

startServer()
