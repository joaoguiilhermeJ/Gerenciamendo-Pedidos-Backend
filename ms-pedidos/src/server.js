import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/database.js";

const PORT = process.env.PORT || 3003;

// Capturar erros não tratados que podem derrubar o processo silenciosamente
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "[PEDIDOS FATAL] Rejeição não tratada em:",
    promise,
    "razão:",
    reason,
  );
});

process.on("uncaughtException", (error) => {
  console.error("[PEDIDOS FATAL] Exceção não capturada:", error);
  process.exit(1);
});

async function iniciarServidor() {
  try {
    console.log("[PEDIDOS] Iniciando sincronização do banco de dados...");
    await sequelize.sync({ alter: true });
    console.log("[PEDIDOS] Banco de dados sincronizado.");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`[PEDIDOS] Microserviço rodando na porta ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("[PEDIDOS SERVER ERROR]:", error);
    });

    server.on("close", () => {
      console.log("[PEDIDOS SERVER] Conexão fechada.");
    });
  } catch (error) {
    console.error("[PEDIDOS STARTUP ERROR]:", error);
    process.exit(1);
  }
}

// Inicia o servidor (não usar top-level await para compatibilidade)
iniciarServidor();
