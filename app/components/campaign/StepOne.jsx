"use client";

import { useState } from "react";
import { useCampaign } from "../../context/CampaignContext";
import CampaignPreview from "./CampaignPreview";

export default function StepOne() {
  const { campaignData, updateLook, updateColor, updateColorValues } =
    useCampaign();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorType, setActiveColorType] = useState("primary");

  // Predefined color palettes
  const colorPalettes = {
    basic: [
      "#fe5300",
      "#ff0000",
      "#ff6b00",
      "#ffc700",
      "#00c853",
      "#00b0ff",
      "#304ffe",
      "#aa00ff",
    ],
    shopify: [
      "#95bf47",
      "#5e8e3e",
      "#212b35",
      "#637381",
      "#919eab",
      "#c4cdd5",
      "#dfe3e8",
      "#f4f6f8",
    ],
    modern: [
      "#ff5252",
      "#ff4081",
      "#e040fb",
      "#7c4dff",
      "#536dfe",
      "#448aff",
      "#40c4ff",
      "#18ffff",
    ],
    pastel: [
      "#ffcdd2",
      "#f8bbd0",
      "#e1bee7",
      "#d1c4e9",
      "#c5cae9",
      "#bbdefb",
      "#b3e5fc",
      "#b2ebf2",
    ],
    earth: [
      "#795548",
      "#a1887f",
      "#bcaaa4",
      "#d7ccc8",
      "#efebe9",
      "#8d6e63",
      "#6d4c41",
      "#5d4037",
    ],
  };

  const [activePalette, setActivePalette] = useState("basic");

  // Handle look change (custom or readyMade)
  const handleLookChange = (look) => {
    console.log("Look change clicked:", look);
    updateLook(look);
  };

  // Handle color type change (singleTone or dualTone)
  const handleColorTypeChange = (colorType) => {
    console.log("Color type change clicked:", colorType);
    updateColor(colorType);
  };

  // Handle color value change
  const handleColorChange = (colorType, value) => {
    console.log(`Color change: ${colorType} to ${value}`);
    updateColorValues(colorType, value);
    setShowColorPicker(false);
  };

  // Toggle color picker
  const toggleColorPicker = (colorType) => {
    console.log("Toggle color picker for:", colorType);
    setActiveColorType(colorType);
    setShowColorPicker(!showColorPicker);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24">
      {/* Left side - Options */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-bold mb-6">Pick Your</h2>

        {/* Look Options */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">Look</h3>

          {/* Custom Layout Option */}
          <div
            className={`border p-4 mb-4 rounded-lg cursor-pointer ${
              campaignData.look === "custom"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300"
            }`}
            onClick={() => handleLookChange("custom")}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id="custom-layout"
                name="look"
                className="mt-1 mr-3"
                checked={campaignData.look === "custom"}
                onChange={() => handleLookChange("custom")}
              />
              <div>
                <label
                  htmlFor="custom-layout"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Custom Layout
                </label>
                <p className="text-sm text-gray-500">
                  Design your way, from scratch.
                </p>
              </div>
            </div>
          </div>

          {/* Ready-Made Templates Option */}
          {/* <div
            className={`border p-4 rounded-lg cursor-pointer ${
              campaignData.look === "readyMade"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300"
            }`}
            onClick={() => handleLookChange("readyMade")}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id="ready-made"
                name="look"
                className="mt-1 mr-3"
                checked={campaignData.look === "readyMade"}
                onChange={() => handleLookChange("readyMade")}
              />
              <div>
                <label
                  htmlFor="ready-made"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Ready-Made Templates
                </label>
                <p className="text-sm text-gray-500">
                  Pre-made design, your words & color.
                </p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Color Options */}
        <div>
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">Color</h3>

          {/* Single Tone Option */}
          <div
            className={`border p-4 mb-4 rounded-lg cursor-pointer ${
              campaignData.color === "singleTone"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300"
            }`}
            onClick={() => handleColorTypeChange("singleTone")}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id="single-tone"
                name="color"
                className="mt-1 mr-3"
                checked={campaignData.color === "singleTone"}
                onChange={() => handleColorTypeChange("singleTone")}
              />
              <div className="flex-1">
                <label
                  htmlFor="single-tone"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Single Tone
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Use one primary brand color
                </p>

                <div className="flex items-center mt-2">
                  <button
                    className="w-10 h-10 rounded-full border border-gray-300 mr-2 shadow-sm hover:shadow-md"
                    style={{ backgroundColor: campaignData.primaryColor }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleColorPicker("primary");
                    }}
                  ></button>
                  <span className="text-sm font-mono">
                    {campaignData.primaryColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Tone Option */}
          <div
            className={`border p-4 rounded-lg cursor-pointer ${
              campaignData.color === "dualTone"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300"
            }`}
            onClick={() => handleColorTypeChange("dualTone")}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id="dual-tone"
                name="color"
                className="mt-1 mr-3"
                checked={campaignData.color === "dualTone"}
                onChange={() => handleColorTypeChange("dualTone")}
              />
              <div className="flex-1">
                <label
                  htmlFor="dual-tone"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Dual Tone
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Select two of your brand colors
                </p>

                <div className="flex items-center mt-2 mb-2">
                  <button
                    className="w-10 h-10 rounded-full border border-gray-300 mr-2 shadow-sm hover:shadow-md"
                    style={{ backgroundColor: campaignData.secondaryColor }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleColorPicker("secondary");
                    }}
                  ></button>
                  <span className="text-sm font-mono">
                    {campaignData.secondaryColor}
                  </span>
                </div>

                <div className="flex items-center mt-2">
                  <button
                    className="w-10 h-10 rounded-full border border-gray-300 mr-2 shadow-sm hover:shadow-md"
                    style={{ backgroundColor: campaignData.primaryColor }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleColorPicker("primary");
                    }}
                  ></button>
                  <span className="text-sm font-mono">
                    {campaignData.primaryColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">
                  Select Color for{" "}
                  {activeColorType === "primary"
                    ? "Primary"
                    : activeColorType === "secondary"
                      ? "Secondary"
                      : "Primary"}
                </h4>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
              </div>

              {/* Color palette selector */}
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                {Object.keys(colorPalettes).map((palette) => (
                  <button
                    key={palette}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activePalette === palette
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setActivePalette(palette)}
                  >
                    {palette.charAt(0).toUpperCase() + palette.slice(1)}
                  </button>
                ))}
              </div>

              {/* Color swatches */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {colorPalettes[activePalette].map((color) => (
                  <button
                    key={color}
                    className="w-12 h-12 rounded-full border hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(activeColorType, color)}
                  ></button>
                ))}
              </div>

              {/* Custom color input */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Custom Color:
                </label>
                <div className="flex">
                  <input
                    type="color"
                    value={
                      activeColorType === "primary"
                        ? campaignData.primaryColor
                        : activeColorType === "secondary"
                          ? campaignData.secondaryColor
                          : campaignData.primaryColor
                    }
                    onChange={(e) =>
                      handleColorChange(activeColorType, e.target.value)
                    }
                    className="w-10 h-10 p-0 border-0 rounded-full"
                  />
                  <input
                    type="text"
                    value={
                      activeColorType === "primary"
                        ? campaignData.primaryColor
                        : activeColorType === "secondary"
                          ? campaignData.secondaryColor
                          : campaignData.primaryColor
                    }
                    onChange={(e) =>
                      handleColorChange(activeColorType, e.target.value)
                    }
                    className="ml-2 text-sm border rounded px-2 py-1 w-24 font-mono"
                    placeholder="#000000"
                  />
                  <button
                    className="ml-2 bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => {
                      const currentColor =
                        activeColorType === "primary"
                          ? campaignData.primaryColor
                          : activeColorType === "secondary"
                            ? campaignData.secondaryColor
                            : campaignData.primaryColor;
                      handleColorChange(activeColorType, currentColor);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Preview */}
      <div className="w-full lg:w-1/2">
        <CampaignPreview />
      </div>
    </div>
  );
}
