import { Router } from "express";
import * as pedidoController from "../controller/pedido.controller.js";
import { validateApiKey } from "../middlewares/auth.js";
import { validarID } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/", validateApiKey, pedidoController.criar_pedido);
router.get("/", validateApiKey, pedidoController.listar_todos);
router.get(
  "/cliente/:idCliente",
  validateApiKey,
  validarID,
  pedidoController.listar_por_cliente,
);
router.post(
  "/:id/entregar",
  validateApiKey,
  validarID,
  pedidoController.entregar_pedido,
);
router.delete(
  "/:id",
  validateApiKey,
  validarID,
  pedidoController.cancelar_pedido,
);
router.put(
  "/:id",
  validateApiKey,
  validarID,
  pedidoController.atualizar_pedido,
);

export default router;
