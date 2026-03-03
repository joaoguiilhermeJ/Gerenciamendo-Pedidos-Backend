import * as produtoRepository from "../repositories/produto.repository.js";

export async function cadastrar_produto(dados) {
  const nome = String(dados.nome ?? "").trim();
  const preco = parseFloat(dados.preco);
  const estoque = Number(dados.estoque ?? 0);
  const categoria = dados.categoria ? String(dados.categoria).trim() : null;

  if (!nome || isNaN(preco) || preco < 0) {
    throw new Error("Nome e preço válidos são obrigatórios.");
  }

  return await produtoRepository.criar_produto({ nome, preco, estoque, categoria });
}

export async function listar_produtos() {
  return await produtoRepository.listar_produtos();
}

export async function buscar_produto(id) {
  const idProduto = Number(id);
  if (!Number.isInteger(idProduto) || idProduto <= 0)
    throw new Error("ID inválido");

  const produto = await produtoRepository.buscar_produto(idProduto);
  if (!produto) throw new Error("Produto não encontrado");
  return produto;
}

export async function atualizar_produto(id, dados) {
  const idProduto = Number(id);
  if (!Number.isInteger(idProduto) || idProduto <= 0)
    throw new Error("ID inválido");

  const updates = {};
  if (dados.nome) updates.nome = String(dados.nome).trim();
  if (dados.preco !== undefined) updates.preco = parseFloat(dados.preco);
  if (dados.estoque !== undefined) updates.estoque = Number(dados.estoque);
  if (dados.categoria !== undefined) updates.categoria = dados.categoria ? String(dados.categoria).trim() : null;

  return await produtoRepository.atualizar_produto(idProduto, updates);
}

export async function deletar_produto(id) {
  const idProduto = Number(id);
  if (!Number.isInteger(idProduto) || idProduto <= 0)
    throw new Error("ID inválido");

  return await produtoRepository.deletar_produto(idProduto);
}

export async function atualizar_estoque(id, quantidade) {
  const idProduto = Number(id);
  if (!Number.isInteger(idProduto) || idProduto <= 0)
    throw new Error("ID inválido");

  if (quantidade === undefined || isNaN(Number(quantidade))) {
    throw new Error("Quantidade de estoque inválida");
  }

  const produto = await produtoRepository.buscar_produto(idProduto);
  if (!produto) throw new Error("Produto não encontrado");

  produto.estoque = quantidade;
  await produto.save();
  return produto;
}
