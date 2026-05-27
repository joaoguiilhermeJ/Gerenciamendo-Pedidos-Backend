import express from "express";
import cors from "cors";
import pedidosRoutes from "./routes/pedido.routes.js";
import { swaggerUi, specs } from "./swagger.js";

const app = express();
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ms-pedidos", timestamp: new Date() });
});

app.use("/pedidos", pedidosRoutes);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Rota não encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ status: "error", message: "Erro interno do servidor" });
});

export default app;
