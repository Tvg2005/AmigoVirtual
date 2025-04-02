import React from "react";
import { GamepadIcon, Pill, BookOpen, Bot } from 'lucide-react';

const MainPageComponents: React.FC = () => { 
return(
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Jogos */}
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <GamepadIcon className="h-6 w-6 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Jogos</h2>
      <p className="text-gray-600">Divirta-se com jogos que estimulam sua mente</p>
    </div>

    {/* Lembretes de Remédios */}
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <Pill className="h-6 w-6 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Lembretes de Remédios</h2>
      <p className="text-gray-600">Organize seus horários de medicamentos</p>
    </div>

    {/* Dicas e Conteúdos */}
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <BookOpen className="h-6 w-6 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Dicas e Conteúdos</h2>
      <p className="text-gray-600">Aprenda sobre saúde e bem-estar</p>
    </div>

    {/* Chatbot Amigo */}
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <Bot className="h-6 w-6 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Chatbot AmigoSenior</h2>
      <p className="text-gray-600">Converse com nosso assistente virtual</p>
    </div>
  </div>
  </div>
  );
};

export default MainPageComponents;