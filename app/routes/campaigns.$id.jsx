"use client";

import { useParams, Link, useNavigate } from "@remix-run/react";
import { useCampaign } from "../context/CampaignContext";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function CampaignView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allCampaigns } = useCampaign();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Find the campaign by ID
  useEffect(() => {
    console.log("Looking for campaign with ID:", id);
    console.log("Available campaigns:", allCampaigns);

    const foundCampaign = allCampaigns.find((c) => c.id === id);

    if (foundCampaign) {
      console.log("Found campaign for viewing:", foundCampaign);
      setCampaign(foundCampaign);
      setIsLoading(false);
    } else {
      // If campaign not found, redirect to campaigns list
      console.error("Campaign not found:", id);
      toast.error("Campaign not found");
      navigate("/campaigns");
    }
  }, [id, allCampaigns, navigate]);

  // Handle edit campaign click
  const handleEditClick = () => {
    console.log("Navigating to edit campaign:", id);
    navigate(`/campaigns/edit/${id}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-6">
            The campaign you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/campaigns" className="text-indigo-600 hover:underline">
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Navigation />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <div className="flex items-center mt-2">
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  campaign.status === "active"
                    ? "bg-green-100 text-green-800"
                    : campaign.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {campaign.status.charAt(0).toUpperCase() +
                  campaign.status.slice(1)}
              </span>
              <span className="text-gray-500 text-sm ml-4">
                Created: {formatDate(campaign.createdAt)}
              </span>
              {campaign.updatedAt && (
                <span className="text-gray-500 text-sm ml-4">
                  Updated: {formatDate(campaign.updatedAt)}
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit Campaign
            </button>
            <Link
              to="/campaigns"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Campaigns
            </Link>
          </div>
        </div>

        {/* Campaign Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Campaign Preview</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row">
                {/* Campaign Content */}
                <div className="w-full md:w-1/2 p-4">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: campaign.primaryColor }}
                  >
                    {campaign.content?.landing?.title || "SPIN TO WIN"}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    {campaign.content?.landing?.subtitle ||
                      "Enter your email to spin the wheel for a chance to win a discount."}
                  </p>

                  {/* Email Input */}
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-md p-2 text-center"
                      readOnly
                    />
                  </div>

                  {/* Spin Button */}
                  <button
                    className="w-full py-3 rounded-md font-bold text-white mb-2"
                    style={{ backgroundColor: campaign.primaryColor }}
                  >
                    {campaign.content?.landing?.buttonText || "SPIN NOW"}
                  </button>
                </div>

                {/* Wheel Preview */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                  <div className="relative w-48 h-48">
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background:
                          campaign.color === "dualTone"
                            ? `conic-gradient(
                          ${campaign.primaryColor} 0deg, 
                          ${campaign.primaryColor} 45deg, 
                          ${campaign.secondaryColor} 45deg, 
                          ${campaign.secondaryColor} 90deg,
                          ${campaign.primaryColor} 90deg, 
                          ${campaign.primaryColor} 135deg,
                          ${campaign.secondaryColor} 135deg, 
                          ${campaign.secondaryColor} 180deg,
                          ${campaign.primaryColor} 180deg, 
                          ${campaign.primaryColor} 225deg,
                          ${campaign.secondaryColor} 225deg, 
                          ${campaign.secondaryColor} 270deg,
                          ${campaign.primaryColor} 270deg, 
                          ${campaign.primaryColor} 315deg,
                          ${campaign.secondaryColor} 315deg, 
                          ${campaign.secondaryColor} 360deg
                        )`
                            : `conic-gradient(
                          ${campaign.primaryColor} 0deg, 
                          ${campaign.primaryColor} 45deg, 
                          white 45deg, 
                          white 90deg,
                          ${campaign.primaryColor} 90deg, 
                          ${campaign.primaryColor} 135deg,
                          white 135deg, 
                          white 180deg,
                          ${campaign.primaryColor} 180deg, 
                          ${campaign.primaryColor} 225deg,
                          white 225deg, 
                          white 270deg,
                          ${campaign.primaryColor} 270deg, 
                          ${campaign.primaryColor} 315deg,
                          white 315deg, 
                          white 360deg
                        )`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-black"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Design</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Look:</span>
                    <span>
                      {campaign.look === "custom"
                        ? "Custom Layout"
                        : "Ready-Made Template"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Color Scheme:</span>
                    <div className="flex items-center">
                      <span className="mr-2">
                        {campaign.color === "singleTone"
                          ? "Single Tone"
                          : "Dual Tone"}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: campaign.primaryColor }}
                      ></div>
                      {campaign.color === "dualTone" && (
                        <div
                          className="w-4 h-4 rounded-full ml-1"
                          style={{ backgroundColor: campaign.secondaryColor }}
                        ></div>
                      )}
                    </div>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Display Style:</span>
                    <span>
                      {campaign.layout?.displayStyle === "popup"
                        ? "Pop-up"
                        : "Full Screen"}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Rules</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Appearing Rules:</span>
                    <span>
                      {Object.entries(campaign.rules?.appearingRules || {})
                        .filter(([_, rule]) => rule.enabled)
                        .map(
                          ([key]) => key.charAt(0).toUpperCase() + key.slice(1),
                        )
                        .join(", ") || "None"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Page Targeting:</span>
                    <span>
                      {campaign.rules?.pageTargeting?.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Display Frequency:</span>
                    <span>
                      {campaign.rules?.displayFrequency?.frequency?.replace(
                        /_/g,
                        " ",
                      ) || "Once a day"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
