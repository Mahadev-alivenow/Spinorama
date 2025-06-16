import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onChange: (theme: 'light' | 'dark') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onChange }) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow">
      <div 
        className={`w-6 h-6 rounded-full ${theme === 'dark' ? 'bg-black' : 'bg-gray-200 border border-gray-300'}`}
        onClick={() => onChange('dark')}
      ></div>
      <span className="text-sm font-medium">Light</span>
    </div>
  );
};

export default ThemeToggle;
