const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'La rutina debe estar vinculada a un usuario'],
        },
        nombre: {
            type: String,
            required: [true, 'El nombre de la rutina es obligatorio'],
            trim: true,
            maxlength: [100, 'El nombre no puede tener más de 100 caracteres'],
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede tener más de 500 caracteres'],
        },
        ejercicios: [
            {
                ejercicio: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Exercise',
                    required: true,
                },
                series: {
                    type: Number,
                    required: true,
                    min: [1, 'Mínimo 1 serie'],
                },
                repeticiones: {
                    type: Number,
                    required: true,
                    min: [1, 'Mínimo 1 repetición'],
                },
                descansoSegundos: {
                    type: Number,
                    default: 60,
                },
            },
        ],
        dias: {
            type: [String],
            enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Routine', routineSchema);

