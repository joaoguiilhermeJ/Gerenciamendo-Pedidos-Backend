# 🛣️ Mapeamento de Rotas - API Gateway & Microserviços

## Frontend → Gateway → Microserviços

### Clientes

```
Frontend:   GET/POST/PUT/DELETE /api/v1/customers[/:id]
            ↓
Gateway:    pathRewrite "^/api/v1/customers" → "/clientes"
            CLIENTES_URL: https://gp-ms-clientes.onrender.com
            ↓
Ms-Clientes: GET/POST/PUT/DELETE /clientes[/:id]
```

### Produtos

```
Frontend:   GET/POST/PUT/DELETE /api/v1/products[/:id]
            PATCH /api/v1/products/:id (estoque)
            ↓
Gateway:    pathRewrite "^/api/v1/products" → "/produtos"
            PRODUTOS_URL: https://gp-ms-produtos.onrender.com
            ↓
Ms-Produtos: GET/POST/PUT/DELETE /produtos[/:id]
             PATCH /produtos/:id (estoque)
```

### Pedidos

```
Frontend:   GET/POST/PUT/DELETE /api/v1/orders[/:id]
            POST /api/v1/orders/:id/entregar
            ↓
Gateway:    pathRewrite "^/api/v1/orders" → "/pedidos"
            PEDIDOS_URL: https://gp-ms-pedidos.onrender.com
            ↓
Ms-Pedidos:  GET/POST/PUT/DELETE /pedidos[/:id]
             POST /pedidos/:id/entregar
             GET /pedidos/cliente/:idCliente
```

## Variáveis de Ambiente

### api-gateway/.env (Produção no Render)

```
PORT=10000                                           # Render assign automaticamente
CLIENTES_URL=https://gp-ms-clientes.onrender.com   # URL do ms-clientes
PRODUTOS_URL=https://gp-ms-produtos.onrender.com   # URL do ms-produtos
PEDIDOS_URL=https://gp-ms-pedidos.onrender.com     # URL do ms-pedidos
FRONTEND_URL=https://sistema-pedidos.netlify.app   # Frontend Netlify
API_KEY=sua-chave-secreta                          # Chave de autenticação
NODE_ENV=production
```

### api-gateway/.env (Desenvolvimento Local)

```
PORT=3000
CLIENTES_URL=http://localhost:3001
PRODUTOS_URL=http://localhost:3002
PEDIDOS_URL=http://localhost:3003
FRONTEND_URL=http://localhost:5173
API_KEY=default-api-key
NODE_ENV=development
```

### Microserviços (ms-clientes, ms-produtos, ms-pedidos)

```
PORT=3001|3002|3003        # Local
DATABASE_URL=postgres://.. # Neon em produção
API_KEY=sua-chave-secreta  # MESMA do gateway
CLIENTES_URL=...           # Apenas ms-pedidos precisa
PRODUTOS_URL=...           # Apenas ms-pedidos precisa
```

## ✅ Validação de Conectividade

### Health Check

```bash
# Gateway
curl http://localhost:3000/api/health
curl https://gp-api-gateway.onrender.com/api/health

# Todos os microserviços
curl -H "x-api-key: SUA_CHAVE" http://localhost:3000/api/health/services
curl -H "x-api-key: SUA_CHAVE" https://gp-api-gateway.onrender.com/api/health/services
```

### Teste de Rotas

```bash
# Listar Clientes
curl -H "x-api-key: SUA_CHAVE" http://localhost:3000/api/v1/customers

# Listar Produtos
curl -H "x-api-key: SUA_CHAVE" http://localhost:3000/api/v1/products

# Listar Pedidos
curl -H "x-api-key: SUA_CHAVE" http://localhost:3000/api/v1/orders
```

## 🔄 Fluxo de Requisição Completo

1. **Frontend** envia: `GET /api/v1/customers` com header `x-api-key`
2. **Gateway recebe** em `/api` (rota: `/v1/customers`)
3. **authMiddleware** valida `x-api-key`
4. **createServiceProxy** reescreve: `/api/v1/customers` → `/clientes`
5. **Proxy** redireciona para `CLIENTES_URL/clientes`
6. **Ms-Clientes** recebe em `/clientes`
7. **validateApiKey** revalida `x-api-key` (segurança extra)
8. **Controller** processa a requisição
9. **Resposta** retorna via proxy ao frontend

## ⚠️ Possíveis Erros 502

| Causa                                                 | Solução                                    |
| ----------------------------------------------------- | ------------------------------------------ |
| CLIENTES_URL/PRODUTOS_URL/PEDIDOS_URL não configurada | Definir em .env                            |
| API_KEY inconsistente entre gateway e ms              | Usar MESMA chave em todos                  |
| Ms offline                                            | Verificar status em `/api/health/services` |
| Rota reescrita incorretamente                         | Validar `pathRewrite` em gateway.routes.js |
| Method not allowed (POST em GET-only)                 | Verificar se rota suporta METHOD           |

## 📍 Status Atual (4 de Março de 2026)

- ✅ Gateway usa variáveis de ambiente
- ✅ Máximes configuradas corretamente
- ✅ Microserviços seguem padrão REST
- ✅ API_KEY setup consistente
- ✅ URLs de Render documentadas
- ✅ Local development com localhost
- ⚠️ Frontend ainda em testes (Netlify)
