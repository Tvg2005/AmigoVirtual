import React, { useState } from "react";
import {
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";

interface ChatHeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export const ChatHeader = ({ isDarkMode, onThemeToggle }: ChatHeaderProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Função para alternar tema
  const handleThemeToggle = () => {
    onThemeToggle();
    
    // Aplicar tema no documento
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Função para busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Pesquisando por:", searchTerm);
      // Aqui você pode implementar a lógica de busca
      // Por exemplo: onSearch?.(searchTerm);
    }
  };

  // Função para configurações
  const handleSettings = () => {
    setShowSettings(!showSettings);
    console.log("Abrindo configurações...");
    // Aqui você pode implementar a abertura de um modal ou navegação
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 flex items-center justify-between px-8 z-20">
      
      {/* Search Bar */}
      {/* <form onSubmit={handleSearch} className="relative flex-1 max-w-lg"> */}
        {/* <div className="relative h-12 bg-white rounded-full border-2 border-[#548bc54f] flex items-center overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"> */}
        {/* Tirar essa parte debaixo se quiser deixar o form ativo */}
        <div className="relative h-12">
          {/* <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisa..."
            className="flex-1 ml-5 mr-4 bg-transparent border-none p-0 shadow-none font-medium text-gray-800 text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:outline-none h-full"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="mr-3 h-8 w-8 rounded-full hover:bg-blue-100"
          >
            <SearchIcon className="w-5 h-5 text-600"style={{color: '#548AC5'}} />
          </Button> */}
        </div>
      {/* </form> */}

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 ml-8">
      

        {/* Theme Toggle */}
        <div 
          onClick={handleThemeToggle}
          className="h-12 bg-white rounded-lg flex items-center border-2 border-[#548bc54f] cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden"
        >
          <div 
            className={`flex items-center justify-center h-full px-3 transition-all duration-300 ${
              !isDarkMode 
                ? "bg-[#548AC5] text-white" 
                : "bg-transparent text-[#548AC5] hover:bg-blue-50"
            }`}
          >
            <SunIcon className="w-6 h-6" />
          </div>
          <div 
            className={`flex items-center justify-center h-full px-3 transition-all duration-300 ${
              isDarkMode 
                ? "bg-gray-700 text-white" 
                : "bg-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            <MoonIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Settings Button */}
        <Button
        onClick={handleSettings}
        size="icon"
        variant="ghost"
        className={`w-12 h-12 rounded-lg transition-all duration-200 border-2 ${
          showSettings 
            ? "bg-[#548AC5] text-white border-[#FFFFFF]" 
            : "bg-white hover:bg-[#548AC5] hover:text-white hover:border-[#548AC5] border-[#548bc54f]"
        }`}
      >
        <SettingsIcon 
          className={`w-6 h-6 transition-transform duration-200 ${
            showSettings ? "rotate-90" : ""
          }`} 
        />
      </Button>

      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-full right-8 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-30">
          <h3 className="font-medium text-gray-800 mb-2 text-sm">Configurações</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2">
              Preferências
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2">
              Acessibilidade
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2">
              Sobre
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};