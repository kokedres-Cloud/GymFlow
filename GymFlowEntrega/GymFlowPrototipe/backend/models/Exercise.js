const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del ejercicio es obligatorio'],
            trim: true,
            maxlength: [100, 'El nombre no puede tener más de 100 caracteres'],
        },
        grupoMuscular: {
            type: String,
            required: [true, 'El grupo muscular es obligatorio'],
            enum: [
                'pecho',
                'espalda',
                'hombros',
                'biceps',
                'triceps',
                'piernas',
                'gluteos',
                'abdominales',
                'cardio',
                'cuerpo completo',
            ],
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede tener más de 500 caracteres'],
        },
        dificultad: {
            type: String,
            enum: ['principiante', 'intermedio', 'avanzado'],
            default: 'intermedio',
        },
        imagenUrl: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Exercise', exerciseSchema);

