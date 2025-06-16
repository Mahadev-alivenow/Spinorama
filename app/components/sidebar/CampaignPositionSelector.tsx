import React from 'react';

interface CampaignPositionSelectorProps {
  selected: 'fullscreen' | 'popup';
  onChange: (value: 'fullscreen' | 'popup') => void;
}

const CampaignPositionSelector: React.FC<CampaignPositionSelectorProps> = ({ selected, onChange }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm font-medium">Campaign Position</span>
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div 
            className={`w-24 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 cursor-pointer ${selected === 'fullscreen' ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
            onClick={() => onChange('fullscreen')}
          >
            <div className="relative w-16 h-16 bg-gray-200 rounded">
              <div className="absolute top-1 right-1 w-3 h-3 flex items-center justify-center bg-white rounded-full text-xs">×</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full" style={{ 
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
            </div>
          </div>
          <span className="text-xs text-gray-500">Full screen</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            className={`w-24 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 cursor-pointer ${selected === 'popup' ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
            onClick={() => onChange('popup')}
          >
            <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
              <div className="w-8 h-8 rounded-full" style={{ 
                background: `conic-gradient(
                  #999 0deg, 
                  #999 90deg, 
                  #ccc 90deg, 
                  #ccc 180deg, 
                  #999 180deg, 
                  #999 270deg, 
                  #ccc 270deg, 
                  #ccc 360deg
                )`
              }}></div>
            </div>
          </div>
          <span className="text-xs text-gray-500">Pop-Up</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignPositionSelector;
