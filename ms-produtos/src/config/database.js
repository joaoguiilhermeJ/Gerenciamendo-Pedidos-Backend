const { Sequelize } = require('sequelize')

// uses DATABASE_URL for Neon/Postgres connection with sqlite fallback
const connectionString = process.env.DATABASE_URL || 'sqlite::memory:'
const isPostgres = Boolean(process.env.DATABASE_URL)
const sequelize = new Sequelize(connectionString, {
  dialect: isPostgres ? 'postgres' : 'sqlite',
  dialectOptions: isPostgres
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
    : undefined,
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
  },
})

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Conexão com o banco de dados de Produtos estabelecida')
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error)
  }
}

testConnection()

module.exports = sequelize
