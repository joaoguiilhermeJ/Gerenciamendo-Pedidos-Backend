import express from "express";
import cors from "cors";

import env from "./config/env.js";
import routes from "./routes/gateway.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { attachServicesHealth, healthCheckEndpoint } from "./middlewares/health.middleware.js";

const app = express();

app.set('trust proxy', 1);

const corsOptions = {
  origin: [
    env.FRONTEND_URL,
    "http://localhost:5173",
    "https://gerenciamendo-pedidos-frontend.vercel.app",
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 4. Middlewares de parsing e log vêm logo após a liberação do CORS
app.use(express.json());
app.use(loggerMiddleware);

// Health check endpoints (sem autenticação)
app.get("/health", healthCheckEndpoint);
app.get("/status", healthCheckEndpoint);

// Middleware que adiciona informações de saúde dos serviços
app.use(attachServicesHealth);

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  authMiddleware(req, res, next);
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;