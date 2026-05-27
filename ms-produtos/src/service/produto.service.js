import * as produtoRepository from "../repositories/produto.repository.js";
import SimpleCache from "../utils/cache.js";

const productCache = new SimpleCache(30000); // 30 seconds TTL
const ALL_PRODUCTS_KEY = "@all";

export async function cadastrar_produto(dados) {
  const nome = String(dados.nome ?? "").trim();
  const preco = parseFloat(dados.preco);
  const estoque = Number(dados.estoque ?? 0);
  const categoria = dados.categoria ? String(dados.categoria).trim() : null;

  if (!nome || isNaN(preco) || preco < 0) {
    throw new Error("Nome e preço válidos são obrigatórios.");
  }

  const novoProduto = await produtoRepository.criar_produto({ nome, preco, estoque, categoria });
  
  // Invalida cache da lista ao cadastrar novo
  productCache.delete(ALL_PRODUCTS_KEY);
  
  return novoProduto;
}

export async function listar_produtos() {
  const cached = productCache.get(ALL_PRODUCTS_KEY);
  if (cached) return cached;

  const produtos = await produtoRepository.listar_produtos();
  productCache.set(ALL_PRODUCTS_KEY, produtos);
  
  return produtos;
}

export async function buscar_produto(id) {
  const idProduto = Number(id);
  if (!Number.isInteger(idProduto) || idProduto <= 0)
    throw new Error("ID inválido");

  const cached = productCache.get(idProduto);
  if (cached) return cached;

  const produto = await produtoRepository.buscar_produto(idProduto);
  if (!produto) throw new Error("Produto não encontrado");
  
  productCache.set(idProduto, produto);
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

  const produto = await produtoRepository.atualizar_produto(idProduto, updates);
  
  // Invalida cache
  productCache.delete(idProduto);
  productCache.delete(ALL_PRODUCTS_KEY);
  
  return produto;
}

export async function deletar_produto(id) {
  const idProduto = Number(id);
  if (!Number.isInteger(idProduto) || idProduto <= 0)
    throw new Error("ID inválido");

  const result = await produtoRepository.deletar_produto(idProduto);
  
  // Invalida cache
  productCache.delete(idProduto);
  productCache.delete(ALL_PRODUCTS_KEY);
  
  return result;
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
  
  // Invalida cache
  productCache.delete(idProduto);
  productCache.delete(ALL_PRODUCTS_KEY);
  
  return produto;
}

