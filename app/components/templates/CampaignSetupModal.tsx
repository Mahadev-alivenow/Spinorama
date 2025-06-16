"use client"

import type React from "react"

interface CampaignSetupModalProps {
  campaignName: string
  onCampaignNameChange: (value: string) => void
  campaignDescription: string
  onCampaignDescriptionChange: (value: string) => void
  color: string
  onColorChange: (value: string) => void
  onStartCreating: () => void
  onSkipStep: () => void
}

const CampaignSetupModal: React.FC<CampaignSetupModalProps> = ({
  campaignName,
  onCampaignNameChange,
  campaignDescription,
  onCampaignDescriptionChange,
  color,
  onColorChange,
  onStartCreating,
  onSkipStep,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2">Let's Get This Wheel Rolling!</h2>
          <p className="text-gray-600 text-sm mb-6">*Don't worry this information can be changed later</p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Enter your campaign name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={campaignName}
              onChange={(e) => onCampaignNameChange(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Enter your campaign description</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded resize-none h-24"
              value={campaignDescription}
              onChange={(e) => onCampaignDescriptionChange(e.target.value)}
            ></textarea>
            <p className="text-gray-500 text-xs mt-1">*This is optional</p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-bold mb-2">Upload Your Brand's Color</h3>
            <p className="text-gray-600 text-sm mb-4">So we can suggest the best-looking templates for you!</p>

            <div>
              <label className="block text-sm font-medium mb-2">Choose your brand color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: color }}
                ></div>

                <div className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 4V12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 8H12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button className="w-full py-3 bg-black text-white font-bold rounded mb-4" onClick={onStartCreating}>
              Start creating
            </button>

            <div className="text-center">
              <button className="text-gray-500 text-sm" onClick={onSkipStep}>
                skip this step
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignSetupModal

