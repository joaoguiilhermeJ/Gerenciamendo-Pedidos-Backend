import axios from "axios";
import pedidoRepository from "../repositories/pedido.repository.js";
import sequelize from "../config/database.js";
import SimpleCache from "../utils/cache.js";

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

// Caches locais para reduzir chamadas HTTP externas
const clientCache = new SimpleCache(30000); // 30s
const productCache = new SimpleCache(30000); // 30s

async function fetchClientById(id) {
  const key = `client:${id}`;
  const cached = clientCache.get(key);
  if (cached) return cached;

  const resp = await axios.get(`${MS_CLIENTES}/${id}`, getAuthHeader());
  clientCache.set(key, resp.data);
  return resp.data;
}

async function fetchProductById(id) {
  const key = `product:${id}`;
  const cached = productCache.get(key);
  if (cached) return cached;

  const resp = await axios.get(`${MS_PRODUTOS}/${id}`, getAuthHeader());
  productCache.set(key, resp.data);
  return resp.data;
}

async function criar_pedido(dados) {
  const { idCliente, itens, local } = dados;

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    throw new Error("O pedido deve conter pelo menos um item.");
  }

  // valida cliente primeiro (usando cache)
  try {
    await fetchClientById(idCliente);
  } catch (error) {
    throw new Error(
      "Falha ao validar cliente: Cliente não encontrado ou serviço fora do ar.",
    );
  }

  try {
    // Busca informações de todos os produtos em paralelo (com cache)
    const validacoes = itens.map(async (item) => {
      try {
        const produto = await fetchProductById(item.idProduto);
        return { item, produto };
      } catch (e) {
        throw new Error(
          `Produto ${item.idProduto} não encontrado ou serviço fora do ar.`,
        );
      }
    });

    const resultados = await Promise.all(validacoes);

    let valorTotal = 0;
    const itensParaSalvar = [];

    for (const { item, produto } of resultados) {
      if (produto.estoque < item.quantidade) {
        throw new Error(
          `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}`,
        );
      }

      const precoUnitario = Number(produto.preco) || 0;
      valorTotal += precoUnitario * item.quantidade;

      itensParaSalvar.push({
        idProduto: item.idProduto,
        quantidade: item.quantidade,
        precoUnitario,
        novoEstoque: produto.estoque - item.quantidade,
      });
    }

    const t = await sequelize.transaction();

    try {
      const novoPedido = await pedidoRepository.criar(
        {
          idCliente,
          valorTotal,
          local,
          status: "PENDENTE",
        },
        t,
      );

      // Criar itens do pedido
      await Promise.all(
        itensParaSalvar.map((item) =>
          pedidoRepository.criarItem(
            {
              idPedido: novoPedido.idPedido,
              idProduto: item.idProduto,
              quantidade: item.quantidade,
              precoUnitario: item.precoUnitario,
            },
            t,
          ),
        ),
      );

      // Atualiza estoque no MS de produtos e atualiza cache local quando possível
      // Nota: Idealmente isso seria via saga ou outbox, mas mantendo a lógica atual síncrona/paralela
      await Promise.all(
        itensParaSalvar.map(async (item) => {
          try {
            const resp = await axios.patch(
              `${MS_PRODUTOS}/${item.idProduto}`,
              { estoque: item.novoEstoque },
              getAuthHeader(),
            );
            // atualiza cache local com a resposta (se retornou o produto atualizado)
            if (resp && resp.data) {
              productCache.set(`product:${item.idProduto}`, resp.data);
            } else {
              // se não houver corpo, apenas atualizar campo estoque parcial no cache
              const cached = productCache.get(`product:${item.idProduto}`);
              if (cached) {
                cached.estoque = item.novoEstoque;
                productCache.set(`product:${item.idProduto}`, cached);
              }
            }
          } catch (err) {
            console.error(
              `Falha ao sincronizar estoque do produto ${item.idProduto}`,
            );
          }
        }),
      );

      await t.commit();
      return pedidoRepository.buscarPorId(novoPedido.idPedido);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
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

  // Devolver estoque para cada item em paralelo
  if (pedido.itens && pedido.itens.length > 0) {
    const devolucoes = pedido.itens.map(async (item) => {
      try {
        // tentar usar cache para obter produto
        const produto = await fetchProductById(item.idProduto).catch(
          () => null,
        );
        const novoEstoque =
          (produto && produto.estoque ? produto.estoque : 0) + item.quantidade;
        const resp = await axios.patch(
          `${MS_PRODUTOS}/${item.idProduto}`,
          { estoque: novoEstoque },
          getAuthHeader(),
        );
        if (resp && resp.data) {
          productCache.set(`product:${item.idProduto}`, resp.data);
        } else {
          const cached = productCache.get(`product:${item.idProduto}`);
          if (cached) {
            cached.estoque = novoEstoque;
            productCache.set(`product:${item.idProduto}`, cached);
          }
        }
      } catch (e) {
        console.error(
          `[PEDIDO SERVICE] Falha ao devolver estoque (Prod: ${item.idProduto}):`,
          e.message,
        );
      }
    });

    await Promise.all(devolucoes);
  }

  return pedidoRepository.atualizarStatus(id, "CANCELADO");
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

  return pedidoRepository.atualizarStatus(id, "ENTREGUE");
}

export default {
  criar_pedido,
  listar_pedidos,
  buscar_pedido,
  buscar_por_cliente,
  cancelar_pedido,
  atualizar_pedido,
  confirmar_entrega,
};
