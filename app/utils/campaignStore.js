// Local storage keys
const ACTIVE_CAMPAIGNS_KEY = "activeCampaigns";
const DRAFT_CAMPAIGNS_KEY = "draftCampaigns";

// Initialize storage with empty arrays if not exists
const initStorage = () => {
  if (!localStorage.getItem(ACTIVE_CAMPAIGNS_KEY)) {
    localStorage.setItem(ACTIVE_CAMPAIGNS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(DRAFT_CAMPAIGNS_KEY)) {
    localStorage.setItem(DRAFT_CAMPAIGNS_KEY, JSON.stringify([]));
  }
};

// Get all campaigns (active and drafts)
export const getCampaigns = () => {
  initStorage();
  return {
    active: JSON.parse(localStorage.getItem(ACTIVE_CAMPAIGNS_KEY)),
    drafts: JSON.parse(localStorage.getItem(DRAFT_CAMPAIGNS_KEY)),
  };
};

// Get a specific campaign by ID
export const getCampaignById = (id) => {
  const { active, drafts } = getCampaigns();

  // Check active campaigns
  const activeCampaign = active.find((campaign) => campaign.id === id);
  if (activeCampaign) return { ...activeCampaign, isDraft: false };

  // Check draft campaigns
  const draftCampaign = drafts.find((campaign) => campaign.id === id);
  if (draftCampaign) return { ...draftCampaign, isDraft: true };

  return null;
};

// Save a draft campaign
export const saveDraftCampaign = (campaign) => {
  initStorage();
  const drafts = JSON.parse(localStorage.getItem(DRAFT_CAMPAIGNS_KEY));

  // Check if campaign already exists
  const existingIndex = drafts.findIndex((c) => c.id === campaign.id);

  if (existingIndex >= 0) {
    // Update existing campaign
    drafts[existingIndex] = campaign;
  } else {
    // Add new campaign
    drafts.push({
      ...campaign,
      id: campaign.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(DRAFT_CAMPAIGNS_KEY, JSON.stringify(drafts));
  return campaign;
};

// Move campaign from drafts to active
export const moveCampaignToActive = (campaignId) => {
  const { active, drafts } = getCampaigns();

  // Find campaign in drafts
  const campaignIndex = drafts.findIndex((c) => c.id === campaignId);
  if (campaignIndex === -1) return false;

  // Move campaign to active
  const campaign = { ...drafts[campaignIndex], status: "active" };
  active.push(campaign);

  // Remove from drafts
  drafts.splice(campaignIndex, 1);

  // Save changes
  localStorage.setItem(ACTIVE_CAMPAIGNS_KEY, JSON.stringify(active));
  localStorage.setItem(DRAFT_CAMPAIGNS_KEY, JSON.stringify(drafts));

  return true;
};

// Move campaign from active to drafts
export const moveCampaignToDrafts = (campaignId) => {
  const { active, drafts } = getCampaigns();

  // Find campaign in active
  const campaignIndex = active.findIndex((c) => c.id === campaignId);
  if (campaignIndex === -1) return false;

  // Move campaign to drafts
  const campaign = { ...active[campaignIndex], status: "inactive" };
  drafts.push(campaign);

  // Remove from active
  active.splice(campaignIndex, 1);

  // Save changes
  localStorage.setItem(ACTIVE_CAMPAIGNS_KEY, JSON.stringify(active));
  localStorage.setItem(DRAFT_CAMPAIGNS_KEY, JSON.stringify(drafts));

  return true;
};

// Delete a campaign
export const deleteCampaign = (campaignId, isDraft = true) => {
  const storageKey = isDraft ? DRAFT_CAMPAIGNS_KEY : ACTIVE_CAMPAIGNS_KEY;
  const campaigns = JSON.parse(localStorage.getItem(storageKey));

  const updatedCampaigns = campaigns.filter((c) => c.id !== campaignId);
  localStorage.setItem(storageKey, JSON.stringify(updatedCampaigns));

  return true;
};

// Create new campaign (starting point)
export const createNewCampaign = (name, description = "") => {
  const campaign = {
    id: Date.now().toString(),
    name,
    description,
    createdAt: new Date().toISOString(),
    layout: "custom", // default
    colorScheme: "single", // default
    primaryColor: "#fe5300", // default
    secondaryColor: null,
    impressions: 0,
    rewards: 0,
  };

  return saveDraftCampaign(campaign);
};
