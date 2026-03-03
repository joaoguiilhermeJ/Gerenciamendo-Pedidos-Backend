const express = require('express')
const produtosController = require('../controller/produto.controller')
const { validarID } = require('../middlewares/validate.middleware')
const { validateApiKey } = require('../middlewares/auth')

const router = express.Router()

router.post('/', validateApiKey, produtosController.cadastrar_produto)
router.get('/', validateApiKey, produtosController.listar_produtos)
router.get(
  '/:id',
  validateApiKey,
  validarID,
  produtosController.buscar_produto,
)
router.put(
  '/:id',
  validateApiKey,
  validarID,
  produtosController.atualizar_produto,
)
router.delete(
  '/:id',
  validateApiKey,
  validarID,
  produtosController.deletar_produto,
)
router.patch(
  '/:id',
  validateApiKey,
  validarID,
  produtosController.atualizar_estoque,
)

module.exports = router