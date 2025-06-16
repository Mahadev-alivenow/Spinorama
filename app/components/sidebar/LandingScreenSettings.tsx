import React from 'react';

interface LandingScreenSettingsProps {
  title: string;
  onTitleChange: (value: string) => void;
  subtitle: string;
  onSubtitleChange: (value: string) => void;
  emailPlaceholder: string;
  onEmailPlaceholderChange: (value: string) => void;
  buttonText: string;
  onButtonTextChange: (value: string) => void;
  termsEnabled: boolean;
  onTermsEnabledChange: (value: boolean) => void;
  termsText: string;
  onTermsTextChange: (value: string) => void;
  termsLink: string;
  onTermsLinkChange: (value: string) => void;
}

const LandingScreenSettings: React.FC<LandingScreenSettingsProps> = ({
  title,
  onTitleChange,
  subtitle,
  onSubtitleChange,
  emailPlaceholder,
  onEmailPlaceholderChange,
  buttonText,
  onButtonTextChange,
  termsEnabled,
  onTermsEnabledChange,
  termsText,
  onTermsTextChange,
  termsLink,
  onTermsLinkChange
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Landing Screen</span>
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
          placeholder="GO AHEAD GIVE IT A SPIN!"
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
            placeholder="This is a demo of our Spin to Win displays"
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
        <label className="block text-sm mb-1">Email</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={emailPlaceholder}
          onChange={(e) => onEmailPlaceholderChange(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Button</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={buttonText}
          onChange={(e) => onButtonTextChange(e.target.value)}
          placeholder="SPIN NOW"
        />
      </div>
      
      <div className="mb-4">
        <label className="flex items-center mb-2">
          <div className="relative inline-block w-10 mr-2 align-middle">
            <input 
              type="checkbox" 
              className="absolute w-6 h-6 opacity-0 cursor-pointer z-10" 
              checked={termsEnabled}
              onChange={(e) => onTermsEnabledChange(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition ${termsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${termsEnabled ? 'translate-x-4' : ''}`}></div>
          </div>
          <span className="text-sm">Terms and conditions</span>
        </label>
      </div>
      
      {termsEnabled && (
        <>
          <div className="mb-4">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              value={termsText}
              onChange={(e) => onTermsTextChange(e.target.value)}
              placeholder="I accept the T&C and Privacy Notice."
            />
            <button className="mt-2 p-1 border border-gray-300 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">Link</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              value={termsLink}
              onChange={(e) => onTermsLinkChange(e.target.value)}
              placeholder="www.termsandcondition.com"
            />
          </div>
        </>
      )}
      
      <div>
        <button className="flex items-center gap-2 text-sm text-gray-600 py-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 8L8 13L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Result screen
        </button>
      </div>
    </div>
  );
};

export default LandingScreenSettings;
