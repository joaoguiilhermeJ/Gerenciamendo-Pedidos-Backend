import env from "../config/env.js";

const SERVICES = [
  { name: "ms-clientes", url: env.CLIENTES_URL },
  { name: "ms-produtos", url: env.PRODUTOS_URL },
  { name: "ms-pedidos", url: env.PEDIDOS_URL },
];

// Cache simples para evitar verificações frequentes
const healthCache = new Map();
const CACHE_TTL = 10000; // 10 segundos

async function checkServiceHealth(serviceUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 seg timeout

    const response = await fetch(serviceUrl, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok || response.status < 500;
  } catch (error) {
    return false;
  }
}

export async function getServicesHealth() {
  const health = {};
  const now = Date.now();

  for (const service of SERVICES) {
    const cacheKey = service.name;
    const cached = healthCache.get(cacheKey);

    // Se está em cache e ainda válido, usa o cache
    if (cached && now - cached.timestamp < CACHE_TTL) {
      health[service.name] = cached.status;
    } else {
      const isHealthy = await checkServiceHealth(service.url);
      health[service.name] = isHealthy;
      healthCache.set(cacheKey, { status: isHealthy, timestamp: now });
    }
  }

  return health;
}

/**
 * Middleware que adiciona informações de saúde dos serviços ao req
 */
export async function attachServicesHealth(req, res, next) {
  const health = await getServicesHealth();
  req.servicesHealth = health;
  next();
}

/**
 * Endpoint de health check
 */
export async function healthCheckEndpoint(req, res) {
  const health = await getServicesHealth();
  const allHealthy = Object.values(health).every((h) => h === true);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "healthy" : "degraded",
    gateway: "ok",
    services: health,
    timestamp: new Date().toISOString(),
  });
}
