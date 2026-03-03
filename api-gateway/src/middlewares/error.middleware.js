const errorMiddleware = (err, req, res, next) => {
    console.error('[GATEWAY ERROR]:', err.message)

    const status = err.status || 500

    res.status(status).json({
        error: true,
        message: err.message || 'Erro interno no API Gateway',
        details: err.details || null
    })
}

module.exports = errorMiddleware
