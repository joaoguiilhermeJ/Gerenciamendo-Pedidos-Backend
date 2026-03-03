export function validateApiKey(req, res, next) {
  const key = req.header("x-api-key");
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ erro: "API key inválida." });
  }
  next();
}
