import express from "express";
import * as produtosController from "../controller/produto.controller.js";
import { validarID } from "../middlewares/validate.middleware.js";
import { validateApiKey } from "../middlewares/auth.js";

const router = express.Router();


router.post("/", validateApiKey, produtosController.cadastrar_produto);
router.get("/", validateApiKey, produtosController.listar_produtos);
router.get(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.buscar_produto,
);
router.put(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.atualizar_produto,
);
router.delete(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.deletar_produto,
);
router.patch(
  "/:id",
  validateApiKey,
  validarID,
  produtosController.atualizar_estoque,
);

export default router;