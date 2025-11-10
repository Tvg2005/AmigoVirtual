import React, { useState } from "react";
import {
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import AccessibilityMenu from "../components/AccessibilityMenu";


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


  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-300 to-blue-200 border-b border-blue-300 flex items-center justify-between px-8 z-20">
      {/* Logo */}
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
                ? "bg-blue-400 text-white" 
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
       <AccessibilityMenu/>
      </div>

    </header>
  );
};