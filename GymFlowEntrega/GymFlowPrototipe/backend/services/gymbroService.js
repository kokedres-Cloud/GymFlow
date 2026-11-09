const { getModel } = require('../config/gemini');

const SYSTEM_PROMPT = `Eres GymBro, el asistente virtual del sistema GymFlow. 
Tu objetivo es motivar a los usuarios y resolver sus dudas sobre ejercicios, rutinas y salud en el gimnasio. 
Eres enérgico, amigable, respetuoso y usas analogías de entrenamiento. 
Responde de forma concisa y práctica.`;

// Respuestas de contingencia contextuales si la API externa no está disponible
const getFallbackResponse = (pregunta) => {
    const p = pregunta.toLowerCase();

    if (p.includes('pecho') || p.includes('press') || p.includes('pectoral')) {
        return '¡A reventar esos pectorales, crack! 🔥 Para pecho, la clave es la retracción escapular: junta los omóplatos, saca el pecho y controla la fase excéntrica (bajada de 2-3 seg). Prueba 4 series de Press de Banca plano y remata con aperturas en polea. ¡Con técnica limpia!';
    }
    if (p.includes('pierna') || p.includes('sentadilla') || p.includes('cuadriceps') || p.includes('gluteo')) {
        return '¡No te saltes el día de pierna, titán! 🦵 La sentadilla libre profunda o prensa pesada es la base del crecimiento. Recuerda: pies al ancho de hombros, rodillas alineadas con las puntas y empuja desde los talones. 4 series de 8 a 10 reps bien pesadas. ¡Mañana dolerá sentarse pero valdrá la pena!';
    }
    if (p.includes('espalda') || p.includes('dominada') || p.includes('remo')) {
        return '¡Para construir esa espalda en forma de V! 🦅 Enfócate en dominadas con agarre prono y Remo con barra o mancuerna. El secreto no es jalar con los brazos, sino guiar el movimiento con los codos y apretar la espalda 1 segundo al final. ¡Vamos con todo!';
    }
    if (p.includes('brazo') || p.includes('biceps') || p.includes('triceps')) {
        return '¡A bombear esos brazos! 💪 El tríceps representa el 60% del volumen del brazo: no olvides fondos y extensiones en polea. Para bíceps, curl con barra Z y curl martillo para el braquial. 3 series de 10-12 repeticiones buscando el fallo técnico.';
    }
    if (p.includes('dieta') || p.includes('comer') || p.includes('proteina') || p.includes('caloria') || p.includes('nutricion')) {
        return '¡El músculo se construye en la cocina, fiera! 🥗 Asegura entre 1.6g y 2.0g de proteína por kilo de peso corporal al día. Toma suficiente agua (al menos 3 litros) y ajusta tus carbohidratos según tu objetivo (déficit para definir, superávit para masa). ¡La disciplina en el plato es el 70%!';
    }
    if (p.includes('creatina') || p.includes('suplemento')) {
        return '¡Excelente pregunta! 💊 La creatina monohidratada (3 a 5 gramos diarios todos los días, con o sin entrenamiento) es el suplemento con más evidencia científica. Te dará más fuerza explosiva y acelerará tu recuperación celular.';
    }
    if (p.includes('rutina') || p.includes('dia') || p.includes('empezar') || p.includes('principiante')) {
        return '¡Bienvenido al camino del hierro! 🏋️‍♂️ Si vas arrancando, una rutina Push/Pull/Legs (Empuje, Tirón, Pierna) de 3 a 4 días por semana es ideal. Prioriza ejercicios compuestos, aprende la técnica antes de meterle kilos y anota tus pesos para aplicar sobrecarga progresiva.';
    }

    return `¡Qué buena pregunta, crack! 💪 "${pregunta}". La regla de oro en GymFlow es la consistencia y la sobrecarga progresiva: busca mejorar una repetición o un kilo cada semana. Mantén la forma perfecta, duerme de 7 a 8 horas y alimenta tus músculos. ¡Dale con todo a esa serie!`;
};

/**
 * Envía una pregunta a Gemini y retorna la respuesta de texto.
 * Si la API falla, utiliza el motor fallback de GymBro para garantizar 100% de disponibilidad.
 * @param {string} pregunta - La consulta del usuario.
 * @returns {Promise<string>} La respuesta generada por la IA o fallback.
 */
const ask = async (pregunta) => {
    try {
        const model = getModel();
        const prompt = `${SYSTEM_PROMPT}\n\nConsulta del usuario: ${pregunta}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('❌ ERROR REAL DE GEMINI:');
        console.error(error.message);
        console.error(error.status);
        console.error(error);

        return getFallbackResponse(pregunta);
    }
};

module.exports = { ask };
