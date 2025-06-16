import { useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorPicker({ 
  label, 
  initialColor = "#ff5200", 
  onChange 
}) {
  const [color, setColor] = useState(initialColor);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };
  
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-md border border-gray-300 shadow-sm"
          style={{ backgroundColor: color }}
          aria-label="Select color"
        />
        
        <input
          type="text"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          className="ml-2 block w-28 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-3">
          <HexColorPicker color={color} onChange={handleColorChange} />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}