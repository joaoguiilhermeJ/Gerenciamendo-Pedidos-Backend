import env from '../config/env.js'

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

export default authMiddleware

