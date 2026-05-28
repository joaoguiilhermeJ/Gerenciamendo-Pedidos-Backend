import env from "../config/env.js";

const authMiddleware = (req, res, next) => {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      return res.status(401).json({
        error: true,
        message: "Acesso negado: cabeçalho x-api-key ausente",
      });
    }

    if (apiKey !== env.API_KEY) {
      return res.status(401).json({
        error: true,
        message: "Acesso negado: x-api-key inválida",
      });
    }

    return next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE ERROR]", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: true,
        message: "Erro interno de autenticação",
      });
    }

    return next(error);
  }
};

export default authMiddleware;
