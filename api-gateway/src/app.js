import express from "express";
import cors from "cors";

import routes from "./routes/gateway.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();


app.set('trust proxy', 1);

const corsOptions = {
  origin: [
    "https://gerenciamendo-pedidos-frontend-9btj03oty.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  credentials: true,
};


app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 4. Middlewares de parsing e log vêm logo após a liberação do CORS
app.use(express.json());
app.use(loggerMiddleware);


app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  authMiddleware(req, res, next);
});


app.use("/", routes);

app.use(errorMiddleware);

export default app;