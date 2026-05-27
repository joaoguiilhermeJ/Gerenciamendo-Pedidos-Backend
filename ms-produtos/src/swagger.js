import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MS Produtos API",
      version: "1.0.0",
      description:
        "Microserviço para gerenciamento de produtos e controle de estoque",
      contact: {
        name: "Sistema de Pedidos",
        url: "http://localhost:3000",
      },
    },
    servers: [
      {
        url: "http://localhost:3002",
        description: "Servidor Local (Desenvolvimento)",
      },
      {
        url: "http://ms-produtos:3002",
        description: "Container Docker",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Chave de autenticação da API",
        },
      },
      schemas: {
        Produto: {
          type: "object",
          required: ["nome", "preco"],
          properties: {
            idProduto: {
              type: "integer",
              example: 1,
              description: "ID único do produto",
            },
            nome: {
              type: "string",
              example: "Notebook",
              description: "Nome do produto",
            },
            categoria: {
              type: "string",
              example: "Eletrônicos",
              description: "Categoria do produto (opcional)",
            },
            preco: {
              type: "number",
              format: "float",
              example: 2500.0,
              description: "Preço unitário do produto",
            },
            estoque: {
              type: "integer",
              example: 10,
              description: "Quantidade em estoque",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-18T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-18T10:30:00Z",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            erro: {
              type: "string",
              example: "Mensagem de erro",
            },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
