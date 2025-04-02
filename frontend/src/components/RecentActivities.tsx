import React from "react";
import { GamepadIcon, Pill } from 'lucide-react';

const RecentActivities: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          {/* Lembrete de Remédio */}
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Pill className="h-6 w-6 text-blue-600 mr-4" />
            <div>
              <p className="text-lg font-medium text-gray-900">Lembrete de Remédio</p>
              <p className="text-gray-600">Próximo remédio: Pressão Alta - 14:00</p>
            </div>
          </div>

          {/* Jogo da Memória */}
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <GamepadIcon className="h-6 w-6 text-blue-600 mr-4" />
            <div>
              <p className="text-lg font-medium text-gray-900">Jogo da Memória</p>
              <p className="text-gray-600">Melhor pontuação: 85 pontos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
