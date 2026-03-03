const { Cliente } = require('../model/Cliente')

async function cadastrar_cliente(dados) {
    return await Cliente.create(dados)
}

async function listar_clientes() {
    return await Cliente.findAll()
}

async function buscar_cliente(id) {
    return await Cliente.findByPk(id)
}

async function atualizar_cliente(id, dados) {
    await Cliente.update(dados, { where: { idCliente: id } })
    return await Cliente.findByPk(id)
}

async function deletar_cliente(id) {
    const cliente = await Cliente.findByPk(id)
    if (cliente) {
        await Cliente.destroy({ where: { idCliente: id } })
        return { id }
    }
    return null
}

module.exports = {
    cadastrar_cliente,
    listar_clientes,
    buscar_cliente,
    atualizar_cliente,
    deletar_cliente
}