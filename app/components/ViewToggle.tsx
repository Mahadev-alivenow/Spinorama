import React from 'react';
import { Button } from '@shopify/polaris';

interface ViewToggleProps {
  activeView: 'mobile' | 'desktop';
  onChange: (view: 'mobile' | 'desktop') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onChange }) => {
  return (
    <div className="inline-flex rounded-md overflow-hidden border border-gray-300">
      <button
        className={`px-4 py-2 text-sm ${activeView === 'mobile' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500'}`}
        onClick={() => onChange('mobile')}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7.5 12H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Mobile
        </div>
      </button>
      <button
        className={`px-4 py-2 text-sm ${activeView === 'desktop' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500'}`}
        onClick={() => onChange('desktop')}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 13H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Desktop
        </div>
      </button>
    </div>
  );
};

export default ViewToggle;
