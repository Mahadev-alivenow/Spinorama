import React from 'react';

interface LayoutSelectorProps {
  selected: 'right' | 'left';
  onChange: (value: 'right' | 'left') => void;
  viewMode: 'mobile' | 'desktop';
  onViewModeChange: (mode: 'mobile' | 'desktop') => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ 
  selected, 
  onChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="5" width="15" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7.5 5V15" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className="text-sm font-medium">Layout of the Popup</span>
        </div>
        
        <div className="flex">
          <button 
            className={`p-1 ${viewMode === 'mobile' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => onViewModeChange('mobile')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7.5 12H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          
          <button 
            className={`p-1 ${viewMode === 'desktop' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => onViewModeChange('desktop')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 13H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div 
            className={`w-24 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 cursor-pointer ${selected === 'right' ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
            onClick={() => onChange('right')}
          >
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <span className="text-xs text-gray-500">Right</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            className={`w-24 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 cursor-pointer ${selected === 'left' ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
            onClick={() => onChange('left')}
          >
            <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          </div>
          <span className="text-xs text-gray-500">Left</span>
        </div>
      </div>
    </div>
  );
};

export default LayoutSelector;
