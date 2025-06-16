import React from 'react';

interface UrgencyBarSettingsProps {
  showBar: boolean;
  onShowBarChange: (value: boolean) => void;
  displayText: string;
  onDisplayTextChange: (value: string) => void;
  couponCode: string;
  onCouponCodeChange: (value: string) => void;
  minutes: string;
  onMinutesChange: (value: string) => void;
  seconds: string;
  onSecondsChange: (value: string) => void;
}

const UrgencyBarSettings: React.FC<UrgencyBarSettingsProps> = ({ 
  showBar, 
  onShowBarChange, 
  displayText, 
  onDisplayTextChange,
  couponCode,
  onCouponCodeChange,
  minutes,
  onMinutesChange,
  seconds,
  onSecondsChange
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Urgency Bar</span>
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
        <label className="block text-sm mb-1">Display Text</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={displayText}
          onChange={(e) => onDisplayTextChange(e.target.value)}
          placeholder="Your coupon code is reserved for. You can apply it at check"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Coupon Code</label>
        <div className="relative">
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
            placeholder="ABCDEFG_101"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 8.5V12.5C13.5 12.7652 13.3946 13.0196 13.2071 13.2071C13.0196 13.3946 12.7652 13.5 12.5 13.5H3.5C3.23478 13.5 2.98043 13.3946 2.79289 13.2071C2.60536 13.0196 2.5 12.7652 2.5 12.5V3.5C2.5 3.23478 2.60536 2.98043 2.79289 2.79289C2.98043 2.60536 3.23478 2.5 3.5 2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 2.5H13.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 9L13.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm mb-1">Timer</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              className="w-16 px-3 py-2 border border-gray-300 rounded text-sm text-center"
              value={minutes}
              onChange={(e) => onMinutesChange(e.target.value)}
              placeholder="00"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 8.5V12.5C13.5 12.7652 13.3946 13.0196 13.2071 13.2071C13.0196 13.3946 12.7652 13.5 12.5 13.5H3.5C3.23478 13.5 2.98043 13.3946 2.79289 13.2071C2.60536 13.0196 2.5 12.7652 2.5 12.5V3.5C2.5 3.23478 2.60536 2.98043 2.79289 2.79289C2.98043 2.60536 3.23478 2.5 3.5 2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 2.5H13.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 9L13.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <span className="text-lg font-medium">:</span>
          
          <div className="relative">
            <input 
              type="text" 
              className="w-16 px-3 py-2 border border-gray-300 rounded text-sm text-center"
              value={seconds}
              onChange={(e) => onSecondsChange(e.target.value)}
              placeholder="00"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 8.5V12.5C13.5 12.7652 13.3946 13.0196 13.2071 13.2071C13.0196 13.3946 12.7652 13.5 12.5 13.5H3.5C3.23478 13.5 2.98043 13.3946 2.79289 13.2071C2.60536 13.0196 2.5 12.7652 2.5 12.5V3.5C2.5 3.23478 2.60536 2.98043 2.79289 2.79289C2.98043 2.60536 3.23478 2.5 3.5 2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 2.5H13.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 9L13.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Minutes</span>
          <span className="text-xs text-gray-500">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default UrgencyBarSettings;
