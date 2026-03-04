# 📋 Checklist de Configuração para Produção (Render + Netlify)

## 1. API Gateway (Render)

### Variáveis de Ambiente Obrigatórias

```
CLIENTES_URL = https://[SEU_MS_CLIENTES].onrender.com
PRODUTOS_URL = https://[SEU_MS_PRODUTOS].onrender.com
PEDIDOS_URL = https://[SEU_MS_PEDIDOS].onrender.com
API_KEY = [MESMA CHAVE USADA EM TODOS OS MICROSERVIÇOS]
FRONTEND_URL = https://sistema-pedidos.netlify.app
NODE_ENV = production
```

### Detalhes

- PORT é atribuída automaticamente pelo Render (10000+)
- API_KEY deve ser complexa e aleatória
- Usar `https://` para URLs de produção

---

## 2. Ms-Clientes (Render)

### Variáveis de Ambiente Obrigatórias

```
PORT = [Atribuída pelo Render]
DATABASE_URL = [String PostgreSQL do Neon com ?sslmode=require]
API_KEY = [MESMA CHAVE DO GATEWAY]
NODE_ENV = production
```

### Detalhes

- DATABASE_URL deve incluir `?sslmode=require` para Neon
- Aplicar migração de banco: `npm run migrate` (se houver script)

---

## 3. Ms-Produtos (Render)

### Variáveis de Ambiente Obrigatórias

```
PORT = [Atribuída pelo Render]
DATABASE_URL = [String PostgreSQL do Neon com ?sslmode=require]
API_KEY = [MESMA CHAVE DO GATEWAY]
NODE_ENV = production
```

### Detalhes

- Mesmos requisitos de ms-clientes
- Produto precisa de índice em `estoque` para performance

---

## 4. Ms-Pedidos (Render)

### Variáveis de Ambiente Obrigatórias

```
PORT = [Atribuída pelo Render]
DATABASE_URL = [String PostgreSQL do Neon com ?sslmode=require]
CLIENTES_URL = https://[SEU_MS_CLIENTES].onrender.com
PRODUTOS_URL = https://[SEU_MS_PRODUTOS].onrender.com
API_KEY = [MESMA CHAVE DO GATEWAY]
NODE_ENV = production
```

### Detalhes

- CLIENTES_URL e PRODUTOS_URL são necessárias para validação interna de pedidos
- Mensagens de erro devem indicar problema de conexão com ms-clientes/ms-produtos

---

## 5. Frontend (Netlify)

### Variáveis de Ambiente Obrigatórias

```
VITE_API_BASE = https://[SEU_API_GATEWAY].onrender.com/api/v1
VITE_API_KEY = [MESMA CHAVE DO GATEWAY]
```

### Arquivo netlify.toml

```toml
[build]
command = "npm run build"
publish = "dist"
```

### Arquivo public/\_redirects

```
/* /index.html 200
```

---

## 6. Neon PostgreSQL

### Criar Bancos de Dados

1. **db_clientes** - Para ms-clientes
2. **db_produtos** - Para ms-produtos
3. **db_pedidos** - Para ms-pedidos

### Connection Strings (Formato)

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

---

## 7. Testes Pós-Deploy

### 1. Health Check

```bash
curl https://[SEU_API_GATEWAY]/api/health
```

Resposta esperada:

```json
{ "status": "ok", "service": "api-gateway", "timestamp": "..." }
```

### 2. Status de Microserviços

```bash
curl -H "x-api-key: [CHAVE]" https://[SEU_API_GATEWAY]/api/health/services
```

Resposta esperada:

```json
{
  "gateway": "ok",
  "services": [
    { "service": "ms-clientes", "status": "online", "data": { ... } },
    { "service": "ms-produtos", "status": "online", "data": { ... } },
    { "service": "ms-pedidos", "status": "online", "data": { ... } }
  ]
}
```

### 3. Listar Dados

```bash
curl -H "x-api-key: [CHAVE]" https://[SEU_API_GATEWAY]/api/v1/customers
curl -H "x-api-key: [CHAVE]" https://[SEU_API_GATEWAY]/api/v1/products
curl -H "x-api-key: [CHAVE]" https://[SEU_API_GATEWAY]/api/v1/orders
```

### 4. Criar Cliente (POST)

```bash
curl -X POST \
  -H "x-api-key: [CHAVE]" \
  -H "Content-Type: application/json" \
  -d '{"nomeCliente": "Teste", "contato": "123", "documento": "123.456.789-00"}' \
  https://[SEU_API_GATEWAY]/api/v1/customers
```

---

## 8. Troubleshooting

### 502 Bad Gateway

- Verificar se CLIENTES_URL/PRODUTOS_URL/PEDIDOS_URL estão corretas
- Confirmar que microserviços estão online em `/api/health/services`
- Checar logs do gateway para URL malformada

### 401 Unauthorized

- Confirmar que `x-api-key` é enviada em todas as requisições
- Validar que API_KEY é idêntica no gateway e microserviços
- Não há espaços ou caracteres inválidos na chave

### Erro na Criação de Pedido

- Verificar se CLIENTES_URL e PRODUTOS_URL estão configuradas no ms-pedidos
- Confirmar que cliente existe (GET /api/v1/customers/:id)
- Validar que produto tem estoque suficiente

---

## 9. Ordem Recomendada de Deploy

1. ✅ Criar bancos no Neon (db_clientes, db_produtos, db_pedidos)
2. ✅ Deploy **ms-clientes** e **ms-produtos** (sem dependências)
3. ✅ Deploy **ms-pedidos** (com URLs dos anteriores)
4. ✅ Deploy **api-gateway** (com URLs de todos)
5. ✅ Deploy **frontend** (com URL do gateway)
6. ✅ Testar em `/api/health/services`
7. ✅ Testar fluxo completo de criação de pedido

---

## 10. Dicas de Segurança

- ✅ Use HTTPS em produção (Render/Netlify oferecem automaticamente)
- ✅ Rotinire a API_KEY a cada 3-6 meses
- ✅ Não commite `.env` com valores reais no git
- ✅ Use variáveis do Render/Netlify UI, não valores hardcoded
- ✅ Ative WAF (Web Application Firewall) se disponível
- ✅ Monitor logs para requisições não autorizadas
