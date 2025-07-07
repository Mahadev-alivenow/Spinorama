"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useCampaign } from "../context/CampaignContext";
import { usePlan } from "../context/PlanContext";
import Navigation from "../components/Navigation";
import StepOne from "../components/campaign/StepOne";
import StepTwo from "../components/campaign/StepTwo";
import StepThree from "../components/campaign/StepThree";
import StepFour from "../components/campaign/StepFour";
import { toast } from "react-hot-toast";
import StepNavigation from "../components/campaign/StepNavigation";

export default function CreateCampaign() {
  const {
    campaignData,
    updateCampaignData,
    checkCanCreateCampaign,
    saveCampaign,
  } = useCampaign();
  const { currentPlan } = usePlan();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const navigate = useNavigate();

  // Log when the component renders
  useEffect(() => {
    console.log("CreateCampaign rendered, current step:", campaignData.step);
    toast.success("Campaign creator loaded!");
  }, []);

  // Check if user can create more campaigns
  useEffect(() => {
    if (!checkCanCreateCampaign()) {
      setShowLimitModal(true);
    }
  }, [checkCanCreateCampaign]);

  // Reset campaign data when component mounts
  useEffect(() => {
    console.log("Initializing campaign data");
    updateCampaignData({
      name: "Campaign Name",
      step: 1,
      look: "custom",
      color: "singleTone",
      primaryColor: "#fe5300",
      secondaryColor: "#767676",
      tertiaryColor: "#444444",
      completionPercentage: 25,
    });
  }, [updateCampaignData]);

  // Handle campaign launch
  const handleLaunch = async (status) => {
    try {
      console.log("Launching campaign with status:", status);

      // Create a campaign object with a unique ID if it doesn't exist
      const campaign = {
        ...campaignData,
        id: campaignData.id || `campaign-${Date.now()}`,
        status: status || "draft",
        createdAt: new Date().toISOString(),
      };

      // Save the campaign
      const savedCampaign = await saveCampaign(campaign);
      console.log("Campaign saved successfully:", savedCampaign);

      // Close the modals
      setShowLaunchModal(false);
      setShowPreviewModal(false);

      // Show success message
      toast.success(
        `Campaign ${status === "active" ? "launched" : "saved"} successfully!`,
      );

      try {
        const syncResponse = await fetch("/api/sync-campaign-metafields", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ campaignId: campaign.id }),
        });

        if (syncResponse.ok) {
          toast.success("Campaign activated and synced to storefront!");
          // console.log("syncing campaign metafields: ",syncResponse);
          // window.location.reload();
        } else {
          console.log("RELOADING PAGE not ok", syncResponse);

          // navigate("/");

          toast.success(
            "Campaign activated! Sync to storefront may take a moment.",
          );
        }
      } catch (syncError) {
        console.log("RELOADING PAGE", syncError);
        // window.location.reload();
        toast.success(
          "Campaign activated! Sync to storefront may take a moment.",
        );
      }

      // Navigate to campaigns page
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
    // Show the preview modal first
    setShowPreviewModal(true);
  };

  // Render the appropriate step based on the current step
  const renderStep = () => {
    console.log("Rendering step:", campaignData.step);
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

  // Render wheel with text based on selected sectors for the preview modal
  const renderWheel = () => {
    const wheelSectors = campaignData.layout?.wheelSectors || "eight";

    return (
      <div className="relative w-[220px] h-[220px]">
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              wheelSectors === "four"
                ? `conic-gradient(
                    ${campaignData.primaryColor} 0deg, 
                    ${campaignData.primaryColor} 90deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                    ${campaignData.primaryColor} 180deg, 
                    ${campaignData.primaryColor} 270deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                  )`
                : wheelSectors === "six"
                  ? `conic-gradient(
                      ${campaignData.primaryColor} 0deg, 
                      ${campaignData.primaryColor} 60deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 60deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 120deg, 
                      ${campaignData.primaryColor} 120deg, 
                      ${campaignData.primaryColor} 180deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 240deg,
                      ${campaignData.primaryColor} 240deg, 
                      ${campaignData.primaryColor} 300deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 300deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                    )`
                  : `conic-gradient(
                      ${campaignData.primaryColor} 0deg, 
                      ${campaignData.primaryColor} 45deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 45deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg,
                      ${campaignData.primaryColor} 90deg, 
                      ${campaignData.primaryColor} 135deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 135deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg,
                      ${campaignData.primaryColor} 180deg, 
                      ${campaignData.primaryColor} 225deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 225deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg,
                      ${campaignData.primaryColor} 270deg, 
                      ${campaignData.primaryColor} 315deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 315deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                    )`,
          }}
        >
          {/* Center of wheel */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-black"></div>
          </div>

          {/* Text for 4-sector wheel */}
          {wheelSectors === "four" && (
            <>
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                {campaignData.prizes?.[0]?.text || "10% OFF"}
              </div>
              <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90">
                {campaignData.prizes?.[1]?.text || "FREE SHIP"}
              </div>
              <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180">
                {campaignData.prizes?.[2]?.text || "20% OFF"}
              </div>
              <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90">
                {campaignData.prizes?.[3]?.text || "NO LUCK"}
              </div>
            </>
          )}

          {/* Text for 6-sector wheel */}
          {wheelSectors === "six" && (
            <>
              <div className="absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                {campaignData.prizes?.[0]?.text || "10% OFF"}
              </div>
              <div className="absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-60">
                {campaignData.prizes?.[1]?.text || "FREE SHIP"}
              </div>
              <div className="absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-120">
                {campaignData.prizes?.[2]?.text || "15% OFF"}
              </div>
              <div className="absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180">
                {campaignData.prizes?.[3]?.text || "20% OFF"}
              </div>
              <div className="absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-120">
                {campaignData.prizes?.[4]?.text || "5% OFF"}
              </div>
              <div className="absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-60">
                {campaignData.prizes?.[5]?.text || "NO LUCK"}
              </div>
            </>
          )}

          {/* Text for 8-sector wheel */}
          {(wheelSectors === "eight" || !wheelSectors) && (
            <>
              <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                {campaignData.prizes?.[0]?.text || "10% OFF"}
              </div>
              <div className="absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-45">
                {campaignData.prizes?.[1]?.text || "FREE SHIP"}
              </div>
              <div className="absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90">
                {campaignData.prizes?.[2]?.text || "5% OFF"}
              </div>
              <div className="absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-135">
                {campaignData.prizes?.[3]?.text || "20% OFF"}
              </div>
              <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180">
                {campaignData.prizes?.[4]?.text || "FREE SHIP"}
              </div>
              <div className="absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-135">
                {campaignData.prizes?.[5]?.text || "5% OFF"}
              </div>
              <div className="absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90">
                {campaignData.prizes?.[6]?.text || "20% OFF"}
              </div>
              <div className="absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-45">
                {campaignData.prizes?.[7]?.text || "10% OFF"}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navigation /> */}
      <div className="container mx-auto px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold mb-8">Create Campaign</h1>
        {renderStep()}
      </div>

      <StepNavigation
        onNext={() => {
          if (campaignData.step === 4) {
            handleFinish();
          }
        }}
        nextButtonText={campaignData.step === 4 ? "Finish" : "Continue"}
      />

      {/* Campaign Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Campaign Limit Reached</h3>
            <p className="text-gray-600 mb-6">
              You've reached the limit of {currentPlan.campaignLimit} campaigns
              for your {currentPlan.name} plan. Please upgrade your plan to
              create more campaigns.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate("/campaigns")}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Campaigns
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal - Updated with improved launch modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-0 relative">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="p-8 bg-indigo-900 text-white text-center">
              <h2 className="text-4xl font-bold mb-2">READY, SET, LAUNCH!</h2>
              <p className="text-xl">
                Your campaign can now shine on your site.
              </p>
            </div>

            {/* Campaign Preview */}
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-lg w-full overflow-hidden">
                <div className="p-6">
                  {/* Logo and Title Section */}
                  <div className="text-center mb-4">
                    {/* Logo */}
                    <div className="w-16 h-16 mx-auto mb-2">
                      {campaignData.logo ? (
                        <img
                          src={campaignData.logo || "/placeholder.svg"}
                          alt="Campaign Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor:
                              campaignData.primaryColor || "#ff5722",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Campaign Name */}
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: campaignData.primaryColor || "#ff5722" }}
                    >
                      {campaignData.name || "Swiggy"}
                    </h3>

                    {/* Campaign Title */}
                    <h4
                      className="text-2xl font-bold mb-4"
                      style={{ color: campaignData.primaryColor || "#ff5722" }}
                    >
                      {campaignData.content?.landing?.title || "SPIN TO WIN"}
                    </h4>
                  </div>

                  {/* Campaign Description */}
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {campaignData.content?.landing?.subtitle ||
                      "Before you go anywhere, enter your email address to spin the wheel for a chance to win a wicked awesome discount."}
                  </p>

                  {/* Form and Wheel Container */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side - Form */}
                    <div className="w-full md:w-1/2">
                      {/* Privacy Policy Checkbox */}
                      {campaignData.content?.landing?.showPrivacyPolicy !==
                        false && (
                        <div className="flex items-center mb-2 w-full">
                          <input
                            type="checkbox"
                            id="privacy-notice"
                            className="mr-2"
                            checked
                            readOnly
                          />
                          <label htmlFor="privacy-notice" className="text-xs">
                            {campaignData.content?.landing?.privacyPolicyText ||
                              "I accept the Privacy Notice."}
                          </label>
                        </div>
                      )}

                      {/* Terms Checkbox */}
                      {campaignData.content?.landing?.showTerms !== false && (
                        <div className="flex items-center mb-4 w-full">
                          <input
                            type="checkbox"
                            id="terms"
                            className="mr-2"
                            checked
                            readOnly
                          />
                          <label htmlFor="terms" className="text-xs">
                            {campaignData.content?.landing?.termsText ||
                              "I accept the Terms & Conditions."}
                          </label>
                        </div>
                      )}

                      {/* Email Input */}
                      {campaignData.content?.landing?.showEmail !== false && (
                        <input
                          type="email"
                          placeholder={
                            campaignData.content?.landing?.emailPlaceholder ||
                            "Enter your email"
                          }
                          className="w-full p-3 border rounded-md mb-4 text-center"
                        />
                      )}

                      {/* Spin Button */}
                      <button
                        className="w-full py-3 font-bold text-white rounded-md text-lg"
                        style={{
                          backgroundColor:
                            campaignData.primaryColor || "#ff5722",
                        }}
                      >
                        {campaignData.content?.landing?.buttonText ||
                          "SPIN NOW"}
                      </button>

                      {/* No Thanks Text */}
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        {campaignData.content?.landing?.noThanksText ||
                          "No, I don't feel lucky today!"}
                      </p>
                    </div>

                    {/* Right side - Wheel */}
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                      {/* Wheel with dots around the edge */}
                      <div className="relative">
                        {/* Dots around the wheel */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle, transparent 80%, white 80%, white 83%, transparent 83%)",
                            backgroundSize: "100% 100%",
                            transform: "scale(1.05)",
                            pointerEvents: "none",
                          }}
                        >
                          {/* Create dots around the wheel */}
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-white rounded-full"
                              style={{
                                top: `${50 - 45 * Math.cos(i * (Math.PI / 12))}%`,
                                left: `${50 + 45 * Math.sin(i * (Math.PI / 12))}%`,
                              }}
                            ></div>
                          ))}
                        </div>

                        {/* The actual wheel */}
                        {renderWheel()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  handleLaunch("draft");
                }}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Later
              </button>
              <button
                onClick={() => {
                  handleLaunch("active");
                }}
                className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Activate Now
              </button>
            </div>

            {/* Footer Text */}
            <div className="text-center pb-6">
              <p className="text-gray-600">
                Easily activate or pause your campaigns anytime in{" "}
                <span className="font-medium">All Campaigns</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
