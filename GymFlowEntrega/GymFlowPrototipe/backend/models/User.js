const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            maxlength: [50, 'El nombre no puede tener más de 50 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Por favor ingresa un email válido',
            ],
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
            select: false, // No se devuelve en queries por defecto
        },
        rol: {
            type: String,
            enum: ['usuario', 'admin'],
            default: 'usuario',
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

// ─── Middleware: hashear password antes de guardar ──────────
userSchema.pre('save', async function () {
    // Solo hashear si el password fue modificado
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ─── Método: comparar password ingresado con el hash ───────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

