# API Gateway - Sistema de Pedidos 🚀

Este é o ponto de entrada único para o ecossistema de microserviços do Sistema de Pedidos. Ele atua como um Reverse Proxy, encaminhando as requisições para os microserviços correspondentes.

## 📌 Funcionalidades

- **Proxy Reverso**: Redireciona chamadas para os microserviços.
- **Resiliência**: Tratamento de erro caso um microserviço esteja fora do ar.
- **Logging**: Log detalhado de método, URL e tempo de resposta.
- **CORS**: Habilitado para integração com o Frontend.

## 🛠️ Tecnologias

- Node.js
- Express
- http-proxy-middleware
- Dotenv

## 🚀 Como rodar

1. Entre na pasta:
   ```bash
   cd backend/api-gateway
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` (se necessário).

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

## 🔗 Rotas Mapeadas

Todas as rotas devem ser prefixadas com `/api`:

- **Clientes**: `http://localhost:3000/api/clientes/*` -> Encaminha para o microserviço na porta 3001
- **Produtos**: `http://localhost:3000/api/produtos/*` -> Encaminha para o microserviço na porta 3002
- **Pedidos**:  `http://localhost:3000/api/pedidos/*`  -> Encaminha para o microserviço na porta 3003

## 💻 Exemplo de Chamada no Frontend

### Buscar todos os clientes:
**Antes (Direto):** `GET http://localhost:3001/clientes`
**Agora (Via Gateway):** `GET http://localhost:3000/api/clientes`

```javascript
fetch('http://localhost:3000/api/clientes')
  .then(res => res.json())
  .then(data => console.log(data))
```

---
*Desenvolvido seguindo as melhores práticas de arquitetura de microserviços.*
