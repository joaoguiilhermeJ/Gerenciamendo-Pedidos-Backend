import express from "express";
import cors from "cors";
import produtosRoutes from "./routes/produto.routes.js";
import { swaggerUi, specs } from "./swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.set('trust proxy', 1);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ms-produtos",
    timestamp: new Date(),
  });
});

app.use("/produtos", produtosRoutes);

// Middleware 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Rota não encontrada",
  });
});

// Middleware de erro 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
});

export default app;
