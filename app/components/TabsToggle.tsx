import React from 'react';

interface TabsToggleProps {
  activeTab: string;
  tabs: { id: string; label: string }[];
  onChange: (tabId: string) => void;
}

const TabsToggle: React.FC<TabsToggleProps> = ({ activeTab, tabs, onChange }) => {
  return (
    <div className="flex border-b border-gray-300">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === tab.id 
              ? 'border-b-2 border-gray-900 text-gray-900' 
              : 'text-gray-500'
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabsToggle;
