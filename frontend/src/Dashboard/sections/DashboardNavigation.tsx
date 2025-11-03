import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Button } from "../components/button";
import {
  MessageSquareIcon,
  Gamepad2Icon,
  PillIcon,
  LightbulbIcon,
} from "lucide-react";

export const DashboardNavigation = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigationItems = [
    { icon: MessageSquareIcon, label: "Eliza", image: "/message-bot.png", route: "/chatbot" },
    { icon: Gamepad2Icon, label: "Jogos", image: "/game-controller.png", route: null },
    { icon: PillIcon, label: "Remédios", image: "/hand-with-a-pill.png", route: "/medication-reminders" },
    { icon: LightbulbIcon, label: "Notícias", image: "/morning-news.png", route: "/noticias" },
  ];

  useEffect(() => {
    // Verificar modo dark inicial
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    // Observar mudanças no modo dark
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className={`fixed left-0 top-0 w-80 h-screen flex flex-col overflow-hidden z-10 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-[#66a5c0] via-[#4584cbb7] to-[#7ea8b9]'
    }`}>
      
      {/* Espaçamento do topo */}
      <div className="pt-6"></div>

      {/* Robot Avatar */}
      <div className="relative flex justify-center mb-8">
        <div className={`w-48 h-48 bg-[url(/ellipse-7.svg)] bg-cover bg-center flex items-center justify-center transition-opacity duration-300 ${
          isDarkMode ? 'opacity-70' : 'opacity-100'
        }`}>
          <Avatar className="w-24 h-24">
            <AvatarImage src="/robot-logo.png" alt="Robot" />
            <AvatarFallback className={`text-xl font-semibold transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-700/20 text-blue-400' 
                : 'bg-white/20 text-[#5ba5c2d9]'
            }`}>R</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-6 space-y-4">
        {navigationItems.map((item) =>
          item.route ? (
            <Link
              key={item.label}
              to={item.route}
              className={`w-full h-14 flex items-center justify-start p-3 transition-colors duration-200 rounded-xl group ${
                isDarkMode 
                  ? 'hover:bg-gray-700/50' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  alt={item.label}
                  src={item.image}
                />
              </div>
              <span className={`ml-6 font-medium text-xl transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-200 group-hover:text-white' 
                  : 'text-[#ffffff] group-hover:text-white'
              }`}>
                {item.label}
              </span>
            </Link>
          ) : (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full h-14 flex items-center justify-start p-3 transition-colors duration-200 rounded-xl group ${
                isDarkMode 
                  ? 'hover:bg-gray-700/50' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  alt={item.label}
                  src={item.image}
                />
              </div>
              <span className={`ml-6 font-medium text-xl transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-200 group-hover:text-white' 
                  : 'text-[#ffffff] group-hover:text-white'
              }`}>
                {item.label}
              </span>
            </Button>
          )
        )}
      </nav>

      {/* Upgrade Button */}
      <div className="p-6 pt-2">
        <Button className={`w-full h-14 rounded-full border-none relative overflow-hidden backdrop-blur-sm transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:p-[2px] before:rounded-full before:-z-10 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-700/80 to-gray-600/60 hover:from-gray-600/90 hover:to-gray-500/70 before:bg-gradient-to-r before:from-gray-500/70 before:to-transparent' 
            : 'bg-gradient-to-r from-white/80 to-white/60 hover:from-white/90 hover:to-white/70 before:bg-gradient-to-r before:from-white/70 before:to-transparent'
        }`}>
          <span className={`font-semibold text-xl transition-colors duration-300 ${
            isDarkMode ? 'text-blue-300' : 'text-[#548AC5]'
          }`}>
            upgrade
          </span>
        </Button>
        
        {/* Logo centralizado abaixo do botão upgrade */}
        <div className="text-center mt-4 pb-2">
          <div className={`text-lg font-normal transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-[#ffffff]'
          }`}>
            wiseconnect™
          </div>
        </div>
      </div>
    </aside>
  );
};