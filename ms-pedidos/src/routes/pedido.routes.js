import express from "express";
import pedidoController from "../controller/pedido.controller.js";
import { validateApiKey } from "../middlewares/auth.js";
import { validarID } from "../middlewares/validate.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarPedidoRequest'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Erro de validação (estoque insuficiente, cliente não encontrado, etc)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: API Key inválida
 */
router.post("/", validateApiKey, pedidoController.criar_pedido);

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Pedidos]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       401:
 *         description: API Key inválida
 */
router.get("/", validateApiKey, pedidoController.listar_todos);

/**
 * @swagger
 * /pedidos/cliente/{idCliente}:
 *   get:
 *     summary: Listar pedidos de um cliente
 *     tags: [Pedidos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de pedidos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: ID do cliente inválido
 *       401:
 *         description: API Key inválida
 */
router.get(
  "/cliente/:idCliente",
  validateApiKey,
  validarID,
  pedidoController.listar_por_cliente,
);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: API Key inválida
 */
router.get("/:id", validateApiKey, validarID, pedidoController.buscar_pedido);

/**
 * @swagger
 * /pedidos/{id}/entregar:
 *   post:
 *     summary: Confirmar entrega do pedido (mudar status para ENTREGUE)
 *     tags: [Pedidos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido entregue com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: ID inválido ou pedido não pode ser entregue
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: API Key inválida
 */
router.post(
  "/:id/entregar",
  validateApiKey,
  validarID,
  pedidoController.entregar_pedido,
);

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Cancelar pedido (devolver estoque para todos os itens)
 *     tags: [Pedidos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso e estoque devolvido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Pedido cancelado e estoque devolvido."
 *       400:
 *         description: ID inválido ou pedido já cancelado
 *       404:
 *         description: Pedido não existe
 *       401:
 *         description: API Key inválida
 */
router.delete(
  "/:id",
  validateApiKey,
  validarID,
  pedidoController.cancelar_pedido,
);

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: "Atualizar pedido (ex: local de entrega)"
 *     tags: [Pedidos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               local:
 *                 type: string
 *                 example: "Rua das Flores, 456"
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: ID inválido ou local inválido
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: API Key inválida
 */
router.put(
  "/:id",
  validateApiKey,
  validarID,
  pedidoController.atualizar_pedido,
);

export default router;
