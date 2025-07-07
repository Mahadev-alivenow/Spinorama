"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useCampaign } from "../../context/CampaignContext";
import { toast } from "react-hot-toast";
import StepSidebar from "./StepSidebar";

export default function StepFour() {
  const {
    campaignData,
    saveCampaign,
    updateCampaignData,
    updateCampaignRules,
  } = useCampaign();
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStatus, setLaunchStatus] = useState("draft"); // draft or active
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [activePreviewTab, setActivePreviewTab] = useState("landing");
  const [newPageUrl, setNewPageUrl] = useState("");
  const navigate = useNavigate();

  // Initialize local state from campaign context with proper null checks
  const [appearingRules, setAppearingRules] = useState(
    campaignData.rules?.appearingRules || {
      exitIntent: { enabled: false, device: "desktop" },
      timeDelay: { enabled: false, seconds: 5 },
      pageScroll: { enabled: false, percentage: 20 },
      pageCount: { enabled: false, pages: 2 },
      clicksCount: { enabled: false, clicks: 2 },
      inactivity: { enabled: false, seconds: 30 },
    },
  );

  const [pageTargeting, setPageTargeting] = useState(
    campaignData.rules?.pageTargeting || {
      enabled: true,
      url: "www.yourdomain.com",
      urls: [],
    },
  );

  const [popupAgain, setPopupAgain] = useState(
    campaignData.rules?.popupAgain || {
      enabled: true,
      timer: { minutes: 10, seconds: 0 },
    },
  );

  const [displayFrequency, setDisplayFrequency] = useState(
    campaignData.rules?.displayFrequency || {
      enabled: true,
      frequency: "once_a_day",
      visitorType: "everyone", // everyone, new, return
    },
  );

  // Ensure campaignData.rules is initialized
  useEffect(() => {
    if (!campaignData.rules) {
      updateCampaignData({
        rules: {
          appearingRules,
          pageTargeting,
          popupAgain,
          displayFrequency,
        },
      });
    }
  }, []);

  // Sync local state with campaign context when it changes
  useEffect(() => {
    if (campaignData.rules) {
      if (campaignData.rules.appearingRules) {
        setAppearingRules(campaignData.rules.appearingRules);
      }
      if (campaignData.rules.pageTargeting) {
        setPageTargeting(campaignData.rules.pageTargeting);
      }
      if (campaignData.rules.popupAgain) {
        setPopupAgain(campaignData.rules.popupAgain);
      }
      if (campaignData.rules.displayFrequency) {
        setDisplayFrequency(campaignData.rules.displayFrequency);
      }
    }
  }, [campaignData.rules]);

  // Save all rules to campaign context
  const saveRulesToContext = () => {
    // Update each rule type individually to ensure proper updates
    updateCampaignRules("appearingRules", appearingRules);
    updateCampaignRules("pageTargeting", pageTargeting);
    updateCampaignRules("popupAgain", popupAgain);
    updateCampaignRules("displayFrequency", displayFrequency);
  };

  // Handle finish button click
  const handleFinish = () => {
    console.log("Finish button clicked, showing launch modal");

    // Save all rules to campaign context
    saveRulesToContext();

    // Show the launch modal
    setShowLaunchModal(true);
  };

  // Handle launch campaign
  const handleLaunch = async () => {
    try {
      setIsLaunching(true);
      console.log("Launching campaign with status:", launchStatus);

      // Save all rules to context first
      saveRulesToContext();

      // First save the campaign with all rules explicitly included
      const savedCampaign = await saveCampaign({
        ...campaignData,
        status: launchStatus,
        createdAt: new Date().toISOString(),
        rules: {
          appearingRules,
          pageTargeting,
          popupAgain,
          displayFrequency,
        },
      });

      toast.success(
        `Campaign ${launchStatus === "active" ? "launched" : "saved"} successfully!`,
      );

      try {
        await toggleCampaignStatus(campaignData.id, campaignData.status);
        const newStatus = currentStatus === "active" ? "draft" : "active";
        toast.success(
          `Campaign ${newStatus === "active" ? "activated" : "deactivated"} successfully!`,
        );
        // navigate("/app"); // Refresh the campaigns list
      } catch (error) {
        toast.error("Failed to update campaign status");
      }

      // Navigate to campaigns page
      console.log("ROUTE to app");
      navigate("/app");
    } catch (error) {
      console.error("Error launching campaign:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLaunching(false);
      setShowLaunchModal(false);
    }
  };

  // Toggle appearing rule
  const toggleAppearingRule = (rule) => {
    const updatedRules = {
      ...appearingRules,
      [rule]: {
        ...appearingRules[rule],
        enabled: !appearingRules[rule].enabled,
      },
    };

    // Update local state
    setAppearingRules(updatedRules);

    // Update context
    updateCampaignRules("appearingRules", updatedRules);
  };

  // Update appearing rule value
  const updateAppearingRuleValue = (rule, field, value) => {
    const updatedRules = {
      ...appearingRules,
      [rule]: {
        ...appearingRules[rule],
        [field]: value,
      },
    };

    // Update local state
    setAppearingRules(updatedRules);

    // Update context
    updateCampaignRules("appearingRules", updatedRules);
  };

  // Toggle page targeting
  const togglePageTargeting = () => {
    const updatedTargeting = {
      ...pageTargeting,
      enabled: !pageTargeting.enabled,
    };

    // Update local state
    setPageTargeting(updatedTargeting);

    // Update context
    updateCampaignRules("pageTargeting", updatedTargeting);
  };

  // Add URL to page targeting
  const addPageTargetingUrl = () => {
    if (newPageUrl && !pageTargeting.urls.includes(newPageUrl)) {
      const updatedTargeting = {
        ...pageTargeting,
        urls: [...pageTargeting.urls, newPageUrl],
      };

      // Update local state
      setPageTargeting(updatedTargeting);

      // Update context
      updateCampaignRules("pageTargeting", updatedTargeting);

      // Clear input
      setNewPageUrl("");
    }
  };

  // Remove URL from page targeting
  const removePageTargetingUrl = (url) => {
    const updatedTargeting = {
      ...pageTargeting,
      urls: pageTargeting.urls.filter((u) => u !== url),
    };

    // Update local state
    setPageTargeting(updatedTargeting);

    // Update context
    updateCampaignRules("pageTargeting", updatedTargeting);
  };

  // Toggle popup again
  const togglePopupAgain = () => {
    const updatedPopupAgain = {
      ...popupAgain,
      enabled: !popupAgain.enabled,
    };

    // Update local state
    setPopupAgain(updatedPopupAgain);

    // Update context
    updateCampaignRules("popupAgain", updatedPopupAgain);
  };

  // Update popup timer
  const updatePopupTimer = (field, value) => {
    const numValue = Number.parseInt(value) || 0;
    const updatedTimer = {
      ...popupAgain.timer,
      [field]: numValue,
    };

    const updatedPopupAgain = {
      ...popupAgain,
      timer: updatedTimer,
    };

    // Update local state
    setPopupAgain(updatedPopupAgain);

    // Update context
    updateCampaignRules("popupAgain", updatedPopupAgain);
  };

  // Toggle display frequency
  const toggleDisplayFrequency = () => {
    const updatedFrequency = {
      ...displayFrequency,
      enabled: !displayFrequency.enabled,
    };

    // Update local state
    setDisplayFrequency(updatedFrequency);

    // Update context
    updateCampaignRules("displayFrequency", updatedFrequency);
  };

  // Update display frequency
  const updateDisplayFrequency = (frequency) => {
    const updatedFrequency = {
      ...displayFrequency,
      frequency,
    };

    // Update local state
    setDisplayFrequency(updatedFrequency);

    // Update context
    updateCampaignRules("displayFrequency", updatedFrequency);
  };

  // Update visitor type
  const updateVisitorType = (visitorType) => {
    const updatedFrequency = {
      ...displayFrequency,
      visitorType,
    };

    // Update local state
    setDisplayFrequency(updatedFrequency);

    // Update context
    updateCampaignRules("displayFrequency", updatedFrequency);
  };

  // Render wheel with text based on selected sectors
  const renderWheel = (size, isMobile = false) => {
    const wheelSectors = campaignData.layout?.wheelSectors || "eight";
    const textSizeClass = isMobile ? "text-[6px]" : "text-sm";

    return (
      <div className={`relative ${size}`}>
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${isMobile ? "w-6 h-6" : "w-10 h-10"} rounded-full bg-black`}
            ></div>
          </div>

          {/* Text for 4-sector wheel */}
          {wheelSectors === "four" && (
            <>
              <div
                className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold`}
              >
                {campaignData.prizes?.[0]?.text || "10% OFF"}
              </div>
              <div
                className={`absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-90`}
              >
                {campaignData.prizes?.[1]?.text || "FREE SHIP"}
              </div>
              <div
                className={`absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-180`}
              >
                {campaignData.prizes?.[2]?.text || "20% OFF"}
              </div>
              <div
                className={`absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-90`}
              >
                {campaignData.prizes?.[3]?.text || "NO LUCK"}
              </div>
            </>
          )}

          {/* Text for 6-sector wheel */}
          {wheelSectors === "six" && (
            <>
              <div
                className={`absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold`}
              >
                {campaignData.prizes?.[0]?.text || "10% OFF"}
              </div>
              <div
                className={`absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-60`}
              >
                {campaignData.prizes?.[1]?.text || "FREE SHIP"}
              </div>
              <div
                className={`absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-120`}
              >
                {campaignData.prizes?.[2]?.text || "15% OFF"}
              </div>
              <div
                className={`absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-180`}
              >
                {campaignData.prizes?.[3]?.text || "20% OFF"}
              </div>
              <div
                className={`absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-120`}
              >
                {campaignData.prizes?.[4]?.text || "5% OFF"}
              </div>
              <div
                className={`absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-60`}
              >
                {campaignData.prizes?.[5]?.text || "NO LUCK"}
              </div>
            </>
          )}

          {/* Text for 8-sector wheel */}
          {wheelSectors === "eight" && (
            <>
              <div
                className={`absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold`}
              >
                {campaignData.prizes?.[0]?.text || "10% OFF"}
              </div>
              <div
                className={`absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-45`}
              >
                {campaignData.prizes?.[1]?.text || "FREE SHIP"}
              </div>
              <div
                className={`absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-90`}
              >
                {campaignData.prizes?.[2]?.text || "15% OFF"}
              </div>
              <div
                className={`absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-135`}
              >
                {campaignData.prizes?.[3]?.text || "BOGO"}
              </div>
              <div
                className={`absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-180`}
              >
                {campaignData.prizes?.[4]?.text || "20% OFF"}
              </div>
              <div
                className={`absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-135`}
              >
                {campaignData.prizes?.[5]?.text || "5% OFF"}
              </div>
              <div
                className={`absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-90`}
              >
                {campaignData.prizes?.[6]?.text || "GIFT"}
              </div>
              <div
                className={`absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-45`}
              >
                {campaignData.prizes?.[7]?.text || "NO LUCK"}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render floating button
  const renderFloatingButton = (isMobile = false) => {
    if (!campaignData.layout?.showFloatingButton) return null;

    return (
      <div
        className={`absolute ${
          campaignData.layout?.floatingButtonPosition === "bottomLeft"
            ? "bottom-4 left-4"
            : campaignData.layout?.floatingButtonPosition === "bottomRight"
              ? "bottom-4 right-4"
              : campaignData.layout?.floatingButtonPosition === "topRight"
                ? "top-4 right-4"
                : "bottom-4 left-1/2 transform -translate-x-1/2"
        }`}
      >
        {campaignData.layout?.floatingButtonHasText ? (
          <div
            className={`flex items-center ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2"} rounded-full text-white`}
            style={{ backgroundColor: campaignData.primaryColor }}
          >
            <div
              className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} bg-white rounded-full flex items-center justify-center ${isMobile ? "mr-1" : "mr-2"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`}
                viewBox="0 0 20 20"
                fill={campaignData.primaryColor}
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
            </div>
            <span className="font-bold">
              {campaignData.layout?.floatingButtonText || "SPIN & WIN"}
            </span>
          </div>
        ) : (
          <div
            className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full flex items-center justify-center`}
            style={{ backgroundColor: campaignData.primaryColor }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-white`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                clipRule="evenodd"
              />
              <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  // Add an effect to save rules when component unmounts
  useEffect(() => {
    return () => {
      // Save rules when component unmounts
      saveRulesToContext();
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Step Sidebar */}
      <div className="hidden lg:block lg:w-1/5">
        <div className="bg-indigo-600 text-white rounded-lg p-6 h-full top-4">
          {/* <h2 className="text-xl font-semibold mb-6">Campaign Steps</h2> */}
          <StepSidebar
            activeStep={4}
            onStepClick={(step) => {
              if (step !== 4) {
                // Save current rules before navigating
                saveRulesToContext();

                if (step > campaignData.step) {
                  // Only allow navigation to steps we've already completed or the next step
                  if (step <= campaignData.step + 1) {
                    updateCampaignData({ step });
                  }
                } else {
                  updateCampaignData({ step });
                }
              }
            }}
          />
        </div>
      </div>

      {/* Left Column - Campaign Rules */}
      <div className="w-full lg:w-2/5">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="flex items-center text-xl font-semibold mb-6 text-indigo-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Define your campaign rules!
            </h2>

            {/* Appearing Rules */}
            <div className="mb-8">
              <h3 className="font-medium mb-2 text-gray-700">
                APPEARING RULES
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                You can pick more than one.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Exit Intent */}
                <div className="bg-gray-100 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={appearingRules.exitIntent.enabled}
                        onChange={() => toggleAppearingRule("exitIntent")}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 17l-5-5m0 0l5-5m-5 5h12"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-center mb-1">
                      Exit Intent
                    </h4>
                    <p className="text-xs text-gray-500 text-center">
                      Show when a visitor is about to leave the page
                    </p>
                  </div>
                </div>

                {/* Time Delay */}
                <div className="bg-gray-100 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={appearingRules.timeDelay.enabled}
                        onChange={() => toggleAppearingRule("timeDelay")}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-center mb-1">Time Delay</h4>
                    <p className="text-xs text-gray-500 text-center mb-2">
                      After
                    </p>
                    {appearingRules.timeDelay.enabled && (
                      <div className="bg-indigo-200 rounded px-3 py-1 text-center w-full">
                        <input
                          type="number"
                          className="w-8 bg-transparent text-center focus:outline-none"
                          value={appearingRules.timeDelay.seconds}
                          onChange={(e) =>
                            updateAppearingRuleValue(
                              "timeDelay",
                              "seconds",
                              Number.parseInt(e.target.value) || 5,
                            )
                          }
                          min="1"
                        />
                        <span className="text-sm ml-1">sec</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Page Scroll */}
                <div className="bg-gray-100 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={appearingRules.pageScroll.enabled}
                        onChange={() => toggleAppearingRule("pageScroll")}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-center mb-1">
                      Page Scroll
                    </h4>
                    <p className="text-xs text-gray-500 text-center mb-2">
                      After
                    </p>
                    {appearingRules.pageScroll.enabled && (
                      <div className="bg-indigo-200 rounded px-3 py-1 text-center w-full">
                        <input
                          type="number"
                          className="w-8 bg-transparent text-center focus:outline-none"
                          value={appearingRules.pageScroll.percentage}
                          onChange={(e) =>
                            updateAppearingRuleValue(
                              "pageScroll",
                              "percentage",
                              Number.parseInt(e.target.value) || 20,
                            )
                          }
                          min="1"
                          max="100"
                        />
                        <span className="text-sm ml-1">% of page</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Page Count */}
                <div className="bg-gray-100 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={appearingRules.pageCount.enabled}
                        onChange={() => toggleAppearingRule("pageCount")}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-center mb-1">Page Count</h4>
                    <p className="text-xs text-gray-500 text-center mb-2">
                      After
                    </p>
                    {appearingRules.pageCount.enabled && (
                      <div className="bg-indigo-200 rounded px-3 py-1 text-center w-full">
                        <input
                          type="number"
                          className="w-8 bg-transparent text-center focus:outline-none"
                          value={appearingRules.pageCount.pages}
                          onChange={(e) =>
                            updateAppearingRuleValue(
                              "pageCount",
                              "pages",
                              Number.parseInt(e.target.value) || 2,
                            )
                          }
                          min="1"
                        />
                        <span className="text-sm ml-1">Pages</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clicks Count */}
                <div className="bg-gray-100 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={appearingRules.clicksCount.enabled}
                        onChange={() => toggleAppearingRule("clicksCount")}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-center mb-1">
                      Clicks Count
                    </h4>
                    <p className="text-xs text-gray-500 text-center mb-2">
                      After
                    </p>
                    {appearingRules.clicksCount.enabled && (
                      <div className="bg-indigo-200 rounded px-3 py-1 text-center w-full">
                        <input
                          type="number"
                          className="w-8 bg-transparent text-center focus:outline-none"
                          value={appearingRules.clicksCount.clicks}
                          onChange={(e) =>
                            updateAppearingRuleValue(
                              "clicksCount",
                              "clicks",
                              Number.parseInt(e.target.value) || 2,
                            )
                          }
                          min="1"
                        />
                        <span className="text-sm ml-1">Clicks</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inactivity */}
                <div className="bg-gray-100 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={appearingRules.inactivity.enabled}
                        onChange={() => toggleAppearingRule("inactivity")}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-center mb-1">Inactivity</h4>
                    <p className="text-xs text-gray-500 text-center mb-2">
                      After
                    </p>
                    {appearingRules.inactivity.enabled && (
                      <div className="bg-indigo-200 rounded px-3 py-1 text-center w-full">
                        <input
                          type="number"
                          className="w-8 bg-transparent text-center focus:outline-none"
                          value={appearingRules.inactivity.seconds}
                          onChange={(e) =>
                            updateAppearingRuleValue(
                              "inactivity",
                              "seconds",
                              Number.parseInt(e.target.value) || 30,
                            )
                          }
                          min="1"
                        />
                        <span className="text-sm ml-1">sec idle</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Page Targeting */}
            <div className="mb-8 border-t pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">PAGE TARGETTING</h3>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={pageTargeting.enabled}
                    onChange={togglePageTargeting}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                When OFF: Shows on home page of{" "}
                <span className="font-medium">{pageTargeting.url}</span>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter URL"
                    disabled={!pageTargeting.enabled}
                    value={newPageUrl}
                    onChange={(e) => setNewPageUrl(e.target.value)}
                  />
                  <button
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
                    disabled={!pageTargeting.enabled}
                    onClick={addPageTargetingUrl}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Display added URLs */}
              {pageTargeting.enabled && pageTargeting.urls.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Added URLs:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pageTargeting.urls.map((url, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                      >
                        <span className="text-sm text-gray-700 mr-1">
                          {url}
                        </span>
                        <button
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => removePageTargetingUrl(url)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Show Pop-up Again After a While */}
            <div className="mb-8 border-t pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">
                  SHOW POP-UP AGAIN AFTER A WHILE
                </h3>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={popupAgain.enabled}
                    onChange={togglePopupAgain}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                When OFF: The pop-up will not reappear once the user closes it.
              </p>

              {popupAgain.enabled && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timer
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      className="w-16 p-2 border rounded-md text-center"
                      value={popupAgain.timer.minutes}
                      onChange={(e) =>
                        updatePopupTimer("minutes", e.target.value)
                      }
                      min="0"
                      max="59"
                    />
                    <span className="text-gray-500">:</span>
                    <input
                      type="number"
                      className="w-16 p-2 border rounded-md text-center"
                      value={popupAgain.timer.seconds}
                      onChange={(e) =>
                        updatePopupTimer("seconds", e.target.value)
                      }
                      min="0"
                      max="59"
                    />
                  </div>
                  <div className="flex mt-1">
                    <div className="w-16 text-xs text-gray-500 text-center">
                      Minutes
                    </div>
                    <div className="w-4"></div>
                    <div className="w-16 text-xs text-gray-500 text-center">
                      Seconds
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Display Frequency */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">DISPLAY FREQUENCY</h3>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={displayFrequency.enabled}
                    onChange={toggleDisplayFrequency}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                When OFF: once a day for each visitor
              </p>

              {displayFrequency.enabled && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div
                      className={`bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer ${displayFrequency.visitorType === "everyone" ? "ring-2 ring-indigo-500" : ""}`}
                      onClick={() => updateVisitorType("everyone")}
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {displayFrequency.visitorType === "everyone" && (
                          <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Everyone</span>
                    </div>

                    <div
                      className={`bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer ${displayFrequency.visitorType === "new" ? "ring-2 ring-indigo-500" : ""}`}
                      onClick={() => updateVisitorType("new")}
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {displayFrequency.visitorType === "new" && (
                          <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">New</span>
                    </div>

                    <div
                      className={`bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer ${displayFrequency.visitorType === "return" ? "ring-2 ring-indigo-500" : ""}`}
                      onClick={() => updateVisitorType("return")}
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                        {displayFrequency.visitorType === "return" && (
                          <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Return</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Show to visitors
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full p-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                        value={displayFrequency.frequency}
                        onChange={(e) => updateDisplayFrequency(e.target.value)}
                      >
                        <option value="once_a_day">Once a day</option>
                        <option value="every_visit">Every visit</option>
                        <option value="once_every_2_days">
                          Once every 2 days
                        </option>
                        <option value="once_every_few_visits">
                          Once every few visits
                        </option>
                        <option value="all_pages_all_time">
                          All pages all the time
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Finish Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="w-full lg:w-2/5">
        <div className="bg-gray-100 p-4 rounded-lg sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white rounded-full overflow-hidden flex border border-indigo-600 p-1">
              <button
                className={`px-4 py-2 rounded-full flex items-center ${
                  previewDevice === "mobile"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600"
                }`}
                onClick={() => setPreviewDevice("mobile")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Mobile
              </button>
              <button
                className={`px-4 py-2 rounded-full flex items-center ${
                  previewDevice === "desktop"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600"
                }`}
                onClick={() => setPreviewDevice("desktop")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                    clipRule="evenodd"
                  />
                </svg>
                Desktop
              </button>
            </div>
            <button className="text-indigo-600 flex items-center font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Preview
            </button>
          </div>

          {/* Preview Container */}
          <div className="w-full h-full relative bg-gray-700 flex items-center justify-center">
            {previewDevice === "desktop" ? (
              <div className="w-full h-full rounded-lg overflow-hidden">
                {/* Desktop Preview */}
                {activePreviewTab === "landing" && (
                  <div className="bg-gray-800 p-4 h-[400px] flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] h-[320px] p-0 relative overflow-hidden">
                      {/* Close button */}
                      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <div className="flex h-full">
                        {/* Left side - Content */}
                        <div className="w-1/2 p-8 flex flex-col justify-center">
                          <h2
                            className="text-3xl font-bold mb-3"
                            style={{ color: campaignData.primaryColor }}
                          >
                            {campaignData.content?.landing?.title ||
                              "GO AHEAD GIVE IT A SPIN!"}
                          </h2>

                          {campaignData.content?.landing?.showSubtitle && (
                            <p className="text-sm text-gray-600 mb-5">
                              {campaignData.content?.landing?.subtitle ||
                                "This is a demo of our Spin to Win displays"}
                            </p>
                          )}

                          {campaignData.content?.landing?.showPrivacyPolicy && (
                            <div className="flex items-center mb-4">
                              <input
                                type="checkbox"
                                id="preview-privacy"
                                className="mr-2"
                                checked
                                readOnly
                              />
                              <label
                                htmlFor="preview-privacy"
                                className="text-xs text-gray-600"
                              >
                                {campaignData.content?.landing
                                  ?.privacyPolicyText ||
                                  "I accept the T&C and Privacy Notice."}
                              </label>
                            </div>
                          )}

                          {campaignData.content?.landing?.showEmail && (
                            <input
                              type="email"
                              placeholder={
                                campaignData.content?.landing
                                  ?.emailPlaceholder || "Enter your email"
                              }
                              className="w-full p-3 border rounded-md mb-4 text-center"
                            />
                          )}

                          <button
                            className="w-full py-3 font-bold text-white rounded-md text-lg"
                            style={{
                              backgroundColor: campaignData.primaryColor,
                            }}
                          >
                            {campaignData.content?.landing?.buttonText ||
                              "SPIN NOW"}
                          </button>

                          {campaignData.content?.landing?.showTerms && (
                            <p className="text-xs text-gray-500 mt-3 text-center">
                              {campaignData.content?.landing?.termsText ||
                                "I accept the T&C$"}
                            </p>
                          )}
                        </div>

                        {/* Right side - Wheel */}
                        <div className="w-1/2 bg-gray-50 flex items-center justify-center relative">
                          {renderWheel("w-[280px] h-[280px]")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === "result" && (
                  <div className="bg-gray-800 p-4 h-[400px] flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] h-[320px] p-0 relative overflow-hidden">
                      {/* Close button */}
                      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <div className="flex h-full">
                        {/* Left side - Content */}
                        <div className="w-1/2 p-8 flex flex-col justify-center">
                          <h2
                            className="text-3xl font-bold mb-3"
                            style={{ color: campaignData.primaryColor }}
                          >
                            {campaignData.content?.winTitle ||
                              "CONGRATULATIONS!"}
                          </h2>

                          <p className="text-sm text-gray-600 mb-5">
                            {campaignData.content?.winMessage ||
                              "You've won a 10% discount on your next purchase"}
                          </p>

                          <div
                            className="w-full p-4 mb-6 text-center font-bold text-lg border-2 border-dashed"
                            style={{
                              borderColor: campaignData.primaryColor,
                              color: campaignData.primaryColor,
                            }}
                          >
                            {campaignData.content?.couponCode || "WINNER10"}
                          </div>

                          <button
                            className="w-full py-3 font-bold text-white rounded-md mb-4 text-lg"
                            style={{
                              backgroundColor: campaignData.primaryColor,
                            }}
                          >
                            {campaignData.content?.copyButtonText ||
                              "COPY CODE"}
                          </button>

                          <button className="w-full py-3 font-bold text-gray-800 bg-gray-200 rounded-md text-lg">
                            {campaignData.content?.shopButtonText || "SHOP NOW"}
                          </button>
                        </div>

                        {/* Right side - Success icon */}
                        <div className="w-1/2 bg-gray-50 flex items-center justify-center relative">
                          <div className="w-48 h-48 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-24 w-24 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === "floating" && (
                  <div className="bg-gray-800 p-4 h-[400px] relative">
                    <div className="w-full h-full bg-gray-50 flex flex-col">
                      <div className="border-b border-gray-300 w-full mb-2"></div>
                      <div className="border-b border-gray-300 w-full mb-2"></div>
                      <div className="border-b border-gray-300 w-full mb-2"></div>
                      <div className="border-b border-gray-300 w-full mb-2"></div>
                      <div className="border-b border-gray-300 w-full mb-2"></div>
                      <div className="border-b border-gray-300 w-full mb-2"></div>
                      <div className="border-b border-gray-300 w-full mb-2"></div>
                    </div>

                    {renderFloatingButton()}
                  </div>
                )}
              </div>
            ) : (
              // Mobile view
              <div className="w-56 h-[480px] bg-gray-900 rounded-3xl p-2 relative">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full"></div>
                <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden">
                  {activePreviewTab === "landing" && (
                    <div className="bg-white h-full p-4 flex flex-col items-center">
                      {/* Mobile Landing Screen Content */}
                      <div className="text-center w-full">
                        <h2
                          className="text-xl font-bold mb-2"
                          style={{ color: campaignData.primaryColor }}
                        >
                          {campaignData.content?.landing?.title ||
                            "GO AHEAD GIVE IT A SPIN!"}
                        </h2>

                        {campaignData.content?.landing?.showSubtitle && (
                          <p className="text-xs text-gray-600 mb-3">
                            {campaignData.content?.landing?.subtitle ||
                              "This is a demo of our Spin to Win displays"}
                          </p>
                        )}

                        {campaignData.content?.landing?.showPrivacyPolicy && (
                          <div className="flex items-center justify-center mb-3">
                            <input
                              type="checkbox"
                              id="preview-privacy-mobile"
                              className="mr-1 h-3 w-3"
                              checked
                              readOnly
                            />
                            <label
                              htmlFor="preview-privacy-mobile"
                              className="text-[10px] text-gray-600"
                            >
                              {campaignData.content?.landing
                                ?.privacyPolicyText ||
                                "I accept the T&C and Privacy Notice."}
                            </label>
                          </div>
                        )}

                        {campaignData.content?.landing?.showEmail && (
                          <input
                            type="email"
                            placeholder={
                              campaignData.content?.landing?.emailPlaceholder ||
                              "Enter your email"
                            }
                            className="w-full p-2 text-xs border rounded-md mb-3 text-center"
                          />
                        )}

                        <button
                          className="w-full py-2 text-sm font-bold text-white rounded-md"
                          style={{ backgroundColor: campaignData.primaryColor }}
                        >
                          {campaignData.content?.landing?.buttonText ||
                            "SPIN NOW"}
                        </button>

                        {campaignData.content?.landing?.showTerms && (
                          <p className="text-[8px] text-gray-500 mt-2 text-center">
                            {campaignData.content?.landing?.termsText ||
                              "I accept the T&C$"}
                          </p>
                        )}
                      </div>

                      {/* Mobile Wheel Preview */}
                      <div className="mt-4">
                        {renderWheel("w-40 h-40", true)}
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "result" && (
                    <div className="bg-white h-full p-4 flex flex-col items-center">
                      <div className="text-center w-full">
                        <h2
                          className="text-xl font-bold mb-2"
                          style={{ color: campaignData.primaryColor }}
                        >
                          {campaignData.content?.winTitle || "CONGRATULATIONS!"}
                        </h2>

                        <p className="text-xs text-gray-600 mb-3">
                          {campaignData.content?.winMessage ||
                            "You've won a 10% discount on your next purchase"}
                        </p>

                        <div
                          className="w-full p-2 mb-3 text-center font-bold text-sm border-2 border-dashed"
                          style={{
                            borderColor: campaignData.primaryColor,
                            color: campaignData.primaryColor,
                          }}
                        >
                          {campaignData.content?.couponCode || "WINNER10"}
                        </div>

                        <button
                          className="w-full py-2 text-sm font-bold text-white rounded-md mb-2"
                          style={{ backgroundColor: campaignData.primaryColor }}
                        >
                          {campaignData.content?.copyButtonText || "COPY CODE"}
                        </button>

                        <button className="w-full py-2 text-sm font-bold text-gray-800 bg-gray-200 rounded-md">
                          {campaignData.content?.shopButtonText || "SHOP NOW"}
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "floating" && (
                    <div className="bg-white h-full relative">
                      {renderFloatingButton(true)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preview Tabs */}
          <div className="flex justify-center mt-4 border-b">
            <button
              className={`px-4 py-2 ${
                activePreviewTab === "landing"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActivePreviewTab("landing")}
            >
              Landing Screen
            </button>
            <button
              className={`px-4 py-2 ${
                activePreviewTab === "result"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActivePreviewTab("result")}
            >
              Result screen
            </button>
            <button
              className={`px-4 py-2 ${
                activePreviewTab === "floating"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActivePreviewTab("floating")}
            >
              Floating Button
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex justify-end">
            <div className="bg-indigo-600 text-white rounded-full px-3 py-1 text-sm font-medium">
              90%
            </div>
          </div>
        </div>
      </div>

      {/* Launch Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-0 relative">
            {/* Close button */}
            <button
              onClick={() => setShowLaunchModal(false)}
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

                        {/* The actual wheel - using the dynamic wheel sectors from context */}
                        <div
                          className="relative w-[220px] h-[220px] rounded-full overflow-hidden"
                          style={{
                            background:
                              campaignData.layout?.wheelSectors === "four"
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
                                : campaignData.layout?.wheelSectors === "six"
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
                          {campaignData.layout?.wheelSectors === "four" && (
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
                          {campaignData.layout?.wheelSectors === "six" && (
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
                          {(campaignData.layout?.wheelSectors === "eight" ||
                            !campaignData.layout?.wheelSectors) && (
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setLaunchStatus("draft");
                  handleLaunch();
                }}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Later
              </button>
              <button
                onClick={() => {
                  setLaunchStatus("active");
                  handleLaunch();
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
