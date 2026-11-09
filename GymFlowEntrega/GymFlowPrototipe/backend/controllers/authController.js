const authService = require('../services/authService');

/**
 * POST /api/auth/register
 * Registra un nuevo usuario en GymFlow.
 */
const register = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: 'Todos los campos (nombre, email, contraseña) son obligatorios.',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres.',
            });
        }

        const data = await authService.register({ nombre, email, password });
        res.status(201).json({
            message: '¡Usuario registrado exitosamente en GymFlow!',
            ...data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/login
 * Inicia sesión y retorna token JWT.
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son obligatorios.',
            });
        }

        const data = await authService.login({ email, password });
        res.json({
            message: 'Inicio de sesión exitoso.',
            ...data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/auth/me
 * Retorna el perfil del usuario autenticado actual.
 */
const getMe = async (req, res, next) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                nombre: req.user.nombre,
                email: req.user.email,
                rol: req.user.rol,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};

