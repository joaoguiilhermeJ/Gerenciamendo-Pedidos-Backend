function validarID(req, res, next) {
    const { id } = req.params

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ erro: 'ID inválido. Deve ser um número inteiro positivo.' })
    }

    next()
}

module.exports = { validarID }