const { Sequelize } = require('sequelize')

// use DATABASE_URL and Neon SSL fallback to sqlite for local development
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
    console.log('Conexão com o banco de dados estabelecida')
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error)
  }
}

testConnection()

module.exports = sequelize
