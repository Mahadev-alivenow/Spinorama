import React from 'react';

export default function ProgressBar({ progress = 0 }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-200 h-1">
      <div 
        className="bg-indigo-600 h-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      ></div>
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">{progress}%</div>
    </div>
  );
}