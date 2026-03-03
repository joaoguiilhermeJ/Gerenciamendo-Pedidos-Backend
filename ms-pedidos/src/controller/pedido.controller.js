import * as pedidosService from "../service/pedido.service.js";

export async function criar_pedido(req, res) {
  try {
    const { idCliente, itens, local } = req.body;
    const novoPedido = await pedidosService.criar_pedido({
      idCliente,
      itens,
      local,
    });
    return res.status(201).json(novoPedido);
  } catch (err) {
    console.error("ERRO CRITICO AO CRIAR PEDIDO:", err);
    return res.status(500).json({
      erro: "Erro interno ao processar o pedido.",
      mensagem: err.message,
    });
  }
}

export async function listar_todos(req, res) {
  try {
    const pedidos = await pedidosService.listar_pedidos();
    return res.status(200).json(pedidos);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function listar_por_cliente(req, res) {
  try {
    const { idCliente } = req.params;
    const pedidos = await pedidosService.buscar_por_cliente(idCliente);
    return res.status(200).json(pedidos);
  } catch (err) {
    return res.status(404).json({ erro: err.message });
  }
}

export async function cancelar_pedido(req, res) {
  try {
    const { id } = req.params;
    await pedidosService.cancelar_pedido(id);
    return res
      .status(200)
      .json({ mensagem: "Pedido cancelado e estoque devolvido." });
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function atualizar_pedido(req, res) {
  try {
    const id = Number(req.params.id);
    const updates = {};
    if (req.body.local !== undefined)
      updates.local = String(req.body.local).trim();
    const pedido = await pedidosService.atualizar_pedido(id, updates);
    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }
    return res.status(200).json(pedido);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function entregar_pedido(req, res) {
  try {
    const { id } = req.params;
    const pedido = await pedidosService.confirmar_entrega(id);
    return res.status(200).json(pedido);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}
