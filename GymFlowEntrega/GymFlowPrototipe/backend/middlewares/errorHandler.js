/**
 * Middleware centralizado de manejo de errores.
 * Express lo identifica como error handler por tener 4 parámetros.
 */
const errorHandler = (err, req, res, next) => {
    console.error('🔥 Error:', err.message);

    const statusCode = err.statusCode || 500;
    const message =
        process.env.NODE_ENV === 'production'
            ? 'GymBro está descansando entre series, intenta de nuevo más tarde.'
            : err.message || 'Error interno del servidor';

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;

