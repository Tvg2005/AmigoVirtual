import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardNovo from './Dashboard/Dashboard';
import Desktop from './Desktop/Desktop';
import Login from './Login&Register/Login';
import Register from './Login&Register/Register';
import News from './News/News';
import MedicationReminders from './MedicationReminder/MedicationReminders';
import ChatbotPage from './ChatBot/Chatbot';
import ChatBot from './Desktop/components/ChatBot';
import ChatBotButton from './Desktop/components/ChatBotButton';
import Games from './Games/Games';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Página de Jogos */}
          <Route path='/jogos' element={<Games/>} />

          {/* Página de Notícias */}
          <Route path='/noticias' element={<News/>} />

          {/* Página do Chatbot */}
          <Route path="/chatbot" element={<ChatbotPage />} />

          {/* Homepage - Desktop */}
          <Route path="/" element={<Desktop />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Registro */}
          <Route path="/register" element={<Register />} />

          {/* Novo Dashboard com ChatBot */}
          <Route 
            path="/dashboard" 
            element={
              <div className="relative">
                <DashboardNovo />
                <ChatBotButton onClick={toggleChat} />
                {isChatOpen && <ChatBot onClose={function (): void {
                  throw new Error('Function not implemented.');
                } } />}
              </div>
            } 
          />

          {/* Medication Reminders */}
          <Route path="/medication-reminders" element={<MedicationReminders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
