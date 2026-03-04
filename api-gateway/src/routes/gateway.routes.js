const express = require("express");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");
const env = require("../config/env");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * Função auxiliar para gerar configuração de proxy explícita
 */
const createServiceProxy = (target, pathPattern, internalPath) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${pathPattern}`]: internalPath,
    },
    onProxyReq: (proxyReq, req, res) => {
      // Repassar corpo JSON para requisições POST/PUT/PATCH
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      // Repassar x-api-key para os microserviços
      if (req.headers["x-api-key"]) {
        proxyReq.setHeader("x-api-key", req.headers["x-api-key"]);
      }
      // Logs aprimorados do proxy
      console.log(
        `[PROXY] ${req.method} ${req.originalUrl} -> ${target}${internalPath}`,
      );
    },
    onError: (err, req, res) => {
      console.error(
        `[PROXY ERROR] Falha ao conectar com ${target}:`,
        err.message,
      );
      res.status(503).json({
        error: true,
        message:
          "O serviço de destino está offline ou indisponível no momento.",
        details: err.code === "ECONNREFUSED" ? "Service Down" : err.message,
      });
    },
  });
};

// Rota de saúde no gateway
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "api-gateway",
    timestamp: new Date(),
  });
});

// Rota de diagnóstico dos serviços
router.get("/health/services", async (req, res) => {
  const services = [
    { name: "ms-clientes", url: `${env.CLIENTES_URL}/clientes` },
    { name: "ms-produtos", url: `${env.PRODUTOS_URL}/produtos` },
    { name: "ms-pedidos", url: `${env.PEDIDOS_URL}/pedidos` },
  ];

  const results = await Promise.all(
    services.map(async (s) => {
      try {
        // Note: Endpoints de negócio exigem API Key
        const response = await axios.get(s.url, {
          headers: { "x-api-key": env.API_KEY || req.headers["x-api-key"] },
          timeout: 3000,
        });
        return { service: s.name, status: "online", endpoint: s.url };
      } catch (error) {
        return {
          service: s.name,
          status: "offline",
          error: error.message,
          endpoint: s.url,
        };
      }
    }),
  );

  res.json({
    gateway: "ok",
    services: results,
  });
});

// Mapeamento Explícito dos Microserviços (Protegidos por API Key)
// /api/v1/customers -> MS_CLIENTES/clientes
router.use(
  "/v1/customers",
  authMiddleware,
  createServiceProxy(env.CLIENTES_URL, "/api/v1/customers", "/clientes"),
);

// /api/v1/products -> MS_PRODUTOS/produtos
router.use(
  "/v1/products",
  authMiddleware,
  createServiceProxy(env.PRODUTOS_URL, "/api/v1/products", "/produtos"),
);

// /api/v1/orders -> MS_PEDIDOS/pedidos
router.use(
  "/v1/orders",
  authMiddleware,
  createServiceProxy(env.PEDIDOS_URL, "/api/v1/orders", "/pedidos"),
);

module.exports = router;
