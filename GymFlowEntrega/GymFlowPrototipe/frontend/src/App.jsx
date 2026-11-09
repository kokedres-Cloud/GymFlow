import React, { useState } from 'react';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import GymBroChat from './GymBroChat';
import ExerciseCatalog from './ExerciseCatalog';
import RoutineManager from './RoutineManager';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('gymflow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('gymflow_token');
    localStorage.removeItem('gymflow_user');
    setUser(null);
  };

  const handleAskGymbro = (promptText) => {
    setPendingPrompt(promptText);
    setActiveTab('chat');
  };

  return (
    <div className="gymflow-app">
      {/* Barra de navegación superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Contenido principal según la pestaña activa */}
      <main className="gymflow-main">
        {activeTab === 'chat' && (
          <div className="chat-view-wrapper">
            <GymBroChat
              initialPrompt={pendingPrompt}
              onClearInitialPrompt={() => setPendingPrompt('')}
            />
          </div>
        )}

        {activeTab === 'exercises' && (
          <ExerciseCatalog onAskGymbro={handleAskGymbro} />
        )}

        {activeTab === 'routines' && (
          <RoutineManager
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onAskGymbro={handleAskGymbro}
          />
        )}
      </main>

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />
    </div>
  );
}

export default App;
