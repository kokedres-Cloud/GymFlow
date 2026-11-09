# GymFlow — Prototipo Funcional de Software

Sistema Web de Entrenamiento y Asistencia Virtual con Inteligencia Artificial.
Desarrollado para la asignatura de Ingeniería de Software (INACAP).

---

## 🚀 Cómo Ejecutar el Proyecto (Windows)

### Opción 1: Con 1 solo clic (Recomendado)
Simplemente haz doble clic sobre el archivo:
👉 **`iniciar.bat`**

El script se encargará automáticamente de:
1. Verificar que tengas Node.js instalado.
2. Instalar las dependencias (`npm install`) si es la primera vez que lo abres.
3. Levantar el Backend (Node.js/Express) en el puerto `5000`.
4. Levantar el Frontend (React/Vite) en el puerto `5173`.
5. Abrir la aplicación directamente en tu navegador web.

---

### Opción 2: Desde la Terminal

1. **Abrir una terminal para el Backend:**
   ```powershell
   cd GymFlowProtipe\backend
   npm install      # (Solo la primera vez)
   npm run dev
   ```
   *Servidor API escuchando en:* `http://localhost:5000`

2. **Abrir una segunda terminal para el Frontend:**
   ```powershell
   cd GymFlowProtipe\frontend
   npm install      # (Solo la primera vez)
   npm run dev
   ```
   *Aplicación web disponible en:* `http://localhost:5173`

---

## 🌟 Funcionalidades Incluidas

1. **GymBro IA (Asistente Virtual):**
   - Asesoría biomecánica, dudas sobre nutrición, técnica de ejercicios y motivación deportiva.
   - Motor de respuestas contextuales de alta disponibilidad.

2. **Catálogo de Ejercicios:**
   - 12 ejercicios fundamentales cargados en base de datos.
   - Búsqueda en tiempo real, filtros por grupo muscular y por dificultad (Principiante, Intermedio, Avanzado).
   - Botón *"💬 Consultar a GymBro"* para enviar dudas sobre cualquier ejercicio a la IA con un clic.

3. **Gestor de Rutinas Semanales:**
   - Creación de rutinas personalizadas seleccionando días de la semana (Lunes a Domingo).
   - Asignación de ejercicios con series, repeticiones y descansos (segundos).
   - Botón *"💬 Pedir feedback a GymBro"* para que la IA audite la rutina.

4. **Autenticación Segura (OWASP):**
   - Registro e inicio de sesión de usuarios con contraseñas encriptadas mediante `bcrypt` y tokens `JWT`.

5. **Base de Datos NoSQL:**
   - Conexión configurada con MongoDB Atlas (Mongoose).
   - Almacén de contingencia en memoria en caso de que la IP no esté autorizada o no haya internet.
