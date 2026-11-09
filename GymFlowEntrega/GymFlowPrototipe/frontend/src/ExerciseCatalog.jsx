import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExerciseCatalog.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MUSCLE_GROUPS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pecho', label: 'Pecho' },
  { id: 'espalda', label: 'Espalda' },
  { id: 'piernas', label: 'Piernas' },
  { id: 'hombros', label: 'Hombros' },
  { id: 'biceps', label: 'Bíceps' },
  { id: 'triceps', label: 'Tríceps' },
  { id: 'gluteos', label: 'Glúteos' },
  { id: 'abdominales', label: 'Abdominales' },
];

function ExerciseCatalog({ onAskGymbro }) {
  const [exercises, setExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState('todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedMuscle !== 'todos') params.grupoMuscular = selectedMuscle;
        if (selectedDifficulty !== 'todos') params.dificultad = selectedDifficulty;

        const res = await axios.get(`${API_URL}/api/exercises`, { params });
        setExercises(res.data.exercises || []);
      } catch (err) {
        console.error('Error al cargar ejercicios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedMuscle, selectedDifficulty]);

  const filteredExercises = exercises.filter((ex) => {
    const q = search.toLowerCase();
    return (
      ex.nombre.toLowerCase().includes(q) ||
      (ex.descripcion && ex.descripcion.toLowerCase().includes(q))
    );
  });

  return (
    <div className="catalog-container">
      {/* Header */}
      <div className="catalog-header">
        <div>
          <h2>Catálogo de Ejercicios y Guía Técnica</h2>
          <p>Instrucciones de ejecución, grupos musculares y recomendaciones seguras.</p>
        </div>
        <div className="catalog-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar ejercicio por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros por Grupo Muscular */}
      <div className="filter-chips">
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group.id}
            className={`chip-btn ${selectedMuscle === group.id ? 'active' : ''}`}
            onClick={() => setSelectedMuscle(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Subfiltros por dificultad */}
      <div className="difficulty-filters">
        <span className="diff-label">Dificultad:</span>
        {['todos', 'principiante', 'intermedio', 'avanzado'].map((diff) => (
          <button
            key={diff}
            className={`diff-btn ${selectedDifficulty === diff ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid de Ejercicios */}
      {loading ? (
        <div className="catalog-loading">
          <div className="spinner"></div>
          <p>Cargando ejercicios de GymFlow...</p>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="catalog-empty">
          <span className="empty-icon">🏋️</span>
          <h3>No se encontraron ejercicios</h3>
          <p>Intenta con otro filtro de búsqueda o grupo muscular.</p>
        </div>
      ) : (
        <div className="exercises-grid">
          {filteredExercises.map((ex) => (
            <div key={ex._id} className="exercise-card">
              {ex.imagenUrl && (
                <div className="exercise-image-wrapper">
                  <img src={ex.imagenUrl} alt={ex.nombre} loading="lazy" />
                  <span className={`badge-difficulty badge-${ex.dificultad}`}>
                    {ex.dificultad}
                  </span>
                </div>
              )}
              <div className="exercise-content">
                <div className="exercise-tags">
                  <span className="badge-muscle">{ex.grupoMuscular}</span>
                </div>
                <h3>{ex.nombre}</h3>
                <p className="exercise-desc">{ex.descripcion}</p>

                <div className="exercise-actions">
                  <button
                    className="ask-bro-btn"
                    onClick={() => onAskGymbro(`¿Cuál es la técnica correcta y errores comunes al hacer ${ex.nombre}?`)}
                  >
                    <span>💬 Consultar a GymBro</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExerciseCatalog;
