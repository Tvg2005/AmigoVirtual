import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Desktop from './Desktop/Desktop';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MedicationReminders from './pages/MedicationReminders';
import Chatbot from './components/ChatBot';
import ChatBotButton from './components/ChatBotButton';

function App() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatOpen((prev: boolean) => !prev);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Homepage - Now Desktop */}
          <Route path="/" element={<Desktop />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Registro */}
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <div className="relative">
                <Dashboard />
                <ChatBotButton onClick={toggleChat} />
                {isChatOpen && <Chatbot onClose={toggleChat} />}
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