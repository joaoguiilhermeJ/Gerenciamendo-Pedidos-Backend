import express from "express";
import cors from "cors";
import pedidosRoutes from "./routes/pedido.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pedidos", pedidosRoutes);

// tratamento de erros genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: "Algo deu errado no servidor de pedidos!" });
});

export default app;
