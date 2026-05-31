import dotenv from 'dotenv'
dotenv.config()

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 10000,
  JWT_SECRET: process.env.JWT_SECRET || "IFPIpantera3324JJM",
  CLIENTES_URL: (
    process.env.MS_CLIENTES_URL || "http://localhost:3001"
  ).replace(/\/$/, ""),
  PRODUTOS_URL: (
    process.env.MS_PRODUTOS_URL || "http://localhost:3002"
  ).replace(/\/$/, ""),
  PEDIDOS_URL: (process.env.MS_PEDIDOS_URL || "http://localhost:3003").replace(
    /\/$/,
    "",
  ),
  FRONTEND_URL: (process.env.FRONTEND_URL || "http://localhost:5173").replace(
    /\/$/,
    "",
  ),
  API_KEY: process.env.API_KEY || "IFPIpantera3324JJM",
};

