import express from "express";
import cors from "cors";
import clienteRoutes from "./routes/cliente.routes.js";
import { swaggerUi, specs } from "./swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ms-clientes",
    timestamp: new Date(),
  });
});

app.use("/clientes", clienteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: "Algo deu errado no servidor de clientes!" });
});

export default app;
