import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AccessibilityMenu from './AccessibilityMenu';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

export default function Header({ searchQuery, setSearchQuery, onSearch }: HeaderProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="Voltar ao dashboard"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <div>
                <img src="../../public/robot copy.png" alt="elizIA Logo" className="h-12 w-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
                  eliz<span className="text-blue-400">IA</span>
                </h1>
                <p className="text-blue-600 text-xs font-medium">Notícias em Tempo Real</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar notícias..."
                className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-xl
                         bg-white backdrop-blur-sm text-blue-800 placeholder-blue-400
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onSearch}
              className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl
                       transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-50"
              title="Buscar notícias"
            >
              Buscar
            </button>
            <AccessibilityMenu />
          </div>
        </div>
      </div>
    </header>
  );
}