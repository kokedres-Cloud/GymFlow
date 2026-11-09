const routineService = require('../services/routineService');

/**
 * GET /api/routines
 * Obtiene las rutinas del usuario autenticado.
 */
const getMyRoutines = async (req, res, next) => {
    try {
        const routines = await routineService.getByUser(req.user._id);
        res.json({
            count: routines.length,
            routines,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/routines/:id
 * Obtiene el detalle de una rutina específica perteneciente al usuario.
 */
const getRoutineById = async (req, res, next) => {
    try {
        const routine = await routineService.getById(req.params.id, req.user._id);
        res.json({ routine });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/routines
 * Crea una nueva rutina para el usuario autenticado.
 */
const createRoutine = async (req, res, next) => {
    try {
        const { nombre, descripcion, ejercicios, dias } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ error: 'El nombre de la rutina es obligatorio.' });
        }

        const routine = await routineService.create(
            {
                nombre: nombre.trim(),
                descripcion: descripcion ? descripcion.trim() : '',
                ejercicios: Array.isArray(ejercicios) ? ejercicios : [],
                dias: Array.isArray(dias) ? dias : [],
            },
            req.user._id
        );

        res.status(201).json({
            message: '¡Rutina creada con éxito!',
            routine,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/routines/:id
 * Actualiza una rutina existente.
 */
const updateRoutine = async (req, res, next) => {
    try {
        const routine = await routineService.update(req.params.id, req.body, req.user._id);
        res.json({
            message: 'Rutina actualizada con éxito.',
            routine,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/routines/:id
 * Elimina una rutina del usuario.
 */
const removeRoutine = async (req, res, next) => {
    try {
        await routineService.remove(req.params.id, req.user._id);
        res.json({ message: 'Rutina eliminada correctamente.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyRoutines,
    getRoutineById,
    createRoutine,
    updateRoutine,
    removeRoutine,
};

