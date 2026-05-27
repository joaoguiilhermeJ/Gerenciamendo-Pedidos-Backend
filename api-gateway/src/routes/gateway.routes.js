import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import authMiddleware from "../middlewares/auth.middleware.js";
import env from "../config/env.js";

const router = express.Router();

/**
 * Corrige o corpo da requisição JSON para o proxy.
 */
const fixRequestBody = (proxyReq, req) => {
  if (!req.body || !Object.keys(req.body).length) return;

  const bodyData = JSON.stringify(req.body);

  proxyReq.setHeader("Content-Type", "application/json");
  proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

  proxyReq.write(bodyData);
};

/**
 * Cria um proxy para um microserviço com o mapeamento correto de path.
 */
const createServiceProxy = (apiPath, internalPath, targetUrl) => {
  return createProxyMiddleware(apiPath, {
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^${apiPath}`]: internalPath,
    },
    onProxyReq: fixRequestBody,
    onError: (err, req, res) => {
      console.error(
        `[GATEWAY] Erro ao conectar com ${internalPath}:`,
        err.message,
      );
      res
        .status(502)
        .json({ status: "error", message: "Serviço indisponível" });
    },
  });
};

// ✅ SEGURANÇA: Camada de proteção adicional (defesa em profundidade)
router.use(authMiddleware);

// Configuração das rotas conforme exigido
// Mapeia /api/clientes -> /clientes no target http://localhost:3001
router.use(createServiceProxy("/api/clientes", "/clientes", env.CLIENTES_URL));

// Mapeia /api/produtos -> /produtos no target http://localhost:3002
router.use(createServiceProxy("/api/produtos", "/produtos", env.PRODUTOS_URL));

// Mapeia /api/pedidos -> /pedidos no target http://localhost:3003
router.use(createServiceProxy("/api/pedidos", "/pedidos", env.PEDIDOS_URL));

export default router;
