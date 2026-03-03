const express = require('express')
const clientesController = require('../controller/cliente.controller')
const { validarID } = require('../middlewares/validate.middleware')
const { validateApiKey } = require('../middlewares/auth')

const router = express.Router()

// todas rotas exigem API key
router.post('/clientes', validateApiKey, clientesController.cadastrar_cliente)
router.get('/clientes', validateApiKey, clientesController.listar_clientes)
router.get(
  '/clientes/:id',
  validateApiKey,
  validarID,
  clientesController.buscar_cliente,
)
router.delete(
  '/clientes/:id',
  validateApiKey,
  validarID,
  clientesController.deletar_cliente,
)
router.put(
  '/clientes/:id',
  validateApiKey,
  validarID,
  clientesController.atualizar_cliente,
)

module.exports = router
