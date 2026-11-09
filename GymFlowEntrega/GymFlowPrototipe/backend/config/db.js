const mongoose = require('mongoose');

// Desactivar buffer para que las operaciones no se queden colgadas si MongoDB Atlas está desconectado o bloqueado por IP
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn('⚠️ MONGO_URI no está definido en el archivo .env');
            return null;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 4000, // Timeout de 4s para verificar conectividad
        });
        console.log(`✅ MongoDB conectado exitosamente: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.warn(`⚠️ Advertencia de conexión a MongoDB: ${error.message}`);
        console.log('ℹ️ Modo de alta disponibilidad activo: el servidor utiliza almacenamiento local de respaldo mientras la IP se autoriza en MongoDB Atlas.');
        return null;
    }
};

module.exports = connectDB;
