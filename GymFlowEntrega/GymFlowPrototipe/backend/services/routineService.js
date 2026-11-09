const mongoose = require('mongoose');
const Routine = require('../models/Routine');

// Almacén en memoria de respaldo si MongoDB Atlas no está conectado
const memoryRoutines = [];

/**
 * Obtener todas las rutinas del usuario autenticado.
 */
const getByUser = async (userId) => {
    const uId = String(userId);
    if (mongoose.connection.readyState === 1 && !uId.startsWith('user_')) {
        try {
            return await Routine.find({ usuario: userId })
                .populate('ejercicios.ejercicio', 'nombre grupoMuscular dificultad')
                .sort({ createdAt: -1 });
        } catch (err) {
            console.warn('⚠️ Fallo lectura de rutinas en MongoDB, usando memoria:', err.message);
        }
    }
    return memoryRoutines.filter((r) => String(r.usuario) === uId);
};

/**
 * Obtener una rutina por ID (solo si pertenece al usuario).
 */
const getById = async (id, userId) => {
    const uId = String(userId);
    if (mongoose.connection.readyState === 1 && !String(id).startsWith('routine_')) {
        try {
            const routine = await Routine.findOne({ _id: id, usuario: userId }).populate(
                'ejercicios.ejercicio',
                'nombre grupoMuscular dificultad descripcion'
            );
            if (routine) return routine;
        } catch (err) {
            console.warn('⚠️ Fallo lectura por ID en MongoDB:', err.message);
        }
    }
    const found = memoryRoutines.find((r) => String(r._id) === String(id) && String(r.usuario) === uId);
    if (!found) {
        const error = new Error('Rutina no encontrada.');
        error.statusCode = 404;
        throw error;
    }
    return found;
};

/**
 * Crear una nueva rutina vinculada al usuario.
 */
const create = async (data, userId) => {
    const uId = String(userId);
    if (mongoose.connection.readyState === 1 && !uId.startsWith('user_')) {
        try {
            return await Routine.create({ ...data, usuario: userId });
        } catch (err) {
            console.warn('⚠️ Fallo creación en MongoDB, guardando en memoria:', err.message);
        }
    }
    const newRoutine = {
        _id: 'routine_' + Date.now(),
        ...data,
        usuario: uId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    memoryRoutines.unshift(newRoutine);
    return newRoutine;
};

/**
 * Actualizar una rutina (solo si pertenece al usuario).
 */
const update = async (id, data, userId) => {
    const uId = String(userId);
    if (mongoose.connection.readyState === 1 && !String(id).startsWith('routine_')) {
        try {
            const routine = await Routine.findOneAndUpdate(
                { _id: id, usuario: userId },
                data,
                { new: true, runValidators: true }
            ).populate('ejercicios.ejercicio', 'nombre grupoMuscular dificultad');
            if (routine) return routine;
        } catch (err) {
            console.warn('⚠️ Fallo actualización en MongoDB:', err.message);
        }
    }
    const index = memoryRoutines.findIndex((r) => String(r._id) === String(id) && String(r.usuario) === uId);
    if (index === -1) {
        const error = new Error('Rutina no encontrada.');
        error.statusCode = 404;
        throw error;
    }
    memoryRoutines[index] = {
        ...memoryRoutines[index],
        ...data,
        updatedAt: new Date(),
    };
    return memoryRoutines[index];
};

/**
 * Eliminar una rutina (solo si pertenece al usuario).
 */
const remove = async (id, userId) => {
    const uId = String(userId);
    if (mongoose.connection.readyState === 1 && !String(id).startsWith('routine_')) {
        try {
            const routine = await Routine.findOneAndDelete({ _id: id, usuario: userId });
            if (routine) return routine;
        } catch (err) {
            console.warn('⚠️ Fallo borrado en MongoDB:', err.message);
        }
    }
    const index = memoryRoutines.findIndex((r) => String(r._id) === String(id) && String(r.usuario) === uId);
    if (index === -1) {
        const error = new Error('Rutina no encontrada.');
        error.statusCode = 404;
        throw error;
    }
    const removed = memoryRoutines.splice(index, 1)[0];
    return removed;
};

module.exports = { getByUser, getById, create, update, remove, memoryRoutines };
