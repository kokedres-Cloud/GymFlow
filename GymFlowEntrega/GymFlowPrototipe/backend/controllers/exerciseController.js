const exerciseService = require('../services/exerciseService');
const Exercise = require('../models/Exercise');

const DEFAULT_EXERCISES = [
    {
        nombre: 'Press de Banca Plano',
        grupoMuscular: 'pecho',
        descripcion: 'Tumbado en banco plano, bajar la barra controladamente hasta rozar el pecho y empujar verticalmente manteniendo retracción escapular.',
        dificultad: 'intermedio',
        imagenUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Aperturas con Mancuernas',
        grupoMuscular: 'pecho',
        descripcion: 'En banco plano o inclinado, abrir los brazos con ligera flexión de codo sintiendo el estiramiento pectoral y cerrar apretando arriba.',
        dificultad: 'principiante',
        imagenUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Sentadilla Libre Trasera',
        grupoMuscular: 'piernas',
        descripcion: 'Barra sobre trapecios, pies al ancho de hombros. Bajar flexionando cadera y rodillas rompiendo el paralelo, empujar desde los talones.',
        dificultad: 'avanzado',
        imagenUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Prensa de Piernas',
        grupoMuscular: 'piernas',
        descripcion: 'Colocar los pies a la mitad de la plataforma, bajar hasta un ángulo de 90 grados sin despegar la zona lumbar y empujar sin bloquear rodillas.',
        dificultad: 'principiante',
        imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Dominadas Pronas',
        grupoMuscular: 'espalda',
        descripcion: 'Colgado de la barra con agarre amplio prono, traccionar llevando el pecho hacia la barra usando la fuerza de la espalda y bajada controlada.',
        dificultad: 'avanzado',
        imagenUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Remo con Barra',
        grupoMuscular: 'espalda',
        descripcion: 'Torso inclinado a 45 grados, espalda recta. Tirar de la barra hacia el ombligo manteniendo los codos pegados al cuerpo.',
        dificultad: 'intermedio',
        imagenUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Press Militar con Barra',
        grupoMuscular: 'hombros',
        descripcion: 'De pie o sentado, empujar la barra verticalmente por encima de la cabeza bloqueando el abdomen para proteger la zona lumbar.',
        dificultad: 'intermedio',
        imagenUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Elevaciones Laterales',
        grupoMuscular: 'hombros',
        descripcion: 'Con mancuernas ligeras, elevar los brazos lateralmente hasta la altura de los hombros guiando el movimiento con los codos.',
        dificultad: 'principiante',
        imagenUrl: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Curl de Bíceps con Barra Z',
        grupoMuscular: 'biceps',
        descripcion: 'De pie, sujetar la barra Z con agarre supino y flexionar los codos sin balancear el torso. Apretar un segundo en la contracción.',
        dificultad: 'principiante',
        imagenUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Fondos en Paralelas (Dips)',
        grupoMuscular: 'triceps',
        descripcion: 'En barras paralelas, bajar el cuerpo flexionando los codos hasta 90 grados manteniendo el torso erguido para enfocar en tríceps.',
        dificultad: 'intermedio',
        imagenUrl: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Hip Thrust con Barra',
        grupoMuscular: 'gluteos',
        descripcion: 'Espalda apoyada en banco, barra sobre la pelvis. Extender cadera hacia arriba empujando con los talones y apretando glúteos arriba.',
        dificultad: 'intermedio',
        imagenUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    },
    {
        nombre: 'Plancha Abdominal Isométrica',
        grupoMuscular: 'abdominales',
        descripcion: 'Apoyo sobre antebrazos y puntas de los pies. Mantener el cuerpo en línea recta activando abdomen y glúteos sin arquear la zona lumbar.',
        dificultad: 'principiante',
        imagenUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
    },
];

/**
 * GET /api/exercises
 * Lista ejercicios con filtros opcionales (grupoMuscular, dificultad).
 * Si la base de datos está vacía, realiza un auto-seed con ejercicios iniciales.
 */
const getAll = async (req, res, next) => {
    try {
        const { grupoMuscular, dificultad } = req.query;

        // Auto-seed si la colección está vacía
        const count = await Exercise.countDocuments();
        if (count === 0) {
            await Exercise.insertMany(DEFAULT_EXERCISES);
        }

        const exercises = await exerciseService.getAll({ grupoMuscular, dificultad });
        res.json({
            count: exercises.length,
            exercises,
        });
    } catch (error) {
        // Si la base de datos estuviera desconectada, responder con la lista precargada
        console.warn('Fallo consulta a BD de ejercicios, respondiendo catálogo base:', error.message);
        let list = DEFAULT_EXERCISES;
        if (req.query.grupoMuscular) {
            list = list.filter((e) => e.grupoMuscular === req.query.grupoMuscular);
        }
        if (req.query.dificultad) {
            list = list.filter((e) => e.dificultad === req.query.dificultad);
        }
        res.json({
            count: list.length,
            exercises: list.map((e, idx) => ({ _id: `fallback_${idx}`, ...e })),
        });
    }
};

/**
 * GET /api/exercises/:id
 */
const getById = async (req, res, next) => {
    try {
        const exercise = await exerciseService.getById(req.params.id);
        res.json({ exercise });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/exercises
 */
const create = async (req, res, next) => {
    try {
        const { nombre, grupoMuscular, descripcion, dificultad, imagenUrl } = req.body;
        if (!nombre || !grupoMuscular) {
            return res.status(400).json({ error: 'Nombre y grupo muscular son obligatorios.' });
        }
        const exercise = await exerciseService.create({
            nombre,
            grupoMuscular,
            descripcion,
            dificultad,
            imagenUrl,
        });
        res.status(201).json({
            message: 'Ejercicio creado con éxito.',
            exercise,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/exercises/:id
 */
const update = async (req, res, next) => {
    try {
        const exercise = await exerciseService.update(req.params.id, req.body);
        res.json({
            message: 'Ejercicio actualizado con éxito.',
            exercise,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/exercises/:id
 */
const remove = async (req, res, next) => {
    try {
        await exerciseService.remove(req.params.id);
        res.json({ message: 'Ejercicio eliminado con éxito.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};

