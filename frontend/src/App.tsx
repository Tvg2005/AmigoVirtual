import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardNovo from './Dashboard/Dashboard';
import Desktop from './Desktop/Desktop';
import Login from './Login&Register/Login';
import Register from './Login&Register/Register';
import DashboardVelho from './Dashboard/DashboardVelho';
import MedicationReminders from './MedicationReminder/MedicationReminders';
import Chatbot from './Desktop/components/ChatBot';
import ChatBotButton from './Desktop/components/ChatBotButton';

function App() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatOpen((prev: boolean) => !prev);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Chatbot */}
          <Route path="/chatbot" element={<Chatbot onClose={toggleChat} />} />

          {/* Velho Dashboard */}
          <Route path="/dashboard-velho" element={<DashboardVelho />} />

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
                <DashboardNovo />
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
