import express from "express";
import cors from "cors";

import routes from "./routes/gateway.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

const corsOptions = {
  origin: ["https://gerenciamento-pedidos.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  credentials: true,
};

app.use(cors(corsOptions));

// responder corretamente preflight requests
app.options("*", cors(corsOptions));

// ✅ SEGURANÇA: Validar API Key em TODAS as requisições
app.use(authMiddleware);

app.use("/", routes);

app.use(errorMiddleware);

export default app;
