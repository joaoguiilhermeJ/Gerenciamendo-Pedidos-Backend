import express from "express";
import * as clientesController from "../controller/cliente.controller.js";
import { validarID } from "../middlewares/validate.middleware.js";
import { validateApiKey } from "../middlewares/auth.js";

const router = express.Router();

// todas rotas exigem API key
router.post("/clientes", validateApiKey, clientesController.cadastrar_cliente);
router.get("/clientes", validateApiKey, clientesController.listar_clientes);
router.get(
  "/clientes/:id",
  validateApiKey,
  validarID,
  clientesController.buscar_cliente,
);
router.delete(
  "/clientes/:id",
  validateApiKey,
  validarID,
  clientesController.deletar_cliente,
);
router.put(
  "/clientes/:id",
  validateApiKey,
  validarID,
  clientesController.atualizar_cliente,
);

export default router;
