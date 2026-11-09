const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Modelo de GymFlow (gemini-1.5-flash por defecto o el configurado en variables de entorno)
const getModel = (modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash') => {
    return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { genAI, getModel };