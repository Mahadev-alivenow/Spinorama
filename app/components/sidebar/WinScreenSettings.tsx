import React from 'react';

interface WinScreenSettingsProps {
  title: string;
  onTitleChange: (value: string) => void;
  subtitle: string;
  onSubtitleChange: (value: string) => void;
  couponText: string;
  onCouponTextChange: (value: string) => void;
  buttonText: string;
  onButtonTextChange: (value: string) => void;
}

const WinScreenSettings: React.FC<WinScreenSettingsProps> = ({
  title,
  onTitleChange,
  subtitle,
  onSubtitleChange,
  couponText,
  onCouponTextChange,
  buttonText,
  onButtonTextChange
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Win Screen</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Title</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="LUCKY DAY!"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Sub Title</label>
        <div className="relative">
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="You have won 10% discount for your shopping"
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
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Coupon text</label>
        <div className="relative">
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            value={couponText}
            onChange={(e) => onCouponTextChange(e.target.value)}
            placeholder="Your discount code is"
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
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Button</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={buttonText}
          onChange={(e) => onButtonTextChange(e.target.value)}
          placeholder="REDEEM NOW"
        />
      </div>
      
      <div>
        <button className="flex items-center gap-2 text-sm text-gray-600 py-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 8L8 13L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Urgency Bar
        </button>
      </div>
    </div>
  );
};

export default WinScreenSettings;
