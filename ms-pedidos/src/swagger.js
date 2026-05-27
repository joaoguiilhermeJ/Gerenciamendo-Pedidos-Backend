import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MS Pedidos API",
      version: "1.0.0",
      description:
        "Microserviço para gerenciamento de pedidos com validação de estoque e transações",
      contact: {
        name: "Sistema de Pedidos",
        url: "http://localhost:3000",
      },
    },
    servers: [
      {
        url: "http://localhost:3003",
        description: "Servidor Local (Desenvolvimento)",
      },
      {
        url: "http://ms-pedidos:3003",
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
        Pedido: {
          type: "object",
          properties: {
            idPedido: {
              type: "integer",
              example: 1,
              description: "ID único do pedido",
            },
            idCliente: {
              type: "integer",
              example: 1,
              description: "ID do cliente",
            },
            valorTotal: {
              type: "number",
              format: "float",
              example: 5000.0,
              description: "Valor total do pedido",
            },
            local: {
              type: "string",
              example: "Rua das Flores, 123, São Paulo",
              description: "Endereço de entrega",
            },
            status: {
              type: "string",
              enum: ["PENDENTE", "ENTREGUE", "CANCELADO"],
              example: "PENDENTE",
              description: "Status do pedido",
            },
            itens: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ItemPedido",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ItemPedido: {
          type: "object",
          properties: {
            idItem: {
              type: "integer",
              example: 1,
            },
            idPedido: {
              type: "integer",
              example: 1,
            },
            idProduto: {
              type: "integer",
              example: 1,
            },
            quantidade: {
              type: "integer",
              example: 2,
              minimum: 1,
            },
            precoUnitario: {
              type: "number",
              format: "float",
              example: 2500.0,
            },
          },
        },
        CriarPedidoRequest: {
          type: "object",
          required: ["idCliente", "local", "itens"],
          properties: {
            idCliente: {
              type: "integer",
              example: 1,
            },
            local: {
              type: "string",
              example: "Rua das Flores, 123",
            },
            itens: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["idProduto", "quantidade"],
                properties: {
                  idProduto: {
                    type: "integer",
                    example: 1,
                  },
                  quantidade: {
                    type: "integer",
                    example: 2,
                    minimum: 1,
                  },
                },
              },
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
