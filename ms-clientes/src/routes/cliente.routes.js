import express from "express";
import clientesController from "../controller/cliente.controller.js";
import { validarID } from "../middlewares/validate.middleware.js";
import { validateApiKey } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Criar novo cliente
 *     tags: [Clientes]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeCliente
 *               - contato
 *               - documento
 *             properties:
 *               nomeCliente:
 *                 type: string
 *                 example: João Silva
 *               contato:
 *                 type: string
 *                 example: "(11) 98765-4321"
 *               documento:
 *                 type: string
 *                 example: "12345678901"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: API Key inválida
 */
router.post("/", validateApiKey, clientesController.cadastrar_cliente);

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar todos os clientes
 *     tags: [Clientes]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: API Key inválida
 */
router.get("/", validateApiKey, clientesController.listar_clientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obter cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: API Key inválida
 */
router.get(
  "/:id",
  validateApiKey,
  validarID,
  clientesController.buscar_cliente,
);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Deletar cliente
 *     tags: [Clientes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: API Key inválida
 */
router.delete(
  "/:id",
  validateApiKey,
  validarID,
  clientesController.deletar_cliente,
);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     tags: [Clientes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeCliente:
 *                 type: string
 *               contato:
 *                 type: string
 *               documento:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: ID inválido ou erro de validação
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: API Key inválida
 */
router.put(
  "/:id",
  validateApiKey,
  validarID,
  clientesController.atualizar_cliente,
);

export default router;
