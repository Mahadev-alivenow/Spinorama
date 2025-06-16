"use client";

// CampaignsList.jsx - This is a new file, creating the component from scratch based on the provided updates.

import { useState } from "react";
import { toast } from "react-toastify";

const CampaignsList = ({ campaigns, setCampaigns }) => {
  const [updatingCampaigns, setUpdatingCampaigns] = useState(new Set());

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      setUpdatingCampaigns((prev) => new Set([...prev, campaignId]));

      // Create form data
      const formData = new FormData();
      formData.append("status", newStatus);

      // Try to get shop from URL or other sources
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get("shop") || window.location.hostname;

      if (shop) {
        formData.append("shop", shop);
      }

      const response = await fetch(`/api/campaigns/status/${campaignId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle different types of errors
        if (response.status === 302) {
          throw new Error(
            "Authentication required. Please refresh the page and try again.",
          );
        } else if (response.status === 404) {
          throw new Error("Campaign not found.");
        } else if (response.status === 400) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Bad request" }));
          throw new Error(errorData.error || "Invalid request.");
        } else {
          throw new Error(
            `Failed to update campaign status (${response.status})`,
          );
        }
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update campaign status");
      }

      // Show appropriate success message based on sync result
      if (data.syncResult?.success) {
        toast.success(
          `Campaign ${newStatus === "active" ? "activated" : "deactivated"} and synced successfully!`,
        );
      } else if (data.syncResult?.success === false) {
        toast.success(
          `Campaign ${newStatus === "active" ? "activated" : "deactivated"} successfully!`,
        );
        toast.warn(
          "Metafield sync failed: " +
            (data.syncResult?.message || "Unknown error"),
        );
      } else {
        toast.success(
          `Campaign ${newStatus === "active" ? "activated" : "deactivated"} successfully!`,
        );
      }

      // Update local state immediately for better UX
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) => {
          if (campaign._id === campaignId) {
            return { ...campaign, status: newStatus };
          } else if (newStatus === "active") {
            // Set other campaigns to draft when one becomes active
            return { ...campaign, status: "draft" };
          }
          return campaign;
        }),
      );

      // Try to sync using dedicated sync endpoint as backup
      if (!data.syncResult?.success && newStatus === "active") {
        try {
          const syncResponse = await fetch("/api/sync-metafields", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ campaignId, shop }),
          });

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            if (syncData.success) {
              toast.success("Campaign synced to storefront successfully!");
            }
          }
        } catch (syncError) {
          console.log("Backup sync failed:", syncError);
          // Don't show error to user as main operation succeeded
        }
      }
    } catch (error) {
      console.error("Error updating campaign status:", error);

      // Show user-friendly error messages
      if (error.message.includes("Authentication required")) {
        toast.error(
          "Authentication expired. Please refresh the page and try again.",
        );
      } else if (error.message.includes("shop name")) {
        toast.error(
          "Could not determine your shop. Please ensure you're accessing this from the Shopify admin.",
        );
      } else {
        toast.error(
          error.message ||
            "Failed to update campaign status. Please try again.",
        );
      }
    } finally {
      setUpdatingCampaigns((prev) => {
        const newSet = new Set(prev);
        newSet.delete(campaignId);
        return newSet;
      });
    }
  };

  return (
    <div>
      {campaigns && campaigns.length > 0 ? (
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign._id}>
              {campaign.name} - Status: {campaign.status}
              <button
                onClick={() =>
                  handleStatusChange(
                    campaign._id,
                    campaign.status === "active" ? "draft" : "active",
                  )
                }
                disabled={updatingCampaigns.has(campaign._id)}
              >
                {campaign.status === "active" ? "Deactivate" : "Activate"}
              </button>
              {updatingCampaigns.has(campaign._id) && " Updating..."}
            </li>
          ))}
        </ul>
      ) : (
        <p>No campaigns found.</p>
      )}
    </div>
  );
};

export default CampaignsList;
