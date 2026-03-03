import axios from "axios";
import * as pedidoRepository from "../repositories/pedido.repository.js";
import sequelize from "../config/database.js";

const MS_CLIENTES =
  process.env.CLIENTES_SERVICE_URL || "http://localhost:3001/clientes";
const MS_CATALOGO =
  process.env.PRODUTOS_SERVICE_URL || "http://localhost:3002/produtos";

// cabeçalho de autenticação estático usando API_KEY
const getAuthHeader = () => ({
  headers: { "x-api-key": process.env.API_KEY || "default-api-key" },
});

export async function criar_pedido(dados) {
  const { idCliente, itens, local } = dados;

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    throw new Error("O pedido deve conter pelo menos um item.");
  }

  // valida cliente primeiro
  try {
    await axios.get(`${MS_CLIENTES}/${idCliente}`, getAuthHeader());
  } catch (error) {
    throw new Error(
      "Falha ao validar cliente: Cliente não encontrado ou serviço fora do ar.",
    );
  }

  const t = await sequelize.transaction();

  try {
    let valorTotal = 0;
    const itensParaSalvar = [];

    for (const item of itens) {
      const { idProduto, quantidade } = item;

      let produto;
      try {
        const response = await axios.get(
          `${MS_CATALOGO}/${idProduto}`,
          getAuthHeader(),
        );
        produto = response.data;
      } catch (error) {
        throw new Error(
          `Produto ${idProduto} não encontrado ou serviço fora do ar.`,
        );
      }

      if (produto.estoque < quantidade) {
        throw new Error(
          `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}`,
        );
      }

      const precoUnitario = Number(produto.preco) || 0;
      valorTotal += precoUnitario * quantidade;

      itensParaSalvar.push({
        idProduto,
        quantidade,
        precoUnitario,
        produtoInfo: produto, // Para atualizar o estoque depois
      });
    }

    const novoPedido = await pedidoRepository.criar(
      {
        idCliente,
        valorTotal,
        local,
        status: "PENDENTE",
      },
      t,
    );

    for (const item of itensParaSalvar) {
      await pedidoRepository.criarItem(
        {
          idPedido: novoPedido.idPedido,
          idProduto: item.idProduto,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        },
        t,
      );

      // Atualiza estoque (Opcional: fazer fora da transação se o MS de produtos for externo)
      try {
        await axios.patch(
          `${MS_CATALOGO}/${item.idProduto}`,
          { estoque: item.produtoInfo.estoque - item.quantidade },
          getAuthHeader(),
        );
      } catch (error) {
        console.error(
          `Aviso: Falha ao atualizar estoque do produto ${item.idProduto}`,
        );
      }
    }

    await t.commit();
    return await pedidoRepository.buscarPorId(novoPedido.idPedido);
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function listar_pedidos() {
  const pedidos = await pedidoRepository.listarTodos();
  return pedidos.map((p) => ({
    ...(p.toJSON ? p.toJSON() : p),
    valorTotal: Number(p.valorTotal) || 0,
    itens: (p.itens || []).map((item) => ({
      ...(item.toJSON ? item.toJSON() : item),
      precoUnitario: Number(item.precoUnitario) || 0,
    })),
  }));
}

export async function buscar_pedido(id) {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) throw new Error("Pedido não encontrado.");
  const p = pedido.toJSON ? pedido.toJSON() : pedido;
  return {
    ...p,
    valorTotal: Number(p.valorTotal) || 0,
    itens: (p.itens || []).map((item) => ({
      ...(item.toJSON ? item.toJSON() : item),
      precoUnitario: Number(item.precoUnitario) || 0,
    })),
  };
}

export async function buscar_por_cliente(idCliente) {
  const id = Number(idCliente);
  if (isNaN(id)) throw new Error("ID do cliente inválido.");
  const pedidos = await pedidoRepository.buscarPorCliente(id);
  return pedidos.map((p) => ({
    ...(p.toJSON ? p.toJSON() : p),
    valorTotal: Number(p.valorTotal) || 0,
    itens: (p.itens || []).map((item) => ({
      ...(item.toJSON ? item.toJSON() : item),
      precoUnitario: Number(item.precoUnitario) || 0,
    })),
  }));
}

export async function cancelar_pedido(id) {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) throw new Error("Pedido não existe.");

  if (pedido.status === "CANCELADO")
    throw new Error("Pedido já está cancelado.");

  // Devolver estoque para cada item
  if (pedido.itens) {
    for (const item of pedido.itens) {
      try {
        const respProd = await axios.get(
          `${MS_CATALOGO}/${item.idProduto}`,
          getAuthHeader(),
        );
        const produto = respProd.data;
        await axios.patch(
          `${MS_CATALOGO}/${item.idProduto}`,
          { estoque: (produto.estoque || 0) + item.quantidade },
          getAuthHeader(),
        );
      } catch (e) {
        console.error(
          `Erro ao devolver estoque para o produto ${item.idProduto}`,
        );
      }
    }
  }

  return await pedidoRepository.atualizarStatus(id, "CANCELADO");
}

export async function atualizar_pedido(id, updates) {
  const idPedido = Number(id);
  if (!Number.isInteger(idPedido) || idPedido <= 0)
    throw new Error("ID inválido.");

  if (updates.local !== undefined) {
    const loc = String(updates.local).trim();
    if (!loc) throw new Error("Local inválido");
  }

  const resultado = await pedidoRepository.atualizar(idPedido, updates);
  return resultado;
}

export async function confirmar_entrega(id) {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) throw new Error("Pedido não encontrado.");
  if (pedido.status !== "PENDENTE")
    throw new Error("Apenas pedidos pendentes podem ser entregues.");

  return await pedidoRepository.atualizarStatus(id, "ENTREGUE");
}
