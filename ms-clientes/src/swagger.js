import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MS Clientes API",
      version: "1.0.0",
      description:
        "Microserviço para gerenciamento de clientes do Sistema de Pedidos",
      contact: {
        name: "Sistema de Pedidos",
        url: "http://localhost:3000",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor Local (Desenvolvimento)",
      },
      {
        url: "http://ms-clientes:3001",
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
        Cliente: {
          type: "object",
          required: ["nomeCliente", "contato", "documento"],
          properties: {
            idCliente: {
              type: "integer",
              example: 1,
              description: "ID único do cliente",
            },
            nomeCliente: {
              type: "string",
              example: "João Silva",
              description: "Nome completo do cliente",
            },
            contato: {
              type: "string",
              example: "(11) 98765-4321",
              description: "Telefone ou email de contato",
            },
            documento: {
              type: "string",
              example: "12345678901",
              description: "CPF ou CNPJ (deve ser único)",
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
