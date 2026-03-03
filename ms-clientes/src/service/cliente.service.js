const clienteRepository = require('../repositories/cliente.repository')

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

async function cadastrar_cliente(dados) {
    const nomeCliente = String(dados.nomeCliente ?? '').trim()
    const contato = String(dados.contato ?? '').trim()
    const documento = String(dados.documento ?? '').trim()

    if (!nomeCliente || !contato || !documento) {
        throw new Error('Campos obrigatórios ausentes')
    }

    return await clienteRepository.cadastrar_cliente({
        nomeCliente,
        contato,
        documento
    })
}

async function listar_clientes() {
    return await clienteRepository.listar_clientes()
}

async function buscar_cliente(id) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const result = await clienteRepository.buscar_cliente(idCliente)
    if (!result) throw new Error('Cliente não encontrado')

    return result
}

async function atualizar_cliente(id, dados) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const dadosAtualizar = {}
    if (dados.nomeCliente) dadosAtualizar.nomeCliente = String(dados.nomeCliente).trim()
    if (dados.contato) dadosAtualizar.contato = String(dados.contato).trim()
    if (dados.documento) dadosAtualizar.documento = String(dados.documento).trim()

    return await clienteRepository.atualizar_cliente(idCliente, dadosAtualizar)
}

async function deletar_cliente(id) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    return await clienteRepository.deletar_cliente(idCliente)
}

module.exports = {
    cadastrar_cliente,
    listar_clientes,
    buscar_cliente,
    atualizar_cliente,
    deletar_cliente
}