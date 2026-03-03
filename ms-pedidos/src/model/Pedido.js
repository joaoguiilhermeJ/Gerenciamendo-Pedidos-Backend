import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Pedido = sequelize.define('Pedido', {
  idPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PENDENTE',
  },
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Pedido',
  timestamps: true
});

export default Pedido;