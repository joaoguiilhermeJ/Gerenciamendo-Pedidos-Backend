# Sistema de Pedidos - Backend (Microserviços) 🚀

Arquitetura de microserviços pronta para produção (Render + Neon).

## 📋 Microserviços
- **api-gateway**: Porta de entrada única (Proxy Reverso).
- **ms-clientes**: Gerenciamento de clientes.
- **ms-produtos**: Gerenciamento de produtos e estoque.
- **ms-pedidos**: Orquestração de pedidos.

## 🔑 Segurança (API Key)
O sistema utiliza um header fixo `x-api-key` para segurança:
1. O **API Gateway** valida a chave antes de encaminhar qualquer requisição.
2. Os **microserviços** também possuem validação interna para garantir que apenas o Gateway (ou chamadas autorizadas) acesse os dados.
3. Use a mesma `API_KEY` em todos os serviços no Render para consistência.

## 🚀 Ordem de Deploy
1. **Bancos no Neon**: Crie os bancos `db_clientes`, `db_produtos` e `db_pedidos`.
2. **Microserviços Base**: Suba `ms-clientes` e `ms-produtos` no Render.
3. **Microserviço Pedidos**: Suba `ms-pedidos` (informando as URLs dos dois acima).
4. **API Gateway**: Suba por último (informando as URLs de todos os microserviços).

## 🛠️ Variáveis de Ambiente (Render)

| Variável | Descrição |
| --- | --- |
| `PORT` | Definida automaticamente pelo Render (usamos 10000 como fallback) |
| `DATABASE_URL` | String de conexão do Neon (com `?sslmode=require`) |
| `API_KEY` | Sua chave secreta para o header `x-api-key` |
| `CLIENTES_URL` | URL base do ms-clientes (ex: `https://ms-clientes.onrender.com`) |
| `PRODUTOS_URL` | URL base do ms-produtos |
| `PEDIDOS_URL` | URL base do ms-pedidos |
| `FRONTEND_URL` | URL da Vercel (apenas para o api-gateway) |
| `NODE_ENV` | Definir como `production` |

## 🧪 Como Testar (Via Gateway)

Substitua `URL_GATEWAY` pela URL do Render e `SUA_CHAVE` pela `API_KEY` configurada.

**Health Check:**
```bash
curl https://URL_GATEWAY/api/health
```

**Listar Produtos:**
```bash
curl -H "x-api-key: SUA_CHAVE" https://URL_GATEWAY/api/v1/products
```

**Status dos Microserviços:**
```bash
curl -H "x-api-key: SUA_CHAVE" https://URL_GATEWAY/api/health/services
```
