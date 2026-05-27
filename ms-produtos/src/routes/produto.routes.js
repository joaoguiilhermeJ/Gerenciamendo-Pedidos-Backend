import express from "express";
import produtosController from "../controller/produto.controller.js";
import { validarID } from "../middlewares/validate.middleware.js";
import { validateApiKey } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Produtos]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Notebook
 *               categoria:
 *                 type: string
 *                 example: Eletrônicos
 *               preco:
 *                 type: number
 *                 format: float
 *                 example: 2500.00
 *               estoque:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: API Key inválida
 */
router.post("/", validateApiKey, produtosController.cadastrar_produto);

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Produtos]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       401:
 *         description: API Key inválida
 */
router.get("/", validateApiKey, produtosController.listar_produtos);

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Obter produto por ID
 *     tags: [Produtos]
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
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: API Key inválida
 */
router.get(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.buscar_produto,
);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
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
 *               nome:
 *                 type: string
 *               categoria:
 *                 type: string
 *               preco:
 *                 type: number
 *                 format: float
 *               estoque:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: ID inválido ou erro de validação
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: API Key inválida
 */
router.put(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.atualizar_produto,
);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deletar produto
 *     tags: [Produtos]
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
 *         description: Produto deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: API Key inválida
 */
router.delete(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.deletar_produto,
);

/**
 * @swagger
 * /produtos/{id}:
 *   patch:
 *     summary: Atualizar estoque do produto
 *     tags: [Produtos]
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
 *             required:
 *               - estoque
 *             properties:
 *               estoque:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Estoque atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: ID inválido ou estoque inválido
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: API Key inválida
 */
router.patch(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.atualizar_estoque,
);

export default router;
