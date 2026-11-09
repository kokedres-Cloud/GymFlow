import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './RoutineManager.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DAYS_OF_WEEK = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
];

function RoutineManager({ user, onOpenAuth, onAskGymbro }) {
  const [routines, setRoutines] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [routineExercises, setRoutineExercises] = useState([]);
  const [currentExId, setCurrentExId] = useState('');
  const [currentSeries, setCurrentSeries] = useState(4);
  const [currentReps, setCurrentReps] = useState(10);
  const [currentRest, setCurrentRest] = useState(60);
  const [formError, setFormError] = useState('');

  const token = localStorage.getItem('gymflow_token');

  const fetchAvailableExercises = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/exercises`);
      setAvailableExercises(res.data.exercises || []);
      if (res.data.exercises && res.data.exercises.length > 0) {
        setCurrentExId(res.data.exercises[0]._id);
      }
    } catch (err) {
      console.error('Error al cargar ejercicios:', err);
    }
  }, []);

  const fetchMyRoutines = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/routines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines(res.data.routines || []);
    } catch (err) {
      console.error('Error al cargar rutinas:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAvailableExercises();
    if (token) {
      fetchMyRoutines();
    }
  }, [token, fetchAvailableExercises, fetchMyRoutines]);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddExerciseToRoutine = () => {
    if (!currentExId) return;
    const exObj = availableExercises.find((e) => e._id === currentExId);
    if (!exObj) return;

    const newItem = {
      ejercicio: exObj._id,
      nombre: exObj.nombre,
      grupoMuscular: exObj.grupoMuscular,
      series: Number(currentSeries),
      repeticiones: Number(currentReps),
      descansoSegundos: Number(currentRest),
    };

    setRoutineExercises([...routineExercises, newItem]);
  };

  const handleRemoveExercise = (idx) => {
    setRoutineExercises(routineExercises.filter((_, i) => i !== idx));
  };

  const handleSaveRoutine = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim()) {
      setFormError('Por favor ingresa un nombre para la rutina.');
      return;
    }

    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        dias: selectedDays,
        ejercicios: routineExercises.map((item) => ({
          ejercicio: item.ejercicio,
          series: item.series,
          repeticiones: item.repeticiones,
          descansoSegundos: item.descansoSegundos,
        })),
      };

      await axios.post(`${API_URL}/api/routines`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form
      setNombre('');
      setDescripcion('');
      setSelectedDays([]);
      setRoutineExercises([]);
      setIsCreating(false);
      fetchMyRoutines();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al guardar la rutina.');
    }
  };

  const handleDeleteRoutine = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta rutina?')) return;
    try {
      await axios.delete(`${API_URL}/api/routines/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyRoutines();
    } catch (err) {
      console.error('Error al eliminar rutina:', err);
      alert('Error al eliminar la rutina.');
    }
  };

  if (!user && !token) {
    return (
      <div className="routine-container">
        <div className="routine-auth-prompt">
          <div className="prompt-icon">📋</div>
          <h2>Administrador de Rutinas GymFlow</h2>
          <p>
            Crea rutinas personalizadas, asigna días de la semana y configura series, repeticiones y descansos.
          </p>
          <div className="prompt-actions">
            <button className="prompt-btn" onClick={onOpenAuth}>
              🔐 Iniciar Sesión para Gestionar Rutinas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="routine-container">
      {/* Header */}
      <div className="routine-header">
        <div>
          <h2>Mis Rutinas de Entrenamiento</h2>
          <p>Organiza tus sesiones semanales con sobrecarga progresiva.</p>
        </div>
        <button
          className="create-routine-btn"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? '✕ Cancelar' : '➕ Crear Nueva Rutina'}
        </button>
      </div>

      {/* Formulario de creación de rutina */}
      {isCreating && (
        <form onSubmit={handleSaveRoutine} className="routine-form-card">
          <h3>Diseñar Nueva Rutina</h3>
          {formError && <div className="form-error-banner">{formError}</div>}

          <div className="form-grid">
            <div className="form-field">
              <label>Nombre de la Rutina *</label>
              <input
                type="text"
                placeholder="Ej. Empuje / Push Day A"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Descripción / Enfoque</label>
              <input
                type="text"
                placeholder="Ej. Pecho, Hombro y Tríceps pesado"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>

          {/* Días */}
          <div className="form-section">
            <label className="section-label">Días asignados:</label>
            <div className="days-selector">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  type="button"
                  key={day}
                  className={`day-chip ${selectedDays.includes(day) ? 'selected' : ''}`}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Agregar Ejercicios */}
          <div className="form-section">
            <label className="section-label">Agregar Ejercicio a la Rutina:</label>
            <div className="add-exercise-bar">
              <select
                value={currentExId}
                onChange={(e) => setCurrentExId(e.target.value)}
              >
                {availableExercises.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.nombre} ({e.grupoMuscular})
                  </option>
                ))}
              </select>

              <div className="number-input">
                <label>Series</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={currentSeries}
                  onChange={(e) => setCurrentSeries(e.target.value)}
                />
              </div>

              <div className="number-input">
                <label>Reps</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={currentReps}
                  onChange={(e) => setCurrentReps(e.target.value)}
                />
              </div>

              <div className="number-input">
                <label>Descanso (s)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={currentRest}
                  onChange={(e) => setCurrentRest(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="add-item-btn"
                onClick={handleAddExerciseToRoutine}
              >
                ➕ Añadir
              </button>
            </div>
          </div>

          {/* Lista de ejercicios agregados en el formulario */}
          {routineExercises.length > 0 && (
            <div className="added-exercises-list">
              <h4>Ejercicios incluidos ({routineExercises.length}):</h4>
              {routineExercises.map((item, idx) => (
                <div key={idx} className="added-exercise-item">
                  <div className="item-info">
                    <span className="item-name">{item.nombre}</span>
                    <span className="item-badge">{item.grupoMuscular}</span>
                    <span className="item-details">
                      {item.series} series × {item.repeticiones} reps (descanso {item.descansoSegundos}s)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="delete-item-btn"
                    onClick={() => handleRemoveExercise(idx)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-submit-actions">
            <button type="submit" className="save-routine-btn">
              💾 Guardar Rutina en GymFlow
            </button>
          </div>
        </form>
      )}

      {/* Lista de Rutinas */}
      {loading ? (
        <div className="routine-loading">
          <div className="spinner"></div>
          <p>Cargando tus rutinas...</p>
        </div>
      ) : routines.length === 0 ? (
        <div className="routine-empty">
          <span className="empty-icon">📝</span>
          <h3>Aún no has creado rutinas</h3>
          <p>Haz clic en "Crear Nueva Rutina" para planificar tu semana de entrenamiento.</p>
        </div>
      ) : (
        <div className="routines-grid">
          {routines.map((routine) => (
            <div key={routine._id} className="routine-card">
              <div className="routine-card-header">
                <h3>{routine.nombre}</h3>
                <button
                  className="card-delete-btn"
                  onClick={() => handleDeleteRoutine(routine._id)}
                  title="Eliminar rutina"
                >
                  ✕
                </button>
              </div>

              {routine.descripcion && (
                <p className="routine-desc">{routine.descripcion}</p>
              )}

              {/* Días */}
              {routine.dias && routine.dias.length > 0 && (
                <div className="routine-days">
                  {routine.dias.map((d) => (
                    <span key={d} className="routine-day-badge">
                      {d.slice(0, 3).toUpperCase()}
                    </span>
                  ))}
                </div>
              )}

              {/* Ejercicios */}
              <div className="routine-exercises">
                <h4>Ejercicios ({routine.ejercicios ? routine.ejercicios.length : 0}):</h4>
                {routine.ejercicios && routine.ejercicios.length > 0 ? (
                  <ul className="exercise-list">
                    {routine.ejercicios.map((item, i) => (
                      <li key={i}>
                        <span className="bullet">▪</span>
                        <strong>{item.ejercicio?.nombre || 'Ejercicio'}:</strong>{' '}
                        {item.series} series × {item.repeticiones} reps
                        {item.descansoSegundos ? ` (${item.descansoSegundos}s descanso)` : ''}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-exercises-text">Sin ejercicios registrados.</p>
                )}
              </div>

              <div className="routine-card-footer">
                <button
                  className="ask-routine-btn"
                  onClick={() =>
                    onAskGymbro(
                      `Analiza mi rutina "${routine.nombre}" con ${routine.ejercicios?.length || 0} ejercicios para los días ${routine.dias?.join(', ')}. ¿Qué mejoras o recomendaciones me das?`
                    )
                  }
                >
                  💬 Pedir feedback a GymBro
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoutineManager;
