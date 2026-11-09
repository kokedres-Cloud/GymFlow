import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './GymBroChat.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GymBroChat({ initialPrompt, onClearInitialPrompt }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'gymbro',
      text: '¡Qué onda, crack! 💪 Soy GymBro, tu asistente de entrenamiento. Pregúntame lo que quieras sobre rutinas, ejercicios o nutrición. ¡Vamos con todo!',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
      inputRef.current?.focus();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  // Auto-scroll al último mensaje cada vez que cambia el historial o el estado de "escribiendo"
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // 1. Agregar mensaje del usuario al historial
    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // 2. Petición POST al backend
      const { data } = await axios.post(`${API_URL}/api/gymbro`, {
        pregunta: trimmed,
      });

      // 3. Agregar respuesta de GymBro al historial
      const broMessage = { role: 'gymbro', text: data.respuesta };
      setMessages((prev) => [...prev, broMessage]);
    } catch (error) {
      console.error('Error al contactar a GymBro:', error);
      const errorMessage = {
        role: 'gymbro',
        text: '⚠️ GymBro está descansando entre series... Intenta de nuevo en un momento.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="gymbro-chat">
      {/* Header */}
      <div className="gymbro-header">
        <div className="gymbro-avatar">🏋️</div>
        <div className="gymbro-header-info">
          <h2>GymBro</h2>
          <span className="gymbro-status">
            {isTyping ? 'escribiendo...' : 'en línea'}
          </span>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="gymbro-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`gymbro-bubble ${
              msg.role === 'user' ? 'gymbro-bubble--user' : 'gymbro-bubble--bot'
            }`}
          >
            {msg.role === 'gymbro' && (
              <span className="gymbro-bubble-avatar">🏋️</span>
            )}
            <div className="gymbro-bubble-content">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Indicador de "escribiendo..." */}
        {isTyping && (
          <div className="gymbro-bubble gymbro-bubble--bot">
            <span className="gymbro-bubble-avatar">🏋️</span>
            <div className="gymbro-bubble-content gymbro-typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        {/* Referencia para auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Barra de input */}
      <div className="gymbro-input-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Escribe tu pregunta, crack..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={isTyping || !input.trim()}>
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default GymBroChat;

