# 🚀 Quick Start - Documentação com Swagger

## Em 5 Minutos

### 1️⃣ Instalar e Iniciar

```bash
# Abra 3 terminais e execute em cada um:

# Terminal 1: Clientes
cd backend/ms-clientes && npm run dev

# Terminal 2: Produtos
cd backend/ms-produtos && npm run dev

# Terminal 3: Pedidos
cd backend/ms-pedidos && npm run dev
```

### 2️⃣ Acessar Documentação

Clique em um desses links:

- 🔗 **Clientes**: http://localhost:3001/api-docs
- 🔗 **Produtos**: http://localhost:3002/api-docs
- 🔗 **Pedidos**: http://localhost:3003/api-docs

### 3️⃣ Autorizar-se

1. Clique no botão **"Authorize"** 🔒
2. Cole sua API Key: `sua-chave-secreta-muito-segura`
3. Click **"Authorize"**

### 4️⃣ Testar um Endpoint

1. Expanda uma rota (ex: "POST /clientes")
2. Click **"Try it out"**
3. Preencha os dados de exemplo
4. Click **"Execute"**
5. Veja a resposta ✅

---

## Endpoints Principais

### 📍 Clientes

```
POST   /clientes           → Criar cliente
GET    /clientes           → Listar clientes
GET    /clientes/{id}      → Obter cliente
PUT    /clientes/{id}      → Atualizar cliente
DELETE /clientes/{id}      → Deletar cliente
```

### 📦 Produtos

```
POST   /produtos           → Criar produto
GET    /produtos           → Listar produtos
GET    /produtos/{id}      → Obter produto
PUT    /produtos/{id}      → Atualizar produto
DELETE /produtos/{id}      → Deletar produto
PATCH  /produtos/{id}      → Atualizar estoque
```

### 🛒 Pedidos

```
POST   /pedidos                      → Criar pedido
GET    /pedidos                      → Listar pedidos
GET    /pedidos/cliente/{idCliente}  → Pedidos de cliente
POST   /pedidos/{id}/entregar        → Confirmar entrega
PUT    /pedidos/{id}                 → Atualizar pedido
DELETE /pedidos/{id}                 → Cancelar pedido
```

---

## Exemplo: Criar Cliente

**Dados de entrada:**

```json
{
  "nomeCliente": "João Silva",
  "contato": "(11) 98765-4321",
  "documento": "12345678901"
}
```

**Resposta esperada (201):**

```json
{
  "idCliente": 1,
  "nomeCliente": "João Silva",
  "contato": "(11) 98765-4321",
  "documento": "12345678901",
  "createdAt": "2026-05-18T10:30:00.000Z",
  "updatedAt": "2026-05-18T10:30:00.000Z"
}
```

---

## cURL Rápido

```bash
# Criar cliente
curl -X POST http://localhost:3001/clientes \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta-muito-segura" \
  -d '{"nomeCliente":"João","contato":"(11)99999-9999","documento":"123456789"}'

# Listar clientes
curl -H "x-api-key: sua-chave-secreta-muito-segura" \
  http://localhost:3001/clientes

# Criar produto
curl -X POST http://localhost:3002/produtos \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta-muito-segura" \
  -d '{"nome":"Notebook","categoria":"Eletrônicos","preco":2500,"estoque":10}'

# Criar pedido
curl -X POST http://localhost:3003/pedidos \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta-muito-segura" \
  -d '{"idCliente":1,"itens":[{"idProduto":1,"quantidade":2}],"local":"Rua das Flores, 123"}'
```

---

## Recursos Adicionais

📖 **Documentação Completa**: Veja `SWAGGER_GUIDE.md`  
🎯 **Implementação Detalhada**: Veja `IMPLEMENTATION_SUMMARY.md`  
⚙️ **Configuração**: Crie `.env` a partir de `.env.example`

---

## Problema?

| Erro                   | Solução                                         |
| ---------------------- | ----------------------------------------------- |
| "Cannot GET /api-docs" | Serviço não iniciou - check terminal            |
| "API Key inválida"     | Clique Authorize e preencha a chave             |
| "Port already in use"  | Outra app usando porta - kill e tente novamente |
| "Module not found"     | Rode `npm install` naquele diretório            |

---

**Pronto! 🎉 Sua API está documentada e testável!**
