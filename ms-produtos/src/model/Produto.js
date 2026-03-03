import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const Produto = sequelize.define(
  "Produto",
  {
    idProduto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O nome do produto não pode ser vazio." },
      },
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "O preço deve ser um número válido." },
        min: 0,
      },
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "Produto",
    timestamps: true,
  },
);

export default Produto;
