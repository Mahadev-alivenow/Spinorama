"use client";

import { useParams, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import Navigation from "../components/Navigation";
import StepOne from "../components/campaign/StepOne";
import StepTwo from "../components/campaign/StepTwo";
import StepThree from "../components/campaign/StepThree";
import StepFour from "../components/campaign/StepFour";
import StepSidebar from "../components/campaign/StepSidebar";
import StepNavigation from "../components/campaign/StepNavigation";
import { toast } from "react-hot-toast";

export default function CampaignEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allCampaigns, updateCampaignData, campaignData, saveCampaign } =
    useCampaign();
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [campaign, setCampaign] = useState(null);

  console.log("CampaignEdit component rendering with ID:", id);
  console.log("All campaigns available:", allCampaigns);

  // Find the campaign by ID
  useEffect(() => {
    console.log("Looking for campaign with ID:", id);
    console.log("Available campaigns:", allCampaigns);

    const foundCampaign = allCampaigns.find((c) => c.id === id);

    if (foundCampaign) {
      console.log("Found campaign for editing:", foundCampaign);
      setCampaign(foundCampaign);

      // Load campaign data into the editor
      updateCampaignData({
        ...foundCampaign,
        step: 1, // Start at step 1 when editing
        completionPercentage: 25,
      });

      setIsLoading(false);
    } else {
      // If campaign not found, redirect to campaigns list
      console.error("Campaign not found:", id);
      toast.error("Campaign not found");
      navigate("/campaigns");
    }
  }, [id, allCampaigns, updateCampaignData, navigate]);

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      // Get the original campaign to preserve fields that might not be in campaignData
      const originalCampaign = campaign || {};

      // Merge the original campaign with the updated data
      const updatedCampaign = {
        ...originalCampaign,
        ...campaignData,
        id: id, // Ensure ID is preserved
        updatedAt: new Date().toISOString(),
      };

      console.log("Saving updated campaign:", updatedCampaign);
      await saveCampaign(updatedCampaign);
      toast.success("Campaign updated successfully!");
      setShowSaveModal(false);

      // Navigate back to campaigns list
      setTimeout(() => {
        navigate("/campaigns");
      }, 500);
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error(`Error: ${error.message || "Failed to save campaign"}`);
    }
  };

  // Handle finish button click
  const handleFinish = () => {
    setShowSaveModal(true);
  };

  // Handle back to campaigns
  const handleBackToCampaigns = () => {
    navigate("/campaigns");
  };

  // Render the current step
  const renderStep = () => {
    switch (campaignData.step) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      default:
        return <StepOne />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Loading campaign...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* <Navigation /> */}
          <button
            onClick={handleBackToCampaigns}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Campaigns
          </button>
        </div>

        <div className="mt-8 pb-32">
          <h1 className="text-3xl font-bold mb-8">
            Edit Campaign: {campaignData.name}
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            {/* <div className="w-full md:w-1/4">
              <StepSidebar />
            </div> */}

            {/* Main content */}
            <div className="w-full ">{renderStep()}</div>
          </div>
        </div>

        <StepNavigation
          onNext={() => {
            if (campaignData.step === 4) {
              handleFinish();
            }
          }}
          nextButtonText={campaignData.step === 4 ? "Save Changes" : "Continue"}
        />

        {/* Save Changes Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Save Campaign Changes</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to save your changes to "
                {campaignData.name}"?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
