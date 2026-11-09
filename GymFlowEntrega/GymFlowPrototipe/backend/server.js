const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const gymbroRoutes = require('./routes/gymbroRoutes');
const authRoutes = require('./routes/authRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const routineRoutes = require('./routes/routineRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middlewares ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Ruta de prueba / Health Check ─────────────────────────
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: '¡El servidor de GymFlow está bombeando hierro al 100%! 💪',
        modules: ['gymbro', 'auth', 'exercises', 'routines'],
    });
});

// ─── Rutas de la API ───────────────────────────────────────
app.use('/api', gymbroRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);

// ─── Middleware de errores (siempre al final) ──────────────
app.use(errorHandler);

// ─── Arrancar servidor + conectar DB ───────────────────────
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor de GymFlow corriendo en http://localhost:${PORT}`);
    });
    connectDB();
};

startServer();
