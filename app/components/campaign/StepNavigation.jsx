"use client";

import { useState, useRef, useEffect } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { toast } from "react-hot-toast";

export default function StepNavigation({
  onNext,
  nextButtonText,
  showNextButton = true,
  showPrevButton = true,
}) {
  const { campaignData, updateCampaignName, nextStep, prevStep } =
    useCampaign();
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(campaignData.name);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const inputRef = useRef(null);

  // Update local name when campaign data changes
  useEffect(() => {
    setLocalName(campaignData.name);
  }, [campaignData.name]);

  // Handle campaign name change
  const handleCampaignNameChange = (e) => {
    setLocalName(e.target.value);
  };

  // Enable editing mode
  const handleCampaignNameClick = () => {
    console.log("Campaign name clicked, enabling edit mode");
    setIsEditing(true);
  };

  // Save campaign name on blur
  const handleCampaignNameBlur = () => {
    console.log("Campaign name input blurred, saving name:", localName);
    setIsEditing(false);
    if (localName !== campaignData.name) {
      updateCampaignName(localName);
    }
  };

  // Handle key press in campaign name input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Enter key pressed in campaign name input");
      setIsEditing(false);
      if (localName !== campaignData.name) {
        updateCampaignName(localName);
      }
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    console.log("Back button clicked, current step:", campaignData.step);
    if (campaignData.step === 1) {
      toast.error("You're already at the first step!");
    } else {
      prevStep();
    }
  };

  // Handle continue button click
  const handleContinueClick = () => {
    console.log("Continue button clicked, current step:", campaignData.step);
    if (campaignData.step === 4) {
      // If we're on the last step, trigger the onNext callback if provided
      if (onNext) {
        onNext();
      } else {
        // Otherwise, show the launch modal
        setShowLaunchModal(true);
      }
    } else {
      nextStep();
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-40">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${campaignData.completionPercentage}%` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {showPrevButton ? (
          <button
            onClick={handleBackClick}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              campaignData.step === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            disabled={campaignData.step === 1}
          >
            Back
          </button>
        ) : (
          <div></div> // Empty div to maintain flex spacing
        )}

        <div className="text-center">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={localName}
              onChange={handleCampaignNameChange}
              onBlur={handleCampaignNameBlur}
              onKeyDown={handleKeyDown}
              className="border-b border-indigo-500 text-center font-medium text-lg px-2 py-1 focus:outline-none"
            />
          ) : (
            <div
              onClick={handleCampaignNameClick}
              className="font-medium text-lg cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-center group"
            >
              {campaignData.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 text-gray-400 group-hover:text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          )}
          <div className="text-sm text-gray-500">
            Step {campaignData.step} of 4
          </div>
        </div>

        {showNextButton && (
          <button
            onClick={handleContinueClick}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            {nextButtonText ||
              (campaignData.step === 4 ? "Finish" : "Continue")}
          </button>
        )}
      </div>
    </div>
  );
}
