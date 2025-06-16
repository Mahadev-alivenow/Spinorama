import React from 'react';

interface WheelSectorSelectorProps {
  selected: 'four' | 'six' | 'eight';
  onChange: (value: 'four' | 'six' | 'eight') => void;
}

const WheelSectorSelector: React.FC<WheelSectorSelectorProps> = ({ selected, onChange }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 2.5V17.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M17.5 10L2.5 10" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="text-sm font-medium">Wheel Sector</span>
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div 
            className={`w-20 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 cursor-pointer ${selected === 'four' ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
            onClick={() => onChange('four')}
          >
            <div className="w-14 h-14 rounded-full" style={{ 
              background: `conic-gradient(
                #ccc 0deg, 
                #ccc 90deg, 
                #eee 90deg, 
                #eee 180deg, 
                #ccc 180deg, 
                #ccc 270deg, 
                #eee 270deg, 
                #eee 360deg
              )`
            }}></div>
          </div>
          <span className="text-xs text-gray-500">Four</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            className={`w-20 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 cursor-pointer ${selected === 'six' ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
            onClick={() => onChange('six')}
          >
            <div className="w-14 h-14 rounded-full" style={{ 
              background: `conic-gradient(
                #ccc 0deg, 
                #ccc 60deg, 
                #eee 60deg, 
                #eee 120deg, 
                #ccc 120deg, 
                #ccc 180deg, 
                #eee 180deg, 
                #eee 240deg, 
                #ccc 240deg, 
                #ccc 300deg, 
                #eee 300deg, 
                #eee 360deg
              )`
            }}></div>
          </div>
          <span className="text-xs text-gray-500">Six</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            className={`w-20 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 cursor-pointer ${selected === 'eight' ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
            onClick={() => onChange('eight')}
          >
            <div className="w-14 h-14 rounded-full" style={{ 
              background: `conic-gradient(
                #ccc 0deg, 
                #ccc 45deg, 
                #eee 45deg, 
                #eee 90deg, 
                #ccc 90deg, 
                #ccc 135deg, 
                #eee 135deg, 
                #eee 180deg, 
                #ccc 180deg, 
                #ccc 225deg, 
                #eee 225deg, 
                #eee 270deg, 
                #ccc 270deg, 
                #ccc 315deg, 
                #eee 315deg, 
                #eee 360deg
              )`
            }}></div>
          </div>
          <span className="text-xs text-gray-500">Eight</span>
        </div>
      </div>
    </div>
  );
};

export default WheelSectorSelector;
