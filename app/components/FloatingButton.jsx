"use client";

import { useState } from "react";
import { Gift } from "lucide-react";

export default function FloatingButton({
  position = "bottom-right",
  text = "SPIN & WIN",
  showText = true,
  color = "#fe5300",
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "left-4 bottom-4";
      case "bottom-right":
        return "right-4 bottom-4";
      case "top-right":
        return "right-4 top-4";
      case "center-bottom":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "right-4 bottom-4";
    }
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed ${getPositionClasses()} z-50 flex items-center rounded-full shadow-lg transition-all duration-300`}
      style={{
        backgroundColor: color,
        padding: showText
          ? isHovered
            ? "0.75rem 1.5rem"
            : "0.75rem"
          : "0.75rem",
      }}
    >
      <div className="bg-white p-2 rounded-full">
        <Gift size={24} style={{ color }} />
      </div>

      {showText && (
        <span
          className="text-white font-bold ml-2 whitespace-nowrap overflow-hidden transition-all duration-300"
          style={{
            maxWidth: isHovered ? "200px" : "0",
            opacity: isHovered ? 1 : 0,
          }}
        >
          {text}
        </span>
      )}
    </button>
  );
}
