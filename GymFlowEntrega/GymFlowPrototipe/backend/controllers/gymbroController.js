const gymbroService = require('../services/gymbroService');

/**
 * POST /api/gymbro
 * Recibe { pregunta } y responde con { respuesta } de la IA.
 */
const ask = async (req, res, next) => {
    try {
        const { pregunta } = req.body;

        if (!pregunta || typeof pregunta !== 'string' || !pregunta.trim()) {
            return res.status(400).json({
                error: 'El campo "pregunta" es obligatorio y debe ser un texto válido.',
            });
        }

        const respuesta = await gymbroService.ask(pregunta.trim());
        res.json({ respuesta });
    } catch (error) {
        next(error);
    }
};

module.exports = { ask };

