import { useCampaign } from "../context/CampaignContext";

export default function CampaignActiveIndicator() {
  const { allCampaigns, isLoading } = useCampaign();

  // Find the active campaign
  const activeCampaign = allCampaigns.find(
    (campaign) => campaign.status === "active",
  );

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500">
        <div className="animate-pulse h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
        Loading campaigns...
      </div>
    );
  }

  if (!activeCampaign) {
    return (
      <div className="flex items-center text-amber-600">
        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
        No active campaign
      </div>
    );
  }

  return (
    <div className="flex items-center text-green-600">
      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
      Active: {activeCampaign.name}
    </div>
  );
}
