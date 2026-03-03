const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Cliente = sequelize.define('Cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nomeCliente: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome do cliente não pode ser vazio.' }
    }
  },
  contato: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O contato é obrigatório.' }
    }
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'O documento é obrigatório para o cadastro.' }
    }
  }
}, {
  tableName: 'Cliente',
  timestamps: true,
})

module.exports = { Cliente }