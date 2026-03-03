const env = require('../config/env')

const authMiddleware = (req, res, next) => {
    const apiKey = req.header('x-api-key')

    if (!apiKey || apiKey !== env.API_KEY) {
        return res.status(401).json({
            error: true,
            message: 'Acesso negado: x-api-key inválida ou ausente'
        })
    }

    next()
}

module.exports = authMiddleware
