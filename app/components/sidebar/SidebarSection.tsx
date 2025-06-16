import React, { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  children, 
  isOpen = true, 
  onToggle,
  icon,
  rightElement
}) => {
  return (
    <div className="border-b border-gray-200">
      <div 
        className="flex items-center justify-between px-4 py-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        
        {rightElement && (
          <div className="flex items-center">
            {rightElement}
          </div>
        )}
        
        {onToggle && (
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;
