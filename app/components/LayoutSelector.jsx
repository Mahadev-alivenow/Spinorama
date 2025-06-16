import React from 'react';

export default function LayoutSelector({ selectedLayout, onLayoutChange }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#333] mb-4">Look</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
            selectedLayout === 'custom' 
              ? 'border-indigo-600 bg-white shadow-sm' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => onLayoutChange('custom')}
        >
          <div className="flex items-start mb-1">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
              selectedLayout === 'custom' 
                ? 'border-indigo-600 bg-white' 
                : 'border-gray-300 bg-white'
            }`}>
              {selectedLayout === 'custom' && (
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-[#333]">Custom Layout</h3>
              <p className="text-sm text-gray-500">Design your way, from scratch.</p>
            </div>
          </div>
        </div>

        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
            selectedLayout === 'template' 
              ? 'border-indigo-600 bg-white shadow-sm' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => onLayoutChange('template')}
        >
          <div className="flex items-start mb-1">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
              selectedLayout === 'template' 
                ? 'border-indigo-600 bg-white' 
                : 'border-gray-300 bg-white'
            }`}>
              {selectedLayout === 'template' && (
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-[#333]">Ready-Made Templates</h3>
              <p className="text-sm text-gray-500">Pre-made design, your words & color.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}