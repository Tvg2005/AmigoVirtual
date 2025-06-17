import React, { useState, useEffect } from "react";

const FontButton: React.FC = () => {
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");

  useEffect(() => {
    // Apply font size to the entire document
    if (fontSize === "large") {
      document.documentElement.style.fontSize = "18px";
    } else {
      document.documentElement.style.fontSize = "16px";
    }
  }, [fontSize]);

  const toggleFontSize = () => {
    setFontSize((prev) => (prev === "normal" ? "large" : "normal"));
  };

  return (
    <button
      onClick={toggleFontSize}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
    >
      {fontSize === "normal" ? "Aumentar Fonte" : "Diminuir Fonte"}
    </button>
  );
};

export default FontButton;