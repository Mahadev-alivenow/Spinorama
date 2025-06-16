import React from 'react';

interface Prize {
  id: number;
  label: string;
  code: string;
  chance: number;
}

interface PrizeSettingsProps {
  prizes: Prize[];
  onPrizeChange: (id: number, field: 'label' | 'code' | 'chance', value: string | number) => void;
  copyCodeForAll: boolean;
  onCopyCodeForAllChange: (value: boolean) => void;
}

const PrizeSettings: React.FC<PrizeSettingsProps> = ({
  prizes,
  onPrizeChange,
  copyCodeForAll,
  onCopyCodeForAllChange
}) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="text-sm font-medium">PRIZE LABEL</div>
        <div className="text-sm font-medium flex items-center">
          COUPON CODE
          <label className="flex items-center ml-2">
            <input 
              type="checkbox" 
              className="w-4 h-4 mr-1" 
              checked={copyCodeForAll}
              onChange={(e) => onCopyCodeForAllChange(e.target.checked)}
            />
            <span className="text-xs">Copy same code for all</span>
          </label>
        </div>
        <div className="text-sm font-medium">CHANCE</div>
      </div>
      
      {prizes.map((prize) => (
        <div key={prize.id} className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <span className="w-6 text-sm font-medium">{prize.id}</span>
            <input 
              type="text" 
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              value={prize.label}
              onChange={(e) => onPrizeChange(prize.id, 'label', e.target.value)}
              placeholder="20% OFF"
            />
          </div>
          
          <input 
            type="text" 
            className="px-3 py-2 border border-gray-300 rounded text-sm"
            value={prize.code}
            onChange={(e) => onPrizeChange(prize.id, 'code', e.target.value)}
            placeholder="20OFF"
            disabled={copyCodeForAll && prize.id !== 1}
          />
          
          <div className="relative">
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm appearance-none"
              value={prize.chance}
              onChange={(e) => onPrizeChange(prize.id, 'chance', parseInt(e.target.value))}
            >
              <option value={4}>4%</option>
              <option value={10}>10%</option>
              <option value={20}>20%</option>
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
              <option value={60}>60%</option>
              <option value={70}>70%</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrizeSettings;
