"use client";

import { useLoaderData, useNavigate, useFetcher } from "@remix-run/react";
import { useCampaign } from "../context/CampaignContext";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { toast } from "react-hot-toast";
import CampaignActiveIndicator from "./CampaignActiveIndicator";

export default function CampaignListClient() {
  const data = useLoaderData();
  const { allCampaigns, deleteCampaign, isLoading } = useCampaign();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetcher for campaign operations with proper authentication
  const toggleFetcher = useFetcher();

  // Use campaigns from loader data if available, otherwise use context
  const campaigns = data?.campaigns?.length > 0 ? data.campaigns : allCampaigns;

  // Handle toggle fetcher response
  useEffect(() => {
    if (toggleFetcher.state === "idle" && toggleFetcher.data) {
      const campaignId = toggleFetcher.formData?.get("campaignId");

      if (toggleFetcher.data.success) {
        toast.success(toggleFetcher.data.message, {
          id: `toggle-${campaignId}`,
        });

        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // Handle authentication errors
        if (toggleFetcher.data.authError) {
          toast.error("Authentication failed. Please refresh the page.", {
            id: `toggle-${campaignId}`,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error(toggleFetcher.data.error || "Failed to toggle campaign", {
            id: `toggle-${campaignId}`,
          });
        }
      }
    }
  }, [toggleFetcher.data, toggleFetcher.state]);

  // Show error state if not authenticated
  if (!data?.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <div className="mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ Authentication required. Please access this page from within
              the Shopify admin.
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle create campaign click
  const handleCreateClick = () => {
    navigate("/campaigns/create");
  };

  // Handle view campaign click
  const handleViewClick = (campaignId) => {
    console.log("Navigating to view campaign:", campaignId);
    navigate(`/campaigns/${campaignId}`);
  };

  // Handle edit campaign click
  const handleEditClick = (campaignId) => {
    console.log("Navigating to edit campaign:", campaignId);
    navigate(`/campaigns/edit/${campaignId}`);
  };

  // Handle toggle status with proper authentication
  const handleToggleStatus = async (campaignId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "draft" : "active";

      toast.loading(
        newStatus === "active"
          ? "Activating campaign and syncing to storefront..."
          : "Deactivating campaign...",
        { id: `toggle-${campaignId}` },
      );

      // Use fetcher with proper authentication context
      toggleFetcher.submit(
        {
          campaignId: campaignId,
          action: newStatus === "active" ? "activate" : "deactivate",
          shopName: data.shopName,
        },
        {
          method: "POST",
          action: "/api/campaigns/toggle", // Use authenticated API route
        },
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update campaign status", {
        id: `toggle-${campaignId}`,
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = (campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign(campaignToDelete.id);
      setShowDeleteModal(false);
      setCampaignToDelete(null);
    } catch (error) {
      toast.error("Failed to delete campaign");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Navigation />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">All Campaigns</h1>
            <div className="mt-2">
              <CampaignActiveIndicator />
            </div>
            {data?.shopName && (
              <div className="text-sm text-gray-600 mt-1">
                Shop:{" "}
                <span className="font-semibold">{data.shopFormatted}</span>
                {data?.isAuthenticated && (
                  <span className="text-green-600 ml-2">✓ Authenticated</span>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id || campaign._id || `campaign-${Math.random()}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="h-3"
                  style={{
                    backgroundColor: campaign.primaryColor || "#fe5300",
                  }}
                ></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                      {campaign.name || "Unnamed Campaign"}
                    </h2>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleToggleStatus(
                            campaign.id || campaign._id,
                            campaign.status,
                          )
                        }
                        disabled={toggleFetcher.state === "submitting"}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 ${
                          campaign.status === "active"
                            ? "bg-indigo-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`${
                            campaign.status === "active"
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status
                        ? campaign.status.charAt(0).toUpperCase() +
                          campaign.status.slice(1)
                        : "Draft"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Created:{" "}
                      {campaign.createdAt
                        ? formatDate(campaign.createdAt)
                        : "N/A"}
                    </div>

                    {campaign.look && (
                      <div className="flex items-center mb-1">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          ></path>
                        </svg>
                        Look:{" "}
                        {campaign.look
                          ? campaign.look.charAt(0).toUpperCase() +
                            campaign.look.slice(1)
                          : "N/A"}
                      </div>
                    )}

                    {campaign.color && (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          ></path>
                        </svg>
                        Color:{" "}
                        {campaign.color
                          ? campaign.color.charAt(0).toUpperCase() +
                            campaign.color.slice(1)
                          : "N/A"}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleViewClick(campaign.id || campaign._id)
                        }
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleEditClick(campaign.id || campaign._id)
                        }
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(campaign)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Campaigns Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't created any campaigns yet. Get started by creating
              your first campaign.
            </p>
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Your First Campaign
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Campaign</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{campaignToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
