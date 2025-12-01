import { useState } from "react";
import { ChatArea } from "./sections/ChatArea";
import { ChatHeader } from "./sections/ChatHeader";

const ChatbotPage = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader 
        isDarkMode={isDarkMode} 
        onThemeToggle={() => setIsDarkMode(!isDarkMode)} 
      />
      <div className="flex-1 pt-20">
        <ChatArea isDark={isDarkMode} />
      </div>
    </div>
  );
};

export default ChatbotPage;