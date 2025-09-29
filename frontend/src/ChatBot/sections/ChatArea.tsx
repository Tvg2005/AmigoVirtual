import React, { useState } from 'react';
import { Send, Search } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatAreaProps {
  activeSection: string;
}

export const ChatArea = ({ activeSection }: ChatAreaProps): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá, Maria! Sobre o que gostaria de conversar hoje?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: 'Interessante! Como posso ajudá-la com isso?',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSectionContent = () => {
    switch (activeSection) {
      case 'games':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold text-slate-700 mb-8">Jogos</h2>
            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="font-semibold text-slate-700">Jogo da Velha</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-700">Caça Palavras</h3>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisa..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Eliza</p>
                          <p>{message.text}</p>
                        </div>
                      </div>
                    )}
                    {message.sender === 'user' && <p>{message.text}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite algo..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {getSectionContent()}
    </div>
  );
};