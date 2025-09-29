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
  const navigationItems = [
    { icon: MessageSquareIcon, label: "Eliza", image: "/message-bot.png" },
    { icon: Gamepad2Icon, label: "Jogos", image: "/game-controller.png" },
    { icon: PillIcon, label: "Remédios", image: "/hand-with-a-pill.png" },
    { icon: LightbulbIcon, label: "Notícias", image: "/morning-news.png" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-80 h-screen bg-gradient-to-b from-[#66a5c0] via-[#4584cbb7] to-[#7ea8b9] flex flex-col overflow-hidden z-10">
      
      {/* Espaçamento do topo */}
      <div className="pt-6"></div>

      {/* Robot Avatar */}
      <div className="relative flex justify-center mb-8">
        <div className="w-48 h-48 bg-[url(/ellipse-7.svg)] bg-cover bg-center flex items-center justify-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/robot-logo.png" alt="Robot" />
            <AvatarFallback className="bg-white/20 text-[#5ba5c2d9] text-xl font-semibold">R</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-6 space-y-4">
        {navigationItems.map((item) =>
          item.label === "Remédios" ? (
            <Link
              key={item.label}
              to="/medication-reminders"
              className="w-full h-14 flex items-center justify-start p-3 hover:bg-white/10 transition-colors duration-200 rounded-xl group"
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  alt={item.label}
                  src={item.image}
                />
              </div>
              <span className="ml-6 font-medium text-[#ffffff] text-xl group-hover:text-white transition-colors duration-200">
                {item.label}
              </span>
            </Link>
          ) : (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full h-14 flex items-center justify-start p-3 hover:bg-white/10 transition-colors duration-200 rounded-xl group"
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  alt={item.label}
                  src={item.image}
                />
              </div>
              <span className="ml-6 font-medium text-[#ffffff] text-xl group-hover:text-white transition-colors duration-200">
                {item.label}
              </span>
            </Button>
          )
        )}
      </nav>

      {/* Upgrade Button */}
      <div className="p-6 pt-2">
          <Button className="w-full h-14 rounded-full border-none relative overflow-hidden bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm hover:from-white/90 hover:to-white/70 transition-all duration-200 before:content-[''] before:absolute before:inset-0 before:p-[2px] before:rounded-full before:bg-gradient-to-r before:from-white/70 before:to-transparent before:-z-10">
            <span className="font-semibold text-[#548AC5] text-xl">
              upgrade
            </span>
          </Button>
          
        {/* Logo centralizado abaixo do botão upgrade */}
        <div className="text-center mt-4 pb-2">
          <div className="text-[#ffffff] text-lg font-normal">
            wiseconnect™
          </div>
        </div>
      </div>
    </aside>
  );
};
