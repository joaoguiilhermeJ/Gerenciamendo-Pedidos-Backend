const express = require('express')
const pedidoController = require('../controller/pedido.controller')
const { validateApiKey } = require('../middlewares/auth')
const { validarID } = require('../middlewares/validate.middleware')

const router = express.Router()

router.post('/', validateApiKey, pedidoController.criar_pedido)
router.get('/', validateApiKey, pedidoController.listar_todos)
router.get(
  '/cliente/:idCliente',
  validateApiKey,
  validarID,
  pedidoController.listar_por_cliente,
)
router.post(
  '/:id/entregar',
  validateApiKey,
  validarID,
  pedidoController.entregar_pedido,
)
router.delete(
  '/:id',
  validateApiKey,
  validarID,
  pedidoController.cancelar_pedido,
)
router.put(
  '/:id',
  validateApiKey,
  validarID,
  pedidoController.atualizar_pedido,
)

module.exports = router
