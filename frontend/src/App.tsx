import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import Chatbot from './components/ChatBot';
import ChatBotButton from './components/ChatBotButton';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de login
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado do chatbot
  const [fontSize] = useState('normal'); // Estado do tamanho da fonte

  const handleLogin = () => {
    setIsLoggedIn(true); // Define o usuário como logado
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev); // Alterna a visibilidade do chatbot
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} /> 
      ) : (
        <div className="relative">
          <Dashboard />

          {/* Botão flutuante do Chatbot */}
          <ChatBotButton onClick={toggleChat} />

          {/* Exibir Chatbot apenas quando `isChatOpen` for true */}
          {isChatOpen && <Chatbot onClose={toggleChat} />}

          {/* Rodapé */}
          <Footer />

          {/* Botão para alterar o tamanho da fonte */}
        
        </div>
      )}
    </div>
  );
}

export default App;
