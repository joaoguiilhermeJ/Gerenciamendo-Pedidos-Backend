import { Produto } from "../model/Produto.js";

export async function criar_produto(dados) {
  return await Produto.create(dados);
}

export async function listar_produtos() {
  return await Produto.findAll();
}

export async function buscar_produto(id) {
  return await Produto.findByPk(id);
}

export async function atualizar_produto(id, dados) {
  await Produto.update(dados, { where: { idProduto: id } });
  return await Produto.findByPk(id);
}

export async function deletar_produto(id) {
  const produto = await Produto.findByPk(id);
  if (produto) {
    await Produto.destroy({ where: { idProduto: id } });
    return { id };
  }
  return null;
}
