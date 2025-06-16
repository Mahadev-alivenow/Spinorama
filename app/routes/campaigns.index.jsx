"use client";

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import { useCampaign } from "../context/CampaignContext";
import { usePlan } from "../context/PlanContext";
import Navigation from "../components/Navigation";

export default function Campaigns() {
  const { allCampaigns, deleteCampaign, checkCanCreateCampaign } =
    useCampaign();
  const { currentPlan } = usePlan();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchParams] = useSearchParams();
  const [showPlanModal, setShowPlanModal] = useState(
    searchParams.get("upgrade") === "true",
  );
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle campaign deletion
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCampaign(deleteId);
      setIsDeleting(false);
      setDeleteId(null);
      alert("Campaign deleted successfully!");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteId(null);
  };

  // Handle create campaign click
  const handleCreateClick = () => {
    if (checkCanCreateCampaign()) {
      navigate("/campaigns/create");
    } else {
      setShowPlanModal(true);
    }
  };

  // Navigate to pricing page
  const goToPricing = () => {
    navigate("/pricing");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Navigation />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Campaigns</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-500">Current Plan: </span>
              <span className="font-medium capitalize">{currentPlan.name}</span>
              <span className="text-gray-500 ml-2">
                ({allCampaigns.length}/{currentPlan.campaignLimit} campaigns)
              </span>
            </div>
            <button
              onClick={goToPricing}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              Upgrade
            </button>
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create New Campaign
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Campaign Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allCampaigns.length > 0 ? (
                allCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{
                            backgroundColor: campaign.primaryColor || "#fe5300",
                          }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.createdAt
                        ? formatDate(campaign.createdAt)
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to={`/campaigns/${campaign.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteClick(campaign.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No campaigns found.{" "}
                    <button
                      onClick={handleCreateClick}
                      className="text-indigo-600 hover:underline"
                    >
                      Create your first campaign
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Campaign</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this campaign? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
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

      {/* Plan Upgrade Modal */}
      {showPlanModal && (
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
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={goToPricing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
