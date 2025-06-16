"use client";

import { useState, useRef, useEffect } from "react";
import { useCampaign } from "../../context/CampaignContext";
import StepSidebar from "./StepSidebar";
import { usePlan } from "../../context/PlanContext";

export default function StepThree() {
  const { campaignData, updateCampaignData } = useCampaign();
  const { discountCodes, setDiscountCodes, fetchAndSetDiscountCodes,currentPlan } =
    usePlan();
  const [activeTab, setActiveTab] = useState("landing");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFileField, setCurrentFileField] = useState(null);
  const fileInputRef = useRef(null);
  const [localDiscountCodes, setLocalDiscountCodes] = useState([]);

  // New state for discount codes fetching
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [codesError, setCodesError] = useState(null);

  // Enhanced logging
  console.log("=== StepThree Component Debug ===");
  console.log("Current Plan:", currentPlan);
  console.log("campaignData:", campaignData);
  console.log("discountCodes from context:", discountCodes);
  console.log("discountCodes length:", discountCodes?.length || 0);
  console.log("discountCodes type:", typeof discountCodes);
  console.log(
    "Global discount codes:",
    typeof window !== "undefined"
      ? window.GLOBAL_DISCOUNT_CODES?.length
      : "N/A",
  );
  console.log(
    "localStorage codes:",
    typeof window !== "undefined"
      ? (() => {
          try {
            const stored = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
            return stored ? JSON.parse(stored).length : "None";
          } catch (e) {
            return "Error";
          }
        })()
      : "N/A",
  );
  console.log("================================");

  // Initialize local discount codes from all available sources
  useEffect(() => {
    console.log(
      "StepThree - Component mounted, checking for discount codes...",
    );
    let codes = [];

    // Try all possible sources for discount codes
    if (discountCodes && discountCodes.length > 0) {
      console.log(
        "StepThree - Using context discount codes:",
        discountCodes.length,
      );
      codes = discountCodes;
    } else if (typeof window !== "undefined") {
      // Try localStorage
      try {
        const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
        if (storedCodes) {
          const parsedCodes = JSON.parse(storedCodes);
          if (parsedCodes && parsedCodes.length > 0) {
            console.log(
              "StepThree - Using localStorage discount codes:",
              parsedCodes.length,
            );
            codes = parsedCodes;
            // Update context
            setDiscountCodes(parsedCodes);
          }
        }
      } catch (e) {
        console.error("Error parsing stored discount codes:", e);
      }

      // Try global window object
      if (
        codes.length === 0 &&
        window.GLOBAL_DISCOUNT_CODES &&
        window.GLOBAL_DISCOUNT_CODES.length > 0
      ) {
        console.log(
          "StepThree - Using global window discount codes:",
          window.GLOBAL_DISCOUNT_CODES.length,
        );
        codes = window.GLOBAL_DISCOUNT_CODES;
        // Update context
        setDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
      }
    }

    if (codes.length > 0) {
      setLocalDiscountCodes(codes);
    } else {
      console.log("StepThree - No discount codes found in any source");
    }
  }, []);

  // Update local codes when context codes change
  useEffect(() => {
    if (discountCodes && discountCodes.length > 0) {
      console.log(
        "StepThree - Updating local codes from context:",
        discountCodes.length,
      );
      setLocalDiscountCodes(discountCodes);
    }
  }, [discountCodes]);

  // Log when discount codes change
  useEffect(() => {
    console.log(
      "StepThree - Local discount codes updated:",
      localDiscountCodes,
    );
    if (localDiscountCodes && localDiscountCodes.length > 0) {
      console.log("StepThree - Available discount codes:");
      localDiscountCodes.forEach((code, index) => {
        console.log(
          `  ${index + 1}. Title: ${code.title}, Code: ${code.code}, ID: ${code.id}`,
        );
      });
    }
  }, [localDiscountCodes]);

  // Auto-generate wheel when discount codes are available and wheel tab is accessed
  useEffect(() => {
    console.log("StepThree - Tab changed to:", activeTab);
    if (activeTab === "wheel") {
      console.log("StepThree - Wheel tab accessed, checking discount codes...");
      const availableCodes =
        localDiscountCodes.length > 0 ? localDiscountCodes : discountCodes;

      if (availableCodes && availableCodes.length > 0) {
        console.log(
          "StepThree - Found discount codes, generating wheel configuration...",
        );
        generateWheelConfiguration(availableCodes);
      } else {
        console.log(
          "StepThree - No discount codes available, attempting to fetch...",
        );
        fetchDiscountCodes();
      }
    }
  }, [activeTab]);

  const fetchDiscountCodes = async () => {
    console.log("StepThree - fetchDiscountCodes called");
    setLoadingCodes(true);
    setCodesError(null);

    try {
      // First check if we already have codes in any storage
      if (localDiscountCodes.length > 0) {
        console.log(
          "StepThree - Using existing local codes:",
          localDiscountCodes.length,
        );
        generateWheelConfiguration(localDiscountCodes);
        setLoadingCodes(false);
        return;
      }

      if (typeof window !== "undefined") {
        // Try localStorage
        try {
          const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
          if (storedCodes) {
            const parsedCodes = JSON.parse(storedCodes);
            if (parsedCodes && parsedCodes.length > 0) {
              console.log(
                "StepThree - Using localStorage discount codes:",
                parsedCodes.length,
              );
              setLocalDiscountCodes(parsedCodes);
              setDiscountCodes(parsedCodes);
              generateWheelConfiguration(parsedCodes);
              setLoadingCodes(false);
              return;
            }
          }
        } catch (e) {
          console.error("Error parsing stored discount codes:", e);
        }

        // Try global window object
        if (
          window.GLOBAL_DISCOUNT_CODES &&
          window.GLOBAL_DISCOUNT_CODES.length > 0
        ) {
          console.log(
            "StepThree - Using global window discount codes:",
            window.GLOBAL_DISCOUNT_CODES.length,
          );
          setLocalDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
          setDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
          generateWheelConfiguration(window.GLOBAL_DISCOUNT_CODES);
          setLoadingCodes(false);
          return;
        }
      }

      // If no codes found in storage, fetch from API
      console.log("StepThree - No codes in storage, fetching from API...");
      const codes = await fetchAndSetDiscountCodes();

      if (codes && codes.length > 0) {
        console.log(
          "StepThree - Successfully fetched codes from API:",
          codes.length,
        );
        setLocalDiscountCodes(codes);
        generateWheelConfiguration(codes);
      } else {
        setCodesError(
          "No Discount Codes Found\n\nTo create discount codes:\n\n• Go to your Shopify admin panel\n• Navigate to Discounts → Create discount\n• Choose 'Discount code' type\n• Set up your discount details and save\n• Return here and refresh the page",
        );
      }
    } catch (error) {
      console.error("StepThree - Error fetching discount codes:", error);
      setCodesError(error.message);
    } finally {
      setLoadingCodes(false);
    }
  };

  // Generate wheel configuration with discount codes
  const generateWheelConfiguration = (codes) => {
    console.log(
      "StepThree - generateWheelConfiguration called with codes:",
      codes,
    );

    if (!codes || codes.length === 0) {
      console.log(
        "StepThree - No codes provided to generateWheelConfiguration",
      );
      return;
    }

    const sectorCount =
      campaignData.layout?.wheelSectors === "four"
        ? 4
        : campaignData.layout?.wheelSectors === "six"
          ? 6
          : 8;

    console.log("StepThree - Sector count:", sectorCount);

    const sectors = [];
    const availableCodes = [...codes];

    // Fill sectors with discount codes first
    for (let i = 1; i <= sectorCount; i++) {
      if (availableCodes.length > 0 && i <= codes.length) {
        const code = availableCodes.shift();
        console.log(`StepThree - Adding discount code to sector ${i}:`, code);
        sectors.push({
          id: i,
          rewardType: code.title,
          reward: code.code || code.title, // Use title if no specific code
          chance: i === 1 ? "40%" : "15%", // First sector gets higher chance
          discountCodeId: code.id,
          discountCode: code.code,
          discountTitle: code.title,
          discountType: code.type || "DiscountCodeBasic",
        });
      } else {
        console.log(
          `StepThree - Adding "Better luck next time" to sector ${i}`,
        );
        // Fill remaining with "Better luck next time"
        sectors.push({
          id: i,
          rewardType: "Oops!",
          reward: "Better luck next time",
          chance: "5%",
          discountCodeId: null,
          discountCode: null,
          discountTitle: null,
          discountType: null,
        });
      }
    }

    console.log("StepThree - Generated sectors:", sectors);

    // Update campaign data with generated wheel
    updateCampaignData({
      content: {
        ...campaignData.content,
        wheel: {
          sectors: sectors,
          copySameCode: false,
        },
      },
    });

    // Save to database
    saveWheelConfiguration(sectors);
  };

  // Save wheel configuration to database
  const saveWheelConfiguration = async (sectors) => {
    try {
      const configData = {
        campaignId: campaignData.id || `campaign-${Date.now()}`,
        wheelConfig: {
          sectors: sectors,
          copySameCode: false,
        },
        timestamp: new Date().toISOString(),
        shop: campaignData.shop,
      };

      const response = await fetch("/api/wheel-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save wheel configuration: ${response.statusText}`,
        );
      }

      const result = await response.json();
      console.log("Wheel configuration saved successfully!");
      return result;
    } catch (error) {
      console.error("Error saving wheel configuration:", error);
      throw error;
    }
  };

  // Initialize content settings if they don't exist
  useEffect(() => {
    if (!campaignData.content) {
      updateCampaignData({
        content: {
          landing: {
            title: "GO AHEAD GIVE IT A SPIN!",
            showSubtitle: true,
            subtitle: "This is a demo of our Spin to Win displays",
            showEmail: true,
            emailPlaceholder: "Enter your email",
            showPrivacyPolicy: true,
            privacyPolicyText: "I accept the T&C and Privacy Notice.",
            privacyPolicyLink: "",
            buttonText: "SPIN NOW",
            showTerms: true,
            termsText: "I accept the T&C$",
            termsLink: "",
          },
          wheel: {
            sectors: [],
            copySameCode: true,
          },
          result: {
            title: "LUCKY DAY!",
            showSubtitle: true,
            subtitle: "You have won 10% discount for your shopping",
            showButton: true,
            buttonText: "REDEEM NOW",
            buttonDestination: "www.yourdomain.com/productlist",
            showCopyIcon: true,
            showResultAgain: true,
            reminderTimer: {
              minutes: 10,
              seconds: 0,
            },
          },
        },
      });
    }
  }, [campaignData, updateCampaignData]);

  const handleInputChange = (section, field, value) => {
    updateCampaignData({
      content: {
        ...campaignData.content,
        [section]: {
          ...campaignData.content?.[section],
          [field]: value,
        },
      },
    });
  };

  const handleToggleChange = (section, field, value) => {
    updateCampaignData({
      content: {
        ...campaignData.content,
        [section]: {
          ...campaignData.content?.[section],
          [field]: value,
        },
      },
    });
  };

  const handleWheelSectorChange = (sectorId, field, value) => {
    const updatedSectors = campaignData.content.wheel.sectors.map((sector) => {
      if (sector.id === sectorId) {
        return {
          ...sector,
          [field]: value,
        };
      }
      return sector;
    });

    updateCampaignData({
      content: {
        ...campaignData.content,
        wheel: {
          ...campaignData.content.wheel,
          sectors: updatedSectors,
        },
      },
    });
  };

  const handleCopySameCodeToggle = (value) => {
    updateCampaignData({
      content: {
        ...campaignData.content,
        wheel: {
          ...campaignData.content.wheel,
          copySameCode: value,
        },
      },
    });
  };

  const handleReminderTimerChange = (field, value) => {
    // Ensure value is a number and within valid range
    let numValue = Number.parseInt(value, 10);
    if (isNaN(numValue)) numValue = 0;

    if (field === "minutes") {
      numValue = Math.min(Math.max(numValue, 0), 59);
    } else if (field === "seconds") {
      numValue = Math.min(Math.max(numValue, 0), 59);
    }

    updateCampaignData({
      content: {
        ...campaignData.content,
        result: {
          ...campaignData.content.result,
          reminderTimer: {
            ...campaignData.content.result.reminderTimer,
            [field]: numValue,
          },
        },
      },
    });
  };

  const openFileModal = (field) => {
    setCurrentFileField(field);
    setShowFileModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && currentFileField) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the appropriate field with the file data
        const [section, field] = currentFileField.split(".");
        handleInputChange(section, `${field}Link`, reader.result);
        setShowFileModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasteLink = (link) => {
    if (currentFileField) {
      const [section, field] = currentFileField.split(".");
      handleInputChange(section, `${field}Link`, link);
      setShowFileModal(false);
    }
  };

  // Helper function to generate wheel gradient based on sectors and colors
  function generateWheelGradient() {
    const sectorCount =
      campaignData.layout?.wheelSectors === "four"
        ? 4
        : campaignData.layout?.wheelSectors === "six"
          ? 6
          : 8;

    const mainColor = campaignData.primaryColor;
    const secondaryColor =
      campaignData.color === "dualTone" ? campaignData.secondaryColor : "white";

    let gradient = "";
    const sectorAngle = 360 / sectorCount;

    for (let i = 0; i < sectorCount; i++) {
      const startAngle = i * sectorAngle;
      const endAngle = (i + 1) * sectorAngle;
      const color = i % 2 === 0 ? mainColor : secondaryColor;

      gradient += `${color} ${startAngle}deg, ${color} ${endAngle}deg${i < sectorCount - 1 ? ", " : ""}`;
    }

    return `conic-gradient(${gradient})`;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/6 bg-indigo-700 text-white rounded-lg p-4">
        <StepSidebar
          activeStep={3}
          onStepClick={(step) => {
            if (step !== 3) {
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

      {/* Content Configuration */}
      <div className="w-full lg:w-2/5">
        {/* Tabs for different content sections */}
        <div className="mb-6 border-b">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "landing"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("landing")}
            >
              Landing Screen
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "wheel"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("wheel")}
            >
              Wheel
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "result"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("result")}
            >
              Result Screen
            </button>
          </div>
        </div>

        {/* Landing Screen Configuration */}
        {activeTab === "landing" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-indigo-700">
              Landing Screen
            </h3>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={campaignData.content?.landing?.title || ""}
                  onChange={(e) =>
                    handleInputChange("landing", "title", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  maxLength={50}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {campaignData.content?.landing?.title?.length || 0}/50
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Sub Title
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={campaignData.content?.landing?.showSubtitle}
                    onChange={(e) =>
                      handleToggleChange(
                        "landing",
                        "showSubtitle",
                        e.target.checked,
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {campaignData.content?.landing?.showSubtitle && (
                <div className="relative">
                  <input
                    type="text"
                    value={campaignData.content?.landing?.subtitle || ""}
                    onChange={(e) =>
                      handleInputChange("landing", "subtitle", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    maxLength={50}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {campaignData.content?.landing?.subtitle?.length || 0}/50
                  </div>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">
                    Show the input field
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={campaignData.content?.landing?.showEmail}
                      onChange={(e) =>
                        handleToggleChange(
                          "landing",
                          "showEmail",
                          e.target.checked,
                        )
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
              {campaignData.content?.landing?.showEmail && (
                <div className="relative">
                  <input
                    type="text"
                    value={
                      campaignData.content?.landing?.emailPlaceholder || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "landing",
                        "emailPlaceholder",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                    maxLength={20}
                    placeholder="Placeholder text"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {campaignData.content?.landing?.emailPlaceholder?.length ||
                      0}
                    /20
                  </div>
                </div>
              )}
            </div>

            {/* Privacy & Policy */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Privacy & Policy
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={campaignData.content?.landing?.showPrivacyPolicy}
                    onChange={(e) =>
                      handleToggleChange(
                        "landing",
                        "showPrivacyPolicy",
                        e.target.checked,
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {campaignData.content?.landing?.showPrivacyPolicy && (
                <div className="relative flex">
                  <input
                    type="text"
                    value={
                      campaignData.content?.landing?.privacyPolicyText || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "landing",
                        "privacyPolicyText",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                    maxLength={30}
                  />
                  <button
                    className="ml-2 p-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
                    onClick={() => openFileModal("landing.privacyPolicy")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V6a1 1 0 012 0v2.5a3.5 3.5 0 01-7 0V6a1 1 0 012 0v4a1 1 0 002 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {campaignData.content?.landing?.privacyPolicyText?.length ||
                      0}
                    /30
                  </div>
                </div>
              )}
            </div>

            {/* Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={campaignData.content?.landing?.buttonText || ""}
                  onChange={(e) =>
                    handleInputChange("landing", "buttonText", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  maxLength={18}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {campaignData.content?.landing?.buttonText?.length || 0}/18
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Terms & Conditions
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={campaignData.content?.landing?.showTerms}
                    onChange={(e) =>
                      handleToggleChange(
                        "landing",
                        "showTerms",
                        e.target.checked,
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {campaignData.content?.landing?.showTerms && (
                <div className="relative flex">
                  <input
                    type="text"
                    value={campaignData.content?.landing?.termsText || ""}
                    onChange={(e) =>
                      handleInputChange("landing", "termsText", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    maxLength={30}
                  />
                  <button
                    className="ml-2 p-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
                    onClick={() => openFileModal("landing.terms")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V6a1 1 0 012 0v2.5a3.5 3.5 0 01-7 0V6a1 1 0 012 0v4a1 1 0 002 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {campaignData.content?.landing?.termsText?.length || 0}/30
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wheel Configuration */}
        {activeTab === "wheel" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-indigo-700">
              Wheel Configuration
            </h3>

            {/* Debug Information */}
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">
                Debug Information
              </h4>
              <div className="text-sm text-yellow-800 space-y-1">
                <p>Discount codes in context: {discountCodes?.length || 0}</p>
                <p>Loading codes: {loadingCodes ? "Yes" : "No"}</p>
                <p>Codes error: {codesError ? "Yes" : "No"}</p>
                <p>
                  Campaign wheel sectors:{" "}
                  {campaignData.layout?.wheelSectors || "Not set"}
                </p>
                <p>
                  Global codes available:{" "}
                  {typeof window !== "undefined" && window.GLOBAL_DISCOUNT_CODES
                    ? window.GLOBAL_DISCOUNT_CODES.length
                    : "N/A"}
                </p>
                {discountCodes && discountCodes.length > 0 && (
                  <div>
                    <p className="font-medium">Available codes:</p>
                    <ul className="list-disc list-inside ml-2">
                      {discountCodes.map((code, index) => (
                        <li key={index}>
                          {code.title} - {code.code || "No specific code"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div> */}

            {/* Discount Codes Integration Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Shopify Discount Codes
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Your wheel will be automatically configured using discount codes
                from your Shopify store.
              </p>

              {loadingCodes && (
                <div className="flex items-center justify-center py-4">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-blue-700">
                    Loading discount codes...
                  </span>
                </div>
              )}

              {/* Error Message for No Discount Codes */}
              {codesError && (
                <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        No Discount Codes Found
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{codesError}</p>
                        <div className="mt-3 p-3 bg-red-100 rounded-md">
                          <p className="font-medium text-red-800">
                            To create discount codes:
                          </p>
                          <ol className="list-decimal list-inside mt-2 space-y-1 text-red-700">
                            <li>Go to your Shopify admin panel</li>
                            <li>Navigate to Discounts → Create discount</li>
                            <li>Choose "Discount code" type</li>
                            <li>Set up your discount details and save</li>
                            <li>Return here and refresh the page</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {discountCodes && discountCodes.length > 0 && !codesError && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        ✓ Successfully loaded {discountCodes.length} discount
                        codes from Shopify
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-green-600">
                          Available codes:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {discountCodes.map((code, index) => (
                            <span
                              key={code.id || index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {code.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Refresh Button */}
              <div className="mt-3">
                <button
                  onClick={() => fetchDiscountCodes()}
                  disabled={loadingCodes}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingCodes ? "Loading..." : "Refresh Discount Codes"}
                </button>
              </div>
            </div>

            {/* Generated Wheel Configuration Display */}
            {campaignData.content?.wheel?.sectors?.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Generated Wheel Configuration
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {campaignData.content.wheel.sectors.length} segments
                    </span>
                    <button
                      onClick={() => fetchDiscountCodes()}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-2 bg-gray-200 p-2 rounded-t-md font-medium text-gray-700 text-sm">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">Reward Type</div>
                    <div className="col-span-4">Reward Code</div>
                    <div className="col-span-3">Chance %</div>
                  </div>

                  {campaignData.content.wheel.sectors.map((sector, index) => (
                    <div
                      key={sector.id}
                      className={`grid grid-cols-12 gap-2 p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"} ${
                        sector.discountCodeId
                          ? "border-l-4 border-green-500"
                          : sector.reward === "Better luck next time"
                            ? "border-l-4 border-red-300"
                            : "border-l-4 border-gray-300"
                      }`}
                    >
                      <div className="col-span-1 flex items-center justify-center font-medium text-gray-700">
                        {sector.id}
                        {sector.discountCodeId && (
                          <span
                            className="ml-1 text-green-600"
                            title="Shopify discount code"
                          >
                            ✓
                          </span>
                        )}
                        {sector.reward === "Better luck next time" && (
                          <span
                            className="ml-1 text-red-500"
                            title="No prize sector"
                          >
                            ✗
                          </span>
                        )}
                      </div>
                      <div className="col-span-4 flex items-center">
                        <span
                          className={`text-sm ${
                            sector.discountCodeId
                              ? "text-green-700 font-medium"
                              : sector.reward === "Better luck next time"
                                ? "text-red-600"
                                : "text-gray-700"
                          }`}
                        >
                          {sector.rewardType}
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center">
                        <span
                          className={`text-sm font-mono ${
                            sector.discountCodeId
                              ? "text-green-700 font-medium"
                              : sector.reward === "Better luck next time"
                                ? "text-red-600"
                                : "text-gray-700"
                          }`}
                        >
                          {sector.reward}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className="text-sm text-gray-700">
                          {sector.chance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Wheel Statistics */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="font-medium text-gray-900 mb-2">
                    Wheel Statistics
                  </h5>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Segments:</span>
                      <span className="ml-1 font-medium">
                        {campaignData.content.wheel.sectors.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Discount Codes:</span>
                      <span className="ml-1 font-medium text-green-600">
                        {
                          campaignData.content.wheel.sectors.filter(
                            (s) => s.discountCodeId,
                          ).length
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">No Prize:</span>
                      <span className="ml-1 font-medium text-red-600">
                        {
                          campaignData.content.wheel.sectors.filter(
                            (s) => s.reward === "Better luck next time",
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Screen Configuration */}
        {activeTab === "result" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-indigo-700">
              Result Screen
            </h3>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={campaignData.content?.result?.title || ""}
                  onChange={(e) =>
                    handleInputChange("result", "title", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  maxLength={30}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {campaignData.content?.result?.title?.length || 0}/30
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Sub Title
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={campaignData.content?.result?.showSubtitle}
                    onChange={(e) =>
                      handleToggleChange(
                        "result",
                        "showSubtitle",
                        e.target.checked,
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {campaignData.content?.result?.showSubtitle && (
                <div className="relative">
                  <input
                    type="text"
                    value={campaignData.content?.result?.subtitle || ""}
                    onChange={(e) =>
                      handleInputChange("result", "subtitle", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    maxLength={25}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {campaignData.content?.result?.subtitle?.length || 0}/25
                  </div>
                </div>
              )}
            </div>

            {/* Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Button
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={campaignData.content?.result?.showButton}
                    onChange={(e) =>
                      handleToggleChange(
                        "result",
                        "showButton",
                        e.target.checked,
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {campaignData.content?.result?.showButton && (
                <div className="relative">
                  <input
                    type="text"
                    value={campaignData.content?.result?.buttonText || ""}
                    onChange={(e) =>
                      handleInputChange("result", "buttonText", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    maxLength={15}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {campaignData.content?.result?.buttonText?.length || 0}/15
                  </div>
                </div>
              )}
            </div>

            {/* Button Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set Button Destination
              </label>
              <input
                type="text"
                value={campaignData.content?.result?.buttonDestination || ""}
                onChange={(e) =>
                  handleInputChange(
                    "result",
                    "buttonDestination",
                    e.target.value,
                  )
                }
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com"
              />
            </div>

            {/* Copy Icon */}
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Copy Icon
              </label>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  Show the copy icon
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={campaignData.content?.result?.showCopyIcon}
                    onChange={(e) =>
                      handleToggleChange(
                        "result",
                        "showCopyIcon",
                        e.target.checked,
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Show result again as reminder */}
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Show result again as reminder?
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={campaignData.content?.result?.showResultAgain}
                  onChange={(e) =>
                    handleToggleChange(
                      "result",
                      "showResultAgain",
                      e.target.checked,
                    )
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Timer for result screen */}
            {campaignData.content?.result?.showResultAgain && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Set a timer for to show the result screen.
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={
                      campaignData.content?.result?.reminderTimer?.minutes || 0
                    }
                    onChange={(e) =>
                      handleReminderTimerChange("minutes", e.target.value)
                    }
                    className="w-16 p-2 border rounded-md text-center"
                  />
                  <span className="text-sm text-gray-700">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={
                      campaignData.content?.result?.reminderTimer?.seconds || 0
                    }
                    onChange={(e) =>
                      handleReminderTimerChange("seconds", e.target.value)
                    }
                    className="w-16 p-2 border rounded-md text-center"
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
        )}
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
              <div className="w-full h-full rounded-lg overflow-hidden">
                {/* Desktop Preview */}
                <div className="bg-gray-800 p-4 h-[400px] flex items-center justify-center">
                  <div
                    className={`bg-white rounded-lg shadow-lg w-full max-w-[800px] h-[320px] p-0 relative overflow-hidden`}
                  >
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
                      {activeTab === "landing" || activeTab === "wheel" ? (
                        <>
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

                            {campaignData.content?.landing
                              ?.showPrivacyPolicy && (
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
                            <div className="relative w-[280px] h-[280px]">
                              <div
                                className="w-full h-full rounded-full"
                                style={{
                                  background: generateWheelGradient(),
                                }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-black"></div>
                                </div>

                                {/* Add wheel sector labels */}
                                {campaignData.content?.wheel?.sectors?.map(
                                  (sector, index) => {
                                    const sectorCount =
                                      campaignData.content.wheel.sectors.length;
                                    const angle =
                                      (360 / sectorCount) * index +
                                      360 / sectorCount / 2;
                                    const radius = 110;
                                    const x =
                                      radius *
                                      Math.cos((angle - 90) * (Math.PI / 180));
                                    const y =
                                      radius *
                                      Math.sin((angle - 90) * (Math.PI / 180));

                                    return (
                                      <div
                                        key={sector.id}
                                        className="absolute text-xs font-bold text-center"
                                        style={{
                                          left: `calc(50% + ${x}px)`,
                                          top: `calc(50% + ${y}px)`,
                                          transform:
                                            "translate(-50%, -50%) rotate(" +
                                            angle +
                                            "deg)",
                                          width: "60px",
                                          color:
                                            index % 2 === 0 ? "white" : "black",
                                        }}
                                      >
                                        {sector.rewardType}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Result Screen Content */}
                          <div className="w-1/2 p-8 flex flex-col justify-center">
                            <h2
                              className="text-3xl font-bold mb-3"
                              style={{ color: campaignData.primaryColor }}
                            >
                              {campaignData.content?.result?.title ||
                                "LUCKY DAY!"}
                            </h2>

                            {campaignData.content?.result?.showSubtitle && (
                              <p className="text-sm text-gray-600 mb-5">
                                {campaignData.content?.result?.subtitle ||
                                  "You have won 10% discount for your shopping"}
                              </p>
                            )}

                            <div className="mb-5">
                              <p className="text-sm text-gray-600 mb-2">
                                Your discount code is
                              </p>
                              <div className="flex items-center">
                                <div className="border border-gray-300 rounded-md p-3 bg-gray-50 font-mono text-lg flex-grow text-center">
                                  {campaignData.content?.wheel?.sectors?.find(
                                    (s) => s.discountCodeId,
                                  )?.reward || "SAMPLE10"}
                                </div>
                                {campaignData.content?.result?.showCopyIcon && (
                                  <button className="ml-2 p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>

                            {campaignData.content?.result?.showButton && (
                              <button
                                className="w-full py-3 font-bold text-white rounded-md text-lg"
                                style={{
                                  backgroundColor: campaignData.primaryColor,
                                }}
                              >
                                {campaignData.content?.result?.buttonText ||
                                  "REDEEM NOW"}
                              </button>
                            )}
                          </div>

                          {/* Right side - Wheel */}
                          <div className="w-1/2 bg-gray-50 flex items-center justify-center relative">
                            <div className="relative w-[280px] h-[280px]">
                              <div
                                className="w-full h-full rounded-full"
                                style={{
                                  background: generateWheelGradient(),
                                }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-black"></div>
                                </div>

                                {/* Add wheel sector labels */}
                                {campaignData.content?.wheel?.sectors?.map(
                                  (sector, index) => {
                                    const sectorCount =
                                      campaignData.content.wheel.sectors.length;
                                    const angle =
                                      (360 / sectorCount) * index +
                                      360 / sectorCount / 2;
                                    const radius = 110;
                                    const x =
                                      radius *
                                      Math.cos((angle - 90) * (Math.PI / 180));
                                    const y =
                                      radius *
                                      Math.sin((angle - 90) * (Math.PI / 180));

                                    return (
                                      <div
                                        key={sector.id}
                                        className="absolute text-xs font-bold text-center"
                                        style={{
                                          left: `calc(50% + ${x}px)`,
                                          top: `calc(50% + ${y}px)`,
                                          transform:
                                            "translate(-50%, -50%) rotate(" +
                                            angle +
                                            "deg)",
                                          width: "60px",
                                          color:
                                            index % 2 === 0 ? "white" : "black",
                                        }}
                                      >
                                        {sector.rewardType}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Mobile view
              <div className="w-56 h-[480px] bg-gray-900 rounded-3xl p-2 relative">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full"></div>
                <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="bg-white h-full p-4 flex flex-col items-center">
                    {activeTab === "landing" || activeTab === "wheel" ? (
                      <>
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
                                campaignData.content?.landing
                                  ?.emailPlaceholder || "Enter your email"
                              }
                              className="w-full p-2 text-xs border rounded-md mb-3 text-center"
                            />
                          )}

                          <button
                            className="w-full py-2 text-sm font-bold text-white rounded-md"
                            style={{
                              backgroundColor: campaignData.primaryColor,
                            }}
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
                        <div className="mt-4 relative w-40 h-40">
                          <div
                            className="w-full h-full rounded-full"
                            style={{
                              background: generateWheelGradient(),
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-black"></div>
                            </div>

                            {/* Add wheel sector labels for mobile */}
                            {campaignData.content?.wheel?.sectors?.map(
                              (sector, index) => {
                                const sectorCount =
                                  campaignData.content.wheel.sectors.length;
                                const angle =
                                  (360 / sectorCount) * index +
                                  360 / sectorCount / 2;
                                const radius = 60;
                                const x =
                                  radius *
                                  Math.cos((angle - 90) * (Math.PI / 180));
                                const y =
                                  radius *
                                  Math.sin((angle - 90) * (Math.PI / 180));

                                return (
                                  <div
                                    key={sector.id}
                                    className="absolute text-[6px] font-bold text-center"
                                    style={{
                                      left: `calc(50% + ${x}px)`,
                                      top: `calc(50% + ${y}px)`,
                                      transform:
                                        "translate(-50%, -50%) rotate(" +
                                        angle +
                                        "deg)",
                                      width: "30px",
                                      color:
                                        index % 2 === 0 ? "white" : "black",
                                    }}
                                  >
                                    {sector.rewardType}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Mobile Result Screen Content */}
                        <div className="text-center w-full">
                          <h2
                            className="text-xl font-bold mb-2"
                            style={{ color: campaignData.primaryColor }}
                          >
                            {campaignData.content?.result?.title ||
                              "LUCKY DAY!"}
                          </h2>

                          {campaignData.content?.result?.showSubtitle && (
                            <p className="text-xs text-gray-600 mb-3">
                              {campaignData.content?.result?.subtitle ||
                                "You have won 10% discount for your shopping"}
                            </p>
                          )}

                          <div className="mb-3">
                            <p className="text-xs text-gray-600 mb-1">
                              Your discount code is
                            </p>
                            <div className="flex items-center justify-center">
                              <div className="border border-gray-300 rounded-md p-1 bg-gray-50 font-mono text-sm">
                                {campaignData.content?.wheel?.sectors?.find(
                                  (s) => s.discountCodeId,
                                )?.reward || "SAMPLE10"}
                              </div>
                              {campaignData.content?.result?.showCopyIcon && (
                                <button className="ml-1 p-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>

                          {campaignData.content?.result?.showButton && (
                            <button
                              className="w-full py-2 text-sm font-bold text-white rounded-md"
                              style={{
                                backgroundColor: campaignData.primaryColor,
                              }}
                            >
                              {campaignData.content?.result?.buttonText ||
                                "REDEEM NOW"}
                            </button>
                          )}
                        </div>

                        {/* Mobile Wheel Preview */}
                        <div className="mt-4 relative w-40 h-40">
                          <div
                            className="w-full h-full rounded-full"
                            style={{
                              background: generateWheelGradient(),
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-black"></div>
                            </div>

                            {/* Add wheel sector labels for mobile */}
                            {campaignData.content?.wheel?.sectors?.map(
                              (sector, index) => {
                                const sectorCount =
                                  campaignData.content.wheel.sectors.length;
                                const angle =
                                  (360 / sectorCount) * index +
                                  360 / sectorCount / 2;
                                const radius = 60;
                                const x =
                                  radius *
                                  Math.cos((angle - 90) * (Math.PI / 180));
                                const y =
                                  radius *
                                  Math.sin((angle - 90) * (Math.PI / 180));

                                return (
                                  <div
                                    key={sector.id}
                                    className="absolute text-[6px] font-bold text-center"
                                    style={{
                                      left: `calc(50% + ${x}px)`,
                                      top: `calc(50% + ${y}px)`,
                                      transform:
                                        "translate(-50%, -50%) rotate(" +
                                        angle +
                                        "deg)",
                                      width: "30px",
                                      color:
                                        index % 2 === 0 ? "white" : "black",
                                    }}
                                  >
                                    {sector.rewardType}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Tabs */}
          <div className="flex justify-center mt-4 border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "landing"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("landing")}
            >
              Landing Screen
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "result"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("result")}
            >
              Result screen
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "floating"
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("floating")}
            >
              Floating Button
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              How would you like to add it?
            </h3>

            <button
              className="w-full mb-4 p-3 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center hover:bg-indigo-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V6a1 1 0 012 0v2.5a3.5 3.5 0 01-7 0V6a1 1 0 012 0v4a1 1 0 002 0V7a3 3 0 00-3-3z"
                  clipRule="evenodd"
                />
              </svg>
              Browse your file (.xls, .gsheet, .doc)
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="text-center text-gray-500 my-2">OR</div>

            <div className="relative">
              <input
                type="text"
                placeholder="Paste your link here"
                className="w-full p-3 border rounded-lg pl-10"
                onBlur={(e) => handlePasteLink(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => setShowFileModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
