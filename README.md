# Sistema de Gerenciamento de Pedidos 🚀

Um sistema completo de gerenciamento de pedidos (produtos, clientes e pedidos) construído com uma arquitetura de microserviços e um frontend moderno preparado via Vite.

## 📋 Arquitetura

Este projeto é dividido em quatro partes principais:

- **`frontend/`**: Aplicação client-side desenvolvida em HTML, CSS e Vanilla JavaScript servido através do Vite. Ele se comunica de forma integrada com os vários microserviços através de um único `apiService`.
- **`ms-clientes/`**: Microserviço responsável por gerenciar os dados dos clientes.
- **`ms-produtos/`**: Microserviço responsável pelo cadastro, edição e controle de estoque de produtos.
- **`ms-pedidos/`**: Microserviço responsável pelo gerenciamento dos pedidos feitos pelos clientes.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5 e CSS3**
- **JavaScript Moderno (ES6 Modules)**
- **Vite** (Ambiente de desenvolvimento rápido)

### Backend (Microserviços)
- **Node.js** com **Express**
- **Sequelize** (ORM para interagir com o banco de dados)
- Banco de dados relacional flexível (configurado para suportar PostgreSQL/SQLite)
- **Axios** (Para possível comunicação entre os microserviços, se aplicável)
- **CORS** & **Dotenv**

## 📂 Estrutura do Repositório

```text
/
├── frontend/        # Interface com o usuário (Vite, HTML, CSS, JS)
├── ms-clientes/     # Microserviço de Clientes (Node.js/Express)
├── ms-pedidos/      # Microserviço de Pedidos (Node.js/Express)
├── ms-produtos/     # Microserviço de Produtos (Node.js/Express)
└── README.md        # Este arquivo
```

## 🚀 Como Executar o Projeto Localmente

Para rodar esta aplicação por completo, você deve inicializar o frontend e todos os microserviços simultaneamente.

> **Pré-requisitos:** Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Inicializando os Microserviços (Backend)

Em um terminal separado para cada microserviço, acesse as pastas e execute:

**Microserviço de Clientes:**
```bash
cd ms-clientes
npm install
npm run dev
```

**Microserviço de Produtos:**
```bash
cd ms-produtos
npm install
npm run dev
```

**Microserviço de Pedidos:**
```bash
cd ms-pedidos
npm install
npm run dev
```

*Nota: Certifique-se de configurar qualquer variável de ambiente (como arquivo `.env` contendo chaves ou strings de conexão com o banco de dados) de acordo com o padrão do projeto dentro das subpastas das APIs.*

### 2. Inicializando o Frontend

Abra um novo terminal para rodar a aplicação frontend:

```bash
cd frontend
npm install
npm run dev
```
O Vite subirá um servidor local (geralmente em `http://localhost:5173`). Acesse este link pelo navegador.

## 💡 Funcionalidades Principais
- **Clientes**: Listagem, criação, edição e exclusão de clientes.
- **Produtos**: Controle completo de produtos através do sistema, com visibilidade de disponibilidade em estoque e edições gerais.
- **Pedidos**: Interface automatizada para efetuar pedidos baseados nos clientes e estoques de produtos disponíveis.
- **Resiliência Básica**: O frontend avisa o usuário (amigavelmente) no caso de o microserviço/servidor estar fora de alcance.

## 👤 Autor
Desenvolvido por você. Sinta-se à vontade para enviar issues ou pull requests para melhorias do sistema!
