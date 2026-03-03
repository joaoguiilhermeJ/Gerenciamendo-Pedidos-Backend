const clientesService = require('../service/cliente.service')

async function cadastrar_cliente(req, res) {
    try {
        console.log('Dados recebidos no Body:', req.body)
        const cliente = await clientesService.cadastrar_cliente(req.body)
        console.log('Resultado do Service:', cliente)
        return res.status(201).json(cliente)
    } catch (err) {
        const mensagem = err.errors ? err.errors[0].message : err.message
        console.error('Erro detalhado:', mensagem)
        return res.status(400).json({ erro: mensagem })
    }
}

async function listar_clientes(req, res) {
    try {
        const clientes = await clientesService.listar_clientes()
        return res.status(200).json(clientes)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function buscar_cliente(req, res) {
    try {
        const id = Number(req.params.id)
        const cliente = await clientesService.buscar_cliente(id)

        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }

        return res.status(200).json(cliente)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function atualizar_cliente(req, res) {
    try {
        const id = Number(req.params.id)
        const cliente = await clientesService.atualizar_cliente(id, req.body)

        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }

        return res.status(200).json(cliente)
    } catch (err) {
        return res.status(400).json({ erro: err.message })
    }
}

async function deletar_cliente(req, res) {
    try {
        const id = Number(req.params.id)
        const cliente = await clientesService.deletar_cliente(id)

        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }

        return res.status(200).json(cliente)
    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

module.exports = {
    cadastrar_cliente,
    listar_clientes,
    buscar_cliente,
    atualizar_cliente,
    deletar_cliente
}