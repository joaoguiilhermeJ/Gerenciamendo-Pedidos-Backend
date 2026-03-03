import express from "express";
import cors from "cors";
import produtosRoutes from "./routes/produto.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/produtos", produtosRoutes);

export default app;
