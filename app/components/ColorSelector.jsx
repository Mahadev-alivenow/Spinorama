import React from 'react';

export default function ColorSelector({ 
  colorScheme, 
  primaryColor, 
  secondaryColor, 
  onColorSchemeChange, 
  onPrimaryColorChange, 
  onSecondaryColorChange 
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#333] mb-4">Color</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
            colorScheme === 'single' 
              ? 'border-indigo-600 bg-white shadow-sm' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => onColorSchemeChange('single')}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                colorScheme === 'single' 
                  ? 'border-indigo-600 bg-white' 
                  : 'border-gray-300 bg-white'
              }`}>
                {colorScheme === 'single' && (
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-[#333]">Single Tone</h3>
                <p className="text-sm text-gray-500">Use one primary brand color</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded overflow-hidden relative cursor-pointer" style={{ backgroundColor: primaryColor }}>
                <input 
                  type="color" 
                  value={primaryColor}
                  onChange={(e) => onPrimaryColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <span className="ml-2 text-sm text-gray-700">{primaryColor}</span>
            </div>
          </div>
        </div>

        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
            colorScheme === 'dual' 
              ? 'border-indigo-600 bg-white shadow-sm' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => onColorSchemeChange('dual')}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                colorScheme === 'dual' 
                  ? 'border-indigo-600 bg-white' 
                  : 'border-gray-300 bg-white'
              }`}>
                {colorScheme === 'dual' && (
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-[#333]">Dual Tone</h3>
                <p className="text-sm text-gray-500">Select two of your brand colors</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded overflow-hidden relative cursor-pointer" style={{ backgroundColor: primaryColor }}>
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => onPrimaryColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={colorScheme !== 'dual'}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-700">{primaryColor}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded overflow-hidden relative cursor-pointer" style={{ backgroundColor: secondaryColor || '#444444' }}>
                  <input 
                    type="color" 
                    value={secondaryColor || '#444444'}
                    onChange={(e) => onSecondaryColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={colorScheme !== 'dual'}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-700">{secondaryColor || '#444444'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}