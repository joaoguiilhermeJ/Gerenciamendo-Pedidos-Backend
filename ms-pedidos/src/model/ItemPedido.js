import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Pedido } from './Pedido.js';

export const ItemPedido = sequelize.define('ItemPedido', {
    idItem: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'idPedido'
        }
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    precoUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'ItemPedido',
    timestamps: false
});

Pedido.hasMany(ItemPedido, { foreignKey: 'idPedido', as: 'itens' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'idPedido' });

export default ItemPedido;
