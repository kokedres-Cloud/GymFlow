const Exercise = require('../models/Exercise');

/**
 * Obtener todos los ejercicios, con filtro opcional por grupo muscular.
 */
const getAll = async (filters = {}) => {
    const query = {};
    if (filters.grupoMuscular) {
        query.grupoMuscular = filters.grupoMuscular;
    }
    if (filters.dificultad) {
        query.dificultad = filters.dificultad;
    }
    return await Exercise.find(query).sort({ grupoMuscular: 1, nombre: 1 });
};

/**
 * Obtener un ejercicio por ID.
 */
const getById = async (id) => {
    const exercise = await Exercise.findById(id);
    if (!exercise) {
        const error = new Error('Ejercicio no encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return exercise;
};

/**
 * Crear un nuevo ejercicio.
 */
const create = async (data) => {
    return await Exercise.create(data);
};

/**
 * Actualizar un ejercicio por ID.
 */
const update = async (id, data) => {
    const exercise = await Exercise.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!exercise) {
        const error = new Error('Ejercicio no encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return exercise;
};

/**
 * Eliminar un ejercicio por ID.
 */
const remove = async (id) => {
    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
        const error = new Error('Ejercicio no encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return exercise;
};

module.exports = { getAll, getById, create, update, remove };

