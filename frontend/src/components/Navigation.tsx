import React from 'react';
import { Home } from 'lucide-react';
import FontButton from './FontButton'; // Importação do botão de fonte

const Navigation: React.FC = () => {
  return (
    <div>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Esquerda - Ícone e Início */}
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="#"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium"
                >
                  Início
                </a>
              </div>
            </div>

            {/* Direita - Botão de Fonte e Notificações */}
            <div className="flex items-center gap-4">
              <FontButton /> {/* Botão de alterar fonte */}
              <button className="p-2 rounded-full text-gray-600 hover:text-gray-900">
                <span className="sr-only">Ver notificações</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
