import React, { useState } from "react";

const FontButton: React.FC = () => {
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");

  const toggleFontSize = () => {
    setFontSize((prev) => (prev === "normal" ? "large" : "normal"));
  };

  return (
    <button
      onClick={toggleFontSize}
      className="relative top-0 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
    >
      {fontSize === "normal" ? "Aumentar Fonte" : "Diminuir Fonte"}
    </button>
  );
};

export default FontButton;
