const app = require('./app')
const env = require('./config/env')

const PORT = env.PORT

app.listen(PORT, () => {
    console.log(` API Gateway rodando na porta ${PORT}`)
    console.log(` Clientes: ${env.CLIENTES_URL}`)
    console.log(` Produtos: ${env.PRODUTOS_URL}`)
    console.log(`Pedidos:  ${env.PEDIDOS_URL}`)
})
