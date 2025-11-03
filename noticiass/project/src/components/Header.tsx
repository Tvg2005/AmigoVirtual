import React from 'react';
import { Newspaper, Search } from 'lucide-react';

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
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <Newspaper className="h-8 w-8 text-blue-100" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                eliz<span className="text-blue-200">IA</span>
              </h1>
              <p className="text-blue-200 text-xs font-medium">Notícias em Tempo Real</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-300" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar notícias..."
                className="block w-full pl-10 pr-3 py-3 border border-blue-500/30 rounded-xl 
                         bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onSearch}
            className="bg-blue-500 hover:bg-blue-400 text-white font-medium px-6 py-3 rounded-xl
                     transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-800"
          >
            Buscar
          </button>
        </div>
      </div>
    </header>
  );
}