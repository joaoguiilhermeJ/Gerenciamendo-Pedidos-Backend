import clienteRepository from '../repositories/cliente.repository.js';
import SimpleCache from '../utils/cache.js';

const clienteCache = new SimpleCache(30000); // 30 seconds TTL
const ALL_CLIENTES_KEY = '@all';

async function cadastrar_cliente(dados) {
    const nomeCliente = String(dados.nomeCliente ?? '').trim()
    const contato = String(dados.contato ?? '').trim()
    const documento = String(dados.documento ?? '').trim()

    if (!nomeCliente || !contato || !documento) {
        throw new Error('Campos obrigatórios ausentes')
    }

    const novoCliente = await clienteRepository.cadastrar_cliente({
        nomeCliente,
        contato,
        documento
    })

    // Invalida cache da lista
    clienteCache.delete(ALL_CLIENTES_KEY);

    return novoCliente;
}

async function listar_clientes() {
    const cached = clienteCache.get(ALL_CLIENTES_KEY);
    if (cached) return cached;

    const clientes = await clienteRepository.listar_clientes();
    clienteCache.set(ALL_CLIENTES_KEY, clientes);

    return clientes;
}

async function buscar_cliente(id) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const cached = clienteCache.get(idCliente);
    if (cached) return cached;

    const result = await clienteRepository.buscar_cliente(idCliente)
    if (!result) throw new Error('Cliente não encontrado')

    clienteCache.set(idCliente, result);
    return result
}

async function atualizar_cliente(id, dados) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const dadosAtualizar = {}
    if (dados.nomeCliente) dadosAtualizar.nomeCliente = String(dados.nomeCliente).trim()
    if (dados.contato) dadosAtualizar.contato = String(dados.contato).trim()
    if (dados.documento) dadosAtualizar.documento = String(dados.documento).trim()

    const cliente = await clienteRepository.atualizar_cliente(idCliente, dadosAtualizar)

    // Invalida cache
    clienteCache.delete(idCliente);
    clienteCache.delete(ALL_CLIENTES_KEY);

    return cliente;
}

async function deletar_cliente(id) {
    const idCliente = Number(id)
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new Error('ID inválido')

    const result = await clienteRepository.deletar_cliente(idCliente)

    // Invalida cache
    clienteCache.delete(idCliente);
    clienteCache.delete(ALL_CLIENTES_KEY);

    return result;
}

export default {
    cadastrar_cliente,
    listar_clientes,
    buscar_cliente,
    atualizar_cliente,
    deletar_cliente
};