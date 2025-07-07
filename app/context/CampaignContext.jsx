"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { usePlan } from "./PlanContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";

// Create a context for campaign data
const CampaignContext = createContext(null);

// Sample campaigns data for initial state
const SAMPLE_CAMPAIGNS = [];

// Default rules structure
const DEFAULT_RULES = {
  appearingRules: {
    exitIntent: { enabled: false, device: "desktop" },
    timeDelay: { enabled: false, seconds: 5 },
    pageScroll: { enabled: false, percentage: 20 },
    pageCount: { enabled: false, pages: 2 },
    clicksCount: { enabled: false, clicks: 2 },
    inactivity: { enabled: false, seconds: 30 },
  },
  pageTargeting: {
    enabled: true,
    url: "www.yourdomain.com",
    urls: [],
  },
  popupAgain: {
    enabled: true,
    timer: { minutes: 10, seconds: 0 },
  },
  displayFrequency: {
    enabled: true,
    frequency: "once_a_day",
    visitorType: "everyone", // everyone, new, return
  },
};

// Campaign provider component
export function CampaignProvider({ children }) {
  const app = useAppBridge();
  const fetchWithAuth = authenticatedFetch(app); // app = App Bridge instance

  const { currentPlan } = usePlan();
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    checking: true,
  });
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState({
    name: "wheel-of-wonders",
    formatted: "wheel-of-wonders",
  });
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Utility to generate a random name
  // const generateRandomCampaignName = () => {
  //   const adjectives = [
  //     "Lucky",
  //     "Brave",
  //     "Swift",
  //     "Happy",
  //     "Crazy",
  //     "Magic",
  //     "Bold",
  //     "Alpha",
  //     "Epic",
  //     "Silent",
  //   ];
  //   const nouns = [
  //     "Fox",
  //     "Tiger",
  //     "Storm",
  //     "Star",
  //     "Wave",
  //     "Wizard",
  //     "Falcon",
  //     "Comet",
  //     "Shadow",
  //     "Drift",
  //   ];

  //   const randomAdjective =
  //     adjectives[Math.floor(Math.random() * adjectives.length)];
  //   const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  //   return `Campaign-${randomAdjective}${randomNoun}`;
  // };

  // let randomCapaignName = generateRandomCampaignName();
  // console.log("random campaign name:", generateRandomCampaignName());
  // console.log("random campaign name variable:", randomCapaignName);
  // Initialize campaign data with default values
  const [campaignData, setCampaignData] = useState({
    campaignName: "Camapign Name", // Random campaign name
    step: 1,
    look: "custom", // custom or readyMade
    color: "singleTone", // singleTone or dualTone
    primaryColor: "#fe5300",
    secondaryColor: "#767676",
    tertiaryColor: "#444444",
    completionPercentage: 25,
    rules: DEFAULT_RULES,
    shop: "wheel-of-wonders", // Default shop name
  });

  // Store for all campaigns - initialize with sample data
  const [allCampaigns, setAllCampaigns] = useState(SAMPLE_CAMPAIGNS);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to safely parse JSON response
  const safeJsonParse = async (response) => {
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  // Enhanced helper function to get shop info from various sources
  const getShopFromSources = () => {
    try {
      // Try to get from URL params first
      const urlParams = new URLSearchParams(window.location.search);
      let shop = urlParams.get("shop");

      if (shop) {
        return shop;
      }

      // Try to get from URL hash (for embedded apps)
      try {
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          shop = hashParams.get("shop");
          if (shop) {
            return shop;
          }
        }
      } catch (e) {
        // Silent error handling
      }

      // Try to get from localStorage
      try {
        shop = localStorage.getItem("shopify_shop_domain");
        if (shop) {
          return shop;
        }
      } catch (e) {
        // Silent error handling
      }

      // Try to get from global window object
      if (window.shopOrigin) {
        shop = window.shopOrigin;
        return shop;
      }

      // Try to get from Shopify App Bridge (if available)
      try {
        if (
          window.shopify &&
          window.shopify.config &&
          window.shopify.config.shop
        ) {
          shop = window.shopify.config.shop;
          return shop;
        }
      } catch (e) {
        // Silent error handling
      }

      // Try to extract from current URL hostname
      const hostname = window.location.hostname;
      if (hostname.includes(".myshopify.com")) {
        shop = hostname;
        return shop;
      }

      // Try to extract from referrer
      try {
        const referrer = document.referrer;
        if (referrer && referrer.includes(".myshopify.com")) {
          const referrerUrl = new URL(referrer);
          if (referrerUrl.hostname.includes(".myshopify.com")) {
            shop = referrerUrl.hostname;
            return shop;
          }
        }
      } catch (e) {
        // Silent error handling
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  // Get shop information with enhanced error handling and authentication
  useEffect(() => {
    const getShopInfo = async () => {
      try {
        // First try to get shop from client-side sources
        const clientShop = getShopFromSources();
        if (clientShop) {
          const formattedName = clientShop.replace(/\.myshopify\.com$/i, "");
          setShopInfo({
            name: clientShop,
            formatted: formattedName,
          });

          // Store in localStorage for future use
          try {
            localStorage.setItem("shopify_shop_domain", clientShop);
          } catch (e) {
            // Silent error handling
          }

          // Update campaign data with shop name
          setCampaignData((prev) => ({
            ...prev,
            shop: clientShop,
          }));
        }

        // Try to fetch shop info from app route with better authentication
        try {
          const response = await fetch("/", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await safeJsonParse(response);

            if (data && data.shop) {
              const shopName = data.shop;
              const formattedName = shopName.replace(/\.myshopify\.com$/i, "");

              setShopInfo({
                name: shopName,
                formatted: formattedName,
              });

              // Store in localStorage
              try {
                localStorage.setItem("shopify_shop_domain", shopName);
              } catch (e) {
                // Silent error handling
              }

              // Update campaign data with shop name
              setCampaignData((prev) => ({
                ...prev,
                shop: shopName,
              }));

              setIsOfflineMode(false);
              return; // Success, exit early
            }
          } else if (response.status === 401) {
            // Don't set offline mode for auth issues, just continue with fallbacks
          }
        } catch (fetchError) {
          // Silent error handling
        }

        // Try fallback to db-status endpoint
        try {
          const statusResponse = await fetch("/api/db-status", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (statusResponse.ok) {
            const statusData = await safeJsonParse(statusResponse);
            if (statusData && statusData.shop) {
              const shopName = statusData.shop;
              const formattedName = shopName.replace(/\.myshopify\.com$/i, "");

              setShopInfo({
                name: shopName,
                formatted: formattedName,
              });

              // Store in localStorage
              try {
                localStorage.setItem("shopify_shop_domain", shopName);
              } catch (e) {
                // Silent error handling
              }

              // Update campaign data with shop name
              setCampaignData((prev) => ({
                ...prev,
                shop: shopName,
              }));

              setIsOfflineMode(false);
              return; // Success with fallback
            }
          }
        } catch (fallbackError) {
          // Silent error handling
        }

        // If we have client-side shop info, don't set offline mode
        if (clientShop) {
          setIsOfflineMode(false);
        } else {
          setIsOfflineMode(true);
        }
      } catch (error) {
        // Check if we have any shop info from client sources
        const clientShop = getShopFromSources();
        if (clientShop) {
          const formattedName = clientShop.replace(/\.myshopify\.com$/i, "");
          setShopInfo({
            name: clientShop,
            formatted: formattedName,
          });
          setCampaignData((prev) => ({
            ...prev,
            shop: clientShop,
          }));
          setIsOfflineMode(false);
        } else {
          setIsOfflineMode(true);
        }
      }
    };

    getShopInfo();
  }, []);

  // Check database connection with better error handling
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await fetch("/api/db-status", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await safeJsonParse(response);

        if (!data) {
          throw new Error("Invalid JSON response from db-status");
        }

        setDbStatus({
          connected: data.connected,
          checking: false,
          error: data.error,
          dbName: data.dbName,
          shop: data.shop,
        });

        // Update shop info if available
        if (data.shop) {
          const formattedName = data.shop.replace(/\.myshopify\.com$/i, "");
          setShopInfo({
            name: data.shop,
            formatted: formattedName,
          });

          // Store in localStorage
          try {
            localStorage.setItem("shopify_shop_domain", data.shop);
          } catch (e) {
            // Silent error handling
          }

          // Update campaign data with shop name
          setCampaignData((prev) => ({
            ...prev,
            shop: data.shop,
          }));
        }
      } catch (error) {
        setDbStatus({
          connected: false,
          checking: false,
          error: error.message,
        });
      }
    };

    checkDbConnection();
  }, []);

  // Load campaigns from MongoDB if connected
  useEffect(() => {
    const loadCampaigns = async () => {
      // Skip if still checking connection or not connected
      if (dbStatus.checking || !dbStatus.connected) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch("/api/campaigns", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await safeJsonParse(response);

        if (!data) {
          throw new Error("Invalid JSON response from campaigns API");
        }

        const campaigns = data.campaigns || data;

        if (Array.isArray(campaigns) && campaigns.length > 0) {
          setAllCampaigns(campaigns);

          // Update shop info if available in response
          if (data.shop) {
            const formattedName = data.shop.replace(/\.myshopify\.com$/i, "");
            setShopInfo({
              name: data.shop,
              formatted: formattedName,
            });
          }
        }
      } catch (error) {
        // Silent error handling - don't show toast for loading errors
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [dbStatus]);

  // Update campaign data
  const updateCampaignData = useCallback((newData) => {
    setCampaignData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  // Update campaign name
  const updateCampaignName = useCallback((name) => {
    setCampaignData((prevData) => ({
      ...prevData,
      name: name,
    }));
    toast.success("Campaign name updated!");
  }, []);

  // Update look selection
  const updateLook = useCallback((look) => {
    setCampaignData((prevData) => ({
      ...prevData,
      look,
    }));
    toast.success(`Look updated to ${look}!`);
  }, []);

  // Update color selection
  const updateColor = useCallback((color) => {
    setCampaignData((prevData) => ({
      ...prevData,
      color,
    }));
    toast.success(`Color type updated to ${color}!`);
  }, []);

  // Update color values
  const updateColorValues = useCallback((colorType, value) => {
    setCampaignData((prevData) => {
      const updatedData = { ...prevData };

      if (colorType === "primary") {
        updatedData.primaryColor = value;
      } else if (colorType === "secondary") {
        updatedData.secondaryColor = value;
      } else if (colorType === "tertiary") {
        updatedData.tertiaryColor = value;
      }

      return updatedData;
    });
    toast.success(`${colorType} color updated!`);
  }, []);

  // Update campaign rules
  const updateCampaignRules = useCallback((ruleType, ruleData) => {
    setCampaignData((prevData) => {
      // Make sure we have a rules object
      const currentRules = prevData.rules || {};

      // Create a deep copy of the current rules for this type
      const currentTypeRules = currentRules[ruleType]
        ? { ...currentRules[ruleType] }
        : {};

      // Create updated rules by merging the current rules with the new data
      const updatedRules = {
        ...currentRules,
        [ruleType]: {
          ...currentTypeRules,
          ...ruleData,
        },
      };

      return {
        ...prevData,
        rules: updatedRules,
      };
    });
  }, []);

  // Toggle rule enabled state
  const toggleRuleEnabled = useCallback((ruleType, subRuleType = null) => {
    setCampaignData((prevData) => {
      const updatedRules = { ...prevData.rules };

      if (subRuleType) {
        updatedRules[ruleType] = {
          ...updatedRules[ruleType],
          [subRuleType]: {
            ...updatedRules[ruleType][subRuleType],
            enabled: !updatedRules[ruleType][subRuleType].enabled,
          },
        };
      } else {
        updatedRules[ruleType] = {
          ...updatedRules[ruleType],
          enabled: !updatedRules[ruleType].enabled,
        };
      }

      return {
        ...prevData,
        rules: updatedRules,
      };
    });

    const ruleName = subRuleType || ruleType;
    toast.success(
      `${ruleName.charAt(0).toUpperCase() + ruleName.slice(1)} ${subRuleType ? "rule" : ""} toggled!`,
    );
  }, []);

  // Update rule value
  const updateRuleValue = useCallback((ruleType, subRuleType, field, value) => {
    setCampaignData((prevData) => {
      const updatedRules = { ...prevData.rules };

      updatedRules[ruleType] = {
        ...updatedRules[ruleType],
        [subRuleType]: {
          ...updatedRules[ruleType][subRuleType],
          [field]: value,
        },
      };

      return {
        ...prevData,
        rules: updatedRules,
      };
    });
  }, []);

  // Add URL to page targeting
  const addPageTargetingUrl = useCallback((url) => {
    if (!url) return;

    setCampaignData((prevData) => {
      if (prevData.rules.pageTargeting.urls.includes(url)) {
        return prevData;
      }

      const updatedPageTargeting = {
        ...prevData.rules.pageTargeting,
        urls: [...prevData.rules.pageTargeting.urls, url],
      };

      return {
        ...prevData,
        rules: {
          ...prevData.rules,
          pageTargeting: updatedPageTargeting,
        },
      };
    });

    toast.success(`URL "${url}" added to page targeting!`);
  }, []);

  // Remove URL from page targeting
  const removePageTargetingUrl = useCallback((url) => {
    setCampaignData((prevData) => {
      const updatedUrls = prevData.rules.pageTargeting.urls.filter(
        (u) => u !== url,
      );

      return {
        ...prevData,
        rules: {
          ...prevData.rules,
          pageTargeting: {
            ...prevData.rules.pageTargeting,
            urls: updatedUrls,
          },
        },
      };
    });

    toast.success(`URL "${url}" removed from page targeting!`);
  }, []);

  // Move to next step
  const nextStep = useCallback(() => {
    setCampaignData((prevData) => {
      const newStep = Math.min(4, prevData.step + 1);
      const newPercentage = Math.min(100, (newStep / 4) * 100);

      return {
        ...prevData,
        step: newStep,
        completionPercentage: newPercentage,
      };
    });
    toast.success("Moving to next step!");
  }, []);

  // Move to previous step
  const prevStep = useCallback(() => {
    setCampaignData((prevData) => {
      const newStep = Math.max(1, prevData.step - 1);
      const newPercentage = Math.max(25, (newStep / 4) * 100);

      return {
        ...prevData,
        step: newStep,
        completionPercentage: newPercentage,
      };
    });
    toast.success("Moving to previous step!");
  }, []);

  // Check if user can create more campaigns
  const checkCanCreateCampaign = useCallback(() => {
    return allCampaigns.length < currentPlan.campaignLimit;
  }, [allCampaigns.length, currentPlan.campaignLimit]);

  // Helper function to deactivate all campaigns except the specified one
  const deactivateOtherCampaigns = useCallback(
    async (activeId) => {
      // Get all other active campaigns
      const otherActiveCampaigns = allCampaigns.filter(
        (campaign) => campaign.id !== activeId && campaign.status === "active",
      );

      if (otherActiveCampaigns.length === 0) {
        return; // No other active campaigns to deactivate
      }

      // Update in database if connected
      if (dbStatus.connected) {
        for (const campaign of otherActiveCampaigns) {
          try {
            await fetch(`/api/campaigns/${campaign.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ ...campaign, status: "draft" }),
            });
          } catch (error) {
            // Silent error handling
          }
        }
      }

      // Update local state
      setAllCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id !== activeId && campaign.status === "active"
            ? { ...campaign, status: "draft" }
            : campaign,
        ),
      );

      // Show toast notification
      if (otherActiveCampaigns.length > 0) {
        toast.success(
          `Deactivated ${otherActiveCampaigns.length} other campaign(s)`,
        );
      }
    },
    [allCampaigns, dbStatus.connected],
  );

  // Save campaign
  const saveCampaign = useCallback(
    async (campaign) => {
      let campaignWithId;
      try {
        // Ensure we have all required fields
        campaignWithId = {
          ...campaign,
          id: campaign.id || `campaign-${Date.now()}`,
          name: campaign.name,
          createdAt: campaign.createdAt || new Date().toISOString(),
          status: campaign.status || "draft",
          primaryColor: campaign.primaryColor || "#fe5300",
          secondaryColor: campaign.secondaryColor || "#767676",
          tertiaryColor: campaign.tertiaryColor || "#444444",
          look: campaign.look || "custom",
          color: campaign.color || "singleTone",
          rules: campaign.rules ||
            campaignData.rules || {
              appearingRules: {
                exitIntent: { enabled: true, device: "desktop" },
                timeDelay: { enabled: true, seconds: 5 },
                pageScroll: { enabled: true, percentage: 20 },
                pageCount: { enabled: false, pages: 2 },
                clicksCount: { enabled: false, clicks: 2 },
                inactivity: { enabled: false, seconds: 30 },
              },
              pageTargeting: {
                enabled: true,
                url: "www.yourdomain.com",
                urls: [],
              },
              popupAgain: {
                enabled: true,
                timer: { minutes: 10, seconds: 0 },
              },
              displayFrequency: {
                enabled: true,
                frequency: "once_a_day",
                visitorType: "everyone",
              },
            },
          shop:
            shopInfo.name || campaign.shop || "wheel-of-wonders.myshopify.com",
        };

        // If this campaign is being set to active, deactivate all other campaigns
        if (campaignWithId.status === "active") {
          await deactivateOtherCampaigns(campaignWithId.id);
        }

        // Only try to save to MongoDB if connected
        if (dbStatus.connected) {
          const existingIndex = allCampaigns.findIndex(
            (c) => c.id === campaignWithId.id,
          );

          if (existingIndex >= 0) {
            // Update existing campaign
            const response = await fetch(
              `/api/campaigns/${campaignWithId.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(campaignWithId),
              },
            );

            if (!response.ok) {
              throw new Error(
                `Failed to update campaign: ${response.statusText}`,
              );
            }

            const updatedCampaign = await response.json();

            // Update shop info if available in response
            if (updatedCampaign.shop) {
              const formattedName = updatedCampaign.shop.replace(
                /\.myshopify\.com$/i,
                "",
              );
              setShopInfo({
                name: updatedCampaign.shop,
                formatted: formattedName,
              });
            }
          } else {
            // Create new campaign
            const response = await fetch("/api/campaigns", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(campaignWithId),
            });

            if (!response.ok) {
              throw new Error(
                `Failed to create campaign: ${response.statusText}`,
              );
            }

            const newCampaign = await response.json();

            // Update shop info if available in response
            if (newCampaign.shop) {
              const formattedName = newCampaign.shop.replace(
                /\.myshopify\.com$/i,
                "",
              );
              setShopInfo({
                name: newCampaign.shop,
                formatted: formattedName,
              });
            }
          }
        }

        // Update local state
        setAllCampaigns((prev) => {
          const existingIndex = prev.findIndex(
            (c) => c.id === campaignWithId.id,
          );

          if (existingIndex >= 0) {
            // Update existing campaign
            return prev.map((c) =>
              c.id === campaignWithId.id ? campaignWithId : c,
            );
          } else {
            // Add new campaign
            return [...prev, campaignWithId];
          }
        });

        // Also update the current campaign data
        setCampaignData((prevData) => ({
          ...prevData,
          ...campaignWithId,
        }));

        // If campaign is active, immediately sync to metafields
        if (campaignWithId.status === "active") {
          try {
            const syncResponse = await fetchWithAuth(
              "/sync-campaign-metafields",
              {
                method: "POST",
                body: JSON.stringify({ campaignId: campaignWithId.id }),

                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            if (syncResponse.ok) {
              toast.success("Campaign saved and synced to storefront!");
            } else {
              toast.success(
                "Campaign saved! Sync to storefront may take a moment.",
              );
            }
          } catch (syncError) {
            toast.success(
              "Campaign saved! Sync to storefront may take a moment.",
            );
          }
        } else {
          toast.success("Campaign saved successfully!");
        }

        return campaignWithId;
      } catch (error) {
        toast.error(`Failed to save campaign: ${error.message}`);

        // Still update local state even if MongoDB save fails
        const existingIndex = allCampaigns.findIndex(
          (c) => c.id === campaignWithId.id,
        );
        setAllCampaigns((prev) => {
          if (existingIndex >= 0) {
            return prev.map((c) =>
              c.id === campaignWithId.id ? campaignWithId : c,
            );
          } else {
            return [...prev, campaignWithId];
          }
        });

        return campaignWithId;
      }
    },
    [
      allCampaigns,
      campaignData.rules,
      dbStatus.connected,
      shopInfo.name,
      deactivateOtherCampaigns,
    ],
  );

  // Delete campaign
  const deleteCampaign = useCallback(
    async (campaignId) => {
      try {
        // Only try to delete from MongoDB if connected
        if (dbStatus.connected) {
          const response = await fetch(`/api/campaigns/${campaignId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(
              `Failed to delete campaign: ${response.statusText}`,
            );
          }
        }

        // Update local state
        setAllCampaigns((prev) =>
          prev.filter((campaign) => campaign.id !== campaignId),
        );

        toast.success("Campaign deleted successfully!");
        return { success: true };
      } catch (error) {
        toast.error(`Failed to delete campaign: ${error.message}`);

        // Still update local state even if MongoDB delete fails
        setAllCampaigns((prev) =>
          prev.filter((campaign) => campaign.id !== campaignId),
        );
        return { success: true };
      }
    },
    [dbStatus.connected],
  );

  // Toggle campaign status
  const toggleCampaignStatus = useCallback(
    async (campaignId) => {
      try {
        const campaign = allCampaigns.find((c) => c.id === campaignId);
        if (!campaign) {
          throw new Error("Campaign not found");
        }

        const newStatus = campaign.status === "active" ? "draft" : "active";

        // If activating a campaign, deactivate all others first
        if (newStatus === "active") {
          await deactivateOtherCampaigns(campaignId);
        }

        // Update the campaign status in database if connected
        if (dbStatus.connected) {
          // Use POST instead of PATCH and use FormData
          const formData = new FormData();
          formData.append("status", newStatus);
          formData.append("shop", shopInfo.name || "");

          const response = await fetch(`/api/campaigns/status/${campaignId}`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(
              `Failed to toggle campaign status: ${response.statusText}`,
            );
          }
        }

        // Update local state for the toggled campaign
        setAllCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaignId ? { ...c, status: newStatus } : c,
          ),
        );

        console.log("activated new campaign", newStatus, campaignId);

        // Immediately sync the active campaign to metafields for theme extension
        if (newStatus === "active") {
          try {
            const syncResponse = await fetch("/api/sync-campaign-metafields", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ campaignId: campaignId }),
            });

            if (syncResponse.ok) {
              toast.success("Campaign activated and synced to storefront!");
              // console.log("syncing campaign metafields: ",syncResponse);
              // window.location.reload();
            } else {
              console.log("RELOADING PAGE not ok", syncResponse);

              // navigate("/");

              toast.success(
                "Campaign activated! Sync to storefront may take a moment.",
              );
            }
          } catch (syncError) {
            console.log("RELOADING PAGE", syncError);
            // window.location.reload();
            toast.success(
              "Campaign activated! Sync to storefront may take a moment.",
            );
          }
        } else {
          // If deactivating, clear metafields
          try {
            const clearResponse = await fetch("/api/sync-campaign-metafields", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ campaignId: null, clear: true }),
            });

            if (clearResponse.ok) {
              toast.success(
                "Campaign deactivated and removed from storefront!",
              );
            } else {
              toast.success("Campaign deactivated!");
            }
          } catch (clearError) {
            toast.success("Campaign deactivated!");
          }
        }

        return { success: true, status: newStatus };
      } catch (error) {
        toast.error(`Failed to toggle campaign status: ${error.message}`);

        // Still update local state even if API calls fail
        const campaign = allCampaigns.find((c) => c.id === campaignId);
        if (campaign) {
          const newStatus = campaign.status === "active" ? "draft" : "active";

          // If activating, deactivate all others in local state
          if (newStatus === "active") {
            setAllCampaigns((prev) =>
              prev.map((c) => {
                if (c.id === campaignId) {
                  return { ...c, status: newStatus };
                } else if (c.status === "active") {
                  return { ...c, status: "draft" };
                }
                return c;
              }),
            );
          } else {
            setAllCampaigns((prev) =>
              prev.map((c) =>
                c.id === campaignId ? { ...c, status: newStatus } : c,
              ),
            );
          }

          return { success: true, status: newStatus };
        }

        return { success: false };
      }
    },
    [allCampaigns, dbStatus.connected, deactivateOtherCampaigns, shopInfo.name],
  );

  // Get active campaign
  const getActiveCampaign = useCallback(() => {
    return (
      allCampaigns.find((campaign) => campaign.status === "active") || null
    );
  }, [allCampaigns]);

  return (
    <CampaignContext.Provider
      value={{
        campaignData,
        allCampaigns,
        isLoading,
        dbStatus,
        shopInfo,
        isOfflineMode,
        updateCampaignData,
        updateCampaignName,
        updateLook,
        updateColor,
        updateColorValues,
        updateCampaignRules,
        toggleRuleEnabled,
        updateRuleValue,
        addPageTargetingUrl,
        removePageTargetingUrl,
        nextStep,
        prevStep,
        saveCampaign,
        deleteCampaign,
        toggleCampaignStatus,
        checkCanCreateCampaign,
        getActiveCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

// Custom hook to use campaign context
export function useCampaign() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
}

export const useCampaignContext = useCampaign;
