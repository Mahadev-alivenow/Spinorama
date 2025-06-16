import React, { useState } from 'react';
import { Popover } from '@shopify/polaris';
import { InfoIcon, ArrowLeftIcon, CirclePlusIcon } from '@shopify/polaris-icons';

interface ColorSelectorProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ color, onChange }) => {
  const [popoverActive, setPopoverActive] = useState(false);
  
  const togglePopover = () => setPopoverActive(!popoverActive);
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm font-medium">Colour Selected</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 5.5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="text-xs text-gray-500 mb-2">Color_01</div>
      
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={togglePopover}
        ></div>
        
        <div className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {popoverActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={togglePopover}>
          <div className="bg-white p-4 rounded shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-5 gap-2">
              {['#FF5722', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', 
                '#F44336', '#3F51B5', '#009688', '#FF9800', '#673AB7',
                '#E91E63', '#00BCD4', '#8BC34A', '#FF5722', '#607D8B'].map(c => (
                <div 
                  key={c} 
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    onChange(c);
                    togglePopover();
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
