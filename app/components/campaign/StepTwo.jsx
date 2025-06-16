"use client";

import { useState, useRef, useEffect } from "react";
import { useCampaign } from "../../context/CampaignContext";
import StepNavigation from "./StepNavigation";
import StepSidebar from "./StepSidebar";

export default function StepTwo() {
  const { campaignData, updateCampaignData } = useCampaign();
  const [activePreviewTab, setActivePreviewTab] = useState("landing");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const fileInputRef = useRef(null);
  // Fix: Initialize with default value to prevent undefined
  const [floatingButtonText, setFloatingButtonText] = useState("SPIN & WIN");

  // Initialize layout settings if they don't exist
  useEffect(() => {
    if (!campaignData.layout) {
      updateCampaignData({
        layout: {
          theme: "light",
          wheelSectors: "eight",
          displayStyle: "popup",
          popupLayout: "center",
          showFloatingButton: true,
          floatingButtonPosition: "bottomRight",
          floatingButtonHasText: true,
          floatingButtonText: "SPIN & WIN",
          logo: null,
        },
      });
    } else {
      // Set local state from campaign data with fallback
      setFloatingButtonText(
        campaignData.layout.floatingButtonText || "SPIN & WIN",
      );
      if (campaignData.layout.logo) {
        setLogoPreview(campaignData.layout.logo);
      }
    }
  }, [campaignData, updateCampaignData]);

  const handleThemeChange = (theme) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        theme,
      },
    });
  };

  const handleWheelSectorsChange = (wheelSectors) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        wheelSectors,
      },
    });
  };

  const handleDisplayStyleChange = (displayStyle) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        displayStyle,
      },
    });
  };

  const handlePopupLayoutChange = (popupLayout) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        popupLayout,
      },
    });
  };

  const handleFloatingButtonToggle = (showFloatingButton) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        showFloatingButton,
      },
    });
  };

  const handleFloatingButtonPositionChange = (floatingButtonPosition) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        floatingButtonPosition,
      },
    });
  };

  const handleFloatingButtonTextToggle = (floatingButtonHasText) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        floatingButtonHasText,
      },
    });
  };

  const handleFloatingButtonTextChange = (e) => {
    const text = e.target.value;
    setFloatingButtonText(text);
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        floatingButtonText: text,
      },
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        updateCampaignData({
          layout: {
            ...campaignData.layout,
            logo: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoReset = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        logo: null,
      },
    });
  };

  return (
    <div className="flex flex-col justify-center lg:flex-row gap-8 pb-24">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/6 bg-indigo-700 text-white rounded-lg p-4">
        <StepSidebar
          activeStep={2}
          onStepClick={(step) => {
            if (step !== 2) {
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

      {/* Left side - Options */}
      <div className="w-full lg:w-2/5">
        {/* Color Selected from Step 1 */}
        <div className="mb-6">
          <h3 className="flex items-center text-lg font-medium mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                clipRule="evenodd"
              />
            </svg>
            Colour Selected
          </h3>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">
              {campaignData.color === "singleTone"
                ? "Single Tone"
                : "Dual Tone"}
              : {campaignData.color === "singleTone" ? "Color_01" : "Colors"}
            </div>
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded border border-gray-300 mr-2"
                style={{ backgroundColor: campaignData.primaryColor }}
              ></div>
              <span className="text-sm font-mono">
                {campaignData.primaryColor}
              </span>
              {campaignData.color === "dualTone" && (
                <>
                  <div
                    className="w-8 h-8 rounded border border-gray-300 mx-2"
                    style={{ backgroundColor: campaignData.secondaryColor }}
                  ></div>
                  <span className="text-sm font-mono">
                    {campaignData.secondaryColor}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium">Select your campaign theme</h3>
            <div className="ml-2 text-gray-500 cursor-help">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              className={`flex-1 py-2 px-4 rounded-full ${
                campaignData.layout?.theme === "light"
                  ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <div className="flex items-center justify-center">
                <div
                  className={`w-4 h-4 rounded-full mr-2 ${
                    campaignData.layout?.theme === "light"
                      ? "bg-indigo-500"
                      : "bg-gray-200"
                  }`}
                ></div>
                Light Theme
              </div>
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-full ${
                campaignData.layout?.theme === "dark"
                  ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <div className="flex items-center justify-center">
                <div
                  className={`w-4 h-4 rounded-full mr-2 ${
                    campaignData.layout?.theme === "dark"
                      ? "bg-indigo-500"
                      : "bg-gray-200"
                  }`}
                ></div>
                Dark Theme
              </div>
            </button>
          </div>
        </div>

        {/* Upload Logo */}
        {/* <div className="mb-6">
          <h3 className="flex items-center text-lg font-medium mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            Upload logo
          </h3>
          <div className="flex items-start">
            <div
              className="w-32 h-32 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-50 relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <div className="text-xs text-gray-500 text-center">
                    <div>150x150 px</div>
                    <div>recommended</div>
                  </div>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="ml-4 flex flex-col space-y-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={handleLogoReset}
                disabled={!logoPreview}
              >
                Delete
              </button>
            </div>
          </div>
        </div> */}

        {/* Wheel Sector */}
        <div className="mb-6">
          <h3 className="flex items-center text-lg font-medium mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Wheel Sector
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`cursor-pointer ${
                campaignData.layout?.wheelSectors === "four"
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : ""
              }`}
              onClick={() => handleWheelSectorsChange("four")}
            >
              <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <path d="M50 50 L50 0 A50 50 0 0 1 100 50 Z" fill="#e0e0ff" />
                  <path
                    d="M50 50 L100 50 A50 50 0 0 1 50 100 Z"
                    fill="#d0d0ff"
                  />
                  <path d="M50 50 L50 100 A50 50 0 0 1 0 50 Z" fill="#e0e0ff" />
                  <path d="M50 50 L0 50 A50 50 0 0 1 50 0 Z" fill="#d0d0ff" />
                  <circle cx="50" cy="50" r="4" fill="#4f46e5" />
                </svg>
              </div>
              <div className="text-center mt-2 text-sm">Four</div>
            </div>
            <div
              className={`cursor-pointer ${
                campaignData.layout?.wheelSectors === "six"
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : ""
              }`}
              onClick={() => handleWheelSectorsChange("six")}
            >
              <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <path
                    d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z"
                    fill="#e0e0ff"
                  />
                  <path
                    d="M50 50 L93.3 25 A50 50 0 0 1 93.3 75 Z"
                    fill="#d0d0ff"
                  />
                  <path
                    d="M50 50 L93.3 75 A50 50 0 0 1 50 100 Z"
                    fill="#e0e0ff"
                  />
                  <path
                    d="M50 50 L50 100 A50 50 0 0 1 6.7 75 Z"
                    fill="#d0d0ff"
                  />
                  <path
                    d="M50 50 L6.7 75 A50 50 0 0 1 6.7 25 Z"
                    fill="#e0e0ff"
                  />
                  <path d="M50 50 L6.7 25 A50 50 0 0 1 50 0 Z" fill="#d0d0ff" />
                  <circle cx="50" cy="50" r="4" fill="#4f46e5" />
                </svg>
              </div>
              <div className="text-center mt-2 text-sm">Six</div>
            </div>
            <div
              className={`cursor-pointer ${
                campaignData.layout?.wheelSectors === "eight"
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : ""
              }`}
              onClick={() => handleWheelSectorsChange("eight")}
            >
              <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <path
                    d="M50 50 L50 0 A50 50 0 0 1 85.4 14.6 Z"
                    fill="#e0e0ff"
                  />
                  <path
                    d="M50 50 L85.4 14.6 A50 50 0 0 1 100 50 Z"
                    fill="#d0d0ff"
                  />
                  <path
                    d="M50 50 L100 50 A50 50 0 0 1 85.4 85.4 Z"
                    fill="#e0e0ff"
                  />
                  <path
                    d="M50 50 L85.4 85.4 A50 50 0 0 1 50 100 Z"
                    fill="#d0d0ff"
                  />
                  <path
                    d="M50 50 L50 100 A50 50 0 0 1 14.6 85.4 Z"
                    fill="#e0e0ff"
                  />
                  <path
                    d="M50 50 L14.6 85.4 A50 50 0 0 1 0 50 Z"
                    fill="#d0d0ff"
                  />
                  <path
                    d="M50 50 L0 50 A50 50 0 0 1 14.6 14.6 Z"
                    fill="#e0e0ff"
                  />
                  <path
                    d="M50 50 L14.6 14.6 A50 50 0 0 1 50 0 Z"
                    fill="#d0d0ff"
                  />
                  <circle cx="50" cy="50" r="4" fill="#4f46e5" />
                </svg>
              </div>
              <div className="text-center mt-2 text-sm">Eight</div>
            </div>
          </div>
        </div>

        {/* Campaign Display Style */}
        <div className="mb-6">
          <h3 className="flex items-center text-lg font-medium mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                clipRule="evenodd"
              />
            </svg>
            Campaign Display Style
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`cursor-pointer ${
                campaignData.layout?.displayStyle === "fullscreen"
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : ""
              }`}
              onClick={() => handleDisplayStyleChange("fullscreen")}
            >
              <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                <div className="w-16 h-16 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-indigo-200"></div>
                  <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="absolute text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                  15%
                </div>
              </div>
              <div className="text-center mt-2 text-sm">Full screen</div>
            </div>
            <div
              className={`cursor-pointer ${
                campaignData.layout?.displayStyle === "popup"
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : ""
              }`}
              onClick={() => handleDisplayStyleChange("popup")}
            >
              <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                <div className="w-20 h-16 border-2 border-indigo-300 rounded-md flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-indigo-200"></div>
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm">Pop-Up</div>
            </div>
          </div>
        </div>

        {/* Layout of the Popup - Only show if popup is selected */}
        {campaignData.layout?.displayStyle === "popup" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="flex items-center text-lg font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Layout of the Popup
              </h3>
              <div className="flex space-x-2">
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    previewDevice === "mobile"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    previewDevice === "desktop"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`cursor-pointer ${
                  campaignData.layout?.popupLayout === "center"
                    ? "ring-2 ring-indigo-500 ring-offset-2"
                    : ""
                }`}
                onClick={() => handlePopupLayoutChange("center")}
              >
                <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-indigo-300 rounded-md flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-200"></div>
                  </div>
                </div>
                <div className="text-center mt-2 text-sm">Centre</div>
              </div>
              <div
                className={`cursor-pointer ${
                  campaignData.layout?.popupLayout === "top"
                    ? "ring-2 ring-indigo-500 ring-offset-2"
                    : ""
                }`}
                onClick={() => handlePopupLayoutChange("top")}
              >
                <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-indigo-300 rounded-md flex items-start justify-center pt-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-200"></div>
                  </div>
                </div>
                <div className="text-center mt-2 text-sm">Top</div>
              </div>
              <div
                className={`cursor-pointer ${
                  campaignData.layout?.popupLayout === "bottom"
                    ? "ring-2 ring-indigo-500 ring-offset-2"
                    : ""
                }`}
                onClick={() => handlePopupLayoutChange("bottom")}
              >
                <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-indigo-300 rounded-md flex items-end justify-center pb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-200"></div>
                  </div>
                </div>
                <div className="text-center mt-2 text-sm">Bottom</div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <div className="mb-6">
          <h3 className="flex items-center text-lg font-medium mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Floating Button
          </h3>
          <div className="flex items-center mb-4">
            <span className="mr-3 text-sm">Show the Floating button</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={campaignData.layout?.showFloatingButton || false}
                onChange={(e) => handleFloatingButtonToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {campaignData.layout?.showFloatingButton && (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">
                  Position on the page
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  <div
                    className={`cursor-pointer ${
                      campaignData.layout?.floatingButtonPosition ===
                      "bottomLeft"
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={() =>
                      handleFloatingButtonPositionChange("bottomLeft")
                    }
                  >
                    <div className="bg-gray-100 p-2 rounded-md h-20 relative">
                      <div className="absolute bottom-1 left-1 w-6 h-6 bg-indigo-500 rounded-full"></div>
                      <div className="border-b border-gray-300 w-full absolute top-2"></div>
                      <div className="border-b border-gray-300 w-full absolute top-4"></div>
                      <div className="border-b border-gray-300 w-full absolute top-6"></div>
                    </div>
                    <div className="text-center mt-1 text-xs">Bottom left</div>
                  </div>
                  <div
                    className={`cursor-pointer ${
                      campaignData.layout?.floatingButtonPosition ===
                      "bottomRight"
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={() =>
                      handleFloatingButtonPositionChange("bottomRight")
                    }
                  >
                    <div className="bg-gray-100 p-2 rounded-md h-20 relative">
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-indigo-500 rounded-full"></div>
                      <div className="border-b border-gray-300 w-full absolute top-2"></div>
                      <div className="border-b border-gray-300 w-full absolute top-4"></div>
                      <div className="border-b border-gray-300 w-full absolute top-6"></div>
                    </div>
                    <div className="text-center mt-1 text-xs">Bottom right</div>
                  </div>
                  <div
                    className={`cursor-pointer ${
                      campaignData.layout?.floatingButtonPosition === "topRight"
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={() =>
                      handleFloatingButtonPositionChange("topRight")
                    }
                  >
                    <div className="bg-gray-100 p-2 rounded-md h-20 relative">
                      <div className="absolute top-1 right-1 w-6 h-6 bg-indigo-500 rounded-full"></div>
                      <div className="border-b border-gray-300 w-full absolute top-8"></div>
                      <div className="border-b border-gray-300 w-full absolute top-10"></div>
                      <div className="border-b border-gray-300 w-full absolute top-12"></div>
                    </div>
                    <div className="text-center mt-1 text-xs">Top right</div>
                  </div>
                  <div
                    className={`cursor-pointer ${
                      campaignData.layout?.floatingButtonPosition ===
                      "centerBottom"
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={() =>
                      handleFloatingButtonPositionChange("centerBottom")
                    }
                  >
                    <div className="bg-gray-100 p-2 rounded-md h-20 relative">
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-indigo-500 rounded-md"></div>
                      <div className="border-b border-gray-300 w-full absolute top-2"></div>
                      <div className="border-b border-gray-300 w-full absolute top-4"></div>
                      <div className="border-b border-gray-300 w-full absolute top-6"></div>
                    </div>
                    <div className="text-center mt-1 text-xs">
                      Centre bottom
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">
                  Want a text on floating button?
                </h4>
                <div className="flex space-x-3">
                  <button
                    className={`py-2 px-6 rounded-full ${
                      campaignData.layout?.floatingButtonHasText
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleFloatingButtonTextToggle(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`py-2 px-6 rounded-full ${
                      !campaignData.layout?.floatingButtonHasText
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleFloatingButtonTextToggle(false)}
                  >
                    No
                  </button>
                </div>
              </div>

              {campaignData.layout?.floatingButtonHasText && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Text</h4>
                  <div className="relative">
                    <input
                      type="text"
                      value={floatingButtonText || ""}
                      onChange={handleFloatingButtonTextChange}
                      className="w-full p-2 border rounded-md pr-12"
                      maxLength={18}
                      placeholder="SPIN & WIN"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {(floatingButtonText || "").length}/18
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right side - Preview */}
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
            <button className="text-gray-500 flex items-center">
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
              <>
                {/* Desktop Preview */}
                {activePreviewTab === "landing" && (
                  <div
                    className={`w-full h-full rounded-lg overflow-hidden p-4 ${
                      campaignData.layout?.theme === "dark"
                        ? "bg-gray-900"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8"></div>
                      <div
                        className={`text-center ${
                          campaignData.layout?.theme === "dark"
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {logoPreview && (
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo"
                            className="h-8 mx-auto object-contain"
                          />
                        )}
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-row h-[calc(100%-3rem)]">
                      {/* Left side - Text and buttons */}
                      <div className="w-1/2 flex flex-col pr-6">
                        <h2
                          className="text-2xl font-bold mb-4"
                          style={{ color: campaignData.primaryColor }}
                        >
                          GO AHEAD GIVE IT A SPIN!
                        </h2>
                        <p
                          className={`text-base mb-6 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          This is a demo of our spin to Win displays
                        </p>

                        <div className="flex items-center mb-6">
                          <input
                            type="checkbox"
                            id="preview-terms"
                            className="mr-2"
                            checked
                            readOnly
                          />
                          <label
                            htmlFor="preview-terms"
                            className={`text-sm ${
                              campaignData.layout?.theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            I accept the T&C and Privacy Notice.
                          </label>
                        </div>

                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full p-3 border rounded mb-6"
                          readOnly
                        />

                        <button
                          className="w-full py-3 font-bold text-white rounded text-lg"
                          style={{ backgroundColor: campaignData.primaryColor }}
                        >
                          SPIN NOW
                        </button>

                        <p
                          className={`text-sm mt-4 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          No, I don't feel lucky today!
                        </p>
                      </div>

                      {/* Right side - Wheel */}
                      <div className="w-1/2 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          <div
                            className="w-full h-full rounded-full"
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
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-black"></div>
                            </div>
                            {/* Add wheel markers for prizes */}
                            {campaignData.layout?.wheelSectors === "four" && (
                              <>
                                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                                  10% OFF
                                </div>
                                <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90">
                                  FREE SHIP
                                </div>
                                <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180">
                                  20% OFF
                                </div>
                                <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90">
                                  NO LUCK
                                </div>
                              </>
                            )}
                            {/* Add wheel markers for 6 sectors */}
                            {campaignData.layout?.wheelSectors === "six" && (
                              <>
                                <div className="absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                                  10% OFF
                                </div>
                                <div className="absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-60">
                                  FREE SHIP
                                </div>
                                <div className="absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-120">
                                  15% OFF
                                </div>
                                <div className="absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180">
                                  20% OFF
                                </div>
                                <div className="absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-120">
                                  5% OFF
                                </div>
                                <div className="absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-60">
                                  NO LUCK
                                </div>
                              </>
                            )}
                            {/* Add wheel markers for 8 sectors */}
                            {campaignData.layout?.wheelSectors === "eight" && (
                              <>
                                <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                                  10% OFF
                                </div>
                                <div className="absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-45">
                                  FREE SHIP
                                </div>
                                <div className="absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90">
                                  15% OFF
                                </div>
                                <div className="absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-135">
                                  BOGO
                                </div>
                                <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180">
                                  20% OFF
                                </div>
                                <div className="absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-135">
                                  5% OFF
                                </div>
                                <div className="absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90">
                                  GIFT
                                </div>
                                <div className="absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-45">
                                  NO LUCK
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === "result" && (
                  <div
                    className={`w-full h-full rounded-lg overflow-hidden p-4 ${
                      campaignData.layout?.theme === "dark"
                        ? "bg-gray-900"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8"></div>
                      <div
                        className={`text-center ${
                          campaignData.layout?.theme === "dark"
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {logoPreview && (
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo"
                            className="h-8 mx-auto object-contain"
                          />
                        )}
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-row h-[calc(100%-3rem)]">
                      {/* Left side - Text and buttons */}
                      <div className="w-1/2 flex flex-col pr-6">
                        <h2
                          className="text-2xl font-bold mb-4"
                          style={{ color: campaignData.primaryColor }}
                        >
                          CONGRATULATIONS!
                        </h2>
                        <p
                          className={`text-base mb-6 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          You've won a 10% discount on your next purchase
                        </p>

                        <div
                          className="w-full p-4 mb-6 text-center font-bold text-lg border-2 border-dashed"
                          style={{
                            borderColor: campaignData.primaryColor,
                            color: campaignData.primaryColor,
                          }}
                        >
                          WINNER10
                        </div>

                        <button
                          className="w-full py-3 font-bold text-white rounded mb-4 text-lg"
                          style={{ backgroundColor: campaignData.primaryColor }}
                        >
                          COPY CODE
                        </button>

                        <button
                          className={`w-full py-3 font-bold rounded text-lg ${
                            campaignData.layout?.theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          SHOP NOW
                        </button>
                      </div>

                      {/* Right side - Wheel or result image */}
                      <div className="w-1/2 flex items-center justify-center">
                        <div className="relative w-64 h-64 flex items-center justify-center">
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

                {activePreviewTab === "floating" &&
                  campaignData.layout?.showFloatingButton && (
                    <div className="w-full h-[400px] relative bg-gray-50 flex items-center justify-center">
                      <div className="w-full h-full p-4 flex flex-col">
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                      </div>

                      <div
                        className={`absolute ${
                          campaignData.layout?.floatingButtonPosition ===
                          "bottomLeft"
                            ? "bottom-4 left-4"
                            : campaignData.layout?.floatingButtonPosition ===
                                "bottomRight"
                              ? "bottom-4 right-4"
                              : campaignData.layout?.floatingButtonPosition ===
                                  "topRight"
                                ? "top-4 right-4"
                                : "bottom-4 left-1/2 transform -translate-x-1/2"
                        }`}
                      >
                        {campaignData.layout?.floatingButtonHasText ? (
                          <div
                            className="flex items-center px-4 py-2 rounded-full text-white"
                            style={{
                              backgroundColor: campaignData.primaryColor,
                            }}
                          >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                              {floatingButtonText || "SPIN & WIN"}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: campaignData.primaryColor,
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
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
                    </div>
                  )}
              </>
            ) : (
              // Mobile view
              <div className="w-56 h-[480px] bg-gray-900 rounded-3xl p-2 relative">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full"></div>
                <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden">
                  {/* Mobile Preview Content */}
                  {activePreviewTab === "landing" && (
                    <div
                      className={`w-full h-full ${campaignData.layout?.theme === "dark" ? "bg-gray-900" : "bg-white"}`}
                    >
                      <div className="flex items-center justify-between p-2">
                        <div className="w-6 h-6"></div>
                        <div
                          className={`text-center ${
                            campaignData.layout?.theme === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          {logoPreview && (
                            <img
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo"
                              className="h-6 mx-auto object-contain"
                            />
                          )}
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              campaignData.layout?.theme === "dark"
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col items-center">
                        <h2
                          className="text-base font-bold mb-1"
                          style={{ color: campaignData.primaryColor }}
                        >
                          GO AHEAD GIVE IT A SPIN!
                        </h2>
                        <p
                          className={`text-xs mb-2 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          This is a demo of our spin to Win displays
                        </p>

                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="preview-terms-mobile"
                            className="mr-1"
                            checked
                            readOnly
                          />
                          <label
                            htmlFor="preview-terms-mobile"
                            className={`text-[10px] ${
                              campaignData.layout?.theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            I accept the T&C and Privacy Notice.
                          </label>
                        </div>

                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full p-1 text-sm border rounded mb-2"
                          readOnly
                        />

                        <button
                          className="w-full py-1 text-sm font-bold text-white rounded"
                          style={{ backgroundColor: campaignData.primaryColor }}
                        >
                          SPIN NOW
                        </button>

                        <p
                          className={`text-[10px] mt-1 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          No, I don't feel lucky today!
                        </p>

                        {/* Mobile Wheel Preview */}
                        <div className="mt-4 relative w-40 h-40">
                          <div
                            className="w-full h-full rounded-full"
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
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300"></div>
                            </div>

                            {/* Add wheel markers for mobile - 4 sectors */}
                            {campaignData.layout?.wheelSectors === "four" && (
                              <>
                                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold">
                                  10% OFF
                                </div>
                                <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold rotate-90">
                                  FREE SHIP
                                </div>
                                <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold rotate-180">
                                  20% OFF
                                </div>
                                <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold -rotate-90">
                                  NO LUCK
                                </div>
                              </>
                            )}

                            {/* Add wheel markers for mobile - 6 sectors */}
                            {campaignData.layout?.wheelSectors === "six" && (
                              <>
                                <div className="absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold">
                                  10% OFF
                                </div>
                                <div className="absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-60">
                                  FREE SHIP
                                </div>
                                <div className="absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-120">
                                  15% OFF
                                </div>
                                <div className="absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-180">
                                  20% OFF
                                </div>
                                <div className="absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-120">
                                  5% OFF
                                </div>
                                <div className="absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-60">
                                  NO LUCK
                                </div>
                              </>
                            )}

                            {/* Add wheel markers for mobile - 8 sectors */}
                            {campaignData.layout?.wheelSectors === "eight" && (
                              <>
                                <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold">
                                  10% OFF
                                </div>
                                <div className="absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-45">
                                  FREE SHIP
                                </div>
                                <div className="absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-90">
                                  15% OFF
                                </div>
                                <div className="absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-135">
                                  BOGO
                                </div>
                                <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-180">
                                  20% OFF
                                </div>
                                <div className="absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-135">
                                  5% OFF
                                </div>
                                <div className="absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-90">
                                  GIFT
                                </div>
                                <div className="absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-45">
                                  NO LUCK
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "result" && (
                    <div
                      className={`w-full h-full ${campaignData.layout?.theme === "dark" ? "bg-gray-900" : "bg-white"}`}
                    >
                      <div className="flex items-center justify-between p-2">
                        <div className="w-6 h-6"></div>
                        <div
                          className={`text-center ${
                            campaignData.layout?.theme === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          {logoPreview && (
                            <img
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo"
                              className="h-6 mx-auto object-contain"
                            />
                          )}
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              campaignData.layout?.theme === "dark"
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col items-center">
                        <h2
                          className="text-base font-bold mb-1"
                          style={{ color: campaignData.primaryColor }}
                        >
                          CONGRATULATIONS!
                        </h2>
                        <p
                          className={`text-xs mb-2 ${
                            campaignData.layout?.theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          You've won a 10% discount on your next purchase
                        </p>

                        <div
                          className="w-full p-2 mb-3 text-center font-bold text-sm border-2 border-dashed"
                          style={{
                            borderColor: campaignData.primaryColor,
                            color: campaignData.primaryColor,
                          }}
                        >
                          WINNER10
                        </div>

                        <button
                          className="w-full py-1 text-sm font-bold text-white rounded mb-2"
                          style={{ backgroundColor: campaignData.primaryColor }}
                        >
                          COPY CODE
                        </button>

                        <button
                          className={`w-full py-1 text-sm font-bold rounded ${
                            campaignData.layout?.theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          SHOP NOW
                        </button>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "floating" &&
                    campaignData.layout?.showFloatingButton && (
                      <div
                        className={`w-full h-full relative ${
                          campaignData.layout?.theme === "dark"
                            ? "bg-gray-900"
                            : "bg-white"
                        }`}
                      >
                        <div
                          className={`absolute ${
                            campaignData.layout?.floatingButtonPosition ===
                            "bottomLeft"
                              ? "bottom-4 left-4"
                              : campaignData.layout?.floatingButtonPosition ===
                                  "bottomRight"
                                ? "bottom-4 right-4"
                                : campaignData.layout
                                      ?.floatingButtonPosition === "topRight"
                                  ? "top-4 right-4"
                                  : "bottom-4 left-1/2 transform -translate-x-1/2"
                          }`}
                        >
                          {campaignData.layout?.floatingButtonHasText ? (
                            <div
                              className="flex items-center px-3 py-1 rounded-full text-white text-xs"
                              style={{
                                backgroundColor: campaignData.primaryColor,
                              }}
                            >
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
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
                                {floatingButtonText || "SPIN & WIN"}
                              </span>
                            </div>
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: campaignData.primaryColor,
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
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
        </div>
      </div>

      {/* Bottom Navigation */}
      <StepNavigation />
    </div>
  );
}
