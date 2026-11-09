import React, { useState } from 'react';
import axios from 'axios';
import './AuthModal.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister ? { nombre, email, password } : { email, password };
      
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      // Guardar token y usuario
      localStorage.setItem('gymflow_token', res.data.token);
      localStorage.setItem('gymflow_user', JSON.stringify(res.data.user));
      
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al conectar con el servidor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>✕</button>
        
        <div className="auth-header">
          <div className="auth-icon">{isRegister ? '📝' : '🔐'}</div>
          <h2>{isRegister ? 'Crear Cuenta GymFlow' : 'Iniciar Sesión'}</h2>
          <p>{isRegister ? 'Únete y organiza tus rutinas y progresos' : 'Accede a tus rutinas y asesoría de GymBro'}</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="auth-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label>Contraseña (mínimo 6 caracteres)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Procesando...' : isRegister ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          {isRegister ? (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button className="auth-link-btn" onClick={() => { setIsRegister(false); setError(''); }}>
                Inicia sesión aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Aún no tienes cuenta?{' '}
              <button className="auth-link-btn" onClick={() => { setIsRegister(true); setError(''); }}>
                Regístrate gratis
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;

