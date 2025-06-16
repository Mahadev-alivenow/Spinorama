"use client";

import { useState } from "react";

export default function SyncCampaignButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/sync-campaign-metafields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setResult({
        success: data.success,
        message: data.success
          ? "Campaign synced to metafields successfully!"
          : data.message || "Failed to sync campaign to metafields.",
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.message || "An error occurred while syncing campaign.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={isLoading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Syncing..." : "Sync Campaign to Metafields"}
      </button>

      {result && (
        <div
          className={`mt-2 p-2 rounded text-sm ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
