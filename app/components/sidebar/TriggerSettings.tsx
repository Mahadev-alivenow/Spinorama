import React from 'react';

interface TriggerSettingsProps {
  showBar: boolean;
  onShowBarChange: (value: boolean) => void;
  barText: string;
  onBarTextChange: (value: string) => void;
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  onPositionChange: (value: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => void;
}

const TriggerSettings: React.FC<TriggerSettingsProps> = ({ 
  showBar, 
  onShowBarChange, 
  barText, 
  onBarTextChange,
  position,
  onPositionChange
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Trigger</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center mb-2">
          <div className="relative inline-block w-10 mr-2 align-middle">
            <input 
              type="checkbox" 
              className="absolute w-6 h-6 opacity-0 cursor-pointer z-10" 
              checked={showBar}
              onChange={(e) => onShowBarChange(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition ${showBar ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${showBar ? 'translate-x-4' : ''}`}></div>
          </div>
          <span className="text-sm">Show the bar</span>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">With text</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={barText}
          onChange={(e) => onBarTextChange(e.target.value)}
          placeholder="Spin the wheel"
        />
      </div>
      
      <div>
        <label className="block text-sm mb-2">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <button 
            className={`p-3 border ${position === 'topLeft' ? 'border-blue-600' : 'border-gray-300'} rounded`}
            onClick={() => onPositionChange('topLeft')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7H17V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className={`p-3 border ${position === 'topRight' ? 'border-blue-600' : 'border-gray-300'} rounded`}
            onClick={() => onPositionChange('topRight')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 17L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 7H7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className={`p-3 border ${position === 'bottomLeft' ? 'border-blue-600' : 'border-gray-300'} rounded`}
            onClick={() => onPositionChange('bottomLeft')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 7L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 17H17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className={`p-3 border ${position === 'bottomRight' ? 'border-blue-600' : 'border-gray-300'} rounded`}
            onClick={() => onPositionChange('bottomRight')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 17H7V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriggerSettings;
