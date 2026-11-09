const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

// Almacén en memoria de respaldo si MongoDB Atlas no está conectado
const memoryUsers = [];

/**
 * Genera un JWT firmado con el id del usuario.
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_jwt_secret_inacap_2026', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * Registra un nuevo usuario.
 * @returns {{ user, token }}
 */
const register = async ({ nombre, email, password }) => {
    // Si MongoDB está disponible
    if (mongoose.connection.readyState === 1) {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const error = new Error('Ya existe una cuenta con ese email.');
                error.statusCode = 400;
                throw error;
            }

            const user = await User.create({ nombre, email, password });
            const token = generateToken(user._id);

            return {
                user: {
                    id: user._id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                },
                token,
            };
        } catch (dbError) {
            if (dbError.statusCode === 400) throw dbError;
            console.warn('⚠️ Fallo en MongoDB Atlas, recurriendo a almacén seguro de contingencia:', dbError.message);
        }
    }

    // Modo contingencia / Almacén en memoria
    const existing = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        const error = new Error('Ya existe una cuenta con ese email.');
        error.statusCode = 400;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        _id: 'user_' + Date.now(),
        nombre,
        email: email.toLowerCase(),
        password: hashedPassword,
        rol: 'usuario',
    };
    memoryUsers.push(newUser);

    const token = generateToken(newUser._id);
    return {
        user: {
            id: newUser._id,
            nombre: newUser.nombre,
            email: newUser.email,
            rol: newUser.rol,
        },
        token,
    };
};

/**
 * Inicia sesión con email y password.
 * @returns {{ user, token }}
 */
const login = async ({ email, password }) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const user = await User.findOne({ email }).select('+password');
            if (user) {
                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    const error = new Error('Credenciales incorrectas.');
                    error.statusCode = 401;
                    throw error;
                }

                const token = generateToken(user._id);
                return {
                    user: {
                        id: user._id,
                        nombre: user.nombre,
                        email: user.email,
                        rol: user.rol,
                    },
                    token,
                };
            }
        } catch (dbError) {
            if (dbError.statusCode === 401) throw dbError;
            console.warn('⚠️ Fallo en consulta a MongoDB, verificando almacén local:', dbError.message);
        }
    }

    // Almacén en memoria
    const user = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        const error = new Error('Credenciales incorrectas.');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Credenciales incorrectas.');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user._id);
    return {
        user: {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
        },
        token,
    };
};

/**
 * Busca un usuario por ID (para el middleware auth).
 */
const findUserById = async (id) => {
    if (mongoose.connection.readyState === 1 && !id.startsWith('user_')) {
        try {
            const user = await User.findById(id);
            if (user) return user;
        } catch (_) {}
    }
    return memoryUsers.find((u) => u._id === id);
};

module.exports = { register, login, findUserById, memoryUsers };
