import React from 'react';
import { Button } from '@shopify/polaris';
import { EditIcon } from '@shopify/polaris-icons';

interface HeaderProps {
  campaignName: string;
  onBack: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onEditName: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  campaignName, 
  onBack, 
  onPreview, 
  onPublish, 
  onEditName 
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
      <Button onClick={onBack}>Back</Button>
      
      <div className="flex items-center">
        <h1 className="text-xl font-medium mr-2">{campaignName}</h1>
        <button 
          onClick={onEditName}
          className="p-1 text-gray-500 hover:text-gray-700"
          aria-label="Edit campaign name"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 15.5H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.25 4.75L14.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.25 12.75L11.25 4.75L14.25 7.75L6.25 12.75L4.5 15.5L6.25 12.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={onPreview}>Preview</Button>
        <Button primary onClick={onPublish}>Publish</Button>
      </div>
    </div>
  );
};

export default Header;
