import { Cliente } from '../model/Cliente.js'; // Importe o model diretamente

export async function cadastrar_cliente(dados) {
    return await Cliente.create(dados);
}

export async function listar_clientes() {
    return await Cliente.findAll();
}

export async function buscar_cliente(id) {
    return await Cliente.findByPk(id);
}

export async function atualizar_cliente(id, dados) {

    await Cliente.update(dados, { where: { idCliente: id } });
    return await Cliente.findByPk(id);
}

export async function deletar_cliente(id) {
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
        await Cliente.destroy({ where: { idCliente: id } });
        return { id };
    }
    return null;
}