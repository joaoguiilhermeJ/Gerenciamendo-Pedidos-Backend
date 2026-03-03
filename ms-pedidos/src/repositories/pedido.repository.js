import { Pedido } from "../model/Pedido.js";
import { ItemPedido } from "../model/ItemPedido.js";

export async function criar(dados, transaction = null) {
  return await Pedido.create(dados, { transaction });
}

export async function criarItem(dados, transaction = null) {
  return await ItemPedido.create(dados, { transaction });
}

export async function listarTodos() {
  return await Pedido.findAll({ include: ["itens"] });
}

export async function buscarPorId(id) {
  return await Pedido.findByPk(id, { include: ["itens"] });
}

export async function buscarPorCliente(idCliente) {
  return await Pedido.findAll({ where: { idCliente }, include: ["itens"] });
}

export async function atualizarStatus(id, status) {
  await Pedido.update({ status }, { where: { idPedido: id } });
  return await Pedido.findByPk(id, { include: ["itens"] });
}

export async function atualizar(id, updates) {
  await Pedido.update(updates, { where: { idPedido: id } });
  return await Pedido.findByPk(id, { include: ["itens"] });
}
