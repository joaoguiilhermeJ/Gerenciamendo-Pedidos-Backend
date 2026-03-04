const axios = require("axios");
const pedidoRepository = require("../repositories/pedido.repository");
const sequelize = require("../config/database");

const MS_CLIENTES =
  (process.env.CLIENTES_URL || "http://localhost:3001").replace(/\/$/, "") +
  "/clientes";
const MS_PRODUTOS =
  (process.env.PRODUTOS_URL || "http://localhost:3002").replace(/\/$/, "") +
  "/produtos";

// cabeçalho de autenticação estático usando API_KEY
const getAuthHeader = () => ({
  headers: { "x-api-key": process.env.API_KEY || "default-api-key" },
  timeout: 10000, // 10 segundos de timeout
});

async function criar_pedido(dados) {
  const { idCliente, itens, local } = dados;

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    throw new Error("O pedido deve conter pelo menos um item.");
  }

  // valida cliente primeiro
  try {
    const clienteUrl = `${MS_CLIENTES}/${idCliente}`;
    console.log("[PEDIDO SERVICE] Validando cliente URL:", clienteUrl);
    console.log("[PEDIDO SERVICE] API_KEY configurada:", !!process.env.API_KEY);

    const response = await axios.get(clienteUrl, getAuthHeader());
    console.log("[PEDIDO SERVICE] Resposta cliente:", response.data);
  } catch (error) {
    console.error("[PEDIDO SERVICE] Erro ao validar cliente:", {
      url: `${MS_CLIENTES}/${idCliente}`,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      data: error.response?.data,
    });
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
        const produtoUrl = `${MS_PRODUTOS}/${idProduto}`;
        console.log("[PEDIDO SERVICE] Validando produto URL:", produtoUrl);

        const response = await axios.get(produtoUrl, getAuthHeader());
        produto = response.data;
        console.log("[PEDIDO SERVICE] Resposta produto:", produto);
      } catch (error) {
        console.error("[PEDIDO SERVICE] Erro ao validar produto:", {
          url: `${MS_PRODUTOS}/${idProduto}`,
          status: error.response?.status,
          message: error.message,
          code: error.code,
        });
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
          `${MS_PRODUTOS}/${item.idProduto}`,
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

async function listar_pedidos() {
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

async function buscar_pedido(id) {
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

async function buscar_por_cliente(idCliente) {
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

async function cancelar_pedido(id) {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) throw new Error("Pedido não existe.");

  if (pedido.status === "CANCELADO")
    throw new Error("Pedido já está cancelado.");

  // Devolver estoque para cada item
  if (pedido.itens) {
    for (const item of pedido.itens) {
      try {
        const respProd = await axios.get(
          `${MS_PRODUTOS}/${item.idProduto}`,
          getAuthHeader(),
        );
        const produto = respProd.data;
        await axios.patch(
          `${MS_PRODUTOS}/${item.idProduto}`,
          { estoque: (produto.estoque || 0) + item.quantidade },
          getAuthHeader(),
        );
      } catch (e) {
        console.error(
          `[PEDIDO SERVICE] Erro ao devolver estoque para o produto ${item.idProduto}:`,
          e.message,
        );
      }
    }
  }

  return await pedidoRepository.atualizarStatus(id, "CANCELADO");
}

async function atualizar_pedido(id, updates) {
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

async function confirmar_entrega(id) {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) throw new Error("Pedido não encontrado.");
  if (pedido.status !== "PENDENTE")
    throw new Error("Apenas pedidos pendentes podem ser entregues.");

  return await pedidoRepository.atualizarStatus(id, "ENTREGUE");
}

module.exports = {
  criar_pedido,
  listar_pedidos,
  buscar_pedido,
  buscar_por_cliente,
  cancelar_pedido,
  atualizar_pedido,
  confirmar_entrega,
};
