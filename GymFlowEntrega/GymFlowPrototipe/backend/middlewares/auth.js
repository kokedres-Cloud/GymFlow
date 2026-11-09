const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authService = require('../services/authService');

/**
 * Middleware de autenticación JWT.
 * Extrae el token del header Authorization: Bearer <token>,
 * lo verifica y adjunta el usuario a req.user.
 */
const auth = async (req, res, next) => {
    try {
        // 1. Verificar que exista el header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Acceso denegado. No se proporcionó token de autenticación.',
            });
        }

        // 2. Extraer y verificar el token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret_inacap_2026');

        // 3. Buscar el usuario
        const user = await authService.findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({
                error: 'Token válido pero el usuario no fue encontrado.',
            });
        }

        // 4. Adjuntar usuario al request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado. Inicia sesión de nuevo.' });
        }
        next(error);
    }
};

module.exports = auth;

