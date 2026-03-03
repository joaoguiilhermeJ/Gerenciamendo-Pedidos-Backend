export function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res
      .status(403)
      .json({ erro: "Acesso negado: API Key inválida ou ausente." });
  }
  next();
}
