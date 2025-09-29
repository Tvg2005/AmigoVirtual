import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatBotButtonProps {
  onClick: () => void;
}

const ChatBotButton: React.FC<ChatBotButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-7 right-7 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      aria-label="Abrir chat assistente"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default ChatBotButton;
