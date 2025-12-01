import React, { useState } from "react";
import {
  Accessibility,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import AccessibilityMenu from "../components/AccessibilityMenu";

export const DashboardHeader = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Função para alternar tema
  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Aplicar tema no documento
    if (newMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
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
    <header className={`fixed top-0 left-80 right-0 h-20 border-b flex items-center justify-between px-8 z-20 transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700" 
        : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
    }`}>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
        <div className={`relative h-12 rounded-full border-2 flex items-center overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
          isDarkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-white border-[#548bc54f]"
        }`}>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisa..."
            className={`flex-1 ml-5 mr-4 bg-transparent border-none p-0 shadow-none font-medium text-base focus-visible:ring-0 focus-visible:outline-none h-full ${
              isDarkMode
                ? "text-gray-100 placeholder:text-gray-400"
                : "text-gray-800 placeholder:text-gray-500"
            }`}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="mr-3 h-8 w-8 rounded-full hover:bg-blue-100"
          >
            <SearchIcon className="w-5 h-5 text-600"style={{color: '#548AC5'}} />
          </Button>
        </div>
      </form>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 ml-8">
      

     
        {/* Settings Button */}
        <AccessibilityMenu/>
      </div>
    </header>
  );
};