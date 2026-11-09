const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Exercise = require('./models/Exercise');
const Routine = require('./models/Routine');

const INITIAL_EXERCISES = [
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
        nombre: 'Fondos en Paralelas',
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
        nombre: 'Plancha Abdominal',
        grupoMuscular: 'abdominales',
        descripcion: 'Apoyo sobre antebrazos y puntas de los pies. Mantener el cuerpo en línea recta activando abdomen y glúteos sin arquear la zona lumbar.',
        dificultad: 'principiante',
        imagenUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
    },
];

const seedDatabase = async () => {
    try {
        console.log('🔄 Conectando a MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
        console.log('✅ Conexión exitosa a:', mongoose.connection.host);

        // 1. Crear o buscar usuario de prueba
        let testUser = await User.findOne({ email: 'usuario@gymflow.cl' });
        if (!testUser) {
            testUser = await User.create({
                nombre: 'Juan GymUser',
                email: 'usuario@gymflow.cl',
                password: 'password123',
                rol: 'usuario',
            });
            console.log('👤 Colección "users" creada. Usuario de prueba: usuario@gymflow.cl / password123');
        } else {
            console.log('👤 Usuario de prueba ya existe en "users".');
        }

        // 2. Poblar colección exercises
        const countExercises = await Exercise.countDocuments();
        if (countExercises === 0) {
            await Exercise.insertMany(INITIAL_EXERCISES);
            console.log('🏋️ Colección "exercises" creada con 12 ejercicios de muestra.');
        } else {
            console.log(`🏋️ La colección "exercises" ya contiene ${countExercises} ejercicios.`);
        }

        // 3. Crear una rutina de prueba en routines
        const countRoutines = await Routine.countDocuments({ usuario: testUser._id });
        if (countRoutines === 0) {
            const firstExercise = await Exercise.findOne({ grupoMuscular: 'pecho' });
            await Routine.create({
                usuario: testUser._id,
                nombre: 'Rutina Push Day (Pecho y Tríceps)',
                descripcion: 'Rutina básica de empuje para ganar fuerza',
                dias: ['lunes', 'jueves'],
                ejercicios: firstExercise ? [{
                    ejercicio: firstExercise._id,
                    series: 4,
                    repeticiones: 10,
                    descansoSegundos: 90,
                }] : [],
            });
            console.log('📋 Colección "routines" creada con 1 rutina de ejemplo.');
        } else {
            console.log(`📋 La colección "routines" ya contiene rutinas para este usuario.`);
        }

        console.log('\n🎉 ¡Listo! Todas las colecciones ("users", "exercises", "routines") están creadas y visibles en MongoDB Atlas.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al poblar MongoDB:', error.message);
        console.log('💡 Recuerda autorizar tu IP en MongoDB Atlas (Network Access -> Add IP -> 0.0.0.0/0).');
        process.exit(1);
    }
};

seedDatabase();

