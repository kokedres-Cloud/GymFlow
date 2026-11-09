import React from 'react';
import './Navbar.css';

function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  return (
    <header className="gymflow-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => setActiveTab('chat')}>
          <span className="brand-icon">⚡</span>
          <span className="brand-title">Gym<span className="brand-accent">Flow</span></span>
          <span className="brand-badge">Prototipo</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          <button
            className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="nav-icon">🤖</span>
            <span>GymBro IA</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'exercises' ? 'active' : ''}`}
            onClick={() => setActiveTab('exercises')}
          >
            <span className="nav-icon">🏋️‍♂️</span>
            <span>Ejercicios</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'routines' ? 'active' : ''}`}
            onClick={() => setActiveTab('routines')}
          >
            <span className="nav-icon">📋</span>
            <span>Mis Rutinas</span>
          </button>
        </nav>

        {/* User Auth Info */}
        <div className="navbar-user">
          {user ? (
            <div className="user-profile">
              <div className="user-avatar" title={user.email}>
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">{user.nombre}</span>
                <span className="user-role">{user.rol || 'GymUser'}</span>
              </div>
              <button className="logout-btn" onClick={onLogout} title="Cerrar sesión">
                Salir
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={onOpenAuth}>
              <span className="btn-icon">🔐</span>
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

