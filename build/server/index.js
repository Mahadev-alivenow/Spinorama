var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, useActionData, Form, useLocation, Link, useNavigate, useParams, useSearchParams, useNavigation, useFetcher } from "@remix-run/react";
import { createReadableStreamFromReadable, json, redirect } from "@remix-run/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApp, BillingInterval, AppDistribution, ApiVersion, LoginErrorType } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { toast, Toaster } from "react-hot-toast";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { MongoClient, ObjectId } from "mongodb";
import { AppProvider, Page as Page$5, Card, FormLayout, Text, TextField, Button, TopBar, Navigation as Navigation$1, Frame, useBreakpoints, BlockStack, Layout, InlineStack, Tabs, Icon, Popover, Box, Select, Tag, DataTable, Pagination, EmptyState, Modal, Avatar, Badge, Link as Link$1, List } from "@shopify/polaris";
import { useNavigate as useNavigate$1 } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";
import { NotificationIcon, HomeIcon, ConfettiIcon, PersonIcon, FinanceIcon, AppsIcon, SettingsFilledIcon, ImportIcon, ExportIcon, SearchIcon, PlusIcon, FilterIcon, SortIcon, OrderIcon, ChartVerticalIcon, PageIcon } from "@shopify/polaris-icons";
if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}
const prisma = global.prismaGlobal ?? new PrismaClient();
const BILLING_PLANS = {
  MONTHLY: "Monthly Plan",
  ANNUAL: "Annual Plan"
};
const MONTLY_PLAN = "Monthly Subscription";
const ANNUAL_PLAN = "Annual Subscription";
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: (_a = process.env.SCOPES) == null ? void 0 : _a.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  // billing: {
  //   [BILLING_PLANS.MONTHLY]: {
  //     amount: 5,
  //     currencyCode: "USD",
  //     interval: BillingInterval.Every30Days,
  //     name: "Monthly Subscription",
  //     price: 0,
  //     test: true,
  //     trialDays: 14,
  //     trialAmount: 0,
  //     trialCurrencyCode: "USD",
  //     trialInterval: BillingInterval.Every30Days,
  //     trialName: "Monthly Subscription Trial",
  //   },
  //   [BILLING_PLANS.ANNUAL]: {
  //     amount: 50,
  //     currencyCode: "USD",
  //     interval: BillingInterval.Annual,
  //     name: "Annual Subscription",
  //     price: 0,
  //     test: true,
  //     trialAmount: 0,
  //     trialCurrencyCode: "USD",
  //     trialInterval: BillingInterval.Annual,
  //     trialName: "Annual Subscription Trial",
  //     trialDays: 14,
  //   },
  // },
  billing: {
    [MONTLY_PLAN]: {
      amount: 5,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days,
      name: "Monthly Subscription",
      price: 0,
      test: true,
      trialDays: 14,
      trialAmount: 0,
      trialCurrencyCode: "USD",
      trialInterval: BillingInterval.Every30Days,
      trialName: "Monthly Subscription Trial"
    },
    [ANNUAL_PLAN]: {
      amount: 50,
      currencyCode: "USD",
      interval: BillingInterval.Annual,
      name: "Annual Subscription",
      price: 0,
      test: true,
      trialAmount: 0,
      trialCurrencyCode: "USD",
      trialInterval: BillingInterval.Annual,
      trialName: "Annual Subscription Trial",
      trialDays: 14
    }
  },
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks"
    },
    APP_SUBSCRIPTIONS_UPDATE: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks"
    },
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks"
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks"
    },
    SHOP_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks"
    }
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    }
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true
  },
  // Fix X-Frame-Options issues by ensuring proper embedded app handling
  isEmbeddedApp: true,
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
function isClientSideNavigation(request) {
  const purpose = request.headers.get("purpose");
  const fetchDest = request.headers.get("sec-fetch-dest");
  const fetchMode = request.headers.get("sec-fetch-mode");
  return purpose === "prefetch" || fetchDest === "empty" || fetchMode === "navigate" || request.headers.get("x-remix-transition") === "true";
}
async function authenticateWithFallback(request) {
  try {
    const result = await shopify.authenticate.admin(request);
    return { success: true, ...result };
  } catch (error) {
    console.log("Authentication failed:", (error == null ? void 0 : error.message) || "Unknown error");
    if (isClientSideNavigation(request)) {
      console.log("Client-side navigation detected, providing fallback");
      const url = new URL(request.url);
      const shop = url.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain") || "unknown-shop";
      return {
        success: false,
        fallback: true,
        shop,
        error
      };
    }
    throw error;
  }
}
ApiVersion.January25;
const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const shopify_server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ANNUAL_PLAN,
  MONTLY_PLAN,
  addDocumentResponseHeaders,
  authenticate,
  authenticateWithFallback,
  isClientSideNavigation,
  login
}, Symbol.toStringTag, { value: "Module" }));
const streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const PlanContext = createContext(null);
const PLANS = {
  starter: {
    id: "starter",
    name: "Standard",
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    campaignLimit: 20,
    features: [
      "Show on specific pages",
      "Up to 500 Spins/Month",
      "Basic Analytics",
      "Email Support",
      "20 Campaign"
    ],
    popular: false
  },
  lite: {
    id: "lite",
    name: "Lite",
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    campaignLimit: 5,
    features: [
      "Upto 300 impressions",
      "Multiple campaigns",
      "Show on specific pages",
      "A/B testing",
      "Conversion Booster"
    ],
    popular: true
  },
  premium: {
    id: "premium",
    name: "Premium",
    monthlyPrice: 40,
    yearlyPrice: 400,
    campaignLimit: 20,
    features: [
      "Upto 300 impressions",
      "Multiple campaigns",
      "Show on specific pages",
      "A/B testing",
      "Conversion Booster",
      "Priority Support",
      "Custom Branding"
    ],
    popular: false
  }
};
function PlanProvider({ children, initialDiscountCodes = [] }) {
  const [discountCodes, setDiscountCodes] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
        if (storedCodes) {
          const parsedCodes = JSON.parse(storedCodes);
          if (parsedCodes && parsedCodes.length > 0) {
            console.log(
              "PlanProvider - Using localStorage discount codes:",
              parsedCodes.length
            );
            return parsedCodes;
          }
        }
      } catch (e) {
        console.error("Error parsing stored discount codes:", e);
      }
    }
    if (typeof window !== "undefined" && window.GLOBAL_DISCOUNT_CODES && window.GLOBAL_DISCOUNT_CODES.length > 0) {
      console.log(
        "PlanProvider - Using global discount codes:",
        window.GLOBAL_DISCOUNT_CODES.length
      );
      return window.GLOBAL_DISCOUNT_CODES;
    }
    console.log(
      "PlanProvider - Using initial discount codes:",
      initialDiscountCodes
    );
    return initialDiscountCodes;
  });
  console.log("PlanProvider initialized with discount codes:", discountCodes);
  useEffect(() => {
    if (discountCodes.length === 0) {
      if (typeof window !== "undefined") {
        try {
          const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
          if (storedCodes) {
            const parsedCodes = JSON.parse(storedCodes);
            if (parsedCodes && parsedCodes.length > 0) {
              console.log(
                "PlanProvider - Updating from localStorage:",
                parsedCodes.length
              );
              setDiscountCodes(parsedCodes);
              return;
            }
          }
        } catch (e) {
          console.error("Error parsing stored discount codes:", e);
        }
        if (window.GLOBAL_DISCOUNT_CODES && window.GLOBAL_DISCOUNT_CODES.length > 0) {
          console.log(
            "PlanProvider - Updating from global:",
            window.GLOBAL_DISCOUNT_CODES.length
          );
          setDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
          return;
        }
      }
      if (initialDiscountCodes && initialDiscountCodes.length > 0) {
        console.log(
          "PlanProvider - Updating from initial props:",
          initialDiscountCodes.length
        );
        setDiscountCodes(initialDiscountCodes);
      }
    }
  }, [initialDiscountCodes, discountCodes.length]);
  const fetchAndSetDiscountCodes = async () => {
    try {
      console.log("PlanProvider - Fetching discount codes from API...");
      const response = await fetch("/api/discount-codes");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch discount codes: ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.success && data.codes && data.codes.length > 0) {
        console.log("PlanProvider - Successfully fetched codes:", data.codes);
        setDiscountCodes(data.codes);
        if (typeof window !== "undefined") {
          window.GLOBAL_DISCOUNT_CODES = data.codes;
          try {
            localStorage.setItem(
              "GLOBAL_DISCOUNT_CODES",
              JSON.stringify(data.codes)
            );
          } catch (e) {
            console.error("Failed to store discount codes in localStorage:", e);
          }
        }
        return data.codes;
      } else {
        if (discountCodes.length > 0) {
          console.log(
            "PlanProvider - API returned no codes, using existing codes:",
            discountCodes.length
          );
          return discountCodes;
        }
        throw new Error(data.error || "No discount codes available");
      }
    } catch (error) {
      console.error("PlanProvider - Error fetching discount codes:", error);
      if (discountCodes.length > 0) {
        console.log(
          "PlanProvider - Fetch failed, using existing codes:",
          discountCodes.length
        );
        return discountCodes;
      }
      throw error;
    }
  };
  const [currentPlan, setCurrentPlan] = useState(() => {
    if (typeof window !== "undefined") {
      const storedPlan = localStorage.getItem("currentPlan");
      return storedPlan ? JSON.parse(storedPlan) : PLANS.starter;
    }
    return PLANS.starter;
  });
  const [billingCycle, setBillingCycle] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCycle = localStorage.getItem("billingCycle");
      return storedCycle || "monthly";
    }
    return "monthly";
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPlan", JSON.stringify(currentPlan));
    }
  }, [currentPlan]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("billingCycle", billingCycle);
    }
  }, [billingCycle]);
  const changePlan = (planId) => {
    if (PLANS[planId]) {
      setCurrentPlan(PLANS[planId]);
      return true;
    }
    return false;
  };
  const changeBillingCycle = (cycle) => {
    if (cycle === "monthly" || cycle === "yearly") {
      setBillingCycle(cycle);
      return true;
    }
    return false;
  };
  const getPlans = () => {
    return Object.values(PLANS);
  };
  const canCreateCampaign = (campaignCount) => {
    return campaignCount < currentPlan.campaignLimit;
  };
  return /* @__PURE__ */ jsx(
    PlanContext.Provider,
    {
      value: {
        currentPlan,
        billingCycle,
        changePlan,
        changeBillingCycle,
        getPlans,
        canCreateCampaign,
        discountCodes,
        // <-- expose discount codes globally
        setDiscountCodes,
        // <-- allow setting discount codes
        fetchAndSetDiscountCodes,
        // <-- method to fetch codes
        PLANS
      },
      children
    }
  );
}
function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
const CampaignContext = createContext(null);
const SAMPLE_CAMPAIGNS = [];
const DEFAULT_RULES = {
  appearingRules: {
    exitIntent: { enabled: false, device: "desktop" },
    timeDelay: { enabled: false, seconds: 5 },
    pageScroll: { enabled: false, percentage: 20 },
    pageCount: { enabled: false, pages: 2 },
    clicksCount: { enabled: false, clicks: 2 },
    inactivity: { enabled: false, seconds: 30 }
  },
  pageTargeting: {
    enabled: true,
    url: "www.yourdomain.com",
    urls: []
  },
  popupAgain: {
    enabled: true,
    timer: { minutes: 10, seconds: 0 }
  },
  displayFrequency: {
    enabled: true,
    frequency: "once_a_day",
    visitorType: "everyone"
    // everyone, new, return
  }
};
function CampaignProvider({ children }) {
  const { currentPlan } = usePlan();
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    checking: true
  });
  const [shopInfo, setShopInfo] = useState({
    name: "wheel-of-wonders",
    formatted: "wheel-of-wonders"
  });
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [campaignData, setCampaignData] = useState({
    name: "Campaign Name",
    step: 1,
    look: "custom",
    // custom or readyMade
    color: "singleTone",
    // singleTone or dualTone
    primaryColor: "#fe5300",
    secondaryColor: "#767676",
    tertiaryColor: "#444444",
    completionPercentage: 25,
    rules: DEFAULT_RULES,
    shop: "wheel-of-wonders"
    // Default shop name
  });
  const [allCampaigns, setAllCampaigns] = useState(SAMPLE_CAMPAIGNS);
  const [isLoading, setIsLoading] = useState(true);
  const safeJsonParse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Expected JSON but got ${contentType}`);
      return null;
    }
    try {
      return await response.json();
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  };
  const getShopFromSources = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let shop = urlParams.get("shop");
    if (shop) {
      console.log("Got shop from URL params:", shop);
      return shop;
    }
    try {
      shop = localStorage.getItem("shopify_shop_domain");
      if (shop) {
        console.log("Got shop from localStorage:", shop);
        return shop;
      }
    } catch (e) {
      console.warn("Could not access localStorage");
    }
    if (window.shopOrigin) {
      shop = window.shopOrigin;
      console.log("Got shop from window.shopOrigin:", shop);
      return shop;
    }
    const hostname = window.location.hostname;
    if (hostname.includes(".myshopify.com")) {
      shop = hostname;
      console.log("Got shop from hostname:", shop);
      return shop;
    }
    return null;
  };
  useEffect(() => {
    const getShopInfo = async () => {
      try {
        const clientShop = getShopFromSources();
        if (clientShop) {
          const formattedName = clientShop.replace(/\.myshopify\.com$/i, "");
          setShopInfo({
            name: clientShop,
            formatted: formattedName
          });
          try {
            localStorage.setItem("shopify_shop_domain", clientShop);
          } catch (e) {
            console.warn("Could not store shop in localStorage");
          }
        }
        console.log("Attempting to fetch shop info from /app...");
        const response = await fetch("/app", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          console.warn("App route returned non-OK status:", response.status);
          setIsOfflineMode(true);
          return;
        }
        const data = await safeJsonParse(response);
        if (data && data.shop) {
          const shopName = data.shop;
          const formattedName = shopName.replace(/\.myshopify\.com$/i, "");
          console.log("Got shop name from /app:", shopName);
          setShopInfo({
            name: shopName,
            formatted: formattedName
          });
          try {
            localStorage.setItem("shopify_shop_domain", shopName);
          } catch (e) {
            console.warn("Could not store shop in localStorage");
          }
          setCampaignData((prev) => ({
            ...prev,
            shop: shopName
          }));
          setIsOfflineMode(false);
        } else {
          console.warn("No shop data in response from /app");
          setIsOfflineMode(true);
        }
      } catch (error) {
        console.warn("Error getting shop info from /app:", error.message);
        setIsOfflineMode(true);
        try {
          console.log("Trying fallback to /api/db-status...");
          const statusResponse = await fetch("/api/db-status", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          });
          if (statusResponse.ok) {
            const statusData = await safeJsonParse(statusResponse);
            if (statusData && statusData.shop) {
              const shopName = statusData.shop;
              const formattedName = shopName.replace(/\.myshopify\.com$/i, "");
              console.log("Got shop name from db-status:", shopName);
              setShopInfo({
                name: shopName,
                formatted: formattedName
              });
              try {
                localStorage.setItem("shopify_shop_domain", shopName);
              } catch (e) {
                console.warn("Could not store shop in localStorage");
              }
              setCampaignData((prev) => ({
                ...prev,
                shop: shopName
              }));
              setIsOfflineMode(false);
            }
          }
        } catch (fallbackError) {
          console.warn(
            "Fallback to db-status also failed:",
            fallbackError.message
          );
        }
      }
    };
    getShopInfo();
  }, []);
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        console.log("Checking database connection...");
        const response = await fetch("/api/db-status", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
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
          shop: data.shop
        });
        if (data.shop) {
          const formattedName = data.shop.replace(/\.myshopify\.com$/i, "");
          setShopInfo({
            name: data.shop,
            formatted: formattedName
          });
          try {
            localStorage.setItem("shopify_shop_domain", data.shop);
          } catch (e) {
            console.warn("Could not store shop in localStorage");
          }
          setCampaignData((prev) => ({
            ...prev,
            shop: data.shop
          }));
        }
        if (data.connected) {
          console.log(
            `MongoDB connected successfully to database: ${data.dbName}`
          );
        } else {
          console.error("MongoDB connection failed:", data.error);
        }
      } catch (error) {
        console.error("Error checking DB connection:", error);
        setDbStatus({
          connected: false,
          checking: false,
          error: error.message
        });
      }
    };
    checkDbConnection();
  }, []);
  useEffect(() => {
    const loadCampaigns = async () => {
      if (dbStatus.checking || !dbStatus.connected) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        console.log("Loading campaigns from API...");
        const response = await fetch("/api/campaigns", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
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
          console.log(
            `Loaded ${campaigns.length} campaigns from MongoDB (${dbStatus.dbName})`
          );
          if (data.shop) {
            const formattedName = data.shop.replace(/\.myshopify\.com$/i, "");
            setShopInfo({
              name: data.shop,
              formatted: formattedName
            });
          }
        } else {
          console.log(
            `No campaigns found in MongoDB (${dbStatus.dbName}), using sample data`
          );
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaigns();
  }, [dbStatus]);
  const updateCampaignData = useCallback((newData) => {
    setCampaignData((prevData) => ({ ...prevData, ...newData }));
  }, []);
  const updateCampaignName = useCallback((name) => {
    setCampaignData((prevData) => ({
      ...prevData,
      name: name || "Campaign Name"
    }));
    toast.success("Campaign name updated!");
  }, []);
  const updateLook = useCallback((look) => {
    setCampaignData((prevData) => ({
      ...prevData,
      look
    }));
    toast.success(`Look updated to ${look}!`);
  }, []);
  const updateColor = useCallback((color) => {
    setCampaignData((prevData) => ({
      ...prevData,
      color
    }));
    toast.success(`Color type updated to ${color}!`);
  }, []);
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
  const updateCampaignRules = useCallback((ruleType, ruleData) => {
    console.log(`Updating campaign rules: ${ruleType}`, ruleData);
    setCampaignData((prevData) => {
      const currentRules = prevData.rules || {};
      const currentTypeRules = currentRules[ruleType] ? { ...currentRules[ruleType] } : {};
      const updatedRules = {
        ...currentRules,
        [ruleType]: {
          ...currentTypeRules,
          ...ruleData
        }
      };
      console.log("Updated rules:", updatedRules);
      return {
        ...prevData,
        rules: updatedRules
      };
    });
  }, []);
  const toggleRuleEnabled = useCallback((ruleType, subRuleType = null) => {
    setCampaignData((prevData) => {
      const updatedRules = { ...prevData.rules };
      if (subRuleType) {
        updatedRules[ruleType] = {
          ...updatedRules[ruleType],
          [subRuleType]: {
            ...updatedRules[ruleType][subRuleType],
            enabled: !updatedRules[ruleType][subRuleType].enabled
          }
        };
      } else {
        updatedRules[ruleType] = {
          ...updatedRules[ruleType],
          enabled: !updatedRules[ruleType].enabled
        };
      }
      return {
        ...prevData,
        rules: updatedRules
      };
    });
    const ruleName = subRuleType || ruleType;
    toast.success(
      `${ruleName.charAt(0).toUpperCase() + ruleName.slice(1)} ${subRuleType ? "rule" : ""} toggled!`
    );
  }, []);
  const updateRuleValue = useCallback((ruleType, subRuleType, field, value) => {
    setCampaignData((prevData) => {
      const updatedRules = { ...prevData.rules };
      updatedRules[ruleType] = {
        ...updatedRules[ruleType],
        [subRuleType]: {
          ...updatedRules[ruleType][subRuleType],
          [field]: value
        }
      };
      return {
        ...prevData,
        rules: updatedRules
      };
    });
  }, []);
  const addPageTargetingUrl = useCallback((url) => {
    if (!url) return;
    setCampaignData((prevData) => {
      if (prevData.rules.pageTargeting.urls.includes(url)) {
        return prevData;
      }
      const updatedPageTargeting = {
        ...prevData.rules.pageTargeting,
        urls: [...prevData.rules.pageTargeting.urls, url]
      };
      return {
        ...prevData,
        rules: {
          ...prevData.rules,
          pageTargeting: updatedPageTargeting
        }
      };
    });
    toast.success(`URL "${url}" added to page targeting!`);
  }, []);
  const removePageTargetingUrl = useCallback((url) => {
    setCampaignData((prevData) => {
      const updatedUrls = prevData.rules.pageTargeting.urls.filter(
        (u) => u !== url
      );
      return {
        ...prevData,
        rules: {
          ...prevData.rules,
          pageTargeting: {
            ...prevData.rules.pageTargeting,
            urls: updatedUrls
          }
        }
      };
    });
    toast.success(`URL "${url}" removed from page targeting!`);
  }, []);
  const nextStep = useCallback(() => {
    setCampaignData((prevData) => {
      const newStep = Math.min(4, prevData.step + 1);
      const newPercentage = Math.min(100, newStep / 4 * 100);
      return {
        ...prevData,
        step: newStep,
        completionPercentage: newPercentage
      };
    });
    toast.success("Moving to next step!");
  }, []);
  const prevStep = useCallback(() => {
    setCampaignData((prevData) => {
      const newStep = Math.max(1, prevData.step - 1);
      const newPercentage = Math.max(25, newStep / 4 * 100);
      return {
        ...prevData,
        step: newStep,
        completionPercentage: newPercentage
      };
    });
    toast.success("Moving to previous step!");
  }, []);
  const checkCanCreateCampaign = useCallback(() => {
    return allCampaigns.length < currentPlan.campaignLimit;
  }, [allCampaigns.length, currentPlan.campaignLimit]);
  const deactivateOtherCampaigns = useCallback(
    async (activeId) => {
      const otherActiveCampaigns = allCampaigns.filter(
        (campaign) => campaign.id !== activeId && campaign.status === "active"
      );
      if (otherActiveCampaigns.length === 0) {
        return;
      }
      console.log(
        `Deactivating ${otherActiveCampaigns.length} other active campaigns`
      );
      if (dbStatus.connected) {
        for (const campaign of otherActiveCampaigns) {
          try {
            await fetch(`/api/campaigns/${campaign.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...campaign, status: "draft" })
            });
          } catch (error) {
            console.error(
              `Failed to deactivate campaign ${campaign.id}:`,
              error
            );
          }
        }
      }
      setAllCampaigns(
        (prev) => prev.map(
          (campaign) => campaign.id !== activeId && campaign.status === "active" ? { ...campaign, status: "draft" } : campaign
        )
      );
      if (otherActiveCampaigns.length > 0) {
        toast.success(
          `Deactivated ${otherActiveCampaigns.length} other campaign(s)`
        );
      }
    },
    [allCampaigns, dbStatus.connected]
  );
  const saveCampaign = useCallback(
    async (campaign) => {
      let campaignWithId;
      try {
        console.log("Saving campaign:", campaign);
        campaignWithId = {
          ...campaign,
          id: campaign.id || `campaign-${Date.now()}`,
          name: campaign.name || "Campaign Name",
          createdAt: campaign.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          status: campaign.status || "draft",
          primaryColor: campaign.primaryColor || "#fe5300",
          secondaryColor: campaign.secondaryColor || "#767676",
          tertiaryColor: campaign.tertiaryColor || "#444444",
          look: campaign.look || "custom",
          color: campaign.color || "singleTone",
          rules: campaign.rules || campaignData.rules || {
            appearingRules: {
              exitIntent: { enabled: true, device: "desktop" },
              timeDelay: { enabled: true, seconds: 5 },
              pageScroll: { enabled: true, percentage: 20 },
              pageCount: { enabled: false, pages: 2 },
              clicksCount: { enabled: false, clicks: 2 },
              inactivity: { enabled: false, seconds: 30 }
            },
            pageTargeting: {
              enabled: true,
              url: "www.yourdomain.com",
              urls: []
            },
            popupAgain: {
              enabled: true,
              timer: { minutes: 10, seconds: 0 }
            },
            displayFrequency: {
              enabled: true,
              frequency: "once_a_day",
              visitorType: "everyone"
            }
          },
          shop: shopInfo.name || campaign.shop || "wheel-of-wonders.myshopify.com"
        };
        if (campaignWithId.status === "active") {
          await deactivateOtherCampaigns(campaignWithId.id);
        }
        console.log("Campaign to save with shop info:", campaignWithId);
        if (dbStatus.connected) {
          const existingIndex = allCampaigns.findIndex(
            (c) => c.id === campaignWithId.id
          );
          if (existingIndex >= 0) {
            console.log(
              `Updating existing campaign with ID: ${campaignWithId.id}`
            );
            const response = await fetch(
              `/api/campaigns/${campaignWithId.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(campaignWithId)
              }
            );
            if (!response.ok) {
              throw new Error(
                `Failed to update campaign: ${response.statusText}`
              );
            }
            const updatedCampaign = await response.json();
            console.log("Campaign updated successfully:", updatedCampaign);
            if (updatedCampaign.shop) {
              const formattedName = updatedCampaign.shop.replace(
                /\.myshopify\.com$/i,
                ""
              );
              setShopInfo({
                name: updatedCampaign.shop,
                formatted: formattedName
              });
            }
          } else {
            console.log("Creating new campaign");
            const response = await fetch("/api/campaigns", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(campaignWithId)
            });
            if (!response.ok) {
              throw new Error(
                `Failed to create campaign: ${response.statusText}`
              );
            }
            const newCampaign = await response.json();
            console.log("Campaign created successfully:", newCampaign);
            if (newCampaign.shop) {
              const formattedName = newCampaign.shop.replace(
                /\.myshopify\.com$/i,
                ""
              );
              setShopInfo({
                name: newCampaign.shop,
                formatted: formattedName
              });
            }
          }
        } else {
          console.log("Database not connected, only updating local state");
        }
        setAllCampaigns((prev) => {
          const existingIndex = prev.findIndex(
            (c) => c.id === campaignWithId.id
          );
          if (existingIndex >= 0) {
            return prev.map(
              (c) => c.id === campaignWithId.id ? campaignWithId : c
            );
          } else {
            return [...prev, campaignWithId];
          }
        });
        setCampaignData((prevData) => ({
          ...prevData,
          ...campaignWithId
        }));
        if (campaignWithId.status === "active") {
          try {
            console.log("Syncing saved active campaign to metafields...");
            const syncResponse = await fetch("/api/sync-campaign-metafields", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ campaignId: campaignWithId.id })
            });
            if (syncResponse.ok) {
              const syncData = await syncResponse.json();
              console.log(
                "Campaign synced to metafields successfully:",
                syncData
              );
              toast.success("Campaign saved and synced to storefront!");
            } else {
              console.warn("Failed to sync campaign to metafields");
              toast.success(
                "Campaign saved! Sync to storefront may take a moment."
              );
            }
          } catch (syncError) {
            console.error("Error syncing campaign to metafields:", syncError);
            toast.success(
              "Campaign saved! Sync to storefront may take a moment."
            );
          }
        } else {
          toast.success("Campaign saved successfully!");
        }
        return campaignWithId;
      } catch (error) {
        console.error("Error saving campaign:", error);
        toast.error(`Failed to save campaign: ${error.message}`);
        const existingIndex = allCampaigns.findIndex(
          (c) => c.id === campaignWithId.id
        );
        setAllCampaigns((prev) => {
          if (existingIndex >= 0) {
            return prev.map(
              (c) => c.id === campaignWithId.id ? campaignWithId : c
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
      deactivateOtherCampaigns
    ]
  );
  const deleteCampaign = useCallback(
    async (campaignId) => {
      try {
        if (dbStatus.connected) {
          const response = await fetch(`/api/campaigns/${campaignId}`, {
            method: "DELETE"
          });
          if (!response.ok) {
            throw new Error(
              `Failed to delete campaign: ${response.statusText}`
            );
          }
        }
        setAllCampaigns(
          (prev) => prev.filter((campaign) => campaign.id !== campaignId)
        );
        toast.success("Campaign deleted successfully!");
        return { success: true };
      } catch (error) {
        console.error("Error deleting campaign:", error);
        toast.error(`Failed to delete campaign: ${error.message}`);
        setAllCampaigns(
          (prev) => prev.filter((campaign) => campaign.id !== campaignId)
        );
        return { success: true };
      }
    },
    [dbStatus.connected]
  );
  const toggleCampaignStatus = useCallback(
    async (campaignId) => {
      try {
        const campaign = allCampaigns.find((c) => c.id === campaignId);
        if (!campaign) {
          throw new Error("Campaign not found");
        }
        const newStatus = campaign.status === "active" ? "draft" : "active";
        if (newStatus === "active") {
          await deactivateOtherCampaigns(campaignId);
        }
        if (dbStatus.connected) {
          const formData = new FormData();
          formData.append("status", newStatus);
          formData.append("shop", shopInfo.name || "");
          const response = await fetch(`/api/campaigns/status/${campaignId}`, {
            method: "POST",
            // Changed from PATCH to POST
            body: formData
          });
          if (!response.ok) {
            throw new Error(
              `Failed to toggle campaign status: ${response.statusText}`
            );
          }
        }
        setAllCampaigns(
          (prev) => prev.map(
            (c) => c.id === campaignId ? { ...c, status: newStatus } : c
          )
        );
        if (newStatus === "active") {
          try {
            console.log("Syncing newly activated campaign to metafields...");
            const syncResponse = await fetch("/api/sync-campaign-metafields", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ campaignId })
            });
            if (syncResponse.ok) {
              const syncData = await syncResponse.json();
              console.log(
                "Campaign synced to metafields successfully:",
                syncData
              );
              toast.success("Campaign activated and synced to storefront!");
            } else {
              console.warn("Failed to sync campaign to metafields");
              toast.success(
                "Campaign activated! Sync to storefront may take a moment."
              );
            }
          } catch (syncError) {
            console.error("Error syncing campaign to metafields:", syncError);
            toast.success(
              "Campaign activated! Sync to storefront may take a moment."
            );
          }
        } else {
          try {
            console.log("Clearing metafields for deactivated campaign...");
            const clearResponse = await fetch("/api/sync-campaign-metafields", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ campaignId: null, clear: true })
            });
            if (clearResponse.ok) {
              console.log("Metafields cleared successfully");
              toast.success(
                "Campaign deactivated and removed from storefront!"
              );
            } else {
              console.warn("Failed to clear metafields");
              toast.success("Campaign deactivated!");
            }
          } catch (clearError) {
            console.error("Error clearing metafields:", clearError);
            toast.success("Campaign deactivated!");
          }
        }
        return { success: true, status: newStatus };
      } catch (error) {
        console.error("Error toggling campaign status:", error);
        toast.error(`Failed to toggle campaign status: ${error.message}`);
        const campaign = allCampaigns.find((c) => c.id === campaignId);
        if (campaign) {
          const newStatus = campaign.status === "active" ? "draft" : "active";
          if (newStatus === "active") {
            setAllCampaigns(
              (prev) => prev.map((c) => {
                if (c.id === campaignId) {
                  return { ...c, status: newStatus };
                } else if (c.status === "active") {
                  return { ...c, status: "draft" };
                }
                return c;
              })
            );
          } else {
            setAllCampaigns(
              (prev) => prev.map(
                (c) => c.id === campaignId ? { ...c, status: newStatus } : c
              )
            );
          }
          return { success: true, status: newStatus };
        }
        return { success: false };
      }
    },
    [allCampaigns, dbStatus.connected, deactivateOtherCampaigns, shopInfo.name]
  );
  const getActiveCampaign2 = useCallback(() => {
    return allCampaigns.find((campaign) => campaign.status === "active") || null;
  }, [allCampaigns]);
  return /* @__PURE__ */ jsx(
    CampaignContext.Provider,
    {
      value: {
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
        getActiveCampaign: getActiveCampaign2
      },
      children
    }
  );
}
function useCampaign() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
}
const links$1 = () => [
  { rel: "stylesheet", href: "/app/styles/global.css" }
];
const loader$z = async ({ request }) => {
  var _a2, _b, _c, _d, _e;
  const discountCodes = [];
  try {
    const { authenticate: authenticate2 } = await Promise.resolve().then(() => shopify_server);
    const { getDiscountCodes: getDiscountCodes2 } = await Promise.resolve().then(() => Subscription_server);
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const embedded = url.searchParams.get("embedded");
    const host = url.searchParams.get("host");
    if (shop || embedded || host || request.headers.get("x-shopify-shop-domain")) {
      console.log(
        "Root loader - attempting authentication for Shopify app request..."
      );
      const { admin, session } = await authenticate2.admin(request);
      if (admin && session) {
        console.log("Root loader - attempting to fetch discount codes...");
        const discountCode = await getDiscountCodes2(admin.graphql);
        const nodes = ((_b = (_a2 = discountCode == null ? void 0 : discountCode.data) == null ? void 0 : _a2.discountNodes) == null ? void 0 : _b.edges) || [];
        console.log("Root loader - raw discount nodes:", nodes.length);
        for (const { node } of nodes) {
          const discount = node.discount;
          const title = (discount == null ? void 0 : discount.title) || "N/A";
          const summary = (discount == null ? void 0 : discount.summary) || "N/A";
          if (((_d = (_c = discount == null ? void 0 : discount.codes) == null ? void 0 : _c.edges) == null ? void 0 : _d.length) > 0) {
            for (const codeEdge of discount.codes.edges) {
              const code = ((_e = codeEdge == null ? void 0 : codeEdge.node) == null ? void 0 : _e.code) || "N/A";
              discountCodes.push({
                id: node.id,
                title,
                summary,
                code,
                type: discount.__typename || "DiscountCodeBasic"
              });
            }
          } else {
            discountCodes.push({
              id: node.id,
              title,
              summary,
              code: null,
              type: discount.__typename || "DiscountCodeBasic"
            });
          }
        }
        console.log("Root loader - processed discount codes:", discountCodes);
      } else {
        console.log(
          "Root loader - authentication successful but no admin/session available"
        );
      }
    } else {
      console.log(
        "Root loader - not a Shopify app request, skipping authentication"
      );
    }
  } catch (error) {
    console.log(
      "Root loader - could not fetch discount codes:",
      (error == null ? void 0 : error.message) || "Unknown error"
    );
    if (error && error.status === 302) {
      console.log(
        "Root loader - received redirect response, this is normal for unauthenticated requests"
      );
    }
  }
  return json({
    ENV: {
      NODE_ENV: process.env.NODE_ENV
    },
    discountCodes
  });
};
function App$2() {
  const data = useLoaderData();
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (data.discountCodes && data.discountCodes.length > 0) {
        window.GLOBAL_DISCOUNT_CODES = data.discountCodes;
        console.log(
          "Root - Setting global discount codes:",
          data.discountCodes
        );
        try {
          localStorage.setItem(
            "GLOBAL_DISCOUNT_CODES",
            JSON.stringify(data.discountCodes)
          );
        } catch (e) {
          console.error("Failed to store discount codes in localStorage:", e);
        }
      } else {
        try {
          const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
          if (storedCodes) {
            const parsedCodes = JSON.parse(storedCodes);
            if (parsedCodes && parsedCodes.length > 0) {
              window.GLOBAL_DISCOUNT_CODES = parsedCodes;
              console.log(
                "Root - Using stored discount codes from localStorage:",
                parsedCodes.length
              );
            }
          }
        } catch (e) {
          console.error(
            "Failed to retrieve discount codes from localStorage:",
            e
          );
        }
      }
    }
  }, [data.discountCodes]);
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(PlanProvider, { initialDiscountCodes: data.discountCodes || [], children: /* @__PURE__ */ jsxs(CampaignProvider, { children: [
        /* @__PURE__ */ jsx(Outlet, {}),
        /* @__PURE__ */ jsx(Toaster, { position: "top-right" })
      ] }) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `
              window.ENV = ${JSON.stringify(data.ENV)};
              
              // Try to get codes from localStorage first
              let storedCodes;
              try {
                storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
                storedCodes = storedCodes ? JSON.parse(storedCodes) : [];
              } catch (e) {
                console.error("Error parsing stored discount codes:", e);
                storedCodes = [];
              }
              
              // Use server-provided codes if available, otherwise use stored codes
              const serverCodes = ${JSON.stringify(data.discountCodes || [])};
              window.GLOBAL_DISCOUNT_CODES = serverCodes.length > 0 ? serverCodes : storedCodes;
              
              console.log("Global discount codes initialized:", window.GLOBAL_DISCOUNT_CODES);
            `
          }
        }
      )
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$2,
  links: links$1,
  loader: loader$z
}, Symbol.toStringTag, { value: "Module" }));
const uri$2 = process.env.MONGODB_URI;
if (!uri$2) {
  console.error("Please add your MongoDB URI to .env file");
}
let client$2;
let clientPromise$1;
const options$1 = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5e3,
  socketTimeoutMS: 45e3
};
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise && uri$2) {
    client$2 = new MongoClient(uri$2, options$1);
    global._mongoClientPromise = client$2.connect().then((client2) => {
      console.log("Connected to MongoDB (Development)");
      return client2;
    }).catch((err) => {
      console.error("Failed to connect to MongoDB (Development):", err);
      throw err;
    });
  }
  clientPromise$1 = global._mongoClientPromise;
} else {
  if (uri$2) {
    client$2 = new MongoClient(uri$2, options$1);
    clientPromise$1 = client$2.connect().then((client2) => {
      console.log("Connected to MongoDB (Production)");
      return client2;
    }).catch((err) => {
      console.error("Failed to connect to MongoDB (Production):", err);
      throw err;
    });
  }
}
function formatShopName$2(shopName) {
  let formattedName = shopName.replace(/\.myshopify\.com$/i, "");
  formattedName = formattedName.replace(/[/\\. "$*<>:|?]/g, "_");
  if (!/^[a-zA-Z]/.test(formattedName)) {
    formattedName = "shop_" + formattedName;
  }
  console.log(`Formatted shop name: ${shopName} -> ${formattedName}`);
  return formattedName;
}
async function connectToDatabase$1(shopName = null) {
  if (!clientPromise$1) {
    throw new Error(
      "MongoDB connection not initialized. Check your MONGODB_URI."
    );
  }
  try {
    const client2 = await clientPromise$1;
    const effectiveShopName = shopName || "wheel-of-wonders.myshopify.com";
    const dbName = formatShopName$2(effectiveShopName);
    console.log(
      `Connecting to database: ${dbName} (from shop: ${effectiveShopName})`
    );
    const db = client2.db(dbName);
    return { client: client2, db, dbName };
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}
async function getActiveCampaign(shopName = null) {
  try {
    const { db } = await connectToDatabase$1(shopName);
    const campaignsCollection = db.collection("campaigns");
    console.log("Looking for active campaign...");
    const activeCampaign = await campaignsCollection.findOne({
      status: "active"
    });
    if (activeCampaign) {
      console.log(
        "Found active campaign:",
        activeCampaign.name,
        "ID:",
        activeCampaign.id
      );
    } else {
      console.log("No active campaign found");
    }
    return activeCampaign;
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return null;
  }
}
async function getSubscriptionStatus(graphql) {
  const result = await graphql(
    `
      #graphql
      query Shop {
        app {
          installation {
            launchUrl
            activeSubscriptions {
              id
              name
              createdAt
              returnUrl
              status
              currentPeriodEnd
              trialDays
              test
            }
          }
        }
      }
    `,
    { variables: {} }
  );
  const res = await result.json();
  return res;
}
async function syncActiveCampaignToMetafields(graphql, shopName) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  try {
    const activeCampaign = await getActiveCampaign(shopName);
    if (!activeCampaign) {
      console.log("No active campaign found to sync to metafields");
      return { success: false, message: "No active campaign found" };
    }
    console.log("Syncing active campaign to metafields:", activeCampaign.name);
    const layout = activeCampaign.layout || {};
    const content2 = activeCampaign.content || {};
    const rules = activeCampaign.rules || {};
    const floatingButtonHasText = layout.floatingButtonHasText === true ? "true" : "false";
    const floatingButtonPosition = layout.floatingButtonPosition || "bottomRight";
    const floatingButtonText = layout.floatingButtonText || "";
    const showFloatingButton = layout.showFloatingButton === true ? "true" : "false";
    const primaryColor = activeCampaign.primaryColor || "#ffc700";
    const secondaryColor = activeCampaign.secondaryColor || "#ffffff";
    const tertiaryColor = activeCampaign.tertiaryColor || "#000000";
    const wheelSectors = String(layout.wheelSectors || "six");
    const envSelection = layout.theme || "light";
    const versionSelection = layout.popupLayout || "bottom";
    const displayStyle = layout.displayStyle || "popup";
    const colorTone = activeCampaign.color || "dualTone";
    const logoImage = layout.logo || "";
    const landing = content2.landing || {};
    const headlineText = landing.title || "TRY YOUR LUCK";
    const headlineChildText = landing.subtitle || "This is a demo of our Spin to Win";
    const showLandingSubtitle = landing.showSubtitle === true ? "true" : "false";
    const showEmail = landing.showEmail === true ? "true" : "false";
    const emailPlaceholder = landing.emailPlaceholder || "Enter your Email";
    const showPrivacyPolicy = landing.showPrivacyPolicy === true ? "true" : "false";
    const termCondText = landing.privacyPolicyText || "I accept the terms and conditions";
    const landingButtonText = landing.buttonText || "SPIN";
    const result = content2.result || {};
    const headlineResultText = result.title || "CONGRATULATIONS";
    const showResultSubtitle = result.showSubtitle === true ? "true" : "false";
    const resultSubtitle = result.subtitle || "";
    const showResultButton = result.showButton === true ? "true" : "false";
    const resultButtonText = result.buttonText || "REDEEM NOW";
    const wheel = content2.wheel || {};
    const wheelSectorsData = wheel.sectors || [];
    const copySameCode = wheel.copySameCode === true ? "true" : "false";
    const wheelSectorsJson = JSON.stringify(wheelSectorsData);
    const appearingRules = rules.appearingRules || {};
    const triggersJson = JSON.stringify({
      trigger_clicks_enabled: ((_a2 = appearingRules.clicksCount) == null ? void 0 : _a2.enabled) || false,
      trigger_clicks_value: ((_b = appearingRules.clicksCount) == null ? void 0 : _b.count) || 0,
      trigger_exitIntent_enabled: ((_c = appearingRules.exitIntent) == null ? void 0 : _c.enabled) || false,
      trigger_exitIntent_device: "desktop",
      // or dynamically detect if needed
      trigger_inactivity_enabled: false,
      // Not currently supported in rules, fallback
      trigger_inactivity_seconds: 10,
      // Default fallback
      trigger_pageCount_enabled: ((_d = appearingRules.pageCount) == null ? void 0 : _d.enabled) || false,
      trigger_pageCount_pages: ((_e = appearingRules.pageCount) == null ? void 0 : _e.count) || 1,
      trigger_pageScroll_enabled: ((_f = appearingRules.pageScroll) == null ? void 0 : _f.enabled) || false,
      trigger_pageScroll_percentage: ((_g = appearingRules.pageScroll) == null ? void 0 : _g.percentage) || 50,
      trigger_timeDelay_enabled: ((_h = appearingRules.timeDelay) == null ? void 0 : _h.enabled) || false,
      trigger_timeDelay_seconds: ((_i = appearingRules.timeDelay) == null ? void 0 : _i.seconds) || 5
    });
    const appIdQuery = await graphql(`
      #graphql
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    const appInstallationID = (await appIdQuery.json()).data.currentAppInstallation.id;
    console.log("App Installation ID:", appInstallationID);
    const metafieldsInput = [
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonHasText",
        type: "boolean",
        value: floatingButtonHasText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonPosition",
        type: "single_line_text_field",
        value: floatingButtonPosition,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonText",
        type: "single_line_text_field",
        value: floatingButtonText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "showFloatingButton",
        type: "boolean",
        value: showFloatingButton,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "displayStyle",
        type: "single_line_text_field",
        value: displayStyle,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "primaryColor",
        type: "single_line_text_field",
        value: primaryColor,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "secondaryColor",
        type: "single_line_text_field",
        value: secondaryColor,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "tertiaryColor",
        type: "single_line_text_field",
        value: tertiaryColor,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "activeCampaignId",
        type: "single_line_text_field",
        value: activeCampaign.id || "",
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "wheelSectors",
        type: "single_line_text_field",
        value: wheelSectors,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "wheelSectorsData",
        type: "json",
        value: wheelSectorsJson,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "envSelection",
        type: "single_line_text_field",
        value: envSelection,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "versionSelection",
        type: "single_line_text_field",
        value: versionSelection,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "colorTone",
        type: "single_line_text_field",
        value: colorTone,
        ownerId: appInstallationID
      },
      //{ namespace: "wheel-of-wonders", key: "logoImage", type: "single_line_text_field", value: logoImage, ownerId: appInstallationID },
      // Landing page metafields
      {
        namespace: "wheel-of-wonders",
        key: "headlineText",
        type: "single_line_text_field",
        value: headlineText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "headlineChildText",
        type: "single_line_text_field",
        value: headlineChildText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "emailPlaceholder",
        type: "single_line_text_field",
        value: emailPlaceholder,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "termCondText",
        type: "single_line_text_field",
        value: termCondText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "landingButtonText",
        type: "single_line_text_field",
        value: landingButtonText,
        ownerId: appInstallationID
      },
      // Result page metafields
      {
        namespace: "wheel-of-wonders",
        key: "headlineResultText",
        type: "single_line_text_field",
        value: headlineResultText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "resultSubtitle",
        type: "single_line_text_field",
        value: resultSubtitle,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "resultButtonText",
        type: "single_line_text_field",
        value: resultButtonText,
        ownerId: appInstallationID
      },
      // Default coupon result
      {
        namespace: "wheel-of-wonders",
        key: "couponResult",
        type: "number_integer",
        value: "2",
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "triggersData",
        type: "json",
        value: triggersJson,
        ownerId: appInstallationID
      }
    ];
    const filteredMetafields = metafieldsInput.filter(
      (mf) => mf.value !== void 0 && mf.value !== null && mf.value !== ""
    );
    const metafieldsMutation = await graphql(
      `
        mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { variables: { metafields: filteredMetafields } }
    );
    const data = await metafieldsMutation.json();
    if ((_l = (_k = (_j = data.data) == null ? void 0 : _j.metafieldsSet) == null ? void 0 : _k.userErrors) == null ? void 0 : _l.length) {
      console.error(
        "Metafield userErrors:",
        data.data.metafieldsSet.userErrors
      );
      return { success: false, errors: data.data.metafieldsSet.userErrors };
    }
    console.log(
      "Successfully synced campaign to metafields :",
      data.data.metafieldsSet.metafields
    );
    return {
      success: true,
      metafields: data.data.metafieldsSet.metafields,
      campaignId: activeCampaign.id
    };
  } catch (error) {
    console.error("Error syncing campaign to metafields:", error);
    return { success: false, error: error.message };
  }
}
async function createSubscriptionMetafield(graphql, value, position = "bottom-right") {
  var _a2, _b, _c;
  if (!value || value !== "true" && value !== "false") {
    throw new Error(
      `Invalid 'value' for hasPlan: must be "true" or "false", got: ${value}`
    );
  }
  if (!position || typeof position !== "string") {
    position = "bottom-right";
  }
  const appIdQuery = await graphql(`
    #graphql
    query {
      currentAppInstallation {
        id
      }
    }
  `);
  const appIdQueryData = await appIdQuery.json();
  const appInstallationID = appIdQueryData.data.currentAppInstallation.id;
  console.log("App Installation ID:", appInstallationID);
  const appMetafield = await graphql(
    `
      #graphql
      mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafields: [
          {
            namespace: "mtappsremixbillingdemo",
            key: "hasPlan",
            type: "boolean",
            value,
            // must be a string "true" or "false"
            ownerId: appInstallationID
          },
          {
            namespace: "mtappsremixbillingdemo",
            key: "position",
            type: "single_line_text_field",
            value: position,
            ownerId: appInstallationID
          }
        ]
      }
    }
  );
  const data = await appMetafield.json();
  if (((_c = (_b = (_a2 = data.data) == null ? void 0 : _a2.metafieldsSet) == null ? void 0 : _b.userErrors) == null ? void 0 : _c.length) > 0) {
    console.error("Metafield userErrors:", data.data.metafieldsSet.userErrors);
  }
  return data;
}
async function getDiscountCodes(graphql) {
  const result = await graphql(
    `
      #graphql
      query getDiscountCodes {
        discountNodes(first: 50) {
          edges {
            node {
              id
              discount {
                __typename
                ... on DiscountCodeBasic {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
                ... on DiscountCodeBxgy {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
                ... on DiscountCodeFreeShipping {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { variables: {} }
  );
  const res = await result.json();
  return res;
}
async function createCampaignLayoutMetafields(graphql, shopName) {
  var _a2, _b, _c;
  try {
    const activeCampaign = await getActiveCampaign(shopName);
    if (!activeCampaign) {
      console.log("No active campaign found to create layout metafields");
      return null;
    }
    console.log("Creating layout metafields for campaign:", activeCampaign.name);
    const layout = activeCampaign.layout || {};
    const floatingButtonHasText = layout.floatingButtonHasText === true ? "true" : "false";
    const floatingButtonPosition = layout.floatingButtonPosition || "bottomRight";
    const floatingButtonText = layout.floatingButtonText || "";
    const showFloatingButton = layout.showFloatingButton === true ? "true" : "false";
    const wheelSectors = String(layout.wheelSectors || "six");
    const envSelection = layout.theme || "light";
    const versionSelection = layout.popupLayout || "bottom";
    const displayStyle = layout.displayStyle || "popup";
    const logoImage = layout.logo || "";
    const primaryColor = activeCampaign.primaryColor || "#ffc700";
    const secondaryColor = activeCampaign.secondaryColor || "#ffffff";
    const tertiaryColor = activeCampaign.tertiaryColor || "#000000";
    const colorTone = activeCampaign.color || "dualTone";
    const appIdQuery = await graphql(`
      #graphql
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    const appInstallationID = (await appIdQuery.json()).data.currentAppInstallation.id;
    console.log("App Installation ID:", appInstallationID);
    const layoutMetafields = [
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonHasText",
        type: "boolean",
        value: floatingButtonHasText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonPosition",
        type: "single_line_text_field",
        value: floatingButtonPosition,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonText",
        type: "single_line_text_field",
        value: floatingButtonText,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "showFloatingButton",
        type: "boolean",
        value: showFloatingButton,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "displayStyle",
        type: "single_line_text_field",
        value: displayStyle,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "wheelSectors",
        type: "single_line_text_field",
        value: wheelSectors,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "envSelection",
        type: "single_line_text_field",
        value: envSelection,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "versionSelection",
        type: "single_line_text_field",
        value: versionSelection,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "primaryColor",
        type: "single_line_text_field",
        value: primaryColor,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "secondaryColor",
        type: "single_line_text_field",
        value: secondaryColor,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "tertiaryColor",
        type: "single_line_text_field",
        value: tertiaryColor,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "colorTone",
        type: "single_line_text_field",
        value: colorTone,
        ownerId: appInstallationID
      },
      {
        namespace: "wheel-of-wonders",
        key: "activeCampaignId",
        type: "single_line_text_field",
        value: activeCampaign.id || "",
        ownerId: appInstallationID
      }
    ];
    const filteredMetafields = layoutMetafields.filter(
      (mf) => mf.value !== void 0 && mf.value !== null && mf.value !== ""
    );
    const metafieldsMutation = await graphql(
      `
        mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { variables: { metafields: filteredMetafields } }
    );
    const data = await metafieldsMutation.json();
    if ((_c = (_b = (_a2 = data.data) == null ? void 0 : _a2.metafieldsSet) == null ? void 0 : _b.userErrors) == null ? void 0 : _c.length) {
      console.error("Layout metafield userErrors:", data.data.metafieldsSet.userErrors);
      return { success: false, errors: data.data.metafieldsSet.userErrors };
    }
    console.log("Successfully created layout metafields:", data.data.metafieldsSet.metafields);
    return {
      success: true,
      metafields: data.data.metafieldsSet.metafields,
      campaignId: activeCampaign.id
    };
  } catch (error) {
    console.error("Error creating campaign layout metafields:", error);
    return { success: false, error: error.message };
  }
}
const Subscription_server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connectToDatabase: connectToDatabase$1,
  createCampaignLayoutMetafields,
  createSubscriptionMetafield,
  getActiveCampaign,
  getDiscountCodes,
  getSubscriptionStatus,
  syncActiveCampaignToMetafields
}, Symbol.toStringTag, { value: "Module" }));
async function action$j({ request }) {
  const { admin, session } = await authenticate.admin(request);
  try {
    const shopName = session.shop;
    const result = await createCampaignLayoutMetafields(
      admin.graphql,
      shopName
    );
    if (!result) {
      return json(
        { success: false, message: "No active campaign found" },
        { status: 404 }
      );
    }
    return json({
      success: true,
      message: "Campaign metafields updated successfully"
    });
  } catch (error) {
    console.error("Error updating campaign metafields:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}
async function loader$y() {
  return json({ message: "Use POST to update campaign metafields" });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$j,
  loader: loader$y
}, Symbol.toStringTag, { value: "Module" }));
async function action$i({ request }) {
  var _a2, _b, _c;
  try {
    const { session, admin } = await authenticate.admin(request);
    const shopName = session.shop;
    const graphql = admin.graphql;
    const requestBody = await request.json();
    const { campaignId, clear } = requestBody;
    if (clear) {
      console.log("Clearing campaign metafields...");
      const appIdQuery = await graphql(`
        #graphql
        query {
          currentAppInstallation {
            id
          }
        }
      `);
      const appInstallationID = (await appIdQuery.json()).data.currentAppInstallation.id;
      const clearMetafields = [
        {
          namespace: "wheel-of-wonders",
          key: "activeCampaignId",
          type: "single_line_text_field",
          value: "",
          ownerId: appInstallationID
        },
        {
          namespace: "wheel-of-wonders",
          key: "showFloatingButton",
          type: "boolean",
          value: "false",
          ownerId: appInstallationID
        },
        {
          namespace: "wheel-of-wonders",
          key: "primaryColor",
          type: "single_line_text_field",
          value: "#ffc700",
          ownerId: appInstallationID
        },
        {
          namespace: "wheel-of-wonders",
          key: "secondaryColor",
          type: "single_line_text_field",
          value: "#ffffff",
          ownerId: appInstallationID
        },
        {
          namespace: "wheel-of-wonders",
          key: "tertiaryColor",
          type: "single_line_text_field",
          value: "#000000",
          ownerId: appInstallationID
        }
      ];
      const metafieldsMutation = await graphql(
        `
          mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields {
                id
                namespace
                key
                value
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        { variables: { metafields: clearMetafields } }
      );
      const data = await metafieldsMutation.json();
      if ((_c = (_b = (_a2 = data.data) == null ? void 0 : _a2.metafieldsSet) == null ? void 0 : _b.userErrors) == null ? void 0 : _c.length) {
        console.error(
          "Metafield userErrors:",
          data.data.metafieldsSet.userErrors
        );
        return json({
          success: false,
          errors: data.data.metafieldsSet.userErrors
        });
      }
      return json({
        success: true,
        message: "Metafields cleared successfully",
        metafields: data.data.metafieldsSet.metafields
      });
    }
    if (!campaignId) {
      return json({ error: "Campaign ID is required" }, { status: 400 });
    }
    const { db } = await connectToDatabase$1(shopName);
    const campaign = await db.collection("campaigns").findOne({
      id: campaignId,
      status: "active"
    });
    if (!campaign) {
      return json({ error: "Active campaign not found" }, { status: 404 });
    }
    console.log("Syncing campaign to metafields:", campaign.name);
    const syncResult = await syncActiveCampaignToMetafields(graphql, shopName);
    if (syncResult.success) {
      return json({
        success: true,
        message: "Campaign synced to metafields successfully",
        campaignId: campaign.id,
        campaignName: campaign.name,
        metafields: syncResult.metafields
      });
    } else {
      return json(
        {
          success: false,
          error: syncResult.error || "Failed to sync campaign",
          errors: syncResult.errors
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error syncing campaign to metafields:", error);
    return json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
async function loader$x({ request }) {
  try {
    const { session, admin } = await authenticate.admin(request);
    const shopName = session.shop;
    const graphql = admin.graphql;
    const syncResult = await syncActiveCampaignToMetafields(graphql, shopName);
    if (syncResult.success) {
      return json({
        success: true,
        message: "Active campaign synced to metafields successfully",
        campaignId: syncResult.campaignId,
        metafields: syncResult.metafields
      });
    } else {
      return json({
        success: false,
        error: syncResult.error || "No active campaign found or sync failed",
        errors: syncResult.errors
      });
    }
  } catch (error) {
    console.error("Error syncing active campaign:", error);
    return json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
function SyncCampaignMetafieldsRoute() {
  return null;
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$i,
  default: SyncCampaignMetafieldsRoute,
  loader: loader$x
}, Symbol.toStringTag, { value: "Module" }));
const action$h = async ({ request }) => {
  console.log("Received app uninstalled webhook");
  try {
    const { topic, shop } = await authenticate.webhook(request);
    console.log(`Authenticated webhook: ${topic} for shop: ${shop}`);
    if (topic === "APP_UNINSTALLED" && shop) {
      await prisma.session.deleteMany({ where: { shop } });
      console.log(`Successfully deleted sessions for ${shop}`);
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(`Error processing APP_UNINSTALLED webhook: ${error.message}`);
    return new Response(null, { status: 200 });
  }
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$h
}, Symbol.toStringTag, { value: "Module" }));
const uri$1 = process.env.MONGODB_URI;
const client$1 = new MongoClient(uri$1);
function formatShopName$1(shopName) {
  if (!shopName) return "wheel-of-wonders";
  let formattedName = shopName.replace(/\.myshopify\.com$/i, "");
  formattedName = formattedName.replace(/[/\\. "$*<>:|?]/g, "_");
  if (!/^[a-zA-Z]/.test(formattedName)) {
    formattedName = "shop_" + formattedName;
  }
  return formattedName;
}
async function loader$w({ request }) {
  var _a2, _b, _c, _d;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers
    });
  }
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    if (!shop) {
      return json(
        { error: "Shop parameter is required" },
        { status: 400, headers }
      );
    }
    await client$1.connect();
    const dbName = formatShopName$1(shop);
    const db = client$1.db(dbName);
    const campaignsCollection = db.collection("campaigns");
    const activeCampaign = await campaignsCollection.findOne({
      status: "active"
    });
    if (!activeCampaign) {
      return json(
        { error: "No active campaign found" },
        { status: 404, headers }
      );
    }
    const buttonData = {
      floatingButtonPosition: ((_a2 = activeCampaign.layout) == null ? void 0 : _a2.floatingButtonPosition) || "bottomRight",
      floatingButtonHasText: ((_b = activeCampaign.layout) == null ? void 0 : _b.floatingButtonHasText) === true,
      floatingButtonText: ((_c = activeCampaign.layout) == null ? void 0 : _c.floatingButtonText) || "SPIN & WIN",
      showFloatingButton: ((_d = activeCampaign.layout) == null ? void 0 : _d.showFloatingButton) !== false,
      primaryColor: activeCampaign.primaryColor || "#fe5300",
      id: activeCampaign.id
    };
    return json(buttonData, { headers });
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return json(
      { error: "Failed to fetch active campaign" },
      { status: 500, headers }
    );
  } finally {
    await client$1.close();
  }
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$w
}, Symbol.toStringTag, { value: "Module" }));
async function handler$1(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  try {
    const uri2 = process.env.MONGODB_URI;
    if (!uri2) {
      return res.status(500).json({
        error: "MongoDB URI is not defined in environment variables",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const campaign = req.body;
    if (!campaign || !campaign.id) {
      return res.status(400).json({
        error: "Invalid campaign data - missing required fields",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    console.log(
      "Direct Campaign Save: Attempting to save campaign:",
      campaign.id
    );
    const client2 = new MongoClient(uri2, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5e3,
      socketTimeoutMS: 45e3,
      retryWrites: true,
      retryReads: true
    });
    await client2.connect();
    const dbName = "wheel-of-wonders";
    const db = client2.db(dbName);
    const campaignsCollection = db.collection("campaigns");
    const existingCampaign = await campaignsCollection.findOne({
      id: campaign.id
    });
    let result;
    if (existingCampaign) {
      result = await campaignsCollection.updateOne(
        { id: campaign.id },
        { $set: { ...campaign, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } }
      );
      console.log(
        `Direct Campaign Save: Updated campaign ${campaign.id}, matched: ${result.matchedCount}, modified: ${result.modifiedCount}`
      );
    } else {
      result = await campaignsCollection.insertOne({
        ...campaign,
        createdAt: campaign.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      console.log(
        `Direct Campaign Save: Created new campaign ${campaign.id}, inserted ID: ${result.insertedId}`
      );
    }
    await client2.close();
    return res.status(200).json({
      success: true,
      campaign,
      operation: existingCampaign ? "updated" : "created",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Direct Campaign Save: Error saving campaign:", error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : void 0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handler$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader$v({ request, context }) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    if (!shop) {
      return json({ error: "Shop parameter is required" }, { status: 400 });
    }
    const activeCampaign = await getActiveCampaign(shop);
    if (!activeCampaign) {
      return json({ error: "No active campaign found" }, { status: 404 });
    }
    return json(activeCampaign);
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return json({ error: "Failed to fetch active campaign" }, { status: 500 });
  }
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$v
}, Symbol.toStringTag, { value: "Module" }));
async function loader$u({ request }) {
  const { session } = await authenticate.admin(request);
  try {
    const shopName = session.shop;
    console.log("Testing DB connection for shop:", shopName);
    const activeCampaign = await getActiveCampaign(shopName);
    if (!activeCampaign) {
      return json({
        success: false,
        message: "No active campaign found",
        dbConnected: true
      });
    }
    return json({
      success: true,
      dbConnected: true,
      campaign: {
        id: activeCampaign.id,
        name: activeCampaign.name,
        status: activeCampaign.status,
        layout: activeCampaign.layout || {},
        primaryColor: activeCampaign.primaryColor
      }
    });
  } catch (error) {
    console.error("Error testing DB connection:", error);
    return json(
      {
        success: false,
        dbConnected: false,
        message: error.message
      },
      { status: 500 }
    );
  }
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$u
}, Symbol.toStringTag, { value: "Module" }));
async function action$g({ request }) {
  const { admin } = await authenticate.admin(request);
  try {
    const formData = await request.formData();
    const hasPlan = formData.get("hasPlan") || "false";
    const position = formData.get("position") || "bottom-right";
    const result = await createSubscriptionMetafield(
      admin.graphql,
      hasPlan,
      position
    );
    return json({ success: true, message: "Metafields updated successfully" });
  } catch (error) {
    console.error("Error updating metafields:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}
async function loader$t() {
  return json({ message: "Use POST to update metafields" });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g,
  loader: loader$t
}, Symbol.toStringTag, { value: "Module" }));
async function loader$s({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;
    const appIdQuery = await admin.graphql(`
      #graphql
      query {
        currentAppInstallation {
          id
          metafields(first: 20) {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `);
    const appIdQueryData = await appIdQuery.json();
    const metafields = appIdQueryData.data.currentAppInstallation.metafields.edges.map(
      (edge) => edge.node
    );
    return json({
      success: true,
      shop,
      metafields
    });
  } catch (error) {
    console.error("Error fetching metafields:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$s
}, Symbol.toStringTag, { value: "Module" }));
async function loader$r({ request }) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    if (!shop) {
      return json({ error: "Shop parameter is required" }, { status: 400 });
    }
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers
      });
    }
    const activeCampaign = await getActiveCampaign(shop);
    if (!activeCampaign) {
      return json(
        { error: "No active campaign found" },
        { status: 404, headers }
      );
    }
    return json(activeCampaign, { headers });
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return json({ error: "Failed to fetch active campaign" }, { status: 500 });
  }
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$r
}, Symbol.toStringTag, { value: "Module" }));
async function loader$q({ request }) {
  const { authenticate: authenticate2 } = await Promise.resolve().then(() => shopify_server);
  const { getSubscriptionStatus: getSubscriptionStatus2 } = await Promise.resolve().then(() => Subscription_server);
  try {
    const { admin, session } = await authenticate2.admin(request);
    const subscriptions = await getSubscriptionStatus2(admin.graphql);
    const activeSubscriptions = subscriptions.data.app.installation.activeSubscriptions;
    return json({
      success: true,
      activeSubscriptions,
      hasActiveSubscription: activeSubscriptions.length > 0
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return json(
      {
        success: false,
        message: error.message || "An error occurred while fetching subscription status",
        hasActiveSubscription: false
      },
      { status: 500 }
    );
  }
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$q
}, Symbol.toStringTag, { value: "Module" }));
async function loader$p({ request }) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/javascript"
  };
  const url = new URL(request.url);
  const appUrl = `${url.protocol}//${url.host}`;
  const script = `
    (function() {
      // Get the current shop domain
      const shopDomain = Shopify.shop || window.location.hostname;
      
      // Function to fetch active campaign data
      async function fetchActiveCampaign() {
        try {
          const response = await fetch("${appUrl}/api/direct-campaign-data?shop=" + shopDomain);
          
          if (!response.ok) {
            throw new Error('Failed to fetch campaign data');
          }
          
          const campaignData = await response.json();
          return campaignData;
        } catch (error) {
          console.error('Error fetching campaign data:', error);
          return null;
        }
      }
      
      // Function to create and append the button
      function createButton(data) {
        if (!data || data.showFloatingButton === false) return;
        
        // Create button container
        const button = document.createElement('div');
        button.id = 'spin-wheel-button';
        button.className = 'spin-wheel-position-' + data.floatingButtonPosition;
        
        // Create button inner
        const buttonInner = document.createElement('div');
        buttonInner.className = 'spin-wheel-button-inner';
        if (data.primaryColor) {
          buttonInner.style.backgroundColor = data.primaryColor;
        }
        
        // Create icon
        const icon = document.createElement('div');
        icon.className = 'spin-wheel-icon';
        icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 12V20H4V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 7H2V12H22V7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        // Create text if needed
        if (data.floatingButtonHasText) {
          const text = document.createElement('span');
          text.className = 'spin-wheel-text';
          text.textContent = data.floatingButtonText || 'SPIN & WIN';
          buttonInner.appendChild(icon);
          buttonInner.appendChild(text);
        } else {
          buttonInner.appendChild(icon);
        }
        
        // Add click event
        button.addEventListener('click', function() {
          console.log('Spin wheel button clicked');
          // Add campaign trigger logic here
        });
        
        // Append to DOM
        button.appendChild(buttonInner);
        document.body.appendChild(button);
        
        // Add styles
        addStyles();
      }
      
      // Function to add styles
      function addStyles() {
        const styles = document.createElement('style');
        styles.textContent = \`
          /* Spin Wheel Button Styles */
          #spin-wheel-button {
            position: fixed;
            z-index: 9999;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          /* Position Variants */
          .spin-wheel-position-bottomRight {
            bottom: 20px;
            right: 20px;
          }
          
          .spin-wheel-position-bottomLeft {
            bottom: 20px;
            left: 20px;
          }
          
          .spin-wheel-position-topRight {
            top: 20px;
            right: 20px;
          }
          
          .spin-wheel-position-topLeft {
            top: 20px;
            left: 20px;
          }
          
          .spin-wheel-position-centerRight {
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
          }
          
          .spin-wheel-position-centerLeft {
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
          }
          
          /* Button Inner Container */
          .spin-wheel-button-inner {
            display: flex;
            align-items: center;
            background-color: #fe5300;
            color: white;
            padding: 10px 16px;
            border-radius: 50px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }
          
          .spin-wheel-button-inner:hover {
            transform: scale(1.05);
          }
          
          /* Icon */
          .spin-wheel-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Text */
          .spin-wheel-text {
            margin-left: 8px;
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
          }
          
          /* Responsive styles */
          @media (max-width: 768px) {
            #spin-wheel-button {
              transform: scale(0.9);
            }
            
            .spin-wheel-position-bottomRight,
            .spin-wheel-position-bottomLeft {
              bottom: 15px;
            }
            
            .spin-wheel-position-topRight,
            .spin-wheel-position-topLeft {
              top: 15px;
            }
          }
          
          @media (max-width: 480px) {
            #spin-wheel-button {
              transform: scale(0.8);
            }
            
            .spin-wheel-text {
              font-size: 12px;
            }
          }
        \`;
        document.head.appendChild(styles);
      }
      
      // Initialize
      document.addEventListener('DOMContentLoaded', function() {
        fetchActiveCampaign().then(createButton);
      });
    })();
  `;
  return new Response(script, { headers });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$p
}, Symbol.toStringTag, { value: "Module" }));
async function action$f({ request }) {
  const { authenticate: authenticate2, billing } = await Promise.resolve().then(() => shopify_server);
  try {
    const { admin, session } = await authenticate2.admin(request);
    const body = await request.json();
    const { subscriptionId } = body;
    if (!subscriptionId) {
      return json({ error: "Subscription ID is required" }, { status: 400 });
    }
    const cancelResponse = await admin.graphql(
      `
      mutation cancelAppSubscription($id: ID!) {
        appSubscriptionCancel(id: $id) {
          appSubscription {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
      {
        variables: {
          id: subscriptionId
        }
      }
    );
    const responseJson = await cancelResponse.json();
    if (responseJson.errors) {
      return json(
        {
          success: false,
          message: responseJson.errors[0].message
        },
        { status: 400 }
      );
    }
    if (responseJson.data.appSubscriptionCancel.userErrors.length > 0) {
      return json(
        {
          success: false,
          message: responseJson.data.appSubscriptionCancel.userErrors[0].message
        },
        { status: 400 }
      );
    }
    return json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription: responseJson.data.appSubscriptionCancel.appSubscription
    });
  } catch (error) {
    console.error("Billing cancellation error:", error);
    return json(
      {
        success: false,
        message: error.message || "An error occurred while cancelling your subscription"
      },
      { status: 500 }
    );
  }
}
async function loader$o() {
  return json({ message: "Use POST to cancel a subscription" });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$f,
  loader: loader$o
}, Symbol.toStringTag, { value: "Module" }));
async function action$e({ request }) {
  try {
    const { shopifyApp: shopifyApp2 } = await Promise.resolve().then(() => shopify_server);
    const data = await request.json();
    const { planName, returnUrl, isTest = true } = data;
    if (!planName) {
      return json({ success: false, message: "Plan name is required" });
    }
    try {
      const { session } = await shopifyApp2.authenticate.admin(request);
      if (!session) {
        return json({
          success: false,
          requiresAuth: true,
          message: "Authentication required"
        });
      }
      const billingUrl = await shopifyApp2.billing.request({
        session,
        plan: planName,
        isTest,
        returnUrl: returnUrl || `https://${session.shop}/admin/apps`
      });
      return json({
        success: true,
        confirmationUrl: billingUrl
      });
    } catch (authError) {
      console.error("Billing API - Authentication error:", authError);
      return json({
        success: false,
        requiresAuth: true,
        message: "Authentication failed. Please sign in again.",
        error: authError.message
      });
    }
  } catch (error) {
    console.error("Billing API - Error:", error);
    return json({
      success: false,
      message: "Failed to create subscription",
      error: error.message
    });
  }
}
async function loader$n() {
  return json({ message: "POST requests only" }, { status: 405 });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$e,
  loader: loader$n
}, Symbol.toStringTag, { value: "Module" }));
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  try {
    const uri2 = process.env.MONGODB_URI;
    if (!uri2) {
      return res.status(500).json({
        connected: false,
        error: "MongoDB URI is not defined in environment variables",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    console.log("Direct DB Test: Attempting to connect to MongoDB...");
    const client2 = new MongoClient(uri2, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5e3,
      socketTimeoutMS: 45e3,
      retryWrites: true,
      retryReads: true
    });
    await client2.connect();
    const dbName = "wheel-of-wonders";
    const db = client2.db(dbName);
    const collections = await db.listCollections().toArray();
    await client2.close();
    return res.status(200).json({
      connected: true,
      dbName,
      shop: "wheel-of-wonders.myshopify.com",
      collections: collections.map((c) => c.name),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Direct DB Test: Error connecting to MongoDB:", error);
    return res.status(500).json({
      connected: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : void 0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: "Module" }));
async function loader$m({ request }) {
  var _a2, _b;
  try {
    console.log("🔍 Authenticating admin...");
    const { admin } = await authenticate.admin(request);
    console.log("✅ Authenticated. Sending GraphQL query...");
    const response = await admin.graphql(`
      query getDiscountCodes {
        discountNodes(first: 50) {
          edges {
            node {
              id
              discount {
                __typename
                ... on DiscountCodeBasic {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
                ... on DiscountCodeBxgy {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
                ... on DiscountCodeFreeShipping {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      `);
    const data = await response.json();
    console.log("📦 GraphQL response:", data);
    if (data.errors) {
      console.error("❌ GraphQL errors:", data.errors);
      return json(
        { codes: [], error: "Failed to fetch discount codes" },
        { status: 500 }
      );
    }
    const codes = [];
    if ((_b = (_a2 = data.data) == null ? void 0 : _a2.discountNodes) == null ? void 0 : _b.edges) {
      data.data.discountNodes.edges.forEach((edge) => {
        var _a3;
        const discount = edge.node.discount;
        if (discount && ((_a3 = discount.codes) == null ? void 0 : _a3.edges)) {
          discount.codes.edges.forEach((codeEdge) => {
            if (codeEdge.node.code) {
              codes.push({
                id: edge.node.id,
                code: codeEdge.node.code,
                title: discount.title || "N/A",
                summary: discount.summary || "N/A",
                type: discount.__typename || "Unknown"
              });
            }
          });
        }
      });
    }
    console.log(`Found ${codes.length} discount codes`);
    return json({
      codes,
      count: codes.length,
      success: true
    });
  } catch (error) {
    console.error("💥 Error in loader:", error);
    console.error("📜 Stack trace:", error.stack);
    return json(
      { codes: [], error: error.message, success: false },
      { status: 500 }
    );
  }
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$m
}, Symbol.toStringTag, { value: "Module" }));
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Please add your MongoDB URI to .env file");
}
let client;
let clientPromise;
let cachedShopName = null;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5e3,
  socketTimeoutMS: 45e3
};
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise && uri) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().then((client2) => {
      console.log("Connected to MongoDB (Development)");
      return client2;
    }).catch((err) => {
      console.error("Failed to connect to MongoDB (Development):", err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (uri) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().then((client2) => {
      console.log("Connected to MongoDB (Production)");
      return client2;
    }).catch((err) => {
      console.error("Failed to connect to MongoDB (Production):", err);
      throw err;
    });
  }
}
function formatShopName(shopName) {
  if (!shopName) return "shopify-campaigns";
  let formattedName = shopName.replace(/\.myshopify\.com$/i, "");
  formattedName = formattedName.replace(/[/\\. "$*<>:|?]/g, "_");
  if (!/^[a-zA-Z]/.test(formattedName)) {
    formattedName = "shop_" + formattedName;
  }
  console.log(`Formatted shop name: ${shopName} -> ${formattedName}`);
  return formattedName;
}
function setShopName(shopName) {
  cachedShopName = shopName;
}
function getShopName() {
  return cachedShopName;
}
async function connectToDatabase(shopName = null) {
  try {
    if (!clientPromise) throw new Error("No MONGODB_URI");
    const client2 = await clientPromise;
    const dbName = formatShopName(shopName || cachedShopName || "default");
    const db = client2.db(dbName);
    let isConnected = false;
    try {
      await db.admin().ping();
      isConnected = true;
    } catch (e) {
      console.warn("Mongo ping failed:", e);
    }
    return { client: client2, db, dbName, isConnected };
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}
const mongodb_server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connectToDatabase,
  getShopName,
  setShopName
}, Symbol.toStringTag, { value: "Module" }));
async function loader$l({ request }) {
  var _a2, _b;
  try {
    let shopName = null;
    try {
      const url2 = new URL(request.url);
      shopName = url2.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain") || getShopName() || "wheel-of-wonders.myshopify.com";
    } catch (error) {
      console.error("Error getting shop name:", error);
      return json({ error: "Invalid shop name" }, { status: 400 });
    }
    const url = new URL(request.url);
    const visitorId = url.searchParams.get("visitorId") || "anonymous";
    const currentUrl = url.searchParams.get("currentUrl") || "";
    const isNewVisitor = url.searchParams.get("isNewVisitor") === "true";
    const pageCount = Number.parseInt(
      url.searchParams.get("pageCount") || "1",
      10
    );
    const deviceType = url.searchParams.get("deviceType") || "desktop";
    const { db } = await connectToDatabase(shopName);
    const campaigns = await db.collection("campaigns").find({
      shop: shopName,
      status: "active"
    }).toArray();
    if (!campaigns || campaigns.length === 0) {
      return json({
        success: false,
        message: "No active campaigns found",
        shop: shopName
      });
    }
    console.log(
      `Found ${campaigns.length} active campaigns for shop: ${shopName}`
    );
    const eligibleCampaigns = campaigns.filter((campaign) => {
      var _a3, _b2, _c, _d;
      if ((_b2 = (_a3 = campaign.rules) == null ? void 0 : _a3.pageTargeting) == null ? void 0 : _b2.enabled) {
        const targetUrls = campaign.rules.pageTargeting.urls || [];
        if (targetUrls.length > 0 && !targetUrls.some((url2) => currentUrl.includes(url2))) {
          return false;
        }
      }
      if ((_d = (_c = campaign.rules) == null ? void 0 : _c.displayFrequency) == null ? void 0 : _d.enabled) {
        const visitorType = campaign.rules.displayFrequency.visitorType;
        if (visitorType === "new" && !isNewVisitor || visitorType === "return" && isNewVisitor) {
          return false;
        }
      }
      return true;
    });
    if (eligibleCampaigns.length === 0) {
      return json({
        success: false,
        message: "No eligible campaigns found based on rules",
        shop: shopName
      });
    }
    const campaignToServe = eligibleCampaigns[0];
    const lastView = await db.collection("campaign_views").findOne({
      campaignId: campaignToServe.id,
      visitorId
    });
    if (lastView && ((_b = (_a2 = campaignToServe.rules) == null ? void 0 : _a2.displayFrequency) == null ? void 0 : _b.enabled)) {
      const frequency = campaignToServe.rules.displayFrequency.frequency;
      const lastViewTime = new Date(lastView.timestamp);
      const now = /* @__PURE__ */ new Date();
      if (frequency === "once_a_day") {
        const daysSinceLastView = (now - lastViewTime) / (1e3 * 60 * 60 * 24);
        if (daysSinceLastView < 1) {
          return json({
            success: false,
            message: "Campaign already shown to this visitor today",
            shop: shopName
          });
        }
      } else if (frequency === "once_a_session") {
        return json({
          success: false,
          message: "Campaign already shown to this visitor this session",
          shop: shopName
        });
      }
    }
    await db.collection("campaign_views").insertOne({
      campaignId: campaignToServe.id,
      visitorId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      url: currentUrl,
      shop: shopName
    });
    return json({
      success: true,
      campaign: campaignToServe,
      shop: shopName
    });
  } catch (error) {
    console.error("Error serving campaign:", error);
    return json({ error: error.message }, { status: 500 });
  }
}
function ServeCampaignRoute() {
  return null;
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServeCampaignRoute,
  loader: loader$l
}, Symbol.toStringTag, { value: "Module" }));
async function action$d({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const { email, coupon, shop, campaignId } = await request.json();
    if (!email || !coupon) {
      return json({ error: "Email and coupon are required" }, { status: 400 });
    }
    if (!shop) {
      return json({ error: "Shop is required" }, { status: 400 });
    }
    const { db } = await connectToDatabase(shop);
    const redemptionsCollection = db.collection("redemptions");
    await redemptionsCollection.insertOne({
      email,
      coupon,
      campaignId,
      timestamp: /* @__PURE__ */ new Date(),
      redeemed: true
    });
    return json({ success: true });
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    return json({ error: "Failed to redeem coupon" }, { status: 500 });
  }
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d
}, Symbol.toStringTag, { value: "Module" }));
async function action$c({ request }) {
  var _a2;
  const { admin, session } = await authenticate.admin(request);
  try {
    const shopName = session.shop;
    const activeCampaign = await getActiveCampaign(shopName);
    if (!activeCampaign) {
      return json(
        { success: false, message: "No active campaign found" },
        { status: 404 }
      );
    }
    await createCampaignLayoutMetafields(admin.graphql, shopName);
    await createSubscriptionMetafield(
      admin.graphql,
      "true",
      ((_a2 = activeCampaign.layout) == null ? void 0 : _a2.floatingButtonPosition) || "bottom-right"
    );
    return json({
      success: true,
      message: "Campaign synced successfully",
      campaign: {
        id: activeCampaign.id,
        name: activeCampaign.name,
        status: activeCampaign.status,
        layout: activeCampaign.layout
      }
    });
  } catch (error) {
    console.error("Error syncing campaign:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}
async function loader$k() {
  return json({ message: "Use POST to sync campaign" });
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$c,
  loader: loader$k
}, Symbol.toStringTag, { value: "Module" }));
async function action$b({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const { admin, session } = await authenticate.admin(request);
    const data = await request.json();
    const { campaignId, wheelConfig, timestamp, shop } = data;
    console.log("Saving wheel configuration:", {
      campaignId,
      wheelConfig,
      timestamp,
      shop: shop || session.shop
    });
    return json({
      success: true,
      message: "Wheel configuration saved successfully",
      campaignId
    });
  } catch (error) {
    console.error("Error saving wheel configuration:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$b
}, Symbol.toStringTag, { value: "Module" }));
const corsHeaders$1 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function loader$j({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders$1 });
  }
  return json(
    { error: "Method not allowed" },
    { status: 405, headers: corsHeaders$1 }
  );
}
async function action$a({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders$1 }
    );
  }
  try {
    const { email, coupon, campaignId } = await request.json();
    if (!email) {
      return json(
        { error: "Email is required" },
        { status: 400, headers: corsHeaders$1 }
      );
    }
    if (!coupon) {
      return json(
        { error: "Coupon is required" },
        { status: 400, headers: corsHeaders$1 }
      );
    }
    if (!campaignId) {
      return json(
        { error: "Campaign ID is required" },
        { status: 400, headers: corsHeaders$1 }
      );
    }
    const { db, isConnected } = await connectToDatabase();
    if (!isConnected) {
      console.warn("DB down; logging result only", {
        email,
        coupon,
        campaignId
      });
      return json(
        { success: true, message: "Result logged (DB down)" },
        { headers: corsHeaders$1 }
      );
    }
    const result = await db.collection("campaigns").updateOne(
      { id: campaignId },
      {
        $push: {
          results: {
            email,
            coupon,
            awardedAt: /* @__PURE__ */ new Date()
          }
        }
      },
      { upsert: false }
    );
    if (result.matchedCount === 0) {
      return json(
        { error: "Campaign not found", campaignId },
        { status: 404, headers: corsHeaders$1 }
      );
    }
    return json(
      {
        success: true,
        message: "Result saved to campaign",
        modifiedCount: result.modifiedCount
      },
      { headers: corsHeaders$1 }
    );
  } catch (error) {
    console.error("Failed to save result:", error);
    return json(
      {
        success: false,
        error: "Unexpected error",
        details: error.message
      },
      { status: 500, headers: corsHeaders$1 }
    );
  }
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
const action$9 = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const { campaignId, sectorId, userEmail, shop, sessionId } = await request.json();
    if (!campaignId || !sectorId) {
      return Response.json(
        { error: "Missing required fields: campaignId, sectorId" },
        { status: 400 }
      );
    }
    const { db } = await connectToDatabase(shop);
    const wheelConfigCollection = db.collection("wheel_configurations");
    const wheelConfig = await wheelConfigCollection.findOne({ campaignId });
    if (!wheelConfig) {
      return Response.json(
        { error: "Wheel configuration not found" },
        { status: 404 }
      );
    }
    const sector = wheelConfig.wheelConfig.sectors.find(
      (s) => s.id === sectorId
    );
    if (!sector) {
      return Response.json({ error: "Invalid sector" }, { status: 400 });
    }
    const spinResultsCollection = db.collection("spin_results");
    const spinResult = {
      campaignId,
      sectorId,
      sector: {
        rewardType: sector.rewardType,
        reward: sector.reward,
        discountCodeId: sector.discountCodeId,
        discountValue: sector.discountValue,
        discountType: sector.discountType
      },
      userEmail: userEmail || null,
      shop: shop || "default",
      sessionId: sessionId || null,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      createdAt: /* @__PURE__ */ new Date(),
      redeemed: false
    };
    const result = await spinResultsCollection.insertOne(spinResult);
    const response = {
      success: true,
      resultId: result.insertedId,
      sector: {
        id: sector.id,
        rewardType: sector.rewardType,
        reward: sector.reward,
        isDiscount: !!sector.discountCodeId,
        discountValue: sector.discountValue,
        discountType: sector.discountType
      },
      message: sector.discountCodeId ? "Congratulations! You won a discount!" : "Better luck next time!"
    };
    if (sector.discountCodeId) {
      console.log(
        `User won discount: ${sector.reward} (${sector.discountValue}% off)`
      );
    }
    return Response.json(response);
  } catch (error) {
    console.error("Error processing spin result:", error);
    return Response.json(
      { error: "Failed to process spin result", details: error.message },
      { status: 500 }
    );
  }
};
const loader$i = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const campaignId = url.searchParams.get("campaignId");
    const shop = url.searchParams.get("shop");
    const limit = Number.parseInt(url.searchParams.get("limit")) || 50;
    const { db } = await connectToDatabase(shop);
    const collection = db.collection("spin_results");
    const query = {};
    if (campaignId) query.campaignId = campaignId;
    if (shop) query.shop = shop;
    const results = await collection.find(query).sort({ createdAt: -1 }).limit(limit).toArray();
    const analytics = await collection.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$sector.rewardType",
          count: { $sum: 1 },
          discountWins: {
            $sum: {
              $cond: [{ $ne: ["$sector.discountCodeId", null] }, 1, 0]
            }
          }
        }
      }
    ]).toArray();
    return Response.json({
      success: true,
      results,
      analytics,
      totalSpins: results.length
    });
  } catch (error) {
    console.error("Error fetching spin results:", error);
    return Response.json(
      { error: "Failed to fetch spin results", details: error.message },
      { status: 500 }
    );
  }
};
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
const loader$h = () => {
  return redirect("/campaigns/create");
};
function CreateCampaignRedirect() {
  return null;
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CreateCampaignRedirect,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function loader$g({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  return json(
    { error: "Method not allowed" },
    { status: 405, headers: corsHeaders }
  );
}
async function action$8({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders }
    );
  }
  try {
    const { email, coupon = null, campaignId } = await request.json();
    if (!email || !campaignId) {
      return json(
        { error: "Missing required fields: email or campaignId" },
        { status: 400, headers: corsHeaders }
      );
    }
    const { db, isConnected } = await connectToDatabase();
    if (!isConnected) {
      console.warn("MongoDB not connected, logging only:", {
        email,
        coupon,
        campaignId
      });
      return json(
        {
          success: true,
          message: "Email logged (DB not connected)"
        },
        { headers: corsHeaders }
      );
    }
    const result = await db.collection("campaigns").updateOne(
      { id: campaignId },
      {
        $push: {
          emails: {
            email,
            coupon,
            submittedAt: /* @__PURE__ */ new Date()
          }
        }
      }
    );
    if (result.matchedCount === 0) {
      return json(
        { error: "Campaign not found", campaignId },
        { status: 404, headers: corsHeaders }
      );
    }
    return json(
      {
        success: true,
        message: "Email saved successfully"
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error saving email:", error);
    return json(
      {
        success: false,
        error: "Failed to save email",
        message: error.message
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
async function getEffectiveShopName$2(request) {
  try {
    const { session } = await authenticate.admin(request);
    const shopName = session.shop;
    console.log("Using shop name from session:", shopName);
    setShopName(shopName);
    return shopName;
  } catch (authError) {
    console.log("Authentication failed:", authError.message);
    const url = new URL(request.url);
    const shopFromRequest = url.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain");
    const shopName = shopFromRequest || getShopName() || "wheel-of-wonders.myshopify.com";
    console.log("Using shop name from fallback:", shopName);
    if (shopFromRequest) {
      setShopName(shopFromRequest);
    }
    return shopName;
  }
}
async function loader$f({ request }) {
  try {
    const shopName = await getEffectiveShopName$2(request);
    const { db, dbName } = await connectToDatabase(shopName);
    console.log(`Fetching campaigns from database: ${dbName}`);
    const campaigns = await db.collection("campaigns").find({}).toArray();
    return json({
      campaigns,
      shop: shopName,
      dbName
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return json({ error: error.message }, { status: 500 });
  }
}
async function action$7({ request }) {
  try {
    const campaignData = await request.json();
    const shopName = await getEffectiveShopName$2(request);
    const { _id, ...campaignToCreate } = campaignData;
    if (!campaignToCreate.shop) {
      campaignToCreate.shop = shopName;
    }
    const { db, dbName } = await connectToDatabase(shopName);
    console.log(`Creating campaign in database: ${dbName}`);
    const result = await db.collection("campaigns").insertOne(campaignToCreate);
    return json(
      {
        ...campaignToCreate,
        _id: result.insertedId,
        shop: shopName,
        dbName
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    return json({ error: error.message }, { status: 500 });
  }
}
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
async function getEffectiveShopName$1(request) {
  try {
    const { authenticate: authenticate2 } = await Promise.resolve().then(() => shopify_server);
    const { session } = await authenticate2.admin(request);
    const shopName = session.shop;
    console.log("Using shop name from session:", shopName);
    return shopName;
  } catch (authError) {
    console.log("Authentication failed:", authError.message);
    let shopName = null;
    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        shopName = formData.get("shop");
        if (shopName) {
          console.log("Using shop name from form data:", shopName);
          return shopName;
        }
      } catch (e) {
        console.log("Not form data, trying other sources");
      }
    }
    const url = new URL(request.url);
    shopName = url.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain");
    if (shopName) {
      console.log("Using shop name from URL/headers:", shopName);
      return shopName;
    }
    console.log("Using default shop name");
    return "wheel-of-wonders.myshopify.com";
  }
}
async function action$6({ request, params }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const campaignId = params.id;
    if (!campaignId) {
      return json({ error: "Campaign ID is required" }, { status: 400 });
    }
    let formData;
    try {
      formData = await request.formData();
    } catch (e) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }
    const newStatus = formData.get("status");
    if (!newStatus) {
      return json({ error: "Status is required" }, { status: 400 });
    }
    const shopName = await getEffectiveShopName$1(request);
    console.log("Updating campaign", campaignId, "in database:", shopName);
    const { db } = await connectToDatabase(shopName);
    if (!db) {
      return json({ error: "Database connection failed" }, { status: 500 });
    }
    if (newStatus === "active") {
      try {
        await db.collection("campaigns").updateMany(
          {
            id: { $ne: campaignId },
            status: "active"
          },
          {
            $set: {
              status: "draft",
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          }
        );
        console.log("Set all other active campaigns to draft");
      } catch (error) {
        console.error("Error deactivating other campaigns:", error);
      }
    }
    try {
      const result = await db.collection("campaigns").updateOne(
        { id: campaignId },
        {
          $set: {
            status: newStatus,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        }
      );
      if (result.matchedCount === 0) {
        try {
          const objId = new ObjectId(campaignId);
          const result2 = await db.collection("campaigns").updateOne(
            { _id: objId },
            {
              $set: {
                status: newStatus,
                updatedAt: (/* @__PURE__ */ new Date()).toISOString()
              }
            }
          );
          if (result2.matchedCount === 0) {
            return json({ error: "Campaign not found" }, { status: 404 });
          }
        } catch (e) {
          return json({ error: "Campaign not found" }, { status: 404 });
        }
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      return json({ error: "Failed to update campaign" }, { status: 500 });
    }
    let syncResult = {
      success: false,
      message: "Metafield sync not attempted"
    };
    try {
      const { authenticate: authenticate2 } = await Promise.resolve().then(() => shopify_server);
      const { admin } = await authenticate2.admin(request);
      if (admin == null ? void 0 : admin.graphql) {
        const campaign = await db.collection("campaigns").findOne({ id: campaignId });
        if (campaign) {
          if (newStatus === "active") {
            syncResult = {
              success: true,
              message: "Campaign synced to metafields"
            };
          } else {
            syncResult = { success: true, message: "Metafields cleared" };
          }
        }
      }
    } catch (error) {
      console.log("Metafield sync skipped due to authentication");
    }
    return json({
      success: true,
      status: newStatus,
      message: `Campaign ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      syncResult
    });
  } catch (error) {
    console.error("Error in campaign status update:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
async function loader$e({ request, params }) {
  return json({ message: "Use POST to update campaign status" });
}
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
async function getEffectiveShopName(request) {
  try {
    const { session } = await authenticate.admin(request);
    const shopName = session.shop;
    console.log("Using shop name from session:", shopName);
    setShopName(shopName);
    return shopName;
  } catch (authError) {
    console.log("Authentication failed:", authError.message);
    const url = new URL(request.url);
    const shopFromRequest = url.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain");
    const shopName = shopFromRequest || getShopName() || "wheel-of-wonders.myshopify.com";
    console.log("Using shop name from fallback:", shopName);
    if (shopFromRequest) {
      setShopName(shopFromRequest);
    }
    return shopName;
  }
}
async function loader$d({ params, request }) {
  try {
    const { id } = params;
    const shopName = await getEffectiveShopName(request);
    const { db, dbName } = await connectToDatabase(shopName);
    console.log(`Fetching campaign ${id} from database: ${dbName}`);
    const campaign = await db.collection("campaigns").findOne({ id });
    if (!campaign) {
      return json({ error: "Campaign not found" }, { status: 404 });
    }
    return json({
      ...campaign,
      shop: shopName,
      dbName
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return json({ error: error.message }, { status: 500 });
  }
}
async function action$5({ request, params }) {
  const method = request.method.toLowerCase();
  const shopName = await getEffectiveShopName(request);
  const { db, dbName } = await connectToDatabase(shopName);
  if (method === "put") {
    try {
      const { id } = params;
      const campaignData = await request.json();
      const { _id, ...campaignToUpdate } = campaignData;
      if (!campaignToUpdate.shop) {
        campaignToUpdate.shop = shopName;
      }
      console.log(`Updating campaign ${id} in database: ${dbName}`);
      const result = await db.collection("campaigns").updateOne({ id }, { $set: campaignToUpdate });
      if (result.matchedCount === 0) {
        return json({ error: "Campaign not found" }, { status: 404 });
      }
      return json({
        ...campaignToUpdate,
        id,
        shop: shopName,
        dbName
      });
    } catch (error) {
      console.error("Error updating campaign:", error);
      return json({ error: error.message }, { status: 500 });
    }
  } else if (method === "delete") {
    try {
      const { id } = params;
      console.log(`Deleting campaign ${id} from database: ${dbName}`);
      const result = await db.collection("campaigns").deleteOne({ id });
      if (result.deletedCount === 0) {
        return json({ error: "Campaign not found" }, { status: 404 });
      }
      return json({
        success: true,
        shop: shopName,
        dbName
      });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      return json({ error: error.message }, { status: 500 });
    }
  }
  return json({ error: "Method not allowed" }, { status: 405 });
}
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
async function loader$c({ request }) {
  try {
    let shopName = null;
    try {
      const { session } = await authenticate.admin(request);
      shopName = session.shop;
      console.log("Using shop name for database:", shopName);
    } catch (authError) {
      const url = new URL(request.url);
      const shop = url.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain") || "wheel-of-wonders.myshopify.com";
      shopName = shop;
      console.log("Authentication failed, using shop from request:", shopName);
    }
    const { client: client2, db } = await connectToDatabase(shopName);
    await db.command({ ping: 1 });
    return json({
      connected: true,
      message: "Successfully connected to MongoDB",
      dbName: db.databaseName,
      shop: shopName
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return json({
      connected: false,
      error: error.message,
      message: "Failed to connect to MongoDB"
    });
  }
}
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
async function loader$b({ request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const shop = url.searchParams.get("shop");
    if (!id) {
      return json(
        { error: "Campaign ID parameter is required" },
        { status: 400 }
      );
    }
    if (!shop) {
      return json({ error: "Shop parameter is required" }, { status: 400 });
    }
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers
      });
    }
    const { db } = await connectToDatabase(shop);
    const campaignsCollection = db.collection("campaigns");
    const campaign = await campaignsCollection.findOne({ id });
    if (!campaign) {
      return json({ error: "Campaign not found" }, { status: 404, headers });
    }
    return json(campaign, { headers });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const Polaris = /* @__PURE__ */ JSON.parse('{"ActionMenu":{"Actions":{"moreActions":"More actions"},"RollupActions":{"rollupButton":"View actions"}},"ActionList":{"SearchField":{"clearButtonLabel":"Clear","search":"Search","placeholder":"Search actions"}},"Avatar":{"label":"Avatar","labelWithInitials":"Avatar with initials {initials}"},"Autocomplete":{"spinnerAccessibilityLabel":"Loading","ellipsis":"{content}…"},"Badge":{"PROGRESS_LABELS":{"incomplete":"Incomplete","partiallyComplete":"Partially complete","complete":"Complete"},"TONE_LABELS":{"info":"Info","success":"Success","warning":"Warning","critical":"Critical","attention":"Attention","new":"New","readOnly":"Read-only","enabled":"Enabled"},"progressAndTone":"{toneLabel} {progressLabel}"},"Banner":{"dismissButton":"Dismiss notification"},"Button":{"spinnerAccessibilityLabel":"Loading"},"Common":{"checkbox":"checkbox","undo":"Undo","cancel":"Cancel","clear":"Clear","close":"Close","submit":"Submit","more":"More"},"ContextualSaveBar":{"save":"Save","discard":"Discard"},"DataTable":{"sortAccessibilityLabel":"sort {direction} by","navAccessibilityLabel":"Scroll table {direction} one column","totalsRowHeading":"Totals","totalRowHeading":"Total"},"DatePicker":{"previousMonth":"Show previous month, {previousMonthName} {showPreviousYear}","nextMonth":"Show next month, {nextMonth} {nextYear}","today":"Today ","start":"Start of range","end":"End of range","months":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"days":{"monday":"Monday","tuesday":"Tuesday","wednesday":"Wednesday","thursday":"Thursday","friday":"Friday","saturday":"Saturday","sunday":"Sunday"},"daysAbbreviated":{"monday":"Mo","tuesday":"Tu","wednesday":"We","thursday":"Th","friday":"Fr","saturday":"Sa","sunday":"Su"}},"DiscardConfirmationModal":{"title":"Discard all unsaved changes","message":"If you discard changes, you’ll delete any edits you made since you last saved.","primaryAction":"Discard changes","secondaryAction":"Continue editing"},"DropZone":{"single":{"overlayTextFile":"Drop file to upload","overlayTextImage":"Drop image to upload","overlayTextVideo":"Drop video to upload","actionTitleFile":"Add file","actionTitleImage":"Add image","actionTitleVideo":"Add video","actionHintFile":"or drop file to upload","actionHintImage":"or drop image to upload","actionHintVideo":"or drop video to upload","labelFile":"Upload file","labelImage":"Upload image","labelVideo":"Upload video"},"allowMultiple":{"overlayTextFile":"Drop files to upload","overlayTextImage":"Drop images to upload","overlayTextVideo":"Drop videos to upload","actionTitleFile":"Add files","actionTitleImage":"Add images","actionTitleVideo":"Add videos","actionHintFile":"or drop files to upload","actionHintImage":"or drop images to upload","actionHintVideo":"or drop videos to upload","labelFile":"Upload files","labelImage":"Upload images","labelVideo":"Upload videos"},"errorOverlayTextFile":"File type is not valid","errorOverlayTextImage":"Image type is not valid","errorOverlayTextVideo":"Video type is not valid"},"EmptySearchResult":{"altText":"Empty search results"},"Frame":{"skipToContent":"Skip to content","navigationLabel":"Navigation","Navigation":{"closeMobileNavigationLabel":"Close navigation"}},"FullscreenBar":{"back":"Back","accessibilityLabel":"Exit fullscreen mode"},"Filters":{"moreFilters":"More filters","moreFiltersWithCount":"More filters ({count})","filter":"Filter {resourceName}","noFiltersApplied":"No filters applied","cancel":"Cancel","done":"Done","clearAllFilters":"Clear all filters","clear":"Clear","clearLabel":"Clear {filterName}","addFilter":"Add filter","clearFilters":"Clear all","searchInView":"in:{viewName}"},"FilterPill":{"clear":"Clear","unsavedChanges":"Unsaved changes - {label}"},"IndexFilters":{"searchFilterTooltip":"Search and filter","searchFilterTooltipWithShortcut":"Search and filter (F)","searchFilterAccessibilityLabel":"Search and filter results","sort":"Sort your results","addView":"Add a new view","newView":"Custom search","SortButton":{"ariaLabel":"Sort the results","tooltip":"Sort","title":"Sort by","sorting":{"asc":"Ascending","desc":"Descending","az":"A-Z","za":"Z-A"}},"EditColumnsButton":{"tooltip":"Edit columns","accessibilityLabel":"Customize table column order and visibility"},"UpdateButtons":{"cancel":"Cancel","update":"Update","save":"Save","saveAs":"Save as","modal":{"title":"Save view as","label":"Name","sameName":"A view with this name already exists. Please choose a different name.","save":"Save","cancel":"Cancel"}}},"IndexProvider":{"defaultItemSingular":"Item","defaultItemPlural":"Items","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} are selected","selected":"{selectedItemsCount} selected","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}"},"IndexTable":{"emptySearchTitle":"No {resourceNamePlural} found","emptySearchDescription":"Try changing the filters or search term","onboardingBadgeText":"New","resourceLoadingAccessibilityLabel":"Loading {resourceNamePlural}…","selectAllLabel":"Select all {resourceNamePlural}","selected":"{selectedItemsCount} selected","undo":"Undo","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural}","selectItem":"Select {resourceName}","selectButtonText":"Select","sortAccessibilityLabel":"sort {direction} by"},"Loading":{"label":"Page loading bar"},"Modal":{"iFrameTitle":"body markup","modalWarning":"These required properties are missing from Modal: {missingProps}"},"Page":{"Header":{"rollupActionsLabel":"View actions for {title}","pageReadyAccessibilityLabel":"{title}. This page is ready"}},"Pagination":{"previous":"Previous","next":"Next","pagination":"Pagination"},"ProgressBar":{"negativeWarningMessage":"Values passed to the progress prop shouldn’t be negative. Resetting {progress} to 0.","exceedWarningMessage":"Values passed to the progress prop shouldn’t exceed 100. Setting {progress} to 100."},"ResourceList":{"sortingLabel":"Sort by","defaultItemSingular":"item","defaultItemPlural":"items","showing":"Showing {itemsCount} {resource}","showingTotalCount":"Showing {itemsCount} of {totalItemsCount} {resource}","loading":"Loading {resource}","selected":"{selectedItemsCount} selected","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} in your store are selected","allFilteredItemsSelected":"All {itemsLength}+ {resourceNamePlural} in this filter are selected","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural} in your store","selectAllFilteredItems":"Select all {itemsLength}+ {resourceNamePlural} in this filter","emptySearchResultTitle":"No {resourceNamePlural} found","emptySearchResultDescription":"Try changing the filters or search term","selectButtonText":"Select","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}","Item":{"actionsDropdownLabel":"Actions for {accessibilityLabel}","actionsDropdown":"Actions dropdown","viewItem":"View details for {itemName}"},"BulkActions":{"actionsActivatorLabel":"Actions","moreActionsActivatorLabel":"More actions"}},"SkeletonPage":{"loadingLabel":"Page loading"},"Tabs":{"newViewAccessibilityLabel":"Create new view","newViewTooltip":"Create view","toggleTabsLabel":"More views","Tab":{"rename":"Rename view","duplicate":"Duplicate view","edit":"Edit view","editColumns":"Edit columns","delete":"Delete view","copy":"Copy of {name}","deleteModal":{"title":"Delete view?","description":"This can’t be undone. {viewName} view will no longer be available in your admin.","cancel":"Cancel","delete":"Delete view"}},"RenameModal":{"title":"Rename view","label":"Name","cancel":"Cancel","create":"Save","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"DuplicateModal":{"title":"Duplicate view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"CreateViewModal":{"title":"Create new view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}}},"Tag":{"ariaLabel":"Remove {children}"},"TextField":{"characterCount":"{count} characters","characterCountWithMaxLength":"{count} of {limit} characters used"},"TooltipOverlay":{"accessibilityLabel":"Tooltip: {label}"},"TopBar":{"toggleMenuLabel":"Toggle menu","SearchField":{"clearButtonLabel":"Clear","search":"Search"}},"MediaCard":{"dismissButton":"Dismiss","popoverButton":"Actions"},"VideoThumbnail":{"playButtonA11yLabel":{"default":"Play video","defaultWithDuration":"Play video of length {duration}","duration":{"hours":{"other":{"only":"{hourCount} hours","andMinutes":"{hourCount} hours and {minuteCount} minutes","andMinute":"{hourCount} hours and {minuteCount} minute","minutesAndSeconds":"{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hours, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hours, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hours, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hours and {secondCount} seconds","andSecond":"{hourCount} hours and {secondCount} second"},"one":{"only":"{hourCount} hour","andMinutes":"{hourCount} hour and {minuteCount} minutes","andMinute":"{hourCount} hour and {minuteCount} minute","minutesAndSeconds":"{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hour, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hour, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hour, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hour and {secondCount} seconds","andSecond":"{hourCount} hour and {secondCount} second"}},"minutes":{"other":{"only":"{minuteCount} minutes","andSeconds":"{minuteCount} minutes and {secondCount} seconds","andSecond":"{minuteCount} minutes and {secondCount} second"},"one":{"only":"{minuteCount} minute","andSeconds":"{minuteCount} minute and {secondCount} seconds","andSecond":"{minuteCount} minute and {secondCount} second"}},"seconds":{"other":"{secondCount} seconds","one":"{secondCount} second"}}}}}');
const polarisTranslations = {
  Polaris
};
const polarisStyles = "/assets/styles-Cg-8NA1P.css";
function loginErrorMessage(loginErrors) {
  if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  } else if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }
  return {};
}
const links = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader$a = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors, polarisTranslations };
};
const action$4 = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return {
    errors
  };
};
function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;
  return /* @__PURE__ */ jsx(AppProvider, { i18n: loaderData.polarisTranslations, children: /* @__PURE__ */ jsx(Page$5, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs(FormLayout, { children: [
    /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Log in" }),
    /* @__PURE__ */ jsx(
      TextField,
      {
        type: "text",
        name: "shop",
        label: "Shop domain",
        helpText: "example.myshopify.com",
        value: shop,
        onChange: setShop,
        autoComplete: "on",
        error: errors.shop
      }
    ),
    /* @__PURE__ */ jsx(Button, { submit: true, children: "Log in" })
  ] }) }) }) }) });
}
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: Auth,
  links,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
function Navigation({ createButtonText = "Create Campaign" }) {
  const location = useLocation();
  const currentPath = location.pathname;
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 rounded-lg shadow-sm p-1 flex items-center flex-1 mr-4", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/index",
          className: `${currentPath === "/app" || currentPath === "/app" ? "bg-indigo-600 text-white" : "text-gray-700"} px-8 py-3 rounded-lg font-medium text-center flex-1`,
          children: "Home"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/campaigns",
          className: `${currentPath.startsWith("/campaigns") ? "bg-indigo-600 text-white" : "text-gray-700"} px-8 py-3 rounded-lg font-medium text-center flex-1`,
          children: "All Campaigns"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/tutorial",
          className: `${currentPath === "/tutorial" ? "bg-indigo-600 text-white" : "text-gray-700"} px-8 py-3 rounded-lg font-medium text-center flex-1`,
          children: "Tutorial"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: currentPath.includes("/campaigns/create") ? "/campaigns" : "/campaigns/create",
        className: "bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap",
        children: createButtonText
      }
    ) })
  ] });
}
function CampaignActiveIndicator() {
  const { allCampaigns, isLoading } = useCampaign();
  const activeCampaign = allCampaigns.find(
    (campaign) => campaign.status === "active"
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center text-gray-500", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-pulse h-3 w-3 rounded-full bg-gray-300 mr-2" }),
      "Loading campaigns..."
    ] });
  }
  if (!activeCampaign) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center text-amber-600", children: [
      /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-amber-500 mr-2" }),
      "No active campaign"
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center text-green-600", children: [
    /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-green-500 mr-2" }),
    "Active: ",
    activeCampaign.name
  ] });
}
const loader$9 = async ({ request }) => {
  const { authenticateWithFallback: authenticateWithFallback2, isClientSideNavigation: isClientSideNavigation2 } = await Promise.resolve().then(() => shopify_server);
  const { connectToDatabase: connectToDatabase2 } = await Promise.resolve().then(() => mongodb_server);
  let campaigns = [];
  let shopName = null;
  const isClientNavigation = isClientSideNavigation2(request);
  try {
    const authResult = await authenticateWithFallback2(request);
    if (!authResult.success) {
      if (authResult.fallback && isClientNavigation) {
        console.log("Campaigns - Using fallback data for client navigation");
        return json({
          campaigns: [],
          shopName: authResult.shop || "unknown-shop",
          authError: "Authentication temporarily unavailable",
          fallbackMode: true,
          isAuthenticated: false
        });
      }
      const url = new URL(request.url);
      const shop = url.searchParams.get("shop");
      if (shop) {
        return Response.redirect(`/auth?shop=${shop}`, 302);
      }
      return Response.redirect(`/auth/login`, 302);
    }
    const { session } = authResult;
    shopName = session.shop;
    console.log("Campaigns - Authenticated successfully, shop:", shopName);
    try {
      const { db } = await connectToDatabase2(shopName);
      console.log("Campaigns - Fetching campaigns from database:", shopName);
      const campaignsCollection = db.collection("campaigns");
      const campaignsCursor = await campaignsCollection.find({}).sort({ createdAt: -1 });
      campaigns = await campaignsCursor.toArray();
      campaigns = campaigns.map((campaign) => ({
        ...campaign,
        _id: campaign._id.toString()
      }));
      console.log("Campaigns - Loaded campaigns:", (campaigns == null ? void 0 : campaigns.length) || 0);
    } catch (dbError) {
      console.error("Campaigns - Database error:", dbError);
      if (isClientNavigation) {
        campaigns = [];
      } else {
        return json({
          campaigns: [],
          error: "Failed to fetch campaigns from database",
          dbError: dbError.message
        });
      }
    }
    return json({
      campaigns,
      shopName,
      authError: null,
      fallbackMode: false,
      isAuthenticated: true
    });
  } catch (error) {
    console.error("Campaigns - Loader auth error:", error);
    if (isClientNavigation) {
      const url2 = new URL(request.url);
      shopName = url2.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain") || "unknown-shop";
      console.log(
        "Campaigns - Client navigation fallback, using shop:",
        shopName
      );
      return json({
        campaigns: [],
        shopName,
        authError: "Authentication temporarily unavailable",
        fallbackMode: true,
        isAuthenticated: false
      });
    }
    const url = new URL(request.url);
    shopName = url.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain");
    if (!shopName) {
      const referrer = request.headers.get("referer");
      if (referrer) {
        try {
          const referrerUrl = new URL(referrer);
          shopName = referrerUrl.searchParams.get("shop");
        } catch (e) {
          console.log("Could not parse referrer URL");
        }
      }
    }
    if (shopName) {
      console.log(
        "Campaigns - Authentication failed, using shop from request:",
        shopName
      );
      try {
        const { db } = await connectToDatabase2(shopName);
        console.log(
          "Campaigns - Fetching campaigns from database (fallback):",
          shopName
        );
        const campaignsCollection = db.collection("campaigns");
        const campaignsCursor = await campaignsCollection.find({}).sort({ createdAt: -1 });
        campaigns = await campaignsCursor.toArray();
        campaigns = campaigns.map((campaign) => ({
          ...campaign,
          _id: campaign._id.toString()
        }));
        console.log(
          "Campaigns - Loaded campaigns (fallback):",
          (campaigns == null ? void 0 : campaigns.length) || 0
        );
      } catch (dbError) {
        console.error("Campaigns - Database error (fallback):", dbError);
      }
      return json({
        campaigns,
        shopName,
        authError: "Authentication failed, but campaigns loaded from fallback",
        fallbackMode: false,
        // Don't show fallback mode if we have data
        isAuthenticated: false
      });
    } else {
      if (error && typeof error.status === "number" && error.status === 302) {
        throw error;
      }
      return json({
        campaigns: [],
        error: "Could not determine shop name. Please ensure you're accessing this from within the Shopify admin.",
        authError: true,
        fallbackMode: true,
        isAuthenticated: false
      });
    }
  }
};
function CampaignList() {
  var _a2;
  const data = useLoaderData();
  const {
    allCampaigns,
    toggleCampaignStatus,
    deleteCampaign,
    isLoading,
    dbStatus
  } = useCampaign();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const navigate = useNavigate();
  const campaigns = ((_a2 = data == null ? void 0 : data.campaigns) == null ? void 0 : _a2.length) > 0 ? data.campaigns : allCampaigns;
  const shouldShowFallback = (data == null ? void 0 : data.fallbackMode) && campaigns.length === 0;
  if (shouldShowFallback) {
    return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsx(Navigation, {}),
      /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6", children: /* @__PURE__ */ jsx("p", { className: "text-yellow-800", children: "⚠️ Running in offline mode. Campaign data may not be current. Please refresh the page to restore full functionality." }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: "All Campaigns" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Your campaigns will appear here once connectivity is restored." }),
          /* @__PURE__ */ jsx("h2", { className: "text-blue-600 mb-6", children: 'Please create campaigns using the "Create Campaign" button.' }),
          /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.reload(),
              className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors",
              children: "Refresh Page"
            }
          ) })
        ] })
      ] })
    ] });
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const handleCreateClick = () => {
    navigate("/campaigns/create");
  };
  const handleViewClick = (campaignId) => {
    console.log("Navigating to view campaign:", campaignId);
    navigate(`/campaigns/${campaignId}`);
  };
  const handleEditClick = (campaignId) => {
    console.log("Navigating to edit campaign:", campaignId);
    navigate(`/campaigns/edit/${campaignId}`);
  };
  const handleToggleStatus = async (campaignId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "draft" : "active";
      if (newStatus === "active") {
        toast.loading("Activating campaign and syncing to storefront...", {
          id: `toggle-${campaignId}`
        });
      } else {
        toast.loading("Deactivating campaign...", {
          id: `toggle-${campaignId}`
        });
      }
      const result = await toggleCampaignStatus(campaignId);
      if (result.success) {
        toast.success(
          `Campaign ${newStatus === "active" ? "activated and synced to storefront" : "deactivated"} successfully!`,
          { id: `toggle-${campaignId}` }
        );
      } else {
        toast.error("Failed to update campaign status", {
          id: `toggle-${campaignId}`
        });
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update campaign status", {
        id: `toggle-${campaignId}`
      });
    }
  };
  const handleDeleteClick = (campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };
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
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx(Navigation, {}),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-8", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "All Campaigns" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(CampaignActiveIndicator, {}) })
      ] }) }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" }) }) : campaigns.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: campaigns.map((campaign) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-3",
                style: {
                  backgroundColor: campaign.primaryColor || "#fe5300"
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800 truncate", children: campaign.name || "Unnamed Campaign" }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleToggleStatus(
                      campaign.id || campaign._id,
                      campaign.status
                    ),
                    className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${campaign.status === "active" ? "bg-indigo-600" : "bg-gray-200"}`,
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `${campaign.status === "active" ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`
                      }
                    )
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center mb-4", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === "active" ? "bg-green-100 text-green-800" : campaign.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`,
                  children: campaign.status ? campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) : "Draft"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-1", children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "w-4 h-4 mr-1",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: "2",
                          d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        }
                      )
                    }
                  ),
                  "Created:",
                  " ",
                  campaign.createdAt ? formatDate(campaign.createdAt) : "N/A"
                ] }),
                campaign.look && /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-1", children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "w-4 h-4 mr-1",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: "2",
                          d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        }
                      )
                    }
                  ),
                  "Look:",
                  " ",
                  campaign.look ? campaign.look.charAt(0).toUpperCase() + campaign.look.slice(1) : "N/A"
                ] }),
                campaign.color && /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "w-4 h-4 mr-1",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: "2",
                          d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        }
                      )
                    }
                  ),
                  "Color:",
                  " ",
                  campaign.color ? campaign.color.charAt(0).toUpperCase() + campaign.color.slice(1) : "N/A"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-3 border-t border-gray-100", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handleViewClick(campaign.id || campaign._id),
                      className: "text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center",
                      children: [
                        /* @__PURE__ */ jsxs(
                          "svg",
                          {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4 mr-1",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: [
                              /* @__PURE__ */ jsx(
                                "path",
                                {
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: "2",
                                  d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "path",
                                {
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: "2",
                                  d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                }
                              )
                            ]
                          }
                        ),
                        "View"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handleEditClick(campaign.id || campaign._id),
                      className: "text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center",
                      children: [
                        /* @__PURE__ */ jsx(
                          "svg",
                          {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4 mr-1",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: "2",
                                d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              }
                            )
                          }
                        ),
                        "Edit"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleDeleteClick(campaign),
                    className: "text-red-500 hover:text-red-700 text-sm font-medium flex items-center",
                    children: [
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          xmlns: "http://www.w3.org/2000/svg",
                          className: "h-4 w-4 mr-1",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          children: /* @__PURE__ */ jsx(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "2",
                              d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            }
                          )
                        }
                      ),
                      "Delete"
                    ]
                  }
                )
              ] })
            ] })
          ]
        },
        campaign.id || campaign._id || `campaign-${Math.random()}`
      )) }) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-8 text-center", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-16 h-16 mx-auto text-gray-400 mb-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-gray-700 mb-2", children: "No Campaigns Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-6", children: "You haven't created any campaigns yet. Get started by creating your first campaign." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCreateClick,
            className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
            children: "Create Your First Campaign"
          }
        )
      ] })
    ] }),
    showDeleteModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Delete Campaign" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        'Are you sure you want to delete "',
        campaignToDelete == null ? void 0 : campaignToDelete.name,
        '"? This action cannot be undone.'
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowDeleteModal(false),
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmDelete,
            className: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
function Campaigns$1() {
  const location = useLocation();
  return /* @__PURE__ */ jsx(PlanProvider, { children: /* @__PURE__ */ jsxs(CampaignProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    location.pathname === "/campaigns" && /* @__PURE__ */ jsx(CampaignList, {})
  ] }) });
}
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Campaigns$1,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
function CampaignPreview() {
  const { campaignData } = useCampaign();
  const mainColor = campaignData.color === "singleTone" ? campaignData.primaryColor : campaignData.secondaryColor;
  const accentColor = campaignData.color === "dualTone" ? campaignData.primaryColor : campaignData.primaryColor;
  return /* @__PURE__ */ jsx("div", { className: "campaign-preview-container", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium", children: "Preview" }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg overflow-hidden shadow-md", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsx("div", { className: "aspect-video bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-4 max-w-md mx-auto", children: [
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "text-2xl font-bold mb-4",
            style: { color: mainColor },
            children: campaignData.name || "GO AHEAD GIVE IT A SPIN!"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "relative w-64 h-64 mx-auto my-4", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full h-full rounded-full relative",
            style: {
              background: campaignData.color === "dualTone" ? `conic-gradient(
                        ${mainColor} 0deg, 
                        ${mainColor} 90deg, 
                        ${accentColor} 90deg, 
                        ${accentColor} 180deg, 
                        ${mainColor} 180deg, 
                        ${mainColor} 270deg, 
                        ${accentColor} 270deg, 
                        ${accentColor} 360deg
                      )` : `conic-gradient(
                        ${mainColor} 0deg, 
                        ${mainColor} 90deg, 
                        white 90deg, 
                        white 180deg, 
                        ${mainColor} 180deg, 
                        ${mainColor} 270deg, 
                        white 270deg, 
                        white 360deg
                      )`
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-black" }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-black rounded-full" }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full p-2 border rounded mb-3 text-center",
              placeholder: "Enter your email"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "w-full py-2 px-4 rounded font-bold text-white",
              style: { backgroundColor: mainColor },
              children: "SPIN NOW"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-2", children: "*Terms and conditions apply" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-40 mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gray-100 h-6 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-gray-300 rounded-full" }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-1", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-red-500 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xs", children: "S" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx(
              "h4",
              {
                className: "text-xs font-bold",
                style: { color: mainColor },
                children: campaignData.name || "GO AHEAD GIVE IT A SPIN!"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[6px] text-gray-500 my-1", children: "This is a special promotion just for you" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-full py-1 text-[8px] rounded font-bold text-white mt-2",
                style: { backgroundColor: mainColor },
                children: "SPIN NOW"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[4px] text-gray-500 mt-1", children: "*Terms and conditions apply" })
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
}
function StepOne() {
  const { campaignData, updateLook, updateColor, updateColorValues } = useCampaign();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorType, setActiveColorType] = useState("primary");
  const colorPalettes = {
    basic: [
      "#fe5300",
      "#ff0000",
      "#ff6b00",
      "#ffc700",
      "#00c853",
      "#00b0ff",
      "#304ffe",
      "#aa00ff"
    ],
    shopify: [
      "#95bf47",
      "#5e8e3e",
      "#212b35",
      "#637381",
      "#919eab",
      "#c4cdd5",
      "#dfe3e8",
      "#f4f6f8"
    ],
    modern: [
      "#ff5252",
      "#ff4081",
      "#e040fb",
      "#7c4dff",
      "#536dfe",
      "#448aff",
      "#40c4ff",
      "#18ffff"
    ],
    pastel: [
      "#ffcdd2",
      "#f8bbd0",
      "#e1bee7",
      "#d1c4e9",
      "#c5cae9",
      "#bbdefb",
      "#b3e5fc",
      "#b2ebf2"
    ],
    earth: [
      "#795548",
      "#a1887f",
      "#bcaaa4",
      "#d7ccc8",
      "#efebe9",
      "#8d6e63",
      "#6d4c41",
      "#5d4037"
    ]
  };
  const [activePalette, setActivePalette] = useState("basic");
  const handleLookChange = (look) => {
    console.log("Look change clicked:", look);
    updateLook(look);
  };
  const handleColorTypeChange = (colorType) => {
    console.log("Color type change clicked:", colorType);
    updateColor(colorType);
  };
  const handleColorChange = (colorType, value) => {
    console.log(`Color change: ${colorType} to ${value}`);
    updateColorValues(colorType, value);
    setShowColorPicker(false);
  };
  const toggleColorPicker = (colorType) => {
    console.log("Toggle color picker for:", colorType);
    setActiveColorType(colorType);
    setShowColorPicker(!showColorPicker);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8 pb-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Pick Your" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-indigo-700 mb-4", children: "Look" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `border p-4 mb-4 rounded-lg cursor-pointer ${campaignData.look === "custom" ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}`,
            onClick: () => handleLookChange("custom"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  id: "custom-layout",
                  name: "look",
                  className: "mt-1 mr-3",
                  checked: campaignData.look === "custom",
                  onChange: () => handleLookChange("custom")
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "custom-layout",
                    className: "font-medium text-gray-900 cursor-pointer",
                    children: "Custom Layout"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Design your way, from scratch." })
              ] })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-indigo-700 mb-4", children: "Color" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `border p-4 mb-4 rounded-lg cursor-pointer ${campaignData.color === "singleTone" ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}`,
            onClick: () => handleColorTypeChange("singleTone"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  id: "single-tone",
                  name: "color",
                  className: "mt-1 mr-3",
                  checked: campaignData.color === "singleTone",
                  onChange: () => handleColorTypeChange("singleTone")
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "single-tone",
                    className: "font-medium text-gray-900 cursor-pointer",
                    children: "Single Tone"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Use one primary brand color" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "w-10 h-10 rounded-full border border-gray-300 mr-2 shadow-sm hover:shadow-md",
                      style: { backgroundColor: campaignData.primaryColor },
                      onClick: (e) => {
                        e.stopPropagation();
                        toggleColorPicker("primary");
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-mono", children: campaignData.primaryColor })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `border p-4 rounded-lg cursor-pointer ${campaignData.color === "dualTone" ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}`,
            onClick: () => handleColorTypeChange("dualTone"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  id: "dual-tone",
                  name: "color",
                  className: "mt-1 mr-3",
                  checked: campaignData.color === "dualTone",
                  onChange: () => handleColorTypeChange("dualTone")
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "dual-tone",
                    className: "font-medium text-gray-900 cursor-pointer",
                    children: "Dual Tone"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Select two of your brand colors" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 mb-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "w-10 h-10 rounded-full border border-gray-300 mr-2 shadow-sm hover:shadow-md",
                      style: { backgroundColor: campaignData.secondaryColor },
                      onClick: (e) => {
                        e.stopPropagation();
                        toggleColorPicker("secondary");
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-mono", children: campaignData.secondaryColor })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "w-10 h-10 rounded-full border border-gray-300 mr-2 shadow-sm hover:shadow-md",
                      style: { backgroundColor: campaignData.primaryColor },
                      onClick: (e) => {
                        e.stopPropagation();
                        toggleColorPicker("primary");
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-mono", children: campaignData.primaryColor })
                ] })
              ] })
            ] })
          }
        )
      ] }),
      showColorPicker && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-xl max-w-md w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-lg font-medium", children: [
            "Select Color for",
            " ",
            activeColorType === "primary" ? "Primary" : activeColorType === "secondary" ? "Secondary" : "Primary"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowColorPicker(false),
              className: "text-gray-500 hover:text-gray-700",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  )
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex space-x-2 mb-4 overflow-x-auto pb-2", children: Object.keys(colorPalettes).map((palette) => /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-3 py-1 text-sm rounded-full ${activePalette === palette ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`,
            onClick: () => setActivePalette(palette),
            children: palette.charAt(0).toUpperCase() + palette.slice(1)
          },
          palette
        )) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 mb-4", children: colorPalettes[activePalette].map((color) => /* @__PURE__ */ jsx(
          "button",
          {
            className: "w-12 h-12 rounded-full border hover:scale-110 transition-transform shadow-sm",
            style: { backgroundColor: color },
            onClick: () => handleColorChange(activeColorType, color)
          },
          color
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Custom Color:" }),
          /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                value: activeColorType === "primary" ? campaignData.primaryColor : activeColorType === "secondary" ? campaignData.secondaryColor : campaignData.primaryColor,
                onChange: (e) => handleColorChange(activeColorType, e.target.value),
                className: "w-10 h-10 p-0 border-0 rounded-full"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: activeColorType === "primary" ? campaignData.primaryColor : activeColorType === "secondary" ? campaignData.secondaryColor : campaignData.primaryColor,
                onChange: (e) => handleColorChange(activeColorType, e.target.value),
                className: "ml-2 text-sm border rounded px-2 py-1 w-24 font-mono",
                placeholder: "#000000"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "ml-2 bg-indigo-600 text-white px-3 py-1 rounded text-sm",
                onClick: () => {
                  const currentColor = activeColorType === "primary" ? campaignData.primaryColor : activeColorType === "secondary" ? campaignData.secondaryColor : campaignData.primaryColor;
                  handleColorChange(activeColorType, currentColor);
                },
                children: "Apply"
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-1/2", children: /* @__PURE__ */ jsx(CampaignPreview, {}) })
  ] });
}
function StepNavigation({
  onNext,
  nextButtonText,
  showNextButton = true,
  showPrevButton = true
}) {
  const { campaignData, updateCampaignName, nextStep, prevStep } = useCampaign();
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(campaignData.name);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    setLocalName(campaignData.name);
  }, [campaignData.name]);
  const handleCampaignNameChange = (e) => {
    setLocalName(e.target.value);
  };
  const handleCampaignNameClick = () => {
    console.log("Campaign name clicked, enabling edit mode");
    setIsEditing(true);
  };
  const handleCampaignNameBlur = () => {
    console.log("Campaign name input blurred, saving name:", localName);
    setIsEditing(false);
    if (localName !== campaignData.name) {
      updateCampaignName(localName);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Enter key pressed in campaign name input");
      setIsEditing(false);
      if (localName !== campaignData.name) {
        updateCampaignName(localName);
      }
    }
  };
  const handleBackClick = () => {
    console.log("Back button clicked, current step:", campaignData.step);
    if (campaignData.step === 1) {
      toast.error("You're already at the first step!");
    } else {
      prevStep();
    }
  };
  const handleContinueClick = () => {
    console.log("Continue button clicked, current step:", campaignData.step);
    if (campaignData.step === 4) {
      if (onNext) {
        onNext();
      } else {
        setShowLaunchModal(true);
      }
    } else {
      nextStep();
    }
  };
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-40", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full h-1 bg-gray-200", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full bg-indigo-600 transition-all duration-300",
        style: { width: `${campaignData.completionPercentage}%` }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center justify-between", children: [
      showPrevButton ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleBackClick,
          className: `px-6 py-3 rounded-lg font-medium transition-colors ${campaignData.step === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`,
          disabled: campaignData.step === 1,
          children: "Back"
        }
      ) : /* @__PURE__ */ jsx("div", {}),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        isEditing ? /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            value: localName,
            onChange: handleCampaignNameChange,
            onBlur: handleCampaignNameBlur,
            onKeyDown: handleKeyDown,
            className: "border-b border-indigo-500 text-center font-medium text-lg px-2 py-1 focus:outline-none"
          }
        ) : /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: handleCampaignNameClick,
            className: "font-medium text-lg cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-center group",
            children: [
              campaignData.name,
              /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-4 w-4 ml-1 text-gray-400 group-hover:text-indigo-500",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
          "Step ",
          campaignData.step,
          " of 4"
        ] })
      ] }),
      showNextButton && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleContinueClick,
          className: "px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors",
          children: nextButtonText || (campaignData.step === 4 ? "Finish" : "Continue")
        }
      )
    ] })
  ] });
}
function StepSidebar({ activeStep, onStepClick }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex-col items-center p-4 rounded-lg mb-2 ${activeStep === 2 ? "bg-indigo-800" : "hover:bg-indigo-600 cursor-pointer"}`,
        onClick: () => onStepClick && onStepClick(2),
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Layout" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex-col items-center p-4 rounded-lg mb-2 ${activeStep === 3 ? "bg-indigo-800" : "hover:bg-indigo-600 cursor-pointer opacity-70"}`,
        onClick: () => onStepClick && onStepClick(3),
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Content" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex-col items-center p-4 rounded-lg ${activeStep === 4 ? "bg-indigo-800" : "hover:bg-indigo-600 cursor-pointer opacity-70"}`,
        onClick: () => onStepClick && onStepClick(4),
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Campaign rules" })
        ]
      }
    )
  ] });
}
function StepTwo() {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka;
  const { campaignData, updateCampaignData } = useCampaign();
  const [activePreviewTab, setActivePreviewTab] = useState("landing");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  useRef(null);
  const [floatingButtonText, setFloatingButtonText] = useState("SPIN & WIN");
  useEffect(() => {
    if (!campaignData.layout) {
      updateCampaignData({
        layout: {
          theme: "light",
          wheelSectors: "eight",
          displayStyle: "popup",
          popupLayout: "center",
          showFloatingButton: true,
          floatingButtonPosition: "bottomRight",
          floatingButtonHasText: true,
          floatingButtonText: "SPIN & WIN",
          logo: null
        }
      });
    } else {
      setFloatingButtonText(
        campaignData.layout.floatingButtonText || "SPIN & WIN"
      );
      if (campaignData.layout.logo) {
        setLogoPreview(campaignData.layout.logo);
      }
    }
  }, [campaignData, updateCampaignData]);
  const handleThemeChange = (theme) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        theme
      }
    });
  };
  const handleWheelSectorsChange = (wheelSectors) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        wheelSectors
      }
    });
  };
  const handleDisplayStyleChange = (displayStyle) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        displayStyle
      }
    });
  };
  const handlePopupLayoutChange = (popupLayout) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        popupLayout
      }
    });
  };
  const handleFloatingButtonToggle = (showFloatingButton) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        showFloatingButton
      }
    });
  };
  const handleFloatingButtonPositionChange = (floatingButtonPosition) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        floatingButtonPosition
      }
    });
  };
  const handleFloatingButtonTextToggle = (floatingButtonHasText) => {
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        floatingButtonHasText
      }
    });
  };
  const handleFloatingButtonTextChange = (e) => {
    const text2 = e.target.value;
    setFloatingButtonText(text2);
    updateCampaignData({
      layout: {
        ...campaignData.layout,
        floatingButtonText: text2
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center lg:flex-row gap-8 pb-24", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-1/6 bg-indigo-700 text-white rounded-lg p-4", children: /* @__PURE__ */ jsx(
      StepSidebar,
      {
        activeStep: 2,
        onStepClick: (step) => {
          if (step !== 2) {
            if (step > campaignData.step) {
              if (step <= campaignData.step + 1) {
                updateCampaignData({ step });
              }
            } else {
              updateCampaignData({ step });
            }
          }
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-2/5", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "flex items-center text-lg font-medium mb-2", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-2",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z",
                  clipRule: "evenodd"
                }
              )
            }
          ),
          "Colour Selected"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-md shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mb-1", children: [
            campaignData.color === "singleTone" ? "Single Tone" : "Dual Tone",
            ": ",
            campaignData.color === "singleTone" ? "Color_01" : "Colors"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-8 h-8 rounded border border-gray-300 mr-2",
                style: { backgroundColor: campaignData.primaryColor }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-mono", children: campaignData.primaryColor }),
            campaignData.color === "dualTone" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-8 h-8 rounded border border-gray-300 mx-2",
                  style: { backgroundColor: campaignData.secondaryColor }
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-mono", children: campaignData.secondaryColor })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium", children: "Select your campaign theme" }),
          /* @__PURE__ */ jsx("div", { className: "ml-2 text-gray-500 cursor-help", children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z",
                  clipRule: "evenodd"
                }
              )
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `flex-1 py-2 px-4 rounded-full ${((_a2 = campaignData.layout) == null ? void 0 : _a2.theme) === "light" ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700" : "bg-white border border-gray-300 text-gray-700"}`,
              onClick: () => handleThemeChange("light"),
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-4 h-4 rounded-full mr-2 ${((_b = campaignData.layout) == null ? void 0 : _b.theme) === "light" ? "bg-indigo-500" : "bg-gray-200"}`
                  }
                ),
                "Light Theme"
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `flex-1 py-2 px-4 rounded-full ${((_c = campaignData.layout) == null ? void 0 : _c.theme) === "dark" ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700" : "bg-white border border-gray-300 text-gray-700"}`,
              onClick: () => handleThemeChange("dark"),
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-4 h-4 rounded-full mr-2 ${((_d = campaignData.layout) == null ? void 0 : _d.theme) === "dark" ? "bg-indigo-500" : "bg-gray-200"}`
                  }
                ),
                "Dark Theme"
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "flex items-center text-lg font-medium mb-2", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-2",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" }),
                /* @__PURE__ */ jsx("path", { d: "M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" })
              ]
            }
          ),
          "Wheel Sector"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_e = campaignData.layout) == null ? void 0 : _e.wheelSectors) === "four" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handleWheelSectorsChange("four"),
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-16 h-16", children: [
                  /* @__PURE__ */ jsx("path", { d: "M50 50 L50 0 A50 50 0 0 1 100 50 Z", fill: "#e0e0ff" }),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L100 50 A50 50 0 0 1 50 100 Z",
                      fill: "#d0d0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx("path", { d: "M50 50 L50 100 A50 50 0 0 1 0 50 Z", fill: "#e0e0ff" }),
                  /* @__PURE__ */ jsx("path", { d: "M50 50 L0 50 A50 50 0 0 1 50 0 Z", fill: "#d0d0ff" }),
                  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "4", fill: "#4f46e5" })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Four" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_f = campaignData.layout) == null ? void 0 : _f.wheelSectors) === "six" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handleWheelSectorsChange("six"),
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-16 h-16", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L50 0 A50 50 0 0 1 93.3 25 Z",
                      fill: "#e0e0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L93.3 25 A50 50 0 0 1 93.3 75 Z",
                      fill: "#d0d0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L93.3 75 A50 50 0 0 1 50 100 Z",
                      fill: "#e0e0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L50 100 A50 50 0 0 1 6.7 75 Z",
                      fill: "#d0d0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L6.7 75 A50 50 0 0 1 6.7 25 Z",
                      fill: "#e0e0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx("path", { d: "M50 50 L6.7 25 A50 50 0 0 1 50 0 Z", fill: "#d0d0ff" }),
                  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "4", fill: "#4f46e5" })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Six" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_g = campaignData.layout) == null ? void 0 : _g.wheelSectors) === "eight" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handleWheelSectorsChange("eight"),
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-16 h-16", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L50 0 A50 50 0 0 1 85.4 14.6 Z",
                      fill: "#e0e0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L85.4 14.6 A50 50 0 0 1 100 50 Z",
                      fill: "#d0d0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L100 50 A50 50 0 0 1 85.4 85.4 Z",
                      fill: "#e0e0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L85.4 85.4 A50 50 0 0 1 50 100 Z",
                      fill: "#d0d0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L50 100 A50 50 0 0 1 14.6 85.4 Z",
                      fill: "#e0e0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L14.6 85.4 A50 50 0 0 1 0 50 Z",
                      fill: "#d0d0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L0 50 A50 50 0 0 1 14.6 14.6 Z",
                      fill: "#e0e0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M50 50 L14.6 14.6 A50 50 0 0 1 50 0 Z",
                      fill: "#d0d0ff"
                    }
                  ),
                  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "4", fill: "#4f46e5" })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Eight" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "flex items-center text-lg font-medium mb-2", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-2",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z",
                  clipRule: "evenodd"
                }
              )
            }
          ),
          "Campaign Display Style"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_h = campaignData.layout) == null ? void 0 : _h.displayStyle) === "fullscreen" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handleDisplayStyleChange("fullscreen"),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-16 h-16 rounded-full overflow-hidden relative", children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-indigo-200" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 w-6 h-6 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "absolute text-xs bg-indigo-600 text-white px-2 py-1 rounded-full", children: "15%" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Full screen" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_i = campaignData.layout) == null ? void 0 : _i.displayStyle) === "popup" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handleDisplayStyleChange("popup"),
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-16 border-2 border-indigo-300 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-8 h-8 rounded-full overflow-hidden relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-indigo-200" }),
                  /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" })
                ] }) }) }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Pop-Up" })
              ]
            }
          )
        ] })
      ] }),
      ((_j = campaignData.layout) == null ? void 0 : _j.displayStyle) === "popup" && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center text-lg font-medium", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-5 w-5 mr-2",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z",
                    clipRule: "evenodd"
                  }
                )
              }
            ),
            "Layout of the Popup"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `w-8 h-8 flex items-center justify-center rounded-md ${previewDevice === "mobile" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`,
                onClick: () => setPreviewDevice("mobile"),
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `w-8 h-8 flex items-center justify-center rounded-md ${previewDevice === "desktop" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`,
                onClick: () => setPreviewDevice("desktop"),
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_k = campaignData.layout) == null ? void 0 : _k.popupLayout) === "center" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handlePopupLayoutChange("center"),
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-2 border-indigo-300 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-200" }) }) }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Centre" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_l = campaignData.layout) == null ? void 0 : _l.popupLayout) === "top" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handlePopupLayoutChange("top"),
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-2 border-indigo-300 rounded-md flex items-start justify-center pt-2", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-200" }) }) }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Top" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `cursor-pointer ${((_m = campaignData.layout) == null ? void 0 : _m.popupLayout) === "bottom" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
              onClick: () => handlePopupLayoutChange("bottom"),
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-2 border-indigo-300 rounded-md flex items-end justify-center pb-2", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-200" }) }) }),
                /* @__PURE__ */ jsx("div", { className: "text-center mt-2 text-sm", children: "Bottom" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "flex items-center text-lg font-medium mb-2", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-2",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z",
                  clipRule: "evenodd"
                }
              )
            }
          ),
          "Floating Button"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "mr-3 text-sm", children: "Show the Floating button" }),
          /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "sr-only peer",
                checked: ((_n = campaignData.layout) == null ? void 0 : _n.showFloatingButton) || false,
                onChange: (e) => handleFloatingButtonToggle(e.target.checked)
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
          ] })
        ] }),
        ((_o = campaignData.layout) == null ? void 0 : _o.showFloatingButton) && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium mb-2", children: "Position on the page" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `cursor-pointer ${((_p = campaignData.layout) == null ? void 0 : _p.floatingButtonPosition) === "bottomLeft" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
                  onClick: () => handleFloatingButtonPositionChange("bottomLeft"),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-2 rounded-md h-20 relative", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1 w-6 h-6 bg-indigo-500 rounded-full" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-2" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-4" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-6" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-center mt-1 text-xs", children: "Bottom left" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `cursor-pointer ${((_q = campaignData.layout) == null ? void 0 : _q.floatingButtonPosition) === "bottomRight" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
                  onClick: () => handleFloatingButtonPositionChange("bottomRight"),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-2 rounded-md h-20 relative", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 right-1 w-6 h-6 bg-indigo-500 rounded-full" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-2" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-4" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-6" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-center mt-1 text-xs", children: "Bottom right" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `cursor-pointer ${((_r = campaignData.layout) == null ? void 0 : _r.floatingButtonPosition) === "topRight" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
                  onClick: () => handleFloatingButtonPositionChange("topRight"),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-2 rounded-md h-20 relative", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute top-1 right-1 w-6 h-6 bg-indigo-500 rounded-full" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-8" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-10" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-12" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-center mt-1 text-xs", children: "Top right" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `cursor-pointer ${((_s = campaignData.layout) == null ? void 0 : _s.floatingButtonPosition) === "centerBottom" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`,
                  onClick: () => handleFloatingButtonPositionChange("centerBottom"),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-2 rounded-md h-20 relative", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-indigo-500 rounded-md" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-2" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-4" }),
                      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full absolute top-6" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-center mt-1 text-xs", children: "Centre bottom" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium mb-2", children: "Want a text on floating button?" }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `py-2 px-6 rounded-full ${((_t = campaignData.layout) == null ? void 0 : _t.floatingButtonHasText) ? "bg-indigo-600 text-white" : "bg-white border border-gray-300 text-gray-700"}`,
                  onClick: () => handleFloatingButtonTextToggle(true),
                  children: "Yes"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `py-2 px-6 rounded-full ${!((_u = campaignData.layout) == null ? void 0 : _u.floatingButtonHasText) ? "bg-indigo-600 text-white" : "bg-white border border-gray-300 text-gray-700"}`,
                  onClick: () => handleFloatingButtonTextToggle(false),
                  children: "No"
                }
              )
            ] })
          ] }),
          ((_v = campaignData.layout) == null ? void 0 : _v.floatingButtonHasText) && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium mb-2", children: "Text" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: floatingButtonText || "",
                  onChange: handleFloatingButtonTextChange,
                  className: "w-full p-2 border rounded-md pr-12",
                  maxLength: 18,
                  placeholder: "SPIN & WIN"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
                (floatingButtonText || "").length,
                "/18"
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-2/5", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg sticky top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-full overflow-hidden flex border border-indigo-600 p-1", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `px-4 py-2 rounded-full flex items-center ${previewDevice === "mobile" ? "bg-indigo-600 text-white" : "text-indigo-600"}`,
              onClick: () => setPreviewDevice("mobile"),
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 inline-block mr-1",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ),
                "Mobile"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `px-4 py-2 rounded-full flex items-center ${previewDevice === "desktop" ? "bg-indigo-600 text-white" : "text-indigo-600"}`,
              onClick: () => setPreviewDevice("desktop"),
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 inline-block mr-1",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ),
                "Desktop"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "text-gray-500 flex items-center", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-1",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                    clipRule: "evenodd"
                  }
                )
              ]
            }
          ),
          "Preview"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-full relative bg-gray-700 flex items-center justify-center", children: previewDevice === "desktop" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        activePreviewTab === "landing" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `w-full h-full rounded-lg overflow-hidden p-4 ${((_w = campaignData.layout) == null ? void 0 : _w.theme) === "dark" ? "bg-gray-900" : "bg-white"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-center ${((_x = campaignData.layout) == null ? void 0 : _x.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                    children: logoPreview && /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: logoPreview || "/placeholder.svg",
                        alt: "Logo",
                        className: "h-8 mx-auto object-contain"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: `h-5 w-5 ${((_y = campaignData.layout) == null ? void 0 : _y.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-row h-[calc(100%-3rem)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-1/2 flex flex-col pr-6", children: [
                  /* @__PURE__ */ jsx(
                    "h2",
                    {
                      className: "text-2xl font-bold mb-4",
                      style: { color: campaignData.primaryColor },
                      children: "GO AHEAD GIVE IT A SPIN!"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: `text-base mb-6 ${((_z = campaignData.layout) == null ? void 0 : _z.theme) === "dark" ? "text-gray-300" : "text-gray-600"}`,
                      children: "This is a demo of our spin to Win displays"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-6", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        id: "preview-terms",
                        className: "mr-2",
                        checked: true,
                        readOnly: true
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        htmlFor: "preview-terms",
                        className: `text-sm ${((_A = campaignData.layout) == null ? void 0 : _A.theme) === "dark" ? "text-gray-300" : "text-gray-600"}`,
                        children: "I accept the T&C and Privacy Notice."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      placeholder: "Enter your email",
                      className: "w-full p-3 border rounded mb-6",
                      readOnly: true
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "w-full py-3 font-bold text-white rounded text-lg",
                      style: { backgroundColor: campaignData.primaryColor },
                      children: "SPIN NOW"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: `text-sm mt-4 ${((_B = campaignData.layout) == null ? void 0 : _B.theme) === "dark" ? "text-gray-400" : "text-gray-500"}`,
                      children: "No, I don't feel lucky today!"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-1/2 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "relative w-64 h-64", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "w-full h-full rounded-full",
                    style: {
                      background: ((_C = campaignData.layout) == null ? void 0 : _C.wheelSectors) === "four" ? `conic-gradient(
                ${campaignData.primaryColor} 0deg, 
                ${campaignData.primaryColor} 90deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                ${campaignData.primaryColor} 180deg, 
                ${campaignData.primaryColor} 270deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
              )` : ((_D = campaignData.layout) == null ? void 0 : _D.wheelSectors) === "six" ? `conic-gradient(
                ${campaignData.primaryColor} 0deg, 
                ${campaignData.primaryColor} 60deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 60deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 120deg, 
                ${campaignData.primaryColor} 120deg, 
                ${campaignData.primaryColor} 180deg,
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 240deg,
                ${campaignData.primaryColor} 240deg, 
                ${campaignData.primaryColor} 300deg,
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 300deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
              )` : `conic-gradient(
                ${campaignData.primaryColor} 0deg, 
                ${campaignData.primaryColor} 45deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 45deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg,
                ${campaignData.primaryColor} 90deg, 
                ${campaignData.primaryColor} 135deg,
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 135deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg,
                ${campaignData.primaryColor} 180deg, 
                ${campaignData.primaryColor} 225deg,
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 225deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg,
                ${campaignData.primaryColor} 270deg, 
                ${campaignData.primaryColor} 315deg,
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 315deg, 
                ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
              )`
                    },
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-black" }) }),
                      ((_E = campaignData.layout) == null ? void 0 : _E.wheelSectors) === "four" && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: "10% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90", children: "FREE SHIP" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: "20% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90", children: "NO LUCK" })
                      ] }),
                      ((_F = campaignData.layout) == null ? void 0 : _F.wheelSectors) === "six" && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: "10% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-60", children: "FREE SHIP" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-120", children: "15% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: "20% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-120", children: "5% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-60", children: "NO LUCK" })
                      ] }),
                      ((_G = campaignData.layout) == null ? void 0 : _G.wheelSectors) === "eight" && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: "10% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-45", children: "FREE SHIP" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90", children: "15% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-135", children: "BOGO" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: "20% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-135", children: "5% OFF" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90", children: "GIFT" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-45", children: "NO LUCK" })
                      ] })
                    ]
                  }
                ) }) })
              ] })
            ]
          }
        ),
        activePreviewTab === "result" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `w-full h-full rounded-lg overflow-hidden p-4 ${((_H = campaignData.layout) == null ? void 0 : _H.theme) === "dark" ? "bg-gray-900" : "bg-white"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-center ${((_I = campaignData.layout) == null ? void 0 : _I.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                    children: logoPreview && /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: logoPreview || "/placeholder.svg",
                        alt: "Logo",
                        className: "h-8 mx-auto object-contain"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: `h-5 w-5 ${((_J = campaignData.layout) == null ? void 0 : _J.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-row h-[calc(100%-3rem)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-1/2 flex flex-col pr-6", children: [
                  /* @__PURE__ */ jsx(
                    "h2",
                    {
                      className: "text-2xl font-bold mb-4",
                      style: { color: campaignData.primaryColor },
                      children: "CONGRATULATIONS!"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: `text-base mb-6 ${((_K = campaignData.layout) == null ? void 0 : _K.theme) === "dark" ? "text-gray-300" : "text-gray-600"}`,
                      children: "You've won a 10% discount on your next purchase"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-full p-4 mb-6 text-center font-bold text-lg border-2 border-dashed",
                      style: {
                        borderColor: campaignData.primaryColor,
                        color: campaignData.primaryColor
                      },
                      children: "WINNER10"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "w-full py-3 font-bold text-white rounded mb-4 text-lg",
                      style: { backgroundColor: campaignData.primaryColor },
                      children: "COPY CODE"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: `w-full py-3 font-bold rounded text-lg ${((_L = campaignData.layout) == null ? void 0 : _L.theme) === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`,
                      children: "SHOP NOW"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-1/2 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "relative w-64 h-64 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-48 h-48 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-24 w-24 text-green-500",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M5 13l4 4L19 7"
                      }
                    )
                  }
                ) }) }) })
              ] })
            ]
          }
        ),
        activePreviewTab === "floating" && ((_M = campaignData.layout) == null ? void 0 : _M.showFloatingButton) && /* @__PURE__ */ jsxs("div", { className: "w-full h-[400px] relative bg-gray-50 flex items-center justify-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full h-full p-4 flex flex-col", children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute ${((_N = campaignData.layout) == null ? void 0 : _N.floatingButtonPosition) === "bottomLeft" ? "bottom-4 left-4" : ((_O = campaignData.layout) == null ? void 0 : _O.floatingButtonPosition) === "bottomRight" ? "bottom-4 right-4" : ((_P = campaignData.layout) == null ? void 0 : _P.floatingButtonPosition) === "topRight" ? "top-4 right-4" : "bottom-4 left-1/2 transform -translate-x-1/2"}`,
              children: ((_Q = campaignData.layout) == null ? void 0 : _Q.floatingButtonHasText) ? /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center px-4 py-2 rounded-full text-white",
                  style: {
                    backgroundColor: campaignData.primaryColor
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2", children: /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5",
                        viewBox: "0 0 20 20",
                        fill: campaignData.primaryColor,
                        children: [
                          /* @__PURE__ */ jsx(
                            "path",
                            {
                              fillRule: "evenodd",
                              d: "M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z",
                              clipRule: "evenodd"
                            }
                          ),
                          /* @__PURE__ */ jsx("path", { d: "M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold", children: floatingButtonText || "SPIN & WIN" })
                  ]
                }
              ) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-full flex items-center justify-center",
                  style: {
                    backgroundColor: campaignData.primaryColor
                  },
                  children: /* @__PURE__ */ jsxs(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "h-6 w-6 text-white",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      children: [
                        /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z",
                            clipRule: "evenodd"
                          }
                        ),
                        /* @__PURE__ */ jsx("path", { d: "M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" })
                      ]
                    }
                  )
                }
              )
            }
          )
        ] })
      ] }) : (
        // Mobile view
        /* @__PURE__ */ jsxs("div", { className: "w-56 h-[480px] bg-gray-900 rounded-3xl p-2 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full" }),
          /* @__PURE__ */ jsxs("div", { className: "w-full h-full bg-gray-800 rounded-2xl overflow-hidden", children: [
            activePreviewTab === "landing" && /* @__PURE__ */ jsxs(
              "div",
              {
                className: `w-full h-full ${((_R = campaignData.layout) == null ? void 0 : _R.theme) === "dark" ? "bg-gray-900" : "bg-white"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-6 h-6" }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `text-center ${((_S = campaignData.layout) == null ? void 0 : _S.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                        children: logoPreview && /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: logoPreview || "/placeholder.svg",
                            alt: "Logo",
                            className: "h-6 mx-auto object-contain"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "w-6 h-6 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: `h-4 w-4 ${((_T = campaignData.layout) == null ? void 0 : _T.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                            clipRule: "evenodd"
                          }
                        )
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 flex flex-col items-center", children: [
                    /* @__PURE__ */ jsx(
                      "h2",
                      {
                        className: "text-base font-bold mb-1",
                        style: { color: campaignData.primaryColor },
                        children: "GO AHEAD GIVE IT A SPIN!"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: `text-xs mb-2 ${((_U = campaignData.layout) == null ? void 0 : _U.theme) === "dark" ? "text-gray-300" : "text-gray-600"}`,
                        children: "This is a demo of our spin to Win displays"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "checkbox",
                          id: "preview-terms-mobile",
                          className: "mr-1",
                          checked: true,
                          readOnly: true
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          htmlFor: "preview-terms-mobile",
                          className: `text-[10px] ${((_V = campaignData.layout) == null ? void 0 : _V.theme) === "dark" ? "text-gray-300" : "text-gray-600"}`,
                          children: "I accept the T&C and Privacy Notice."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "email",
                        placeholder: "Enter your email",
                        className: "w-full p-1 text-sm border rounded mb-2",
                        readOnly: true
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "w-full py-1 text-sm font-bold text-white rounded",
                        style: { backgroundColor: campaignData.primaryColor },
                        children: "SPIN NOW"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: `text-[10px] mt-1 ${((_W = campaignData.layout) == null ? void 0 : _W.theme) === "dark" ? "text-gray-400" : "text-gray-500"}`,
                        children: "No, I don't feel lucky today!"
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "mt-4 relative w-40 h-40", children: /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "w-full h-full rounded-full",
                        style: {
                          background: ((_X = campaignData.layout) == null ? void 0 : _X.wheelSectors) === "four" ? `conic-gradient(
                            ${campaignData.primaryColor} 0deg, 
                            ${campaignData.primaryColor} 90deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                            ${campaignData.primaryColor} 180deg, 
                            ${campaignData.primaryColor} 270deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                          )` : ((_Y = campaignData.layout) == null ? void 0 : _Y.wheelSectors) === "six" ? `conic-gradient(
                            ${campaignData.primaryColor} 0deg, 
                            ${campaignData.primaryColor} 60deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 60deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 120deg, 
                            ${campaignData.primaryColor} 120deg, 
                            ${campaignData.primaryColor} 180deg,
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 240deg,
                            ${campaignData.primaryColor} 240deg, 
                            ${campaignData.primaryColor} 300deg,
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 300deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                          )` : `conic-gradient(
                            ${campaignData.primaryColor} 0deg, 
                            ${campaignData.primaryColor} 45deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 45deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg,
                            ${campaignData.primaryColor} 90deg, 
                            ${campaignData.primaryColor} 135deg,
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 135deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg,
                            ${campaignData.primaryColor} 180deg, 
                            ${campaignData.primaryColor} 225deg,
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 225deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg,
                            ${campaignData.primaryColor} 270deg, 
                            ${campaignData.primaryColor} 315deg,
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 315deg, 
                            ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                          )`
                        },
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-white border-2 border-gray-300" }) }),
                          ((_Z = campaignData.layout) == null ? void 0 : _Z.wheelSectors) === "four" && /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold", children: "10% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold rotate-90", children: "FREE SHIP" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold rotate-180", children: "20% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold -rotate-90", children: "NO LUCK" })
                          ] }),
                          ((__ = campaignData.layout) == null ? void 0 : __.wheelSectors) === "six" && /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold", children: "10% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-60", children: "FREE SHIP" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-120", children: "15% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-180", children: "20% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-120", children: "5% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-60", children: "NO LUCK" })
                          ] }),
                          ((_$ = campaignData.layout) == null ? void 0 : _$.wheelSectors) === "eight" && /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold", children: "10% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-45", children: "FREE SHIP" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-90", children: "15% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-135", children: "BOGO" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold rotate-180", children: "20% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-135", children: "5% OFF" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-90", children: "GIFT" }),
                            /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-[6px] font-bold -rotate-45", children: "NO LUCK" })
                          ] })
                        ]
                      }
                    ) })
                  ] })
                ]
              }
            ),
            activePreviewTab === "result" && /* @__PURE__ */ jsxs(
              "div",
              {
                className: `w-full h-full ${((_aa = campaignData.layout) == null ? void 0 : _aa.theme) === "dark" ? "bg-gray-900" : "bg-white"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-6 h-6" }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `text-center ${((_ba = campaignData.layout) == null ? void 0 : _ba.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                        children: logoPreview && /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: logoPreview || "/placeholder.svg",
                            alt: "Logo",
                            className: "h-6 mx-auto object-contain"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "w-6 h-6 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: `h-4 w-4 ${((_ca = campaignData.layout) == null ? void 0 : _ca.theme) === "dark" ? "text-white" : "text-gray-800"}`,
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                            clipRule: "evenodd"
                          }
                        )
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 flex flex-col items-center", children: [
                    /* @__PURE__ */ jsx(
                      "h2",
                      {
                        className: "text-base font-bold mb-1",
                        style: { color: campaignData.primaryColor },
                        children: "CONGRATULATIONS!"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: `text-xs mb-2 ${((_da = campaignData.layout) == null ? void 0 : _da.theme) === "dark" ? "text-gray-300" : "text-gray-600"}`,
                        children: "You've won a 10% discount on your next purchase"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-full p-2 mb-3 text-center font-bold text-sm border-2 border-dashed",
                        style: {
                          borderColor: campaignData.primaryColor,
                          color: campaignData.primaryColor
                        },
                        children: "WINNER10"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "w-full py-1 text-sm font-bold text-white rounded mb-2",
                        style: { backgroundColor: campaignData.primaryColor },
                        children: "COPY CODE"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: `w-full py-1 text-sm font-bold rounded ${((_ea = campaignData.layout) == null ? void 0 : _ea.theme) === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`,
                        children: "SHOP NOW"
                      }
                    )
                  ] })
                ]
              }
            ),
            activePreviewTab === "floating" && ((_fa = campaignData.layout) == null ? void 0 : _fa.showFloatingButton) && /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-full h-full relative ${((_ga = campaignData.layout) == null ? void 0 : _ga.theme) === "dark" ? "bg-gray-900" : "bg-white"}`,
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `absolute ${((_ha = campaignData.layout) == null ? void 0 : _ha.floatingButtonPosition) === "bottomLeft" ? "bottom-4 left-4" : ((_ia = campaignData.layout) == null ? void 0 : _ia.floatingButtonPosition) === "bottomRight" ? "bottom-4 right-4" : ((_ja = campaignData.layout) == null ? void 0 : _ja.floatingButtonPosition) === "topRight" ? "top-4 right-4" : "bottom-4 left-1/2 transform -translate-x-1/2"}`,
                    children: ((_ka = campaignData.layout) == null ? void 0 : _ka.floatingButtonHasText) ? /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex items-center px-3 py-1 rounded-full text-white text-xs",
                        style: {
                          backgroundColor: campaignData.primaryColor
                        },
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-white rounded-full flex items-center justify-center mr-1", children: /* @__PURE__ */ jsxs(
                            "svg",
                            {
                              xmlns: "http://www.w3.org/2000/svg",
                              className: "h-4 w-4",
                              viewBox: "0 0 20 20",
                              fill: campaignData.primaryColor,
                              children: [
                                /* @__PURE__ */ jsx(
                                  "path",
                                  {
                                    fillRule: "evenodd",
                                    d: "M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z",
                                    clipRule: "evenodd"
                                  }
                                ),
                                /* @__PURE__ */ jsx("path", { d: "M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" })
                              ]
                            }
                          ) }),
                          /* @__PURE__ */ jsx("span", { className: "font-bold", children: floatingButtonText || "SPIN & WIN" })
                        ]
                      }
                    ) : /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-10 h-10 rounded-full flex items-center justify-center",
                        style: {
                          backgroundColor: campaignData.primaryColor
                        },
                        children: /* @__PURE__ */ jsxs(
                          "svg",
                          {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5 text-white",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            children: [
                              /* @__PURE__ */ jsx(
                                "path",
                                {
                                  fillRule: "evenodd",
                                  d: "M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z",
                                  clipRule: "evenodd"
                                }
                              ),
                              /* @__PURE__ */ jsx("path", { d: "M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" })
                            ]
                          }
                        )
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] })
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center mt-4 border-b", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activePreviewTab === "landing" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActivePreviewTab("landing"),
            children: "Landing Screen"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activePreviewTab === "result" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActivePreviewTab("result"),
            children: "Result screen"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activePreviewTab === "floating" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActivePreviewTab("floating"),
            children: "Floating Button"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(StepNavigation, {})
  ] });
}
function StepThree() {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea, _Fa, _Ga, _Ha, _Ia, _Ja, _Ka, _La, _Ma, _Na, _Oa, _Pa, _Qa, _Ra, _Sa, _Ta, _Ua, _Va, _Wa, _Xa, _Ya, _Za, __a, _$a, _ab, _bb, _cb, _db, _eb, _fb, _gb, _hb, _ib, _jb, _kb, _lb, _mb, _nb, _ob, _pb, _qb, _rb, _sb, _tb, _ub, _vb, _wb, _xb, _yb, _zb, _Ab, _Bb, _Cb, _Db, _Eb, _Fb, _Gb, _Hb, _Ib, _Jb, _Kb, _Lb, _Mb, _Nb, _Ob, _Pb, _Qb, _Rb, _Sb, _Tb, _Ub, _Vb, _Wb, _Xb, _Yb, _Zb, __b, _$b, _ac, _bc, _cc, _dc, _ec, _fc, _gc, _hc, _ic;
  const { campaignData, updateCampaignData } = useCampaign();
  const { discountCodes, setDiscountCodes, fetchAndSetDiscountCodes, currentPlan } = usePlan();
  const [activeTab, setActiveTab] = useState("landing");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFileField, setCurrentFileField] = useState(null);
  const fileInputRef = useRef(null);
  const [localDiscountCodes, setLocalDiscountCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [codesError, setCodesError] = useState(null);
  console.log("=== StepThree Component Debug ===");
  console.log("Current Plan:", currentPlan);
  console.log("campaignData:", campaignData);
  console.log("discountCodes from context:", discountCodes);
  console.log("discountCodes length:", (discountCodes == null ? void 0 : discountCodes.length) || 0);
  console.log("discountCodes type:", typeof discountCodes);
  console.log(
    "Global discount codes:",
    typeof window !== "undefined" ? (_a2 = window.GLOBAL_DISCOUNT_CODES) == null ? void 0 : _a2.length : "N/A"
  );
  console.log(
    "localStorage codes:",
    typeof window !== "undefined" ? (() => {
      try {
        const stored = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
        return stored ? JSON.parse(stored).length : "None";
      } catch (e) {
        return "Error";
      }
    })() : "N/A"
  );
  console.log("================================");
  useEffect(() => {
    console.log(
      "StepThree - Component mounted, checking for discount codes..."
    );
    let codes = [];
    if (discountCodes && discountCodes.length > 0) {
      console.log(
        "StepThree - Using context discount codes:",
        discountCodes.length
      );
      codes = discountCodes;
    } else if (typeof window !== "undefined") {
      try {
        const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
        if (storedCodes) {
          const parsedCodes = JSON.parse(storedCodes);
          if (parsedCodes && parsedCodes.length > 0) {
            console.log(
              "StepThree - Using localStorage discount codes:",
              parsedCodes.length
            );
            codes = parsedCodes;
            setDiscountCodes(parsedCodes);
          }
        }
      } catch (e) {
        console.error("Error parsing stored discount codes:", e);
      }
      if (codes.length === 0 && window.GLOBAL_DISCOUNT_CODES && window.GLOBAL_DISCOUNT_CODES.length > 0) {
        console.log(
          "StepThree - Using global window discount codes:",
          window.GLOBAL_DISCOUNT_CODES.length
        );
        codes = window.GLOBAL_DISCOUNT_CODES;
        setDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
      }
    }
    if (codes.length > 0) {
      setLocalDiscountCodes(codes);
    } else {
      console.log("StepThree - No discount codes found in any source");
    }
  }, []);
  useEffect(() => {
    if (discountCodes && discountCodes.length > 0) {
      console.log(
        "StepThree - Updating local codes from context:",
        discountCodes.length
      );
      setLocalDiscountCodes(discountCodes);
    }
  }, [discountCodes]);
  useEffect(() => {
    console.log(
      "StepThree - Local discount codes updated:",
      localDiscountCodes
    );
    if (localDiscountCodes && localDiscountCodes.length > 0) {
      console.log("StepThree - Available discount codes:");
      localDiscountCodes.forEach((code, index2) => {
        console.log(
          `  ${index2 + 1}. Title: ${code.title}, Code: ${code.code}, ID: ${code.id}`
        );
      });
    }
  }, [localDiscountCodes]);
  useEffect(() => {
    console.log("StepThree - Tab changed to:", activeTab);
    if (activeTab === "wheel") {
      console.log("StepThree - Wheel tab accessed, checking discount codes...");
      const availableCodes = localDiscountCodes.length > 0 ? localDiscountCodes : discountCodes;
      if (availableCodes && availableCodes.length > 0) {
        console.log(
          "StepThree - Found discount codes, generating wheel configuration..."
        );
        generateWheelConfiguration(availableCodes);
      } else {
        console.log(
          "StepThree - No discount codes available, attempting to fetch..."
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
      if (localDiscountCodes.length > 0) {
        console.log(
          "StepThree - Using existing local codes:",
          localDiscountCodes.length
        );
        generateWheelConfiguration(localDiscountCodes);
        setLoadingCodes(false);
        return;
      }
      if (typeof window !== "undefined") {
        try {
          const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
          if (storedCodes) {
            const parsedCodes = JSON.parse(storedCodes);
            if (parsedCodes && parsedCodes.length > 0) {
              console.log(
                "StepThree - Using localStorage discount codes:",
                parsedCodes.length
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
        if (window.GLOBAL_DISCOUNT_CODES && window.GLOBAL_DISCOUNT_CODES.length > 0) {
          console.log(
            "StepThree - Using global window discount codes:",
            window.GLOBAL_DISCOUNT_CODES.length
          );
          setLocalDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
          setDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
          generateWheelConfiguration(window.GLOBAL_DISCOUNT_CODES);
          setLoadingCodes(false);
          return;
        }
      }
      console.log("StepThree - No codes in storage, fetching from API...");
      const codes = await fetchAndSetDiscountCodes();
      if (codes && codes.length > 0) {
        console.log(
          "StepThree - Successfully fetched codes from API:",
          codes.length
        );
        setLocalDiscountCodes(codes);
        generateWheelConfiguration(codes);
      } else {
        setCodesError(
          "No Discount Codes Found\n\nTo create discount codes:\n\n• Go to your Shopify admin panel\n• Navigate to Discounts → Create discount\n• Choose 'Discount code' type\n• Set up your discount details and save\n• Return here and refresh the page"
        );
      }
    } catch (error) {
      console.error("StepThree - Error fetching discount codes:", error);
      setCodesError(error.message);
    } finally {
      setLoadingCodes(false);
    }
  };
  const generateWheelConfiguration = (codes) => {
    var _a3, _b2;
    console.log(
      "StepThree - generateWheelConfiguration called with codes:",
      codes
    );
    if (!codes || codes.length === 0) {
      console.log(
        "StepThree - No codes provided to generateWheelConfiguration"
      );
      return;
    }
    const sectorCount = ((_a3 = campaignData.layout) == null ? void 0 : _a3.wheelSectors) === "four" ? 4 : ((_b2 = campaignData.layout) == null ? void 0 : _b2.wheelSectors) === "six" ? 6 : 8;
    console.log("StepThree - Sector count:", sectorCount);
    const sectors = [];
    const availableCodes = [...codes];
    for (let i = 1; i <= sectorCount; i++) {
      if (availableCodes.length > 0 && i <= codes.length) {
        const code = availableCodes.shift();
        console.log(`StepThree - Adding discount code to sector ${i}:`, code);
        sectors.push({
          id: i,
          rewardType: code.title,
          reward: code.code || code.title,
          // Use title if no specific code
          chance: i === 1 ? "40%" : "15%",
          // First sector gets higher chance
          discountCodeId: code.id,
          discountCode: code.code,
          discountTitle: code.title,
          discountType: code.type || "DiscountCodeBasic"
        });
      } else {
        console.log(
          `StepThree - Adding "Better luck next time" to sector ${i}`
        );
        sectors.push({
          id: i,
          rewardType: "Oops!",
          reward: "Better luck next time",
          chance: "5%",
          discountCodeId: null,
          discountCode: null,
          discountTitle: null,
          discountType: null
        });
      }
    }
    console.log("StepThree - Generated sectors:", sectors);
    updateCampaignData({
      content: {
        ...campaignData.content,
        wheel: {
          sectors,
          copySameCode: false
        }
      }
    });
    saveWheelConfiguration(sectors);
  };
  const saveWheelConfiguration = async (sectors) => {
    try {
      const configData = {
        campaignId: campaignData.id || `campaign-${Date.now()}`,
        wheelConfig: {
          sectors,
          copySameCode: false
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        shop: campaignData.shop
      };
      const response = await fetch("/api/wheel-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData)
      });
      if (!response.ok) {
        throw new Error(
          `Failed to save wheel configuration: ${response.statusText}`
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
            termsLink: ""
          },
          wheel: {
            sectors: [],
            copySameCode: true
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
              seconds: 0
            }
          }
        }
      });
    }
  }, [campaignData, updateCampaignData]);
  const handleInputChange = (section, field, value) => {
    var _a3;
    updateCampaignData({
      content: {
        ...campaignData.content,
        [section]: {
          ...(_a3 = campaignData.content) == null ? void 0 : _a3[section],
          [field]: value
        }
      }
    });
  };
  const handleToggleChange = (section, field, value) => {
    var _a3;
    updateCampaignData({
      content: {
        ...campaignData.content,
        [section]: {
          ...(_a3 = campaignData.content) == null ? void 0 : _a3[section],
          [field]: value
        }
      }
    });
  };
  const handleReminderTimerChange = (field, value) => {
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
            [field]: numValue
          }
        }
      }
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
  function generateWheelGradient() {
    var _a3, _b2;
    const sectorCount = ((_a3 = campaignData.layout) == null ? void 0 : _a3.wheelSectors) === "four" ? 4 : ((_b2 = campaignData.layout) == null ? void 0 : _b2.wheelSectors) === "six" ? 6 : 8;
    const mainColor = campaignData.primaryColor;
    const secondaryColor = campaignData.color === "dualTone" ? campaignData.secondaryColor : "white";
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
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8 pb-24", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-1/6 bg-indigo-700 text-white rounded-lg p-4", children: /* @__PURE__ */ jsx(
      StepSidebar,
      {
        activeStep: 3,
        onStepClick: (step) => {
          if (step !== 3) {
            if (step > campaignData.step) {
              if (step <= campaignData.step + 1) {
                updateCampaignData({ step });
              }
            } else {
              updateCampaignData({ step });
            }
          }
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-2/5", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeTab === "landing" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActiveTab("landing"),
            children: "Landing Screen"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeTab === "wheel" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActiveTab("wheel"),
            children: "Wheel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeTab === "result" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActiveTab("result"),
            children: "Result Screen"
          }
        )
      ] }) }),
      activeTab === "landing" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-indigo-700", children: "Landing Screen" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_c = (_b = campaignData.content) == null ? void 0 : _b.landing) == null ? void 0 : _c.title) || "",
                onChange: (e) => handleInputChange("landing", "title", e.target.value),
                className: "w-full p-2 border rounded-md",
                maxLength: 50
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_f = (_e = (_d = campaignData.content) == null ? void 0 : _d.landing) == null ? void 0 : _e.title) == null ? void 0 : _f.length) || 0,
              "/50"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Sub Title" }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: (_h = (_g = campaignData.content) == null ? void 0 : _g.landing) == null ? void 0 : _h.showSubtitle,
                  onChange: (e) => handleToggleChange(
                    "landing",
                    "showSubtitle",
                    e.target.checked
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] })
          ] }),
          ((_j = (_i = campaignData.content) == null ? void 0 : _i.landing) == null ? void 0 : _j.showSubtitle) && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_l = (_k = campaignData.content) == null ? void 0 : _k.landing) == null ? void 0 : _l.subtitle) || "",
                onChange: (e) => handleInputChange("landing", "subtitle", e.target.value),
                className: "w-full p-2 border rounded-md",
                maxLength: 50
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_o = (_n = (_m = campaignData.content) == null ? void 0 : _m.landing) == null ? void 0 : _n.subtitle) == null ? void 0 : _o.length) || 0,
              "/50"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mr-2", children: "Show the input field" }),
              /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "sr-only peer",
                    checked: (_q = (_p = campaignData.content) == null ? void 0 : _p.landing) == null ? void 0 : _q.showEmail,
                    onChange: (e) => handleToggleChange(
                      "landing",
                      "showEmail",
                      e.target.checked
                    )
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
              ] })
            ] })
          ] }),
          ((_s = (_r = campaignData.content) == null ? void 0 : _r.landing) == null ? void 0 : _s.showEmail) && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_u = (_t = campaignData.content) == null ? void 0 : _t.landing) == null ? void 0 : _u.emailPlaceholder) || "",
                onChange: (e) => handleInputChange(
                  "landing",
                  "emailPlaceholder",
                  e.target.value
                ),
                className: "w-full p-2 border rounded-md",
                maxLength: 20,
                placeholder: "Placeholder text"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_x = (_w = (_v = campaignData.content) == null ? void 0 : _v.landing) == null ? void 0 : _w.emailPlaceholder) == null ? void 0 : _x.length) || 0,
              "/20"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Privacy & Policy" }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: (_z = (_y = campaignData.content) == null ? void 0 : _y.landing) == null ? void 0 : _z.showPrivacyPolicy,
                  onChange: (e) => handleToggleChange(
                    "landing",
                    "showPrivacyPolicy",
                    e.target.checked
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] })
          ] }),
          ((_B = (_A = campaignData.content) == null ? void 0 : _A.landing) == null ? void 0 : _B.showPrivacyPolicy) && /* @__PURE__ */ jsxs("div", { className: "relative flex", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_D = (_C = campaignData.content) == null ? void 0 : _C.landing) == null ? void 0 : _D.privacyPolicyText) || "",
                onChange: (e) => handleInputChange(
                  "landing",
                  "privacyPolicyText",
                  e.target.value
                ),
                className: "w-full p-2 border rounded-md",
                maxLength: 30
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "ml-2 p-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200",
                onClick: () => openFileModal("landing.privacyPolicy"),
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V6a1 1 0 012 0v2.5a3.5 3.5 0 01-7 0V6a1 1 0 012 0v4a1 1 0 002 0V7a3 3 0 00-3-3z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_G = (_F = (_E = campaignData.content) == null ? void 0 : _E.landing) == null ? void 0 : _F.privacyPolicyText) == null ? void 0 : _G.length) || 0,
              "/30"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Button" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_I = (_H = campaignData.content) == null ? void 0 : _H.landing) == null ? void 0 : _I.buttonText) || "",
                onChange: (e) => handleInputChange("landing", "buttonText", e.target.value),
                className: "w-full p-2 border rounded-md",
                maxLength: 18
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_L = (_K = (_J = campaignData.content) == null ? void 0 : _J.landing) == null ? void 0 : _K.buttonText) == null ? void 0 : _L.length) || 0,
              "/18"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Terms & Conditions" }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: (_N = (_M = campaignData.content) == null ? void 0 : _M.landing) == null ? void 0 : _N.showTerms,
                  onChange: (e) => handleToggleChange(
                    "landing",
                    "showTerms",
                    e.target.checked
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] })
          ] }),
          ((_P = (_O = campaignData.content) == null ? void 0 : _O.landing) == null ? void 0 : _P.showTerms) && /* @__PURE__ */ jsxs("div", { className: "relative flex", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_R = (_Q = campaignData.content) == null ? void 0 : _Q.landing) == null ? void 0 : _R.termsText) || "",
                onChange: (e) => handleInputChange("landing", "termsText", e.target.value),
                className: "w-full p-2 border rounded-md",
                maxLength: 30
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "ml-2 p-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200",
                onClick: () => openFileModal("landing.terms"),
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V6a1 1 0 012 0v2.5a3.5 3.5 0 01-7 0V6a1 1 0 012 0v4a1 1 0 002 0V7a3 3 0 00-3-3z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_U = (_T = (_S = campaignData.content) == null ? void 0 : _S.landing) == null ? void 0 : _T.termsText) == null ? void 0 : _U.length) || 0,
              "/30"
            ] })
          ] })
        ] })
      ] }),
      activeTab === "wheel" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-indigo-700", children: "Wheel Configuration" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium text-blue-900 mb-2", children: "Shopify Discount Codes" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700 mb-3", children: "Your wheel will be automatically configured using discount codes from your Shopify store." }),
          loadingCodes && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-4", children: [
            /* @__PURE__ */ jsxs(
              "svg",
              {
                className: "animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                children: [
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      className: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      strokeWidth: "4"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      className: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-blue-700", children: "Loading discount codes..." })
          ] }),
          codesError && /* @__PURE__ */ jsx("div", { className: "mt-3 p-4 bg-red-50 border border-red-200 rounded-md", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-5 w-5 text-red-400",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                    clipRule: "evenodd"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-red-800", children: "No Discount Codes Found" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 text-sm text-red-700", children: [
                /* @__PURE__ */ jsx("p", { children: codesError }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 bg-red-100 rounded-md", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-red-800", children: "To create discount codes:" }),
                  /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside mt-2 space-y-1 text-red-700", children: [
                    /* @__PURE__ */ jsx("li", { children: "Go to your Shopify admin panel" }),
                    /* @__PURE__ */ jsx("li", { children: "Navigate to Discounts → Create discount" }),
                    /* @__PURE__ */ jsx("li", { children: 'Choose "Discount code" type' }),
                    /* @__PURE__ */ jsx("li", { children: "Set up your discount details and save" }),
                    /* @__PURE__ */ jsx("li", { children: "Return here and refresh the page" })
                  ] })
                ] })
              ] })
            ] })
          ] }) }),
          discountCodes && discountCodes.length > 0 && !codesError && /* @__PURE__ */ jsx("div", { className: "mt-3 p-3 bg-green-50 border border-green-200 rounded-md", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-5 w-5 text-green-400",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                    clipRule: "evenodd"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700", children: [
                "✓ Successfully loaded ",
                discountCodes.length,
                " discount codes from Shopify"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600", children: "Available codes:" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: discountCodes.map((code, index2) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800",
                    children: code.title
                  },
                  code.id || index2
                )) })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => fetchDiscountCodes(),
              disabled: loadingCodes,
              className: "px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50",
              children: loadingCodes ? "Loading..." : "Refresh Discount Codes"
            }
          ) })
        ] }),
        ((_X = (_W = (_V = campaignData.content) == null ? void 0 : _V.wheel) == null ? void 0 : _W.sectors) == null ? void 0 : _X.length) > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-900", children: "Generated Wheel Configuration" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
                campaignData.content.wheel.sectors.length,
                " segments"
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => fetchDiscountCodes(),
                  className: "px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700",
                  children: "Regenerate"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-2 bg-gray-200 p-2 rounded-t-md font-medium text-gray-700 text-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "col-span-1", children: "#" }),
              /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Reward Type" }),
              /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Reward Code" }),
              /* @__PURE__ */ jsx("div", { className: "col-span-3", children: "Chance %" })
            ] }),
            campaignData.content.wheel.sectors.map((sector, index2) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `grid grid-cols-12 gap-2 p-2 ${index2 % 2 === 0 ? "bg-white" : "bg-gray-100"} ${sector.discountCodeId ? "border-l-4 border-green-500" : sector.reward === "Better luck next time" ? "border-l-4 border-red-300" : "border-l-4 border-gray-300"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "col-span-1 flex items-center justify-center font-medium text-gray-700", children: [
                    sector.id,
                    sector.discountCodeId && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "ml-1 text-green-600",
                        title: "Shopify discount code",
                        children: "✓"
                      }
                    ),
                    sector.reward === "Better luck next time" && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "ml-1 text-red-500",
                        title: "No prize sector",
                        children: "✗"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "col-span-4 flex items-center", children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-sm ${sector.discountCodeId ? "text-green-700 font-medium" : sector.reward === "Better luck next time" ? "text-red-600" : "text-gray-700"}`,
                      children: sector.rewardType
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "col-span-4 flex items-center", children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-sm font-mono ${sector.discountCodeId ? "text-green-700 font-medium" : sector.reward === "Better luck next time" ? "text-red-600" : "text-gray-700"}`,
                      children: sector.reward
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "col-span-3 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: sector.chance }) })
                ]
              },
              sector.id
            ))
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-3 rounded-md", children: [
            /* @__PURE__ */ jsx("h5", { className: "font-medium text-gray-900 mb-2", children: "Wheel Statistics" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Total Segments:" }),
                /* @__PURE__ */ jsx("span", { className: "ml-1 font-medium", children: campaignData.content.wheel.sectors.length })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Discount Codes:" }),
                /* @__PURE__ */ jsx("span", { className: "ml-1 font-medium text-green-600", children: campaignData.content.wheel.sectors.filter(
                  (s) => s.discountCodeId
                ).length })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "No Prize:" }),
                /* @__PURE__ */ jsx("span", { className: "ml-1 font-medium text-red-600", children: campaignData.content.wheel.sectors.filter(
                  (s) => s.reward === "Better luck next time"
                ).length })
              ] })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "result" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-indigo-700", children: "Result Screen" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_Z = (_Y = campaignData.content) == null ? void 0 : _Y.result) == null ? void 0 : _Z.title) || "",
                onChange: (e) => handleInputChange("result", "title", e.target.value),
                className: "w-full p-2 border rounded-md",
                maxLength: 30
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_aa = (_$ = (__ = campaignData.content) == null ? void 0 : __.result) == null ? void 0 : _$.title) == null ? void 0 : _aa.length) || 0,
              "/30"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Sub Title" }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: (_ca = (_ba = campaignData.content) == null ? void 0 : _ba.result) == null ? void 0 : _ca.showSubtitle,
                  onChange: (e) => handleToggleChange(
                    "result",
                    "showSubtitle",
                    e.target.checked
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] })
          ] }),
          ((_ea = (_da = campaignData.content) == null ? void 0 : _da.result) == null ? void 0 : _ea.showSubtitle) && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_ga = (_fa = campaignData.content) == null ? void 0 : _fa.result) == null ? void 0 : _ga.subtitle) || "",
                onChange: (e) => handleInputChange("result", "subtitle", e.target.value),
                className: "w-full p-2 border rounded-md",
                maxLength: 25
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_ja = (_ia = (_ha = campaignData.content) == null ? void 0 : _ha.result) == null ? void 0 : _ia.subtitle) == null ? void 0 : _ja.length) || 0,
              "/25"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Button" }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: (_la = (_ka = campaignData.content) == null ? void 0 : _ka.result) == null ? void 0 : _la.showButton,
                  onChange: (e) => handleToggleChange(
                    "result",
                    "showButton",
                    e.target.checked
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] })
          ] }),
          ((_na = (_ma = campaignData.content) == null ? void 0 : _ma.result) == null ? void 0 : _na.showButton) && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: ((_pa = (_oa = campaignData.content) == null ? void 0 : _oa.result) == null ? void 0 : _pa.buttonText) || "",
                onChange: (e) => handleInputChange("result", "buttonText", e.target.value),
                className: "w-full p-2 border rounded-md",
                maxLength: 15
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500", children: [
              ((_sa = (_ra = (_qa = campaignData.content) == null ? void 0 : _qa.result) == null ? void 0 : _ra.buttonText) == null ? void 0 : _sa.length) || 0,
              "/15"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Set Button Destination" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: ((_ua = (_ta = campaignData.content) == null ? void 0 : _ta.result) == null ? void 0 : _ua.buttonDestination) || "",
              onChange: (e) => handleInputChange(
                "result",
                "buttonDestination",
                e.target.value
              ),
              className: "w-full p-2 border rounded-md",
              placeholder: "https://example.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Copy Icon" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mr-2", children: "Show the copy icon" }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: (_wa = (_va = campaignData.content) == null ? void 0 : _va.result) == null ? void 0 : _wa.showCopyIcon,
                  onChange: (e) => handleToggleChange(
                    "result",
                    "showCopyIcon",
                    e.target.checked
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Show result again as reminder?" }),
          /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "sr-only peer",
                checked: (_ya = (_xa = campaignData.content) == null ? void 0 : _xa.result) == null ? void 0 : _ya.showResultAgain,
                onChange: (e) => handleToggleChange(
                  "result",
                  "showResultAgain",
                  e.target.checked
                )
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
          ] })
        ] }),
        ((_Aa = (_za = campaignData.content) == null ? void 0 : _za.result) == null ? void 0 : _Aa.showResultAgain) && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Set a timer for to show the result screen." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "59",
                value: ((_Da = (_Ca = (_Ba = campaignData.content) == null ? void 0 : _Ba.result) == null ? void 0 : _Ca.reminderTimer) == null ? void 0 : _Da.minutes) || 0,
                onChange: (e) => handleReminderTimerChange("minutes", e.target.value),
                className: "w-16 p-2 border rounded-md text-center"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: ":" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "59",
                value: ((_Ga = (_Fa = (_Ea = campaignData.content) == null ? void 0 : _Ea.result) == null ? void 0 : _Fa.reminderTimer) == null ? void 0 : _Ga.seconds) || 0,
                onChange: (e) => handleReminderTimerChange("seconds", e.target.value),
                className: "w-16 p-2 border rounded-md text-center"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex mt-1", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 text-xs text-gray-500 text-center", children: "Minutes" }),
            /* @__PURE__ */ jsx("div", { className: "w-4" }),
            /* @__PURE__ */ jsx("div", { className: "w-16 text-xs text-gray-500 text-center", children: "Seconds" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-2/5", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg sticky top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-full overflow-hidden flex border border-indigo-600 p-1", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `px-4 py-2 rounded-full flex items-center ${previewDevice === "mobile" ? "bg-indigo-600 text-white" : "text-indigo-600"}`,
              onClick: () => setPreviewDevice("mobile"),
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 inline-block mr-1",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ),
                "Mobile"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `px-4 py-2 rounded-full flex items-center ${previewDevice === "desktop" ? "bg-indigo-600 text-white" : "text-indigo-600"}`,
              onClick: () => setPreviewDevice("desktop"),
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 inline-block mr-1",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ),
                "Desktop"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "text-gray-500 flex items-center", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-1",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                    clipRule: "evenodd"
                  }
                )
              ]
            }
          ),
          "Preview"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-full relative bg-gray-700 flex items-center justify-center", children: previewDevice === "desktop" ? /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-lg overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "bg-gray-800 p-4 h-[400px] flex items-center justify-center", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `bg-white rounded-lg shadow-lg w-full max-w-[800px] h-[320px] p-0 relative overflow-hidden`,
          children: [
            /* @__PURE__ */ jsx("button", { className: "absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10", children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-5 w-5",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                    clipRule: "evenodd"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex h-full", children: activeTab === "landing" || activeTab === "wheel" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "w-1/2 p-8 flex flex-col justify-center", children: [
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    className: "text-3xl font-bold mb-3",
                    style: { color: campaignData.primaryColor },
                    children: ((_Ia = (_Ha = campaignData.content) == null ? void 0 : _Ha.landing) == null ? void 0 : _Ia.title) || "GO AHEAD GIVE IT A SPIN!"
                  }
                ),
                ((_Ka = (_Ja = campaignData.content) == null ? void 0 : _Ja.landing) == null ? void 0 : _Ka.showSubtitle) && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-5", children: ((_Ma = (_La = campaignData.content) == null ? void 0 : _La.landing) == null ? void 0 : _Ma.subtitle) || "This is a demo of our Spin to Win displays" }),
                ((_Oa = (_Na = campaignData.content) == null ? void 0 : _Na.landing) == null ? void 0 : _Oa.showPrivacyPolicy) && /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      id: "preview-privacy",
                      className: "mr-2",
                      checked: true,
                      readOnly: true
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "label",
                    {
                      htmlFor: "preview-privacy",
                      className: "text-xs text-gray-600",
                      children: ((_Qa = (_Pa = campaignData.content) == null ? void 0 : _Pa.landing) == null ? void 0 : _Qa.privacyPolicyText) || "I accept the T&C and Privacy Notice."
                    }
                  )
                ] }),
                ((_Sa = (_Ra = campaignData.content) == null ? void 0 : _Ra.landing) == null ? void 0 : _Sa.showEmail) && /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    placeholder: ((_Ua = (_Ta = campaignData.content) == null ? void 0 : _Ta.landing) == null ? void 0 : _Ua.emailPlaceholder) || "Enter your email",
                    className: "w-full p-3 border rounded-md mb-4 text-center"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "w-full py-3 font-bold text-white rounded-md text-lg",
                    style: {
                      backgroundColor: campaignData.primaryColor
                    },
                    children: ((_Wa = (_Va = campaignData.content) == null ? void 0 : _Va.landing) == null ? void 0 : _Wa.buttonText) || "SPIN NOW"
                  }
                ),
                ((_Ya = (_Xa = campaignData.content) == null ? void 0 : _Xa.landing) == null ? void 0 : _Ya.showTerms) && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-3 text-center", children: ((__a = (_Za = campaignData.content) == null ? void 0 : _Za.landing) == null ? void 0 : __a.termsText) || "I accept the T&C$" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-1/2 bg-gray-50 flex items-center justify-center relative", children: /* @__PURE__ */ jsx("div", { className: "relative w-[280px] h-[280px]", children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "w-full h-full rounded-full",
                  style: {
                    background: generateWheelGradient()
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-black" }) }),
                    (_bb = (_ab = (_$a = campaignData.content) == null ? void 0 : _$a.wheel) == null ? void 0 : _ab.sectors) == null ? void 0 : _bb.map(
                      (sector, index2) => {
                        const sectorCount = campaignData.content.wheel.sectors.length;
                        const angle = 360 / sectorCount * index2 + 360 / sectorCount / 2;
                        const radius = 110;
                        const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
                        const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
                        return /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "absolute text-xs font-bold text-center",
                            style: {
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              transform: "translate(-50%, -50%) rotate(" + angle + "deg)",
                              width: "60px",
                              color: index2 % 2 === 0 ? "white" : "black"
                            },
                            children: sector.rewardType
                          },
                          sector.id
                        );
                      }
                    )
                  ]
                }
              ) }) })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "w-1/2 p-8 flex flex-col justify-center", children: [
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    className: "text-3xl font-bold mb-3",
                    style: { color: campaignData.primaryColor },
                    children: ((_db = (_cb = campaignData.content) == null ? void 0 : _cb.result) == null ? void 0 : _db.title) || "LUCKY DAY!"
                  }
                ),
                ((_fb = (_eb = campaignData.content) == null ? void 0 : _eb.result) == null ? void 0 : _fb.showSubtitle) && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-5", children: ((_hb = (_gb = campaignData.content) == null ? void 0 : _gb.result) == null ? void 0 : _hb.subtitle) || "You have won 10% discount for your shopping" }),
                /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Your discount code is" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "border border-gray-300 rounded-md p-3 bg-gray-50 font-mono text-lg flex-grow text-center", children: ((_lb = (_kb = (_jb = (_ib = campaignData.content) == null ? void 0 : _ib.wheel) == null ? void 0 : _jb.sectors) == null ? void 0 : _kb.find(
                      (s) => s.discountCodeId
                    )) == null ? void 0 : _lb.reward) || "SAMPLE10" }),
                    ((_nb = (_mb = campaignData.content) == null ? void 0 : _mb.result) == null ? void 0 : _nb.showCopyIcon) && /* @__PURE__ */ jsx("button", { className: "ml-2 p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200", children: /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-6 w-6",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" }),
                          /* @__PURE__ */ jsx("path", { d: "M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" })
                        ]
                      }
                    ) })
                  ] })
                ] }),
                ((_pb = (_ob = campaignData.content) == null ? void 0 : _ob.result) == null ? void 0 : _pb.showButton) && /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "w-full py-3 font-bold text-white rounded-md text-lg",
                    style: {
                      backgroundColor: campaignData.primaryColor
                    },
                    children: ((_rb = (_qb = campaignData.content) == null ? void 0 : _qb.result) == null ? void 0 : _rb.buttonText) || "REDEEM NOW"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-1/2 bg-gray-50 flex items-center justify-center relative", children: /* @__PURE__ */ jsx("div", { className: "relative w-[280px] h-[280px]", children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "w-full h-full rounded-full",
                  style: {
                    background: generateWheelGradient()
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-black" }) }),
                    (_ub = (_tb = (_sb = campaignData.content) == null ? void 0 : _sb.wheel) == null ? void 0 : _tb.sectors) == null ? void 0 : _ub.map(
                      (sector, index2) => {
                        const sectorCount = campaignData.content.wheel.sectors.length;
                        const angle = 360 / sectorCount * index2 + 360 / sectorCount / 2;
                        const radius = 110;
                        const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
                        const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
                        return /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "absolute text-xs font-bold text-center",
                            style: {
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              transform: "translate(-50%, -50%) rotate(" + angle + "deg)",
                              width: "60px",
                              color: index2 % 2 === 0 ? "white" : "black"
                            },
                            children: sector.rewardType
                          },
                          sector.id
                        );
                      }
                    )
                  ]
                }
              ) }) })
            ] }) })
          ]
        }
      ) }) }) : (
        // Mobile view
        /* @__PURE__ */ jsxs("div", { className: "w-56 h-[480px] bg-gray-900 rounded-3xl p-2 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full" }),
          /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gray-800 rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "bg-white h-full p-4 flex flex-col items-center", children: activeTab === "landing" || activeTab === "wheel" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center w-full", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  className: "text-xl font-bold mb-2",
                  style: { color: campaignData.primaryColor },
                  children: ((_wb = (_vb = campaignData.content) == null ? void 0 : _vb.landing) == null ? void 0 : _wb.title) || "GO AHEAD GIVE IT A SPIN!"
                }
              ),
              ((_yb = (_xb = campaignData.content) == null ? void 0 : _xb.landing) == null ? void 0 : _yb.showSubtitle) && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-3", children: ((_Ab = (_zb = campaignData.content) == null ? void 0 : _zb.landing) == null ? void 0 : _Ab.subtitle) || "This is a demo of our Spin to Win displays" }),
              ((_Cb = (_Bb = campaignData.content) == null ? void 0 : _Bb.landing) == null ? void 0 : _Cb.showPrivacyPolicy) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    id: "preview-privacy-mobile",
                    className: "mr-1 h-3 w-3",
                    checked: true,
                    readOnly: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "preview-privacy-mobile",
                    className: "text-[10px] text-gray-600",
                    children: ((_Eb = (_Db = campaignData.content) == null ? void 0 : _Db.landing) == null ? void 0 : _Eb.privacyPolicyText) || "I accept the T&C and Privacy Notice."
                  }
                )
              ] }),
              ((_Gb = (_Fb = campaignData.content) == null ? void 0 : _Fb.landing) == null ? void 0 : _Gb.showEmail) && /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  placeholder: ((_Ib = (_Hb = campaignData.content) == null ? void 0 : _Hb.landing) == null ? void 0 : _Ib.emailPlaceholder) || "Enter your email",
                  className: "w-full p-2 text-xs border rounded-md mb-3 text-center"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "w-full py-2 text-sm font-bold text-white rounded-md",
                  style: {
                    backgroundColor: campaignData.primaryColor
                  },
                  children: ((_Kb = (_Jb = campaignData.content) == null ? void 0 : _Jb.landing) == null ? void 0 : _Kb.buttonText) || "SPIN NOW"
                }
              ),
              ((_Mb = (_Lb = campaignData.content) == null ? void 0 : _Lb.landing) == null ? void 0 : _Mb.showTerms) && /* @__PURE__ */ jsx("p", { className: "text-[8px] text-gray-500 mt-2 text-center", children: ((_Ob = (_Nb = campaignData.content) == null ? void 0 : _Nb.landing) == null ? void 0 : _Ob.termsText) || "I accept the T&C$" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 relative w-40 h-40", children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "w-full h-full rounded-full",
                style: {
                  background: generateWheelGradient()
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-black" }) }),
                  (_Rb = (_Qb = (_Pb = campaignData.content) == null ? void 0 : _Pb.wheel) == null ? void 0 : _Qb.sectors) == null ? void 0 : _Rb.map(
                    (sector, index2) => {
                      const sectorCount = campaignData.content.wheel.sectors.length;
                      const angle = 360 / sectorCount * index2 + 360 / sectorCount / 2;
                      const radius = 60;
                      const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
                      const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
                      return /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "absolute text-[6px] font-bold text-center",
                          style: {
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%) rotate(" + angle + "deg)",
                            width: "30px",
                            color: index2 % 2 === 0 ? "white" : "black"
                          },
                          children: sector.rewardType
                        },
                        sector.id
                      );
                    }
                  )
                ]
              }
            ) })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center w-full", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  className: "text-xl font-bold mb-2",
                  style: { color: campaignData.primaryColor },
                  children: ((_Tb = (_Sb = campaignData.content) == null ? void 0 : _Sb.result) == null ? void 0 : _Tb.title) || "LUCKY DAY!"
                }
              ),
              ((_Vb = (_Ub = campaignData.content) == null ? void 0 : _Ub.result) == null ? void 0 : _Vb.showSubtitle) && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-3", children: ((_Xb = (_Wb = campaignData.content) == null ? void 0 : _Wb.result) == null ? void 0 : _Xb.subtitle) || "You have won 10% discount for your shopping" }),
              /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-1", children: "Your discount code is" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "border border-gray-300 rounded-md p-1 bg-gray-50 font-mono text-sm", children: ((_$b = (__b = (_Zb = (_Yb = campaignData.content) == null ? void 0 : _Yb.wheel) == null ? void 0 : _Zb.sectors) == null ? void 0 : __b.find(
                    (s) => s.discountCodeId
                  )) == null ? void 0 : _$b.reward) || "SAMPLE10" }),
                  ((_bc = (_ac = campaignData.content) == null ? void 0 : _ac.result) == null ? void 0 : _bc.showCopyIcon) && /* @__PURE__ */ jsx("button", { className: "ml-1 p-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200", children: /* @__PURE__ */ jsxs(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "h-4 w-4",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      children: [
                        /* @__PURE__ */ jsx("path", { d: "M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" }),
                        /* @__PURE__ */ jsx("path", { d: "M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" })
                      ]
                    }
                  ) })
                ] })
              ] }),
              ((_dc = (_cc = campaignData.content) == null ? void 0 : _cc.result) == null ? void 0 : _dc.showButton) && /* @__PURE__ */ jsx(
                "button",
                {
                  className: "w-full py-2 text-sm font-bold text-white rounded-md",
                  style: {
                    backgroundColor: campaignData.primaryColor
                  },
                  children: ((_fc = (_ec = campaignData.content) == null ? void 0 : _ec.result) == null ? void 0 : _fc.buttonText) || "REDEEM NOW"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 relative w-40 h-40", children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "w-full h-full rounded-full",
                style: {
                  background: generateWheelGradient()
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-black" }) }),
                  (_ic = (_hc = (_gc = campaignData.content) == null ? void 0 : _gc.wheel) == null ? void 0 : _hc.sectors) == null ? void 0 : _ic.map(
                    (sector, index2) => {
                      const sectorCount = campaignData.content.wheel.sectors.length;
                      const angle = 360 / sectorCount * index2 + 360 / sectorCount / 2;
                      const radius = 60;
                      const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
                      const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
                      return /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "absolute text-[6px] font-bold text-center",
                          style: {
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%) rotate(" + angle + "deg)",
                            width: "30px",
                            color: index2 % 2 === 0 ? "white" : "black"
                          },
                          children: sector.rewardType
                        },
                        sector.id
                      );
                    }
                  )
                ]
              }
            ) })
          ] }) }) })
        ] })
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center mt-4 border-b", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeTab === "landing" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActiveTab("landing"),
            children: "Landing Screen"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeTab === "result" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActiveTab("result"),
            children: "Result screen"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeTab === "floating" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActiveTab("floating"),
            children: "Floating Button"
          }
        )
      ] })
    ] }) }),
    showFileModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: "How would you like to add it?" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "w-full mb-4 p-3 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center hover:bg-indigo-200",
          onClick: () => {
            var _a3;
            return (_a3 = fileInputRef.current) == null ? void 0 : _a3.click();
          },
          children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-5 w-5 mr-2",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V6a1 1 0 012 0v2.5a3.5 3.5 0 01-7 0V6a1 1 0 012 0v4a1 1 0 002 0V7a3 3 0 00-3-3z",
                    clipRule: "evenodd"
                  }
                )
              }
            ),
            "Browse your file (.xls, .gsheet, .doc)"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          ref: fileInputRef,
          onChange: handleFileUpload,
          className: "hidden"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 my-2", children: "OR" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Paste your link here",
            className: "w-full p-3 border rounded-lg pl-10",
            onBlur: (e) => handlePasteLink(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2",
            viewBox: "0 0 20 20",
            fill: "currentColor",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                fillRule: "evenodd",
                d: "M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z",
                clipRule: "evenodd"
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300",
          onClick: () => setShowFileModal(false),
          children: "Cancel"
        }
      ) })
    ] }) })
  ] });
}
function StepFour() {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea, _Fa, _Ga, _Ha, _Ia, _Ja, _Ka, _La, _Ma, _Na, _Oa, _Pa, _Qa, _Ra, _Sa, _Ta, _Ua, _Va, _Wa, _Xa, _Ya, _Za, __a, _$a, _ab, _bb, _cb, _db, _eb, _fb, _gb, _hb;
  const {
    campaignData,
    saveCampaign,
    updateCampaignData,
    updateCampaignRules
  } = useCampaign();
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStatus, setLaunchStatus] = useState("draft");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [activePreviewTab, setActivePreviewTab] = useState("landing");
  const [newPageUrl, setNewPageUrl] = useState("");
  const navigate = useNavigate();
  const [appearingRules, setAppearingRules] = useState(
    ((_a2 = campaignData.rules) == null ? void 0 : _a2.appearingRules) || {
      exitIntent: { enabled: false, device: "desktop" },
      timeDelay: { enabled: false, seconds: 5 },
      pageScroll: { enabled: false, percentage: 20 },
      pageCount: { enabled: false, pages: 2 },
      clicksCount: { enabled: false, clicks: 2 },
      inactivity: { enabled: false, seconds: 30 }
    }
  );
  const [pageTargeting, setPageTargeting] = useState(
    ((_b = campaignData.rules) == null ? void 0 : _b.pageTargeting) || {
      enabled: true,
      url: "www.yourdomain.com",
      urls: []
    }
  );
  const [popupAgain, setPopupAgain] = useState(
    ((_c = campaignData.rules) == null ? void 0 : _c.popupAgain) || {
      enabled: true,
      timer: { minutes: 10, seconds: 0 }
    }
  );
  const [displayFrequency, setDisplayFrequency] = useState(
    ((_d = campaignData.rules) == null ? void 0 : _d.displayFrequency) || {
      enabled: true,
      frequency: "once_a_day",
      visitorType: "everyone"
      // everyone, new, return
    }
  );
  useEffect(() => {
    if (!campaignData.rules) {
      updateCampaignData({
        rules: {
          appearingRules,
          pageTargeting,
          popupAgain,
          displayFrequency
        }
      });
    }
  }, []);
  useEffect(() => {
    if (campaignData.rules) {
      if (campaignData.rules.appearingRules) {
        setAppearingRules(campaignData.rules.appearingRules);
      }
      if (campaignData.rules.pageTargeting) {
        setPageTargeting(campaignData.rules.pageTargeting);
      }
      if (campaignData.rules.popupAgain) {
        setPopupAgain(campaignData.rules.popupAgain);
      }
      if (campaignData.rules.displayFrequency) {
        setDisplayFrequency(campaignData.rules.displayFrequency);
      }
    }
  }, [campaignData.rules]);
  const saveRulesToContext = () => {
    updateCampaignRules("appearingRules", appearingRules);
    updateCampaignRules("pageTargeting", pageTargeting);
    updateCampaignRules("popupAgain", popupAgain);
    updateCampaignRules("displayFrequency", displayFrequency);
  };
  const handleFinish = () => {
    console.log("Finish button clicked, showing launch modal");
    saveRulesToContext();
    setShowLaunchModal(true);
  };
  const handleLaunch = async () => {
    try {
      setIsLaunching(true);
      console.log("Launching campaign with status:", launchStatus);
      saveRulesToContext();
      const savedCampaign = await saveCampaign({
        ...campaignData,
        status: launchStatus,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        rules: {
          appearingRules,
          pageTargeting,
          popupAgain,
          displayFrequency
        }
      });
      toast.success(
        `Campaign ${launchStatus === "active" ? "launched" : "saved"} successfully!`
      );
      navigate("/app/campaigns");
    } catch (error) {
      console.error("Error launching campaign:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLaunching(false);
      setShowLaunchModal(false);
    }
  };
  const toggleAppearingRule = (rule) => {
    const updatedRules = {
      ...appearingRules,
      [rule]: {
        ...appearingRules[rule],
        enabled: !appearingRules[rule].enabled
      }
    };
    setAppearingRules(updatedRules);
    updateCampaignRules("appearingRules", updatedRules);
  };
  const updateAppearingRuleValue = (rule, field, value) => {
    const updatedRules = {
      ...appearingRules,
      [rule]: {
        ...appearingRules[rule],
        [field]: value
      }
    };
    setAppearingRules(updatedRules);
    updateCampaignRules("appearingRules", updatedRules);
  };
  const togglePageTargeting = () => {
    const updatedTargeting = {
      ...pageTargeting,
      enabled: !pageTargeting.enabled
    };
    setPageTargeting(updatedTargeting);
    updateCampaignRules("pageTargeting", updatedTargeting);
  };
  const addPageTargetingUrl = () => {
    if (newPageUrl && !pageTargeting.urls.includes(newPageUrl)) {
      const updatedTargeting = {
        ...pageTargeting,
        urls: [...pageTargeting.urls, newPageUrl]
      };
      setPageTargeting(updatedTargeting);
      updateCampaignRules("pageTargeting", updatedTargeting);
      setNewPageUrl("");
    }
  };
  const removePageTargetingUrl = (url) => {
    const updatedTargeting = {
      ...pageTargeting,
      urls: pageTargeting.urls.filter((u) => u !== url)
    };
    setPageTargeting(updatedTargeting);
    updateCampaignRules("pageTargeting", updatedTargeting);
  };
  const togglePopupAgain = () => {
    const updatedPopupAgain = {
      ...popupAgain,
      enabled: !popupAgain.enabled
    };
    setPopupAgain(updatedPopupAgain);
    updateCampaignRules("popupAgain", updatedPopupAgain);
  };
  const updatePopupTimer = (field, value) => {
    const numValue = Number.parseInt(value) || 0;
    const updatedTimer = {
      ...popupAgain.timer,
      [field]: numValue
    };
    const updatedPopupAgain = {
      ...popupAgain,
      timer: updatedTimer
    };
    setPopupAgain(updatedPopupAgain);
    updateCampaignRules("popupAgain", updatedPopupAgain);
  };
  const toggleDisplayFrequency = () => {
    const updatedFrequency = {
      ...displayFrequency,
      enabled: !displayFrequency.enabled
    };
    setDisplayFrequency(updatedFrequency);
    updateCampaignRules("displayFrequency", updatedFrequency);
  };
  const updateDisplayFrequency = (frequency) => {
    const updatedFrequency = {
      ...displayFrequency,
      frequency
    };
    setDisplayFrequency(updatedFrequency);
    updateCampaignRules("displayFrequency", updatedFrequency);
  };
  const updateVisitorType = (visitorType) => {
    const updatedFrequency = {
      ...displayFrequency,
      visitorType
    };
    setDisplayFrequency(updatedFrequency);
    updateCampaignRules("displayFrequency", updatedFrequency);
  };
  const renderWheel = (size, isMobile = false) => {
    var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2, _p2, _q2, _r2, _s2, _t2, _u2, _v2, _w2, _x2, _y2, _z2, _A2, _B2, _C2, _D2, _E2, _F2, _G2, _H2, _I2, _J2, _K2;
    const wheelSectors = ((_a3 = campaignData.layout) == null ? void 0 : _a3.wheelSectors) || "eight";
    const textSizeClass = isMobile ? "text-[6px]" : "text-sm";
    return /* @__PURE__ */ jsx("div", { className: `relative ${size}`, children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "w-full h-full rounded-full",
        style: {
          background: wheelSectors === "four" ? `conic-gradient(
                    ${campaignData.primaryColor} 0deg, 
                    ${campaignData.primaryColor} 90deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                    ${campaignData.primaryColor} 180deg, 
                    ${campaignData.primaryColor} 270deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                  )` : wheelSectors === "six" ? `conic-gradient(
                      ${campaignData.primaryColor} 0deg, 
                      ${campaignData.primaryColor} 60deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 60deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 120deg, 
                      ${campaignData.primaryColor} 120deg, 
                      ${campaignData.primaryColor} 180deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 240deg,
                      ${campaignData.primaryColor} 240deg, 
                      ${campaignData.primaryColor} 300deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 300deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                    )` : `conic-gradient(
                      ${campaignData.primaryColor} 0deg, 
                      ${campaignData.primaryColor} 45deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 45deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg,
                      ${campaignData.primaryColor} 90deg, 
                      ${campaignData.primaryColor} 135deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 135deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg,
                      ${campaignData.primaryColor} 180deg, 
                      ${campaignData.primaryColor} 225deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 225deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg,
                      ${campaignData.primaryColor} 270deg, 
                      ${campaignData.primaryColor} 315deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 315deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                    )`
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `${isMobile ? "w-6 h-6" : "w-10 h-10"} rounded-full bg-black`
            }
          ) }),
          wheelSectors === "four" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold`,
                children: ((_c2 = (_b2 = campaignData.prizes) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.text) || "10% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-90`,
                children: ((_e2 = (_d2 = campaignData.prizes) == null ? void 0 : _d2[1]) == null ? void 0 : _e2.text) || "FREE SHIP"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-180`,
                children: ((_g2 = (_f2 = campaignData.prizes) == null ? void 0 : _f2[2]) == null ? void 0 : _g2.text) || "20% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-90`,
                children: ((_i2 = (_h2 = campaignData.prizes) == null ? void 0 : _h2[3]) == null ? void 0 : _i2.text) || "NO LUCK"
              }
            )
          ] }),
          wheelSectors === "six" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold`,
                children: ((_k2 = (_j2 = campaignData.prizes) == null ? void 0 : _j2[0]) == null ? void 0 : _k2.text) || "10% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-60`,
                children: ((_m2 = (_l2 = campaignData.prizes) == null ? void 0 : _l2[1]) == null ? void 0 : _m2.text) || "FREE SHIP"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-120`,
                children: ((_o2 = (_n2 = campaignData.prizes) == null ? void 0 : _n2[2]) == null ? void 0 : _o2.text) || "15% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-180`,
                children: ((_q2 = (_p2 = campaignData.prizes) == null ? void 0 : _p2[3]) == null ? void 0 : _q2.text) || "20% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-120`,
                children: ((_s2 = (_r2 = campaignData.prizes) == null ? void 0 : _r2[4]) == null ? void 0 : _s2.text) || "5% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-60`,
                children: ((_u2 = (_t2 = campaignData.prizes) == null ? void 0 : _t2[5]) == null ? void 0 : _u2.text) || "NO LUCK"
              }
            )
          ] }),
          wheelSectors === "eight" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold`,
                children: ((_w2 = (_v2 = campaignData.prizes) == null ? void 0 : _v2[0]) == null ? void 0 : _w2.text) || "10% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-45`,
                children: ((_y2 = (_x2 = campaignData.prizes) == null ? void 0 : _x2[1]) == null ? void 0 : _y2.text) || "FREE SHIP"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-90`,
                children: ((_A2 = (_z2 = campaignData.prizes) == null ? void 0 : _z2[2]) == null ? void 0 : _A2.text) || "15% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-135`,
                children: ((_C2 = (_B2 = campaignData.prizes) == null ? void 0 : _B2[3]) == null ? void 0 : _C2.text) || "BOGO"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold rotate-180`,
                children: ((_E2 = (_D2 = campaignData.prizes) == null ? void 0 : _D2[4]) == null ? void 0 : _E2.text) || "20% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-135`,
                children: ((_G2 = (_F2 = campaignData.prizes) == null ? void 0 : _F2[5]) == null ? void 0 : _G2.text) || "5% OFF"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-90`,
                children: ((_I2 = (_H2 = campaignData.prizes) == null ? void 0 : _H2[6]) == null ? void 0 : _I2.text) || "GIFT"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 ${textSizeClass} font-bold -rotate-45`,
                children: ((_K2 = (_J2 = campaignData.prizes) == null ? void 0 : _J2[7]) == null ? void 0 : _K2.text) || "NO LUCK"
              }
            )
          ] })
        ]
      }
    ) });
  };
  const renderFloatingButton = (isMobile = false) => {
    var _a3, _b2, _c2, _d2, _e2, _f2;
    if (!((_a3 = campaignData.layout) == null ? void 0 : _a3.showFloatingButton)) return null;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute ${((_b2 = campaignData.layout) == null ? void 0 : _b2.floatingButtonPosition) === "bottomLeft" ? "bottom-4 left-4" : ((_c2 = campaignData.layout) == null ? void 0 : _c2.floatingButtonPosition) === "bottomRight" ? "bottom-4 right-4" : ((_d2 = campaignData.layout) == null ? void 0 : _d2.floatingButtonPosition) === "topRight" ? "top-4 right-4" : "bottom-4 left-1/2 transform -translate-x-1/2"}`,
        children: ((_e2 = campaignData.layout) == null ? void 0 : _e2.floatingButtonHasText) ? /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2"} rounded-full text-white`,
            style: { backgroundColor: campaignData.primaryColor },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `${isMobile ? "w-6 h-6" : "w-8 h-8"} bg-white rounded-full flex items-center justify-center ${isMobile ? "mr-1" : "mr-2"}`,
                  children: /* @__PURE__ */ jsxs(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: `${isMobile ? "h-4 w-4" : "h-5 w-5"}`,
                      viewBox: "0 0 20 20",
                      fill: campaignData.primaryColor,
                      children: [
                        /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z",
                            clipRule: "evenodd"
                          }
                        ),
                        /* @__PURE__ */ jsx("path", { d: "M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" })
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: ((_f2 = campaignData.layout) == null ? void 0 : _f2.floatingButtonText) || "SPIN & WIN" })
            ]
          }
        ) : /* @__PURE__ */ jsx(
          "div",
          {
            className: `${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full flex items-center justify-center`,
            style: { backgroundColor: campaignData.primaryColor },
            children: /* @__PURE__ */ jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: `${isMobile ? "h-5 w-5" : "h-6 w-6"} text-white`,
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fillRule: "evenodd",
                      d: "M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z",
                      clipRule: "evenodd"
                    }
                  ),
                  /* @__PURE__ */ jsx("path", { d: "M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" })
                ]
              }
            )
          }
        )
      }
    );
  };
  useEffect(() => {
    return () => {
      saveRulesToContext();
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
    /* @__PURE__ */ jsx("div", { className: "hidden lg:block lg:w-1/5", children: /* @__PURE__ */ jsx("div", { className: "bg-indigo-600 text-white rounded-lg p-6 h-full top-4", children: /* @__PURE__ */ jsx(
      StepSidebar,
      {
        activeStep: 4,
        onStepClick: (step) => {
          if (step !== 4) {
            saveRulesToContext();
            if (step > campaignData.step) {
              if (step <= campaignData.step + 1) {
                updateCampaignData({ step });
              }
            } else {
              updateCampaignData({ step });
            }
          }
        }
      }
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-2/5", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center text-xl font-semibold mb-6 text-indigo-700", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-6 w-6 mr-2",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              }
            )
          }
        ),
        "Define your campaign rules!"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-medium mb-2 text-gray-700", children: "APPEARING RULES" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: "You can pick more than one." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: appearingRules.exitIntent.enabled,
                  onChange: () => toggleAppearingRule("exitIntent")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6 text-indigo-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M11 17l-5-5m0 0l5-5m-5 5h12"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-center mb-1", children: "Exit Intent" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center", children: "Show when a visitor is about to leave the page" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: appearingRules.timeDelay.enabled,
                  onChange: () => toggleAppearingRule("timeDelay")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6 text-indigo-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-center mb-1", children: "Time Delay" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center mb-2", children: "After" }),
              appearingRules.timeDelay.enabled && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-200 rounded px-3 py-1 text-center w-full", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-8 bg-transparent text-center focus:outline-none",
                    value: appearingRules.timeDelay.seconds,
                    onChange: (e) => updateAppearingRuleValue(
                      "timeDelay",
                      "seconds",
                      Number.parseInt(e.target.value) || 5
                    ),
                    min: "1"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm ml-1", children: "sec" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: appearingRules.pageScroll.enabled,
                  onChange: () => toggleAppearingRule("pageScroll")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6 text-indigo-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-center mb-1", children: "Page Scroll" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center mb-2", children: "After" }),
              appearingRules.pageScroll.enabled && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-200 rounded px-3 py-1 text-center w-full", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-8 bg-transparent text-center focus:outline-none",
                    value: appearingRules.pageScroll.percentage,
                    onChange: (e) => updateAppearingRuleValue(
                      "pageScroll",
                      "percentage",
                      Number.parseInt(e.target.value) || 20
                    ),
                    min: "1",
                    max: "100"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm ml-1", children: "% of page" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: appearingRules.pageCount.enabled,
                  onChange: () => toggleAppearingRule("pageCount")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6 text-indigo-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-center mb-1", children: "Page Count" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center mb-2", children: "After" }),
              appearingRules.pageCount.enabled && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-200 rounded px-3 py-1 text-center w-full", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-8 bg-transparent text-center focus:outline-none",
                    value: appearingRules.pageCount.pages,
                    onChange: (e) => updateAppearingRuleValue(
                      "pageCount",
                      "pages",
                      Number.parseInt(e.target.value) || 2
                    ),
                    min: "1"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm ml-1", children: "Pages" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: appearingRules.clicksCount.enabled,
                  onChange: () => toggleAppearingRule("clicksCount")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6 text-indigo-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-center mb-1", children: "Clicks Count" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center mb-2", children: "After" }),
              appearingRules.clicksCount.enabled && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-200 rounded px-3 py-1 text-center w-full", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-8 bg-transparent text-center focus:outline-none",
                    value: appearingRules.clicksCount.clicks,
                    onChange: (e) => updateAppearingRuleValue(
                      "clicksCount",
                      "clicks",
                      Number.parseInt(e.target.value) || 2
                    ),
                    min: "1"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm ml-1", children: "Clicks" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: appearingRules.inactivity.enabled,
                  onChange: () => toggleAppearingRule("inactivity")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6 text-indigo-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-center mb-1", children: "Inactivity" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center mb-2", children: "After" }),
              appearingRules.inactivity.enabled && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-200 rounded px-3 py-1 text-center w-full", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-8 bg-transparent text-center focus:outline-none",
                    value: appearingRules.inactivity.seconds,
                    onChange: (e) => updateAppearingRuleValue(
                      "inactivity",
                      "seconds",
                      Number.parseInt(e.target.value) || 30
                    ),
                    min: "1"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm ml-1", children: "sec idle" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8 border-t pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700", children: "PAGE TARGETTING" }),
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "sr-only peer",
                checked: pageTargeting.enabled,
                onChange: togglePageTargeting
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-4", children: [
          "When OFF: Shows on home page of",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: pageTargeting.url })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Page URL" }),
          /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
                placeholder: "Enter URL",
                disabled: !pageTargeting.enabled,
                value: newPageUrl,
                onChange: (e) => setNewPageUrl(e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700 transition-colors",
                disabled: !pageTargeting.enabled,
                onClick: addPageTargetingUrl,
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        pageTargeting.enabled && pageTargeting.urls.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Added URLs:" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: pageTargeting.urls.map((url, index2) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-gray-100 px-3 py-1 rounded-full flex items-center",
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 mr-1", children: url }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "text-gray-500 hover:text-red-500",
                    onClick: () => removePageTargetingUrl(url),
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-4 w-4",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                            clipRule: "evenodd"
                          }
                        )
                      }
                    )
                  }
                )
              ]
            },
            index2
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8 border-t pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700", children: "SHOW POP-UP AGAIN AFTER A WHILE" }),
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "sr-only peer",
                checked: popupAgain.enabled,
                onChange: togglePopupAgain
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: "When OFF: The pop-up will not reappear once the user closes it." }),
        popupAgain.enabled && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Timer" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "w-16 p-2 border rounded-md text-center",
                value: popupAgain.timer.minutes,
                onChange: (e) => updatePopupTimer("minutes", e.target.value),
                min: "0",
                max: "59"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: ":" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "w-16 p-2 border rounded-md text-center",
                value: popupAgain.timer.seconds,
                onChange: (e) => updatePopupTimer("seconds", e.target.value),
                min: "0",
                max: "59"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex mt-1", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 text-xs text-gray-500 text-center", children: "Minutes" }),
            /* @__PURE__ */ jsx("div", { className: "w-4" }),
            /* @__PURE__ */ jsx("div", { className: "w-16 text-xs text-gray-500 text-center", children: "Seconds" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700", children: "DISPLAY FREQUENCY" }),
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "sr-only peer",
                checked: displayFrequency.enabled,
                onChange: toggleDisplayFrequency
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: "When OFF: once a day for each visitor" }),
        displayFrequency.enabled && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 mb-4", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer ${displayFrequency.visitorType === "everyone" ? "ring-2 ring-indigo-500" : ""}`,
                onClick: () => updateVisitorType("everyone"),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 relative", children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-6 w-6 text-indigo-600",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          }
                        )
                      }
                    ),
                    displayFrequency.visitorType === "everyone" && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-3 w-3 text-white",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                            clipRule: "evenodd"
                          }
                        )
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Everyone" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer ${displayFrequency.visitorType === "new" ? "ring-2 ring-indigo-500" : ""}`,
                onClick: () => updateVisitorType("new"),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 relative", children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-6 w-6 text-indigo-600",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          }
                        )
                      }
                    ),
                    displayFrequency.visitorType === "new" && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-3 w-3 text-white",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                            clipRule: "evenodd"
                          }
                        )
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "New" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer ${displayFrequency.visitorType === "return" ? "ring-2 ring-indigo-500" : ""}`,
                onClick: () => updateVisitorType("return"),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 relative", children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-6 w-6 text-indigo-600",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          }
                        )
                      }
                    ),
                    displayFrequency.visitorType === "return" && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-3 w-3 text-white",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            fillRule: "evenodd",
                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                            clipRule: "evenodd"
                          }
                        )
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Return" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Show to visitors" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "block w-full p-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10",
                  value: displayFrequency.frequency,
                  onChange: (e) => updateDisplayFrequency(e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "once_a_day", children: "Once a day" }),
                    /* @__PURE__ */ jsx("option", { value: "every_visit", children: "Every visit" }),
                    /* @__PURE__ */ jsx("option", { value: "once_every_2_days", children: "Once every 2 days" }),
                    /* @__PURE__ */ jsx("option", { value: "once_every_few_visits", children: "Once every few visits" }),
                    /* @__PURE__ */ jsx("option", { value: "all_pages_all_time", children: "All pages all the time" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-5 w-5 text-gray-400",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      fillRule: "evenodd",
                      d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                      clipRule: "evenodd"
                    }
                  )
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleFinish,
          className: "px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors",
          children: "Finish"
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-2/5", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-4 rounded-lg sticky top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-full overflow-hidden flex border border-indigo-600 p-1", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `px-4 py-2 rounded-full flex items-center ${previewDevice === "mobile" ? "bg-indigo-600 text-white" : "text-indigo-600"}`,
              onClick: () => setPreviewDevice("mobile"),
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 inline-block mr-1",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ),
                "Mobile"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `px-4 py-2 rounded-full flex items-center ${previewDevice === "desktop" ? "bg-indigo-600 text-white" : "text-indigo-600"}`,
              onClick: () => setPreviewDevice("desktop"),
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 inline-block mr-1",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                ),
                "Desktop"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "text-indigo-600 flex items-center font-medium", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-1",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                    clipRule: "evenodd"
                  }
                )
              ]
            }
          ),
          "Preview"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-full relative bg-gray-700 flex items-center justify-center", children: previewDevice === "desktop" ? /* @__PURE__ */ jsxs("div", { className: "w-full h-full rounded-lg overflow-hidden", children: [
        activePreviewTab === "landing" && /* @__PURE__ */ jsx("div", { className: "bg-gray-800 p-4 h-[400px] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-[800px] h-[320px] p-0 relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("button", { className: "absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10", children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                  clipRule: "evenodd"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-1/2 p-8 flex flex-col justify-center", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  className: "text-3xl font-bold mb-3",
                  style: { color: campaignData.primaryColor },
                  children: ((_f = (_e = campaignData.content) == null ? void 0 : _e.landing) == null ? void 0 : _f.title) || "GO AHEAD GIVE IT A SPIN!"
                }
              ),
              ((_h = (_g = campaignData.content) == null ? void 0 : _g.landing) == null ? void 0 : _h.showSubtitle) && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-5", children: ((_j = (_i = campaignData.content) == null ? void 0 : _i.landing) == null ? void 0 : _j.subtitle) || "This is a demo of our Spin to Win displays" }),
              ((_l = (_k = campaignData.content) == null ? void 0 : _k.landing) == null ? void 0 : _l.showPrivacyPolicy) && /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    id: "preview-privacy",
                    className: "mr-2",
                    checked: true,
                    readOnly: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "preview-privacy",
                    className: "text-xs text-gray-600",
                    children: ((_n = (_m = campaignData.content) == null ? void 0 : _m.landing) == null ? void 0 : _n.privacyPolicyText) || "I accept the T&C and Privacy Notice."
                  }
                )
              ] }),
              ((_p = (_o = campaignData.content) == null ? void 0 : _o.landing) == null ? void 0 : _p.showEmail) && /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  placeholder: ((_r = (_q = campaignData.content) == null ? void 0 : _q.landing) == null ? void 0 : _r.emailPlaceholder) || "Enter your email",
                  className: "w-full p-3 border rounded-md mb-4 text-center"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "w-full py-3 font-bold text-white rounded-md text-lg",
                  style: {
                    backgroundColor: campaignData.primaryColor
                  },
                  children: ((_t = (_s = campaignData.content) == null ? void 0 : _s.landing) == null ? void 0 : _t.buttonText) || "SPIN NOW"
                }
              ),
              ((_v = (_u = campaignData.content) == null ? void 0 : _u.landing) == null ? void 0 : _v.showTerms) && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-3 text-center", children: ((_x = (_w = campaignData.content) == null ? void 0 : _w.landing) == null ? void 0 : _x.termsText) || "I accept the T&C$" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-1/2 bg-gray-50 flex items-center justify-center relative", children: renderWheel("w-[280px] h-[280px]") })
          ] })
        ] }) }),
        activePreviewTab === "result" && /* @__PURE__ */ jsx("div", { className: "bg-gray-800 p-4 h-[400px] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-[800px] h-[320px] p-0 relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("button", { className: "absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10", children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                  clipRule: "evenodd"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-1/2 p-8 flex flex-col justify-center", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  className: "text-3xl font-bold mb-3",
                  style: { color: campaignData.primaryColor },
                  children: ((_y = campaignData.content) == null ? void 0 : _y.winTitle) || "CONGRATULATIONS!"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-5", children: ((_z = campaignData.content) == null ? void 0 : _z.winMessage) || "You've won a 10% discount on your next purchase" }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-full p-4 mb-6 text-center font-bold text-lg border-2 border-dashed",
                  style: {
                    borderColor: campaignData.primaryColor,
                    color: campaignData.primaryColor
                  },
                  children: ((_A = campaignData.content) == null ? void 0 : _A.couponCode) || "WINNER10"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "w-full py-3 font-bold text-white rounded-md mb-4 text-lg",
                  style: {
                    backgroundColor: campaignData.primaryColor
                  },
                  children: ((_B = campaignData.content) == null ? void 0 : _B.copyButtonText) || "COPY CODE"
                }
              ),
              /* @__PURE__ */ jsx("button", { className: "w-full py-3 font-bold text-gray-800 bg-gray-200 rounded-md text-lg", children: ((_C = campaignData.content) == null ? void 0 : _C.shopButtonText) || "SHOP NOW" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-1/2 bg-gray-50 flex items-center justify-center relative", children: /* @__PURE__ */ jsx("div", { className: "w-48 h-48 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-24 w-24 text-green-500",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M5 13l4 4L19 7"
                  }
                )
              }
            ) }) })
          ] })
        ] }) }),
        activePreviewTab === "floating" && /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 p-4 h-[400px] relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full h-full bg-gray-50 flex flex-col", children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 w-full mb-2" })
          ] }),
          renderFloatingButton()
        ] })
      ] }) : (
        // Mobile view
        /* @__PURE__ */ jsxs("div", { className: "w-56 h-[480px] bg-gray-900 rounded-3xl p-2 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full" }),
          /* @__PURE__ */ jsxs("div", { className: "w-full h-full bg-gray-800 rounded-2xl overflow-hidden", children: [
            activePreviewTab === "landing" && /* @__PURE__ */ jsxs("div", { className: "bg-white h-full p-4 flex flex-col items-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center w-full", children: [
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    className: "text-xl font-bold mb-2",
                    style: { color: campaignData.primaryColor },
                    children: ((_E = (_D = campaignData.content) == null ? void 0 : _D.landing) == null ? void 0 : _E.title) || "GO AHEAD GIVE IT A SPIN!"
                  }
                ),
                ((_G = (_F = campaignData.content) == null ? void 0 : _F.landing) == null ? void 0 : _G.showSubtitle) && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-3", children: ((_I = (_H = campaignData.content) == null ? void 0 : _H.landing) == null ? void 0 : _I.subtitle) || "This is a demo of our Spin to Win displays" }),
                ((_K = (_J = campaignData.content) == null ? void 0 : _J.landing) == null ? void 0 : _K.showPrivacyPolicy) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-3", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      id: "preview-privacy-mobile",
                      className: "mr-1 h-3 w-3",
                      checked: true,
                      readOnly: true
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "label",
                    {
                      htmlFor: "preview-privacy-mobile",
                      className: "text-[10px] text-gray-600",
                      children: ((_M = (_L = campaignData.content) == null ? void 0 : _L.landing) == null ? void 0 : _M.privacyPolicyText) || "I accept the T&C and Privacy Notice."
                    }
                  )
                ] }),
                ((_O = (_N = campaignData.content) == null ? void 0 : _N.landing) == null ? void 0 : _O.showEmail) && /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    placeholder: ((_Q = (_P = campaignData.content) == null ? void 0 : _P.landing) == null ? void 0 : _Q.emailPlaceholder) || "Enter your email",
                    className: "w-full p-2 text-xs border rounded-md mb-3 text-center"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "w-full py-2 text-sm font-bold text-white rounded-md",
                    style: { backgroundColor: campaignData.primaryColor },
                    children: ((_S = (_R = campaignData.content) == null ? void 0 : _R.landing) == null ? void 0 : _S.buttonText) || "SPIN NOW"
                  }
                ),
                ((_U = (_T = campaignData.content) == null ? void 0 : _T.landing) == null ? void 0 : _U.showTerms) && /* @__PURE__ */ jsx("p", { className: "text-[8px] text-gray-500 mt-2 text-center", children: ((_W = (_V = campaignData.content) == null ? void 0 : _V.landing) == null ? void 0 : _W.termsText) || "I accept the T&C$" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4", children: renderWheel("w-40 h-40", true) })
            ] }),
            activePreviewTab === "result" && /* @__PURE__ */ jsxs("div", { className: "bg-white h-full p-4 flex flex-col items-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center w-full", children: [
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    className: "text-xl font-bold mb-2",
                    style: { color: campaignData.primaryColor },
                    children: ((_X = campaignData.content) == null ? void 0 : _X.winTitle) || "CONGRATULATIONS!"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-3", children: ((_Y = campaignData.content) == null ? void 0 : _Y.winMessage) || "You've won a 10% discount on your next purchase" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-full p-2 mb-3 text-center font-bold text-sm border-2 border-dashed",
                    style: {
                      borderColor: campaignData.primaryColor,
                      color: campaignData.primaryColor
                    },
                    children: ((_Z = campaignData.content) == null ? void 0 : _Z.couponCode) || "WINNER10"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "w-full py-2 text-sm font-bold text-white rounded-md mb-2",
                    style: { backgroundColor: campaignData.primaryColor },
                    children: ((__ = campaignData.content) == null ? void 0 : __.copyButtonText) || "COPY CODE"
                  }
                ),
                /* @__PURE__ */ jsx("button", { className: "w-full py-2 text-sm font-bold text-gray-800 bg-gray-200 rounded-md", children: ((_$ = campaignData.content) == null ? void 0 : _$.shopButtonText) || "SHOP NOW" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-12 w-12 text-green-500",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M5 13l4 4L19 7"
                    }
                  )
                }
              ) }) })
            ] }),
            activePreviewTab === "floating" && /* @__PURE__ */ jsx("div", { className: "bg-white h-full relative", children: renderFloatingButton(true) })
          ] })
        ] })
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center mt-4 border-b", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activePreviewTab === "landing" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActivePreviewTab("landing"),
            children: "Landing Screen"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activePreviewTab === "result" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActivePreviewTab("result"),
            children: "Result screen"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activePreviewTab === "floating" ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`,
            onClick: () => setActivePreviewTab("floating"),
            children: "Floating Button"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx("div", { className: "bg-indigo-600 text-white rounded-full px-3 py-1 text-sm font-medium", children: "90%" }) })
    ] }) }),
    showLaunchModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg max-w-4xl w-full p-0 relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowLaunchModal(false),
          className: "absolute top-4 right-4 z-10",
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-8 w-8 text-white",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M6 18L18 6M6 6l12 12"
                }
              )
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "p-8 bg-indigo-900 text-white text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-2", children: "READY, SET, LAUNCH!" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl", children: "Your campaign can now shine on your site." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-lg w-full overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-2", children: campaignData.logo ? /* @__PURE__ */ jsx(
            "img",
            {
              src: campaignData.logo || "/placeholder.svg",
              alt: "Campaign Logo",
              className: "w-full h-full object-contain"
            }
          ) : /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-full h-full rounded-full flex items-center justify-center",
              style: {
                backgroundColor: campaignData.primaryColor || "#ff5722"
              },
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-8 w-8 text-white",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M13 10V3L4 14h7v7l9-11h-7z"
                    }
                  )
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-2xl font-bold",
              style: { color: campaignData.primaryColor || "#ff5722" },
              children: campaignData.name || "Swiggy"
            }
          ),
          /* @__PURE__ */ jsx(
            "h4",
            {
              className: "text-2xl font-bold mb-4",
              style: { color: campaignData.primaryColor || "#ff5722" },
              children: ((_ba = (_aa = campaignData.content) == null ? void 0 : _aa.landing) == null ? void 0 : _ba.title) || "SPIN TO WIN"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 text-center mb-4", children: ((_da = (_ca = campaignData.content) == null ? void 0 : _ca.landing) == null ? void 0 : _da.subtitle) || "Before you go anywhere, enter your email address to spin the wheel for a chance to win a wicked awesome discount." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2", children: [
            ((_fa = (_ea = campaignData.content) == null ? void 0 : _ea.landing) == null ? void 0 : _fa.showPrivacyPolicy) !== false && /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 w-full", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "privacy-notice",
                  className: "mr-2",
                  checked: true,
                  readOnly: true
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "privacy-notice", className: "text-xs", children: ((_ha = (_ga = campaignData.content) == null ? void 0 : _ga.landing) == null ? void 0 : _ha.privacyPolicyText) || "I accept the Privacy Notice." })
            ] }),
            ((_ja = (_ia = campaignData.content) == null ? void 0 : _ia.landing) == null ? void 0 : _ja.showTerms) !== false && /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4 w-full", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "terms",
                  className: "mr-2",
                  checked: true,
                  readOnly: true
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "terms", className: "text-xs", children: ((_la = (_ka = campaignData.content) == null ? void 0 : _ka.landing) == null ? void 0 : _la.termsText) || "I accept the Terms & Conditions." })
            ] }),
            ((_na = (_ma = campaignData.content) == null ? void 0 : _ma.landing) == null ? void 0 : _na.showEmail) !== false && /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                placeholder: ((_pa = (_oa = campaignData.content) == null ? void 0 : _oa.landing) == null ? void 0 : _pa.emailPlaceholder) || "Enter your email",
                className: "w-full p-3 border rounded-md mb-4 text-center"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-full py-3 font-bold text-white rounded-md text-lg",
                style: {
                  backgroundColor: campaignData.primaryColor || "#ff5722"
                },
                children: ((_ra = (_qa = campaignData.content) == null ? void 0 : _qa.landing) == null ? void 0 : _ra.buttonText) || "SPIN NOW"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-3 text-center", children: ((_ta = (_sa = campaignData.content) == null ? void 0 : _sa.landing) == null ? void 0 : _ta.noThanksText) || "No, I don't feel lucky today!" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 flex justify-center items-center", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 w-full h-full rounded-full",
                style: {
                  background: "radial-gradient(circle, transparent 80%, white 80%, white 83%, transparent 83%)",
                  backgroundSize: "100% 100%",
                  transform: "scale(1.05)",
                  pointerEvents: "none"
                },
                children: Array.from({ length: 24 }).map((_, i) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute w-2 h-2 bg-white rounded-full",
                    style: {
                      top: `${50 - 45 * Math.cos(i * (Math.PI / 12))}%`,
                      left: `${50 + 45 * Math.sin(i * (Math.PI / 12))}%`
                    }
                  },
                  i
                ))
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "relative w-[220px] h-[220px] rounded-full overflow-hidden",
                style: {
                  background: ((_ua = campaignData.layout) == null ? void 0 : _ua.wheelSectors) === "four" ? `conic-gradient(
                                    ${campaignData.primaryColor} 0deg, 
                                    ${campaignData.primaryColor} 90deg, 
                                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg, 
                                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                                    ${campaignData.primaryColor} 180deg, 
                                    ${campaignData.primaryColor} 270deg, 
                                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg, 
                                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                                  )` : ((_va = campaignData.layout) == null ? void 0 : _va.wheelSectors) === "six" ? `conic-gradient(
                                      ${campaignData.primaryColor} 0deg, 
                                      ${campaignData.primaryColor} 60deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 60deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 120deg, 
                                      ${campaignData.primaryColor} 120deg, 
                                      ${campaignData.primaryColor} 180deg,
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 240deg,
                                      ${campaignData.primaryColor} 240deg, 
                                      ${campaignData.primaryColor} 300deg,
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 300deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                                    )` : `conic-gradient(
                                      ${campaignData.primaryColor} 0deg, 
                                      ${campaignData.primaryColor} 45deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 45deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg,
                                      ${campaignData.primaryColor} 90deg, 
                                      ${campaignData.primaryColor} 135deg,
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 135deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg,
                                      ${campaignData.primaryColor} 180deg, 
                                      ${campaignData.primaryColor} 225deg,
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 225deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg,
                                      ${campaignData.primaryColor} 270deg, 
                                      ${campaignData.primaryColor} 315deg,
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 315deg, 
                                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                                    )`
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-black" }) }),
                  ((_wa = campaignData.layout) == null ? void 0 : _wa.wheelSectors) === "four" && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: ((_ya = (_xa = campaignData.prizes) == null ? void 0 : _xa[0]) == null ? void 0 : _ya.text) || "10% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90", children: ((_Aa = (_za = campaignData.prizes) == null ? void 0 : _za[1]) == null ? void 0 : _Aa.text) || "FREE SHIP" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: ((_Ca = (_Ba = campaignData.prizes) == null ? void 0 : _Ba[2]) == null ? void 0 : _Ca.text) || "20% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90", children: ((_Ea = (_Da = campaignData.prizes) == null ? void 0 : _Da[3]) == null ? void 0 : _Ea.text) || "NO LUCK" })
                  ] }),
                  ((_Fa = campaignData.layout) == null ? void 0 : _Fa.wheelSectors) === "six" && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: ((_Ha = (_Ga = campaignData.prizes) == null ? void 0 : _Ga[0]) == null ? void 0 : _Ha.text) || "10% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-60", children: ((_Ja = (_Ia = campaignData.prizes) == null ? void 0 : _Ia[1]) == null ? void 0 : _Ja.text) || "FREE SHIP" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-120", children: ((_La = (_Ka = campaignData.prizes) == null ? void 0 : _Ka[2]) == null ? void 0 : _La.text) || "15% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: ((_Na = (_Ma = campaignData.prizes) == null ? void 0 : _Ma[3]) == null ? void 0 : _Na.text) || "20% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-120", children: ((_Pa = (_Oa = campaignData.prizes) == null ? void 0 : _Oa[4]) == null ? void 0 : _Pa.text) || "5% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-60", children: ((_Ra = (_Qa = campaignData.prizes) == null ? void 0 : _Qa[5]) == null ? void 0 : _Ra.text) || "NO LUCK" })
                  ] }),
                  (((_Sa = campaignData.layout) == null ? void 0 : _Sa.wheelSectors) === "eight" || !((_Ta = campaignData.layout) == null ? void 0 : _Ta.wheelSectors)) && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: ((_Va = (_Ua = campaignData.prizes) == null ? void 0 : _Ua[0]) == null ? void 0 : _Va.text) || "10% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-45", children: ((_Xa = (_Wa = campaignData.prizes) == null ? void 0 : _Wa[1]) == null ? void 0 : _Xa.text) || "FREE SHIP" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90", children: ((_Za = (_Ya = campaignData.prizes) == null ? void 0 : _Ya[2]) == null ? void 0 : _Za.text) || "5% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-135", children: ((_$a = (__a = campaignData.prizes) == null ? void 0 : __a[3]) == null ? void 0 : _$a.text) || "20% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: ((_bb = (_ab = campaignData.prizes) == null ? void 0 : _ab[4]) == null ? void 0 : _bb.text) || "FREE SHIP" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-135", children: ((_db = (_cb = campaignData.prizes) == null ? void 0 : _cb[5]) == null ? void 0 : _db.text) || "5% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90", children: ((_fb = (_eb = campaignData.prizes) == null ? void 0 : _eb[6]) == null ? void 0 : _fb.text) || "20% OFF" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-45", children: ((_hb = (_gb = campaignData.prizes) == null ? void 0 : _gb[7]) == null ? void 0 : _hb.text) || "10% OFF" })
                  ] })
                ]
              }
            )
          ] }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 flex justify-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setLaunchStatus("draft");
              handleLaunch();
            },
            className: "px-8 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium",
            children: "Later"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setLaunchStatus("active");
              handleLaunch();
            },
            className: "px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium",
            children: "Activate Now"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center pb-6", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
        "Easily activate or pause your campaigns anytime in",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "All Campaigns" }),
        "."
      ] }) })
    ] }) })
  ] });
}
function CampaignEdit$1() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allCampaigns, updateCampaignData, campaignData, saveCampaign } = useCampaign();
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [campaign, setCampaign] = useState(null);
  console.log("CampaignEdit component rendering with ID:", id);
  console.log("All campaigns available:", allCampaigns);
  useEffect(() => {
    console.log("Looking for campaign with ID:", id);
    console.log("Available campaigns:", allCampaigns);
    const foundCampaign = allCampaigns.find((c) => c.id === id);
    if (foundCampaign) {
      console.log("Found campaign for editing:", foundCampaign);
      setCampaign(foundCampaign);
      updateCampaignData({
        ...foundCampaign,
        step: 1,
        // Start at step 1 when editing
        completionPercentage: 25
      });
      setIsLoading(false);
    } else {
      console.error("Campaign not found:", id);
      toast.error("Campaign not found");
      navigate("/campaigns");
    }
  }, [id, allCampaigns, updateCampaignData, navigate]);
  const handleSaveChanges = async () => {
    try {
      const originalCampaign = campaign || {};
      const updatedCampaign = {
        ...originalCampaign,
        ...campaignData,
        id,
        // Ensure ID is preserved
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log("Saving updated campaign:", updatedCampaign);
      await saveCampaign(updatedCampaign);
      toast.success("Campaign updated successfully!");
      setShowSaveModal(false);
      setTimeout(() => {
        navigate("/campaigns");
      }, 500);
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error(`Error: ${error.message || "Failed to save campaign"}`);
    }
  };
  const handleFinish = () => {
    setShowSaveModal(true);
  };
  const handleBackToCampaigns = () => {
    navigate("/campaigns");
  };
  const renderStep = () => {
    switch (campaignData.step) {
      case 1:
        return /* @__PURE__ */ jsx(StepOne, {});
      case 2:
        return /* @__PURE__ */ jsx(StepTwo, {});
      case 3:
        return /* @__PURE__ */ jsx(StepThree, {});
      case 4:
        return /* @__PURE__ */ jsx(StepFour, {});
      default:
        return /* @__PURE__ */ jsx(StepOne, {});
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsx(Navigation, {}),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4", children: "Loading campaign..." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleBackToCampaigns,
        className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center",
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 mr-2",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                }
              )
            }
          ),
          "Back to Campaigns"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 pb-32", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-8", children: [
        "Edit Campaign: ",
        campaignData.name
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row gap-8", children: /* @__PURE__ */ jsx("div", { className: "w-full ", children: renderStep() }) })
    ] }),
    /* @__PURE__ */ jsx(
      StepNavigation,
      {
        onNext: () => {
          if (campaignData.step === 4) {
            handleFinish();
          }
        },
        nextButtonText: campaignData.step === 4 ? "Save Changes" : "Continue"
      }
    ),
    showSaveModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Save Campaign Changes" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        'Are you sure you want to save your changes to "',
        campaignData.name,
        '"?'
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowSaveModal(false),
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSaveChanges,
            className: "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors",
            children: "Save Changes"
          }
        )
      ] })
    ] }) })
  ] }) });
}
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CampaignEdit$1
}, Symbol.toStringTag, { value: "Module" }));
function CreateCampaign() {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  const {
    campaignData,
    updateCampaignData,
    checkCanCreateCampaign,
    saveCampaign
  } = useCampaign();
  const { currentPlan } = usePlan();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("CreateCampaign rendered, current step:", campaignData.step);
    toast.success("Campaign creator loaded!");
  }, []);
  useEffect(() => {
    if (!checkCanCreateCampaign()) {
      setShowLimitModal(true);
    }
  }, [checkCanCreateCampaign]);
  useEffect(() => {
    console.log("Initializing campaign data");
    updateCampaignData({
      name: "Campaign Name",
      step: 1,
      look: "custom",
      color: "singleTone",
      primaryColor: "#fe5300",
      secondaryColor: "#767676",
      tertiaryColor: "#444444",
      completionPercentage: 25
    });
  }, [updateCampaignData]);
  const handleLaunch = async (status) => {
    try {
      console.log("Launching campaign with status:", status);
      const campaign = {
        ...campaignData,
        id: campaignData.id || `campaign-${Date.now()}`,
        status: status || "draft",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const savedCampaign = await saveCampaign(campaign);
      console.log("Campaign saved successfully:", savedCampaign);
      setShowLaunchModal(false);
      setShowPreviewModal(false);
      toast.success(
        `Campaign ${status === "active" ? "launched" : "saved"} successfully!`
      );
      setTimeout(() => {
        navigate("/campaigns");
      }, 500);
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error(`Error: ${error.message || "Failed to save campaign"}`);
    }
  };
  const handleFinish = () => {
    setShowPreviewModal(true);
  };
  const renderStep = () => {
    console.log("Rendering step:", campaignData.step);
    switch (campaignData.step) {
      case 1:
        return /* @__PURE__ */ jsx(StepOne, {});
      case 2:
        return /* @__PURE__ */ jsx(StepTwo, {});
      case 3:
        return /* @__PURE__ */ jsx(StepThree, {});
      case 4:
        return /* @__PURE__ */ jsx(StepFour, {});
      default:
        return /* @__PURE__ */ jsx(StepOne, {});
    }
  };
  const renderWheel = () => {
    var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2, _p2, _q2, _r2, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K;
    const wheelSectors = ((_a3 = campaignData.layout) == null ? void 0 : _a3.wheelSectors) || "eight";
    return /* @__PURE__ */ jsx("div", { className: "relative w-[220px] h-[220px]", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "w-full h-full rounded-full",
        style: {
          background: wheelSectors === "four" ? `conic-gradient(
                    ${campaignData.primaryColor} 0deg, 
                    ${campaignData.primaryColor} 90deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                    ${campaignData.primaryColor} 180deg, 
                    ${campaignData.primaryColor} 270deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg, 
                    ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                  )` : wheelSectors === "six" ? `conic-gradient(
                      ${campaignData.primaryColor} 0deg, 
                      ${campaignData.primaryColor} 60deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 60deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 120deg, 
                      ${campaignData.primaryColor} 120deg, 
                      ${campaignData.primaryColor} 180deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 240deg,
                      ${campaignData.primaryColor} 240deg, 
                      ${campaignData.primaryColor} 300deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 300deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                    )` : `conic-gradient(
                      ${campaignData.primaryColor} 0deg, 
                      ${campaignData.primaryColor} 45deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 45deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 90deg,
                      ${campaignData.primaryColor} 90deg, 
                      ${campaignData.primaryColor} 135deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 135deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 180deg,
                      ${campaignData.primaryColor} 180deg, 
                      ${campaignData.primaryColor} 225deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 225deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 270deg,
                      ${campaignData.primaryColor} 270deg, 
                      ${campaignData.primaryColor} 315deg,
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 315deg, 
                      ${campaignData.color === "dualTone" ? campaignData.secondaryColor : "white"} 360deg
                    )`
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-black" }) }),
          wheelSectors === "four" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: ((_c2 = (_b2 = campaignData.prizes) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.text) || "10% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90", children: ((_e2 = (_d2 = campaignData.prizes) == null ? void 0 : _d2[1]) == null ? void 0 : _e2.text) || "FREE SHIP" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: ((_g2 = (_f2 = campaignData.prizes) == null ? void 0 : _f2[2]) == null ? void 0 : _g2.text) || "20% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90", children: ((_i2 = (_h2 = campaignData.prizes) == null ? void 0 : _h2[3]) == null ? void 0 : _i2.text) || "NO LUCK" })
          ] }),
          wheelSectors === "six" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: ((_k2 = (_j2 = campaignData.prizes) == null ? void 0 : _j2[0]) == null ? void 0 : _k2.text) || "10% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-60", children: ((_m2 = (_l2 = campaignData.prizes) == null ? void 0 : _l2[1]) == null ? void 0 : _m2.text) || "FREE SHIP" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-120", children: ((_o2 = (_n2 = campaignData.prizes) == null ? void 0 : _n2[2]) == null ? void 0 : _o2.text) || "15% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[87%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: ((_q2 = (_p2 = campaignData.prizes) == null ? void 0 : _p2[3]) == null ? void 0 : _q2.text) || "20% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-120", children: ((_s2 = (_r2 = campaignData.prizes) == null ? void 0 : _r2[4]) == null ? void 0 : _s2.text) || "5% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-60", children: ((_u = (_t2 = campaignData.prizes) == null ? void 0 : _t2[5]) == null ? void 0 : _u.text) || "NO LUCK" })
          ] }),
          (wheelSectors === "eight" || false) && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold", children: ((_w = (_v = campaignData.prizes) == null ? void 0 : _v[0]) == null ? void 0 : _w.text) || "10% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-45", children: ((_y = (_x = campaignData.prizes) == null ? void 0 : _x[1]) == null ? void 0 : _y.text) || "FREE SHIP" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-90", children: ((_A = (_z = campaignData.prizes) == null ? void 0 : _z[2]) == null ? void 0 : _A.text) || "5% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-135", children: ((_C = (_B = campaignData.prizes) == null ? void 0 : _B[3]) == null ? void 0 : _C.text) || "20% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold rotate-180", children: ((_E = (_D = campaignData.prizes) == null ? void 0 : _D[4]) == null ? void 0 : _E.text) || "FREE SHIP" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[75%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-135", children: ((_G = (_F = campaignData.prizes) == null ? void 0 : _F[5]) == null ? void 0 : _G.text) || "5% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-90", children: ((_I = (_H = campaignData.prizes) == null ? void 0 : _H[6]) == null ? void 0 : _I.text) || "20% OFF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold -rotate-45", children: ((_K = (_J = campaignData.prizes) == null ? void 0 : _J[7]) == null ? void 0 : _K.text) || "10% OFF" })
          ] })
        ]
      }
    ) });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 pb-32", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8", children: "Create Campaign" }),
      renderStep()
    ] }),
    /* @__PURE__ */ jsx(
      StepNavigation,
      {
        onNext: () => {
          if (campaignData.step === 4) {
            handleFinish();
          }
        },
        nextButtonText: campaignData.step === 4 ? "Finish" : "Continue"
      }
    ),
    showLimitModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Campaign Limit Reached" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        "You've reached the limit of ",
        currentPlan.campaignLimit,
        " campaigns for your ",
        currentPlan.name,
        " plan. Please upgrade your plan to create more campaigns."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/campaigns"),
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors",
            children: "Back to Campaigns"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/pricing"),
            className: "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors",
            children: "Upgrade Plan"
          }
        )
      ] })
    ] }) }),
    showPreviewModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg max-w-4xl w-full p-0 relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowPreviewModal(false),
          className: "absolute top-4 right-4 z-10",
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-8 w-8 text-white",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M6 18L18 6M6 6l12 12"
                }
              )
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "p-8 bg-indigo-900 text-white text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-2", children: "READY, SET, LAUNCH!" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl", children: "Your campaign can now shine on your site." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-lg w-full overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-2", children: campaignData.logo ? /* @__PURE__ */ jsx(
            "img",
            {
              src: campaignData.logo || "/placeholder.svg",
              alt: "Campaign Logo",
              className: "w-full h-full object-contain"
            }
          ) : /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-full h-full rounded-full flex items-center justify-center",
              style: {
                backgroundColor: campaignData.primaryColor || "#ff5722"
              },
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-8 w-8 text-white",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M13 10V3L4 14h7v7l9-11h-7z"
                    }
                  )
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-2xl font-bold",
              style: { color: campaignData.primaryColor || "#ff5722" },
              children: campaignData.name || "Swiggy"
            }
          ),
          /* @__PURE__ */ jsx(
            "h4",
            {
              className: "text-2xl font-bold mb-4",
              style: { color: campaignData.primaryColor || "#ff5722" },
              children: ((_b = (_a2 = campaignData.content) == null ? void 0 : _a2.landing) == null ? void 0 : _b.title) || "SPIN TO WIN"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 text-center mb-4", children: ((_d = (_c = campaignData.content) == null ? void 0 : _c.landing) == null ? void 0 : _d.subtitle) || "Before you go anywhere, enter your email address to spin the wheel for a chance to win a wicked awesome discount." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2", children: [
            ((_f = (_e = campaignData.content) == null ? void 0 : _e.landing) == null ? void 0 : _f.showPrivacyPolicy) !== false && /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 w-full", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "privacy-notice",
                  className: "mr-2",
                  checked: true,
                  readOnly: true
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "privacy-notice", className: "text-xs", children: ((_h = (_g = campaignData.content) == null ? void 0 : _g.landing) == null ? void 0 : _h.privacyPolicyText) || "I accept the Privacy Notice." })
            ] }),
            ((_j = (_i = campaignData.content) == null ? void 0 : _i.landing) == null ? void 0 : _j.showTerms) !== false && /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4 w-full", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "terms",
                  className: "mr-2",
                  checked: true,
                  readOnly: true
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "terms", className: "text-xs", children: ((_l = (_k = campaignData.content) == null ? void 0 : _k.landing) == null ? void 0 : _l.termsText) || "I accept the Terms & Conditions." })
            ] }),
            ((_n = (_m = campaignData.content) == null ? void 0 : _m.landing) == null ? void 0 : _n.showEmail) !== false && /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                placeholder: ((_p = (_o = campaignData.content) == null ? void 0 : _o.landing) == null ? void 0 : _p.emailPlaceholder) || "Enter your email",
                className: "w-full p-3 border rounded-md mb-4 text-center"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-full py-3 font-bold text-white rounded-md text-lg",
                style: {
                  backgroundColor: campaignData.primaryColor || "#ff5722"
                },
                children: ((_r = (_q = campaignData.content) == null ? void 0 : _q.landing) == null ? void 0 : _r.buttonText) || "SPIN NOW"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-3 text-center", children: ((_t = (_s = campaignData.content) == null ? void 0 : _s.landing) == null ? void 0 : _t.noThanksText) || "No, I don't feel lucky today!" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 flex justify-center items-center", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 w-full h-full rounded-full",
                style: {
                  background: "radial-gradient(circle, transparent 80%, white 80%, white 83%, transparent 83%)",
                  backgroundSize: "100% 100%",
                  transform: "scale(1.05)",
                  pointerEvents: "none"
                },
                children: Array.from({ length: 24 }).map((_, i) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute w-2 h-2 bg-white rounded-full",
                    style: {
                      top: `${50 - 45 * Math.cos(i * (Math.PI / 12))}%`,
                      left: `${50 + 45 * Math.sin(i * (Math.PI / 12))}%`
                    }
                  },
                  i
                ))
              }
            ),
            renderWheel()
          ] }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 flex justify-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              handleLaunch("draft");
            },
            className: "px-8 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium",
            children: "Later"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              handleLaunch("active");
            },
            className: "px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium",
            children: "Activate Now"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center pb-6", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
        "Easily activate or pause your campaigns anytime in",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "All Campaigns" }),
        "."
      ] }) })
    ] }) })
  ] });
}
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CreateCampaign
}, Symbol.toStringTag, { value: "Module" }));
function Campaigns() {
  const { allCampaigns, deleteCampaign, checkCanCreateCampaign } = useCampaign();
  const { currentPlan } = usePlan();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchParams] = useSearchParams();
  const [showPlanModal, setShowPlanModal] = useState(
    searchParams.get("upgrade") === "true"
  );
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
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
  const handleCreateClick = () => {
    if (checkCanCreateCampaign()) {
      navigate("/campaigns/create");
    } else {
      setShowPlanModal(true);
    }
  };
  const goToPricing = () => {
    navigate("/pricing");
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx(Navigation, {}),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "All Campaigns" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Current Plan: " }),
            /* @__PURE__ */ jsx("span", { className: "font-medium capitalize", children: currentPlan.name }),
            /* @__PURE__ */ jsxs("span", { className: "text-gray-500 ml-2", children: [
              "(",
              allCampaigns.length,
              "/",
              currentPlan.campaignLimit,
              " campaigns)"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goToPricing,
              className: "px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm",
              children: "Upgrade"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleCreateClick,
              className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
              children: "Create New Campaign"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx(
            "th",
            {
              scope: "col",
              className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
              children: "Campaign Name"
            }
          ),
          /* @__PURE__ */ jsx(
            "th",
            {
              scope: "col",
              className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
              children: "Status"
            }
          ),
          /* @__PURE__ */ jsx(
            "th",
            {
              scope: "col",
              className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
              children: "Created"
            }
          ),
          /* @__PURE__ */ jsx(
            "th",
            {
              scope: "col",
              className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
              children: "Actions"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: allCampaigns.length > 0 ? allCampaigns.map((campaign) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-4 h-4 rounded-full mr-2",
                style: {
                  backgroundColor: campaign.primaryColor || "#fe5300"
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: campaign.name })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${campaign.status === "active" ? "bg-green-100 text-green-800" : campaign.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`,
              children: campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: campaign.createdAt ? formatDate(campaign.createdAt) : "N/A" }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/campaigns/${campaign.id}`,
                className: "text-indigo-600 hover:text-indigo-900 mr-4",
                children: "View"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/campaigns/${campaign.id}/edit`,
                className: "text-indigo-600 hover:text-indigo-900 mr-4",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "text-red-600 hover:text-red-900",
                onClick: () => handleDeleteClick(campaign.id),
                children: "Delete"
              }
            )
          ] })
        ] }, campaign.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs(
          "td",
          {
            colSpan: "4",
            className: "px-6 py-4 text-center text-sm text-gray-500",
            children: [
              "No campaigns found.",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleCreateClick,
                  className: "text-indigo-600 hover:underline",
                  children: "Create your first campaign"
                }
              )
            ]
          }
        ) }) })
      ] }) })
    ] }),
    isDeleting && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: "Delete Campaign" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Are you sure you want to delete this campaign? This action cannot be undone." }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: cancelDelete,
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmDelete,
            className: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors",
            children: "Delete"
          }
        )
      ] })
    ] }) }),
    showPlanModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Campaign Limit Reached" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        "You've reached the limit of ",
        currentPlan.campaignLimit,
        " campaigns for your ",
        currentPlan.name,
        " plan. Please upgrade your plan to create more campaigns."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowPlanModal(false),
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: goToPricing,
            className: "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors",
            children: "View Pricing"
          }
        )
      ] })
    ] }) })
  ] });
}
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Campaigns
}, Symbol.toStringTag, { value: "Module" }));
function CampaignView() {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { id } = useParams();
  const navigate = useNavigate();
  const { allCampaigns } = useCampaign();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("Looking for campaign with ID:", id);
    console.log("Available campaigns:", allCampaigns);
    const foundCampaign = allCampaigns.find((c) => c.id === id);
    if (foundCampaign) {
      console.log("Found campaign for viewing:", foundCampaign);
      setCampaign(foundCampaign);
      setIsLoading(false);
    } else {
      console.error("Campaign not found:", id);
      toast.error("Campaign not found");
      navigate("/campaigns");
    }
  }, [id, allCampaigns, navigate]);
  const handleEditClick = () => {
    console.log("Navigating to edit campaign:", id);
    navigate(`/campaigns/edit/${id}`);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsx(Navigation, {}),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4", children: "Loading campaign..." })
      ] })
    ] });
  }
  if (!campaign) {
    return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsx(Navigation, {}),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: "Campaign Not Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "The campaign you're looking for doesn't exist or has been deleted." }),
        /* @__PURE__ */ jsx(Link, { to: "/campaigns", className: "text-indigo-600 hover:underline", children: "Back to Campaigns" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx(Navigation, {}),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: campaign.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${campaign.status === "active" ? "bg-green-100 text-green-800" : campaign.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`,
                children: campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-sm ml-4", children: [
              "Created: ",
              formatDate(campaign.createdAt)
            ] }),
            campaign.updatedAt && /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-sm ml-4", children: [
              "Updated: ",
              formatDate(campaign.updatedAt)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleEditClick,
              className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
              children: "Edit Campaign"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/campaigns",
              className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors",
              children: "Back to Campaigns"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Campaign Preview" }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 p-4", children: [
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: "text-2xl font-bold mb-2",
                  style: { color: campaign.primaryColor },
                  children: ((_b = (_a2 = campaign.content) == null ? void 0 : _a2.landing) == null ? void 0 : _b.title) || "SPIN TO WIN"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm mb-4", children: ((_d = (_c = campaign.content) == null ? void 0 : _c.landing) == null ? void 0 : _d.subtitle) || "Enter your email to spin the wheel for a chance to win a discount." }),
              /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  placeholder: "Enter your email",
                  className: "w-full border border-gray-300 rounded-md p-2 text-center",
                  readOnly: true
                }
              ) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "w-full py-3 rounded-md font-bold text-white mb-2",
                  style: { backgroundColor: campaign.primaryColor },
                  children: ((_f = (_e = campaign.content) == null ? void 0 : _e.landing) == null ? void 0 : _f.buttonText) || "SPIN NOW"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "relative w-48 h-48", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-full h-full rounded-full",
                style: {
                  background: campaign.color === "dualTone" ? `conic-gradient(
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
                        )` : `conic-gradient(
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
                        )`
                },
                children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-black" }) })
              }
            ) }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Campaign Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-3", children: "Design" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Look:" }),
                  /* @__PURE__ */ jsx("span", { children: campaign.look === "custom" ? "Custom Layout" : "Ready-Made Template" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Color Scheme:" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "mr-2", children: campaign.color === "singleTone" ? "Single Tone" : "Dual Tone" }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-4 h-4 rounded-full",
                        style: { backgroundColor: campaign.primaryColor }
                      }
                    ),
                    campaign.color === "dualTone" && /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-4 h-4 rounded-full ml-1",
                        style: { backgroundColor: campaign.secondaryColor }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Display Style:" }),
                  /* @__PURE__ */ jsx("span", { children: ((_g = campaign.layout) == null ? void 0 : _g.displayStyle) === "popup" ? "Pop-up" : "Full Screen" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-3", children: "Rules" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Appearing Rules:" }),
                  /* @__PURE__ */ jsx("span", { children: Object.entries(((_h = campaign.rules) == null ? void 0 : _h.appearingRules) || {}).filter(([_, rule]) => rule.enabled).map(
                    ([key]) => key.charAt(0).toUpperCase() + key.slice(1)
                  ).join(", ") || "None" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Page Targeting:" }),
                  /* @__PURE__ */ jsx("span", { children: ((_j = (_i = campaign.rules) == null ? void 0 : _i.pageTargeting) == null ? void 0 : _j.enabled) ? "Enabled" : "Disabled" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Display Frequency:" }),
                  /* @__PURE__ */ jsx("span", { children: ((_m = (_l = (_k = campaign.rules) == null ? void 0 : _k.displayFrequency) == null ? void 0 : _l.frequency) == null ? void 0 : _m.replace(
                    /_/g,
                    " "
                  )) || "Once a day" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CampaignView
}, Symbol.toStringTag, { value: "Module" }));
function CampaignEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allCampaigns, updateCampaignData, campaignData, saveCampaign } = useCampaign();
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [campaign, setCampaign] = useState(null);
  console.log("CampaignEdit component rendering with ID:", id);
  console.log("All campaigns available:", allCampaigns);
  useEffect(() => {
    console.log("Looking for campaign with ID:", id);
    console.log("Available campaigns:", allCampaigns);
    const foundCampaign = allCampaigns.find((c) => c.id === id);
    if (foundCampaign) {
      console.log("Found campaign for editing:", foundCampaign);
      setCampaign(foundCampaign);
      updateCampaignData({
        ...foundCampaign,
        step: 1,
        // Start at step 1 when editing
        completionPercentage: 25
      });
      setIsLoading(false);
    } else {
      console.error("Campaign not found:", id);
      toast.error("Campaign not found");
      navigate("/campaigns");
    }
  }, [id, allCampaigns, updateCampaignData, navigate]);
  const handleSaveChanges = async () => {
    try {
      const originalCampaign = campaign || {};
      const updatedCampaign = {
        ...originalCampaign,
        ...campaignData,
        id,
        // Ensure ID is preserved
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log("Saving updated campaign:", updatedCampaign);
      await saveCampaign(updatedCampaign);
      toast.success("Campaign updated successfully!");
      setShowSaveModal(false);
      setTimeout(() => {
        navigate("/campaigns");
      }, 500);
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error(`Error: ${error.message || "Failed to save campaign"}`);
    }
  };
  const handleFinish = () => {
    setShowSaveModal(true);
  };
  const renderStep = () => {
    switch (campaignData.step) {
      case 1:
        return /* @__PURE__ */ jsx(StepOne, {});
      case 2:
        return /* @__PURE__ */ jsx(StepTwo, {});
      case 3:
        return /* @__PURE__ */ jsx(StepThree, {});
      case 4:
        return /* @__PURE__ */ jsx(StepFour, {});
      default:
        return /* @__PURE__ */ jsx(StepOne, {});
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsx(Navigation, {}),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4", children: "Loading campaign..." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx(Navigation, { createButtonText: "Back to Campaigns" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 pb-32", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-8", children: [
        "Edit Campaign: ",
        campaignData.name
      ] }),
      renderStep()
    ] }),
    /* @__PURE__ */ jsx(
      StepNavigation,
      {
        onNext: () => {
          if (campaignData.step === 4) {
            handleFinish();
          }
        },
        nextButtonText: campaignData.step === 4 ? "Save Changes" : "Continue"
      }
    ),
    showSaveModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Save Campaign Changes" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        'Are you sure you want to save your changes to "',
        campaignData.name,
        '"?'
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowSaveModal(false),
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSaveChanges,
            className: "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors",
            children: "Save Changes"
          }
        )
      ] })
    ] }) })
  ] }) });
}
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CampaignEdit
}, Symbol.toStringTag, { value: "Module" }));
async function loader$8({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;
  const activeCampaign = await getActiveCampaign(shop);
  const metafieldsQuery = await admin.graphql(`
    #graphql
    query {
      currentAppInstallation {
        id
        metafields(first: 20) {
          edges {
            node {
              id
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  `);
  const metafieldsData = await metafieldsQuery.json();
  const metafields = metafieldsData.data.currentAppInstallation.metafields.edges.map(
    (edge) => edge.node
  );
  return json({
    shop,
    activeCampaign,
    metafields
  });
}
async function action$3({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;
  const formData = await request.formData();
  const action2 = formData.get("action");
  if (action2 === "sync-metafields") {
    try {
      const response = await fetch(
        `${process.env.APP_URL}/api/sync-campaign-metafields`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ shop })
        }
      );
      const result = await response.json();
      return json({
        success: true,
        message: "Campaign synced to metafields successfully",
        result
      });
    } catch (error) {
      return json({ success: false, message: error.message });
    }
  }
  if (action2 === "test-db") {
    try {
      const activeCampaign = await getActiveCampaign(shop);
      return json({
        success: true,
        message: activeCampaign ? `Database connection successful. Found active campaign: ${activeCampaign.name}` : "Database connection successful, but no active campaign found."
      });
    } catch (error) {
      return json({ success: false, message: error.message });
    }
  }
  return json({ success: false, message: "Invalid action" });
}
function Settings() {
  var _a2, _b;
  const data = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showMetafields, setShowMetafields] = useState(false);
  const isLoading = navigation.state === "submitting";
  const wheelOfWondersMetafields = data.metafields.filter(
    (metafield) => metafield.namespace === "wheel-of-wonders"
  );
  return /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6", children: "Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Campaign Settings" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-medium mb-2", children: "Active Campaign" }),
        data.activeCampaign ? /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-green-800", children: data.activeCampaign.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700", children: [
            "ID: ",
            data.activeCampaign.id
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700", children: [
            "Status: ",
            data.activeCampaign.status
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700", children: [
            "Created:",
            " ",
            new Date(data.activeCampaign.createdAt).toLocaleString()
          ] })
        ] }) : /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded p-4", children: /* @__PURE__ */ jsx("p", { className: "text-yellow-700", children: "No active campaign found." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs(Form, { method: "post", children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "action", value: "test-db" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors",
              disabled: isLoading,
              children: isLoading && ((_a2 = navigation.formData) == null ? void 0 : _a2.get("action")) === "test-db" ? "Testing..." : "Test Database Connection"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Form, { method: "post", children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "action", value: "sync-metafields" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors",
              disabled: isLoading || !data.activeCampaign,
              children: isLoading && ((_b = navigation.formData) == null ? void 0 : _b.get("action")) === "sync-metafields" ? "Syncing..." : "Sync Active Campaign to Store"
            }
          )
        ] })
      ] }),
      actionData && /* @__PURE__ */ jsx(
        "div",
        {
          className: `mt-4 p-4 rounded ${actionData.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`,
          children: /* @__PURE__ */ jsx("p", { children: actionData.message })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "App Metafields" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowMetafields(!showMetafields),
            className: "text-blue-600 hover:underline",
            children: [
              showMetafields ? "Hide" : "Show",
              " Metafields"
            ]
          }
        )
      ] }),
      showMetafields && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Namespace" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Key" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Value" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: wheelOfWondersMetafields.length > 0 ? wheelOfWondersMetafields.map((metafield) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: metafield.namespace }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: metafield.key }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: metafield.value }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: metafield.type })
        ] }, metafield.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: "4",
            className: "px-6 py-4 text-center text-sm text-gray-500",
            children: 'No wheel-of-wonders metafields found. Click "Sync Active Campaign to Store" to create them.'
          }
        ) }) })
      ] }) })
    ] })
  ] });
}
const route37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: Settings,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
function Tutorial() {
  const navigate = useNavigate$1();
  const handleCreateClick = () => {
    navigate("/campaigns/create");
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-gray-100 min-h-screen p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx(Navigation, { createButtonText: "Create Campaign" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "STEP-BY-STEP GUIDE" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg mb-6", children: "How to get more customers is one of the biggest challenges in e-commerce, EcomSend puts it all at your fingertips. EcomSend works out of the box without a single line of code. Need help? Contact us via online chat or email, we are 24/7." }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4 mt-8", children: [
          /* @__PURE__ */ jsx("button", { className: "bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-medium", children: "Watch Tutorial" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "border border-[#4F46E5] text-[#4F46E5] px-8 py-3 rounded-lg font-medium",
              onClick: handleCreateClick,
              children: "Create Campaign"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg overflow-hidden shadow-lg", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/placeholder.svg?height=400&width=600",
            alt: "Tutorial video thumbnail",
            className: "w-full h-auto"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-black bg-opacity-50 rounded-full p-4", children: /* @__PURE__ */ jsx(
          "svg",
          {
            width: "48",
            height: "48",
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsx("path", { d: "M5 3L19 12L5 21V3Z", fill: "white" })
          }
        ) }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded", children: "05:20" })
      ] })
    ] })
  ] }) });
}
const route38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tutorial
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);
  console.log(`Received webhook: ${topic} for shop: ${shop}`);
  if (!admin && topic !== "APP_UNINSTALLED") {
    console.log("No admin context available");
    return new Response(null, { status: 200 });
  }
  try {
    switch (topic) {
      case "APP_UNINSTALLED":
        if (session) {
          await prisma.session.deleteMany({ where: { shop } });
          console.log(`Successfully deleted sessions for ${shop}`);
        }
        break;
      case "APP_SUBSCRIPTIONS_UPDATE":
        console.log("Processing subscription update:", payload);
        if (payload.app_subscription.status === "ACTIVE") {
          await createSubscriptionMetafield(admin.graphql, "true");
          console.log("Subscription activated");
        } else {
          await createSubscriptionMetafield(admin.graphql, "false");
          console.log("Subscription deactivated");
        }
        break;
      case "CUSTOMERS_DATA_REQUEST":
      case "CUSTOMERS_REDACT":
      case "SHOP_REDACT":
        console.log(`Received ${topic} webhook - no action needed`);
        break;
      default:
        console.log(`Unhandled webhook topic: ${topic}`);
        return new Response("Unhandled webhook topic", { status: 404 });
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(`Webhook processing error: ${error.message}`, {
      status: 500
    });
  }
};
const route39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request }) => {
  const { topic, shop, session } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  if (topic === "APP_UNINSTALLED") {
    console.log(`Processing app uninstallation for ${shop}`);
    try {
      if (shop) {
        await prisma.session.deleteMany({ where: { shop } });
        console.log(`Successfully deleted sessions for ${shop}`);
      }
    } catch (error) {
      console.error(
        `Error processing APP_UNINSTALLED webhook: ${error.message}`
      );
    }
  }
  return new Response(null, { status: 200 });
};
const route40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
function Page$4() {
  return /* @__PURE__ */ jsx("div", { children: "Page" });
}
const route41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$4
}, Symbol.toStringTag, { value: "Module" }));
function Page$3() {
  return /* @__PURE__ */ jsx("div", { children: "Page" });
}
const route42 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$3
}, Symbol.toStringTag, { value: "Module" }));
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};
async function loader$7({ request }) {
  var _a2, _b, _c;
  try {
    const url = new URL(request.url);
    const shopParam = url.searchParams.get("shop");
    console.log("Pricing loader - Shop parameter:", shopParam);
    if (!shopParam) {
      console.log("Pricing loader - No shop parameter provided");
      return json({
        isAuthenticated: false,
        shop: null,
        activeSubscription: null,
        needsShopParam: true
      });
    }
    try {
      const { authenticate: authenticate2 } = await Promise.resolve().then(() => shopify_server);
      const { getSubscriptionStatus: getSubscriptionStatus2 } = await Promise.resolve().then(() => Subscription_server);
      console.log("Pricing loader - Attempting authentication");
      const { admin, session } = await authenticate2.admin(request);
      const { shop } = session;
      console.log("Pricing loader - Authentication successful for shop:", shop);
      let activeSubscription = null;
      let availablePlans = [];
      try {
        console.log("Pricing loader - Fetching subscription status");
        const subscriptionResult = await getSubscriptionStatus2(admin.graphql);
        const subscriptions = ((_c = (_b = (_a2 = subscriptionResult == null ? void 0 : subscriptionResult.data) == null ? void 0 : _a2.app) == null ? void 0 : _b.installation) == null ? void 0 : _c.activeSubscriptions) || [];
        console.log(
          "Pricing loader - Found subscriptions:",
          subscriptions.length
        );
        if (subscriptions.length > 0) {
          activeSubscription = subscriptions[0];
          console.log(
            "Pricing loader - Active subscription:",
            activeSubscription.name
          );
        }
        availablePlans = [
          {
            id: "starter",
            name: "Standard Package",
            monthlyPrice: 0,
            yearlyPrice: 0,
            shopifyPlanId: null,
            // Free plan
            campaignLimit: 20,
            features: [
              "Show on specific pages",
              "Up to 500 Spins/Month",
              "Basic Analytics",
              "Email Support",
              "20 Campaign"
            ],
            popular: false
          },
          {
            id: "lite",
            name: "Lite",
            monthlyPrice: 4.99,
            yearlyPrice: 49.99,
            shopifyPlanId: BILLING_PLANS.MONTHLY,
            shopifyYearlyPlanId: BILLING_PLANS.ANNUAL,
            campaignLimit: 5,
            features: [
              "Up to 300 impressions",
              "Multiple campaigns",
              "Show on specific pages",
              "A/B testing",
              "Conversion Booster"
            ],
            popular: true
          },
          {
            id: "premium",
            name: "Premium",
            monthlyPrice: 40,
            yearlyPrice: 400,
            shopifyPlanId: "Premium Monthly",
            shopifyYearlyPlanId: "Premium Annual",
            campaignLimit: 20,
            features: [
              "Unlimited impressions",
              "Unlimited campaigns",
              "Advanced targeting",
              "A/B testing",
              "Conversion Booster",
              "Priority Support",
              "Custom Branding",
              "Advanced Analytics"
            ],
            popular: false
          }
        ];
      } catch (error) {
        console.error(
          "Pricing loader - Failed to fetch subscription data:",
          error
        );
      }
      return json({
        isAuthenticated: true,
        shop,
        activeSubscription,
        availablePlans,
        sessionInfo: {
          shop: session.shop,
          expires: session.expires,
          id: session.id
        }
      });
    } catch (authError) {
      console.error("Pricing loader - Authentication failed:", authError);
      throw redirect(`/auth?shop=${shopParam}`);
    }
  } catch (error) {
    console.error("Pricing loader - General error:", error);
    if (error instanceof Response && error.status >= 300 && error.status < 400) {
      throw error;
    }
    return json({
      isAuthenticated: false,
      shop: null,
      activeSubscription: null,
      error: "Failed to load pricing data"
    });
  }
}
async function action({ request }) {
  var _a2, _b, _c, _d, _e, _f;
  try {
    const formData = await request.formData();
    const planId = formData.get("planId");
    const billingCycle = formData.get("billingCycle");
    const shopifyPlanName = formData.get("shopifyPlanName");
    const returnUrl = formData.get("returnUrl");
    const isTest = formData.get("isTest") === "true";
    console.log("Pricing action - Plan change request:", {
      planId,
      billingCycle,
      shopifyPlanName
    });
    const { authenticate: authenticate2 } = await Promise.resolve().then(() => shopify_server);
    const { admin, session, billing } = await authenticate2.admin(request);
    const { shop } = session;
    console.log("Pricing action - Authenticated for shop:", shop);
    if (planId === "starter") {
      console.log("Pricing action - Switching to free plan");
      try {
        const { getSubscriptionStatus: getSubscriptionStatus2 } = await Promise.resolve().then(() => Subscription_server);
        const subscriptionResult = await getSubscriptionStatus2(admin.graphql);
        const subscriptions = ((_c = (_b = (_a2 = subscriptionResult == null ? void 0 : subscriptionResult.data) == null ? void 0 : _a2.app) == null ? void 0 : _b.installation) == null ? void 0 : _c.activeSubscriptions) || [];
        if (subscriptions.length > 0) {
          console.log("Pricing action - Cancelling existing subscription");
          const subscriptionId = subscriptions[0].id;
          const cancelResult = await admin.graphql(
            `
            mutation cancelAppSubscription($id: ID!) {
              appSubscriptionCancel(
                id: $id
              ) {
                appSubscription {
                  id
                  status
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
            {
              variables: {
                id: subscriptionId
              }
            }
          );
          const cancelData = await cancelResult.json();
          console.log("Pricing action - Cancel result:", cancelData);
          if (((_f = (_e = (_d = cancelData.data) == null ? void 0 : _d.appSubscriptionCancel) == null ? void 0 : _e.userErrors) == null ? void 0 : _f.length) > 0) {
            console.error(
              "Pricing action - Cancel errors:",
              cancelData.data.appSubscriptionCancel.userErrors
            );
          }
        }
        return json({
          success: true,
          message: "Successfully switched to Starter plan",
          planId: "starter"
        });
      } catch (error) {
        console.error("Pricing action - Error switching to free plan:", error);
        return json({
          success: true,
          // Still return success for free plan
          message: "Switched to Starter plan",
          planId: "starter"
        });
      }
    } else if (shopifyPlanName && planId !== "starter") {
      console.log("Pricing action - Processing paid plan:", shopifyPlanName);
      try {
        console.log(
          "Pricing action - Requesting billing for plan:",
          shopifyPlanName
        );
        const response = await billing.request({
          plan: shopifyPlanName,
          isTest,
          returnUrl: returnUrl || `${new URL(request.url).origin}/app?shop=${shop}`
        });
        console.log("Pricing action - Billing request successful");
        return json({
          success: true,
          confirmationUrl: response.confirmationUrl,
          planId,
          message: `Billing initiated for ${planId} plan`
        });
      } catch (billingError) {
        console.error("Pricing action - Billing error:", billingError);
        return json(
          {
            success: false,
            message: billingError.message || "Failed to create subscription"
          },
          { status: 400 }
        );
      }
    }
    console.log("Pricing action - Invalid plan configuration");
    return json(
      {
        success: false,
        message: "Invalid plan configuration"
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Pricing action - General error:", error);
    return json(
      {
        success: false,
        message: error.message || "Failed to process plan change"
      },
      { status: 500 }
    );
  }
}
function Pricing() {
  var _a2;
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const { billingCycle, changeBillingCycle, changePlan, currentPlan } = usePlan();
  const fetcher = useFetcher();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const availablePlans = (loaderData == null ? void 0 : loaderData.availablePlans) || [];
  const isAuthenticated = loaderData == null ? void 0 : loaderData.isAuthenticated;
  const activeSubscription = loaderData == null ? void 0 : loaderData.activeSubscription;
  const shop = loaderData == null ? void 0 : loaderData.shop;
  const handleBillingCycleChange = (cycle) => {
    changeBillingCycle(cycle);
  };
  const handlePlanSelect = (planId) => {
    if (!isAuthenticated) {
      setError("Please authenticate first to change plans");
      return;
    }
    if (currentPlan.id === planId) return;
    setSelectedPlanId(planId);
    setShowConfirmModal(true);
  };
  const getShopifyPlanName = (plan, cycle) => {
    if (plan.id === "starter") return null;
    if (cycle === "yearly") {
      return plan.shopifyYearlyPlanId || BILLING_PLANS.ANNUAL;
    } else {
      return plan.shopifyPlanId || BILLING_PLANS.MONTHLY;
    }
  };
  const confirmPlanChange = async () => {
    if (!selectedPlanId) return;
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const selectedPlan = availablePlans.find((p) => p.id === selectedPlanId);
      if (!selectedPlan) {
        throw new Error("Selected plan not found");
      }
      console.log("Confirming plan change to:", selectedPlanId);
      const formData = new FormData();
      formData.append("planId", selectedPlanId);
      formData.append("billingCycle", billingCycle);
      if (selectedPlanId !== "starter") {
        const shopifyPlanName = getShopifyPlanName(selectedPlan, billingCycle);
        console.log("Adding billing info for paid plan:", shopifyPlanName);
        formData.append("shopifyPlanName", shopifyPlanName);
        formData.append(
          "returnUrl",
          `${window.location.origin}/app?shop=${shop}`
        );
        formData.append(
          "isTest",
          process.env.NODE_ENV === "development" ? "true" : "false"
        );
      } else {
        console.log("Free plan selected - no billing required");
      }
      fetcher.submit(formData, { method: "post" });
    } catch (err) {
      console.error("Subscription change error:", err);
      setError(err.message || "Failed to change subscription");
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  };
  useEffect(() => {
    if (fetcher.data) {
      console.log("Fetcher response:", fetcher.data);
      if (fetcher.data.success) {
        changePlan(fetcher.data.planId);
        if (fetcher.data.confirmationUrl) {
          setSuccess(`Redirecting to Shopify to confirm your subscription...`);
          setTimeout(() => {
            window.top.location.href = fetcher.data.confirmationUrl;
          }, 2e3);
        } else {
          setSuccess(fetcher.data.message || "Plan updated successfully!");
          setTimeout(() => {
            navigate(`/app?shop=${shop}`);
          }, 2e3);
        }
      } else {
        setError(fetcher.data.message || "Failed to change subscription");
      }
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  }, [fetcher.data, changePlan, navigate, shop]);
  const getPlansWithPricing = () => {
    return availablePlans.map((plan) => {
      const basePrice = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
      return {
        ...plan,
        price: basePrice
      };
    });
  };
  useEffect(() => {
    if (activeSubscription) {
      let matchedPlanId = "starter";
      if (activeSubscription.name === BILLING_PLANS.MONTHLY) {
        matchedPlanId = "lite";
        changeBillingCycle("monthly");
      } else if (activeSubscription.name === BILLING_PLANS.ANNUAL) {
        matchedPlanId = "lite";
        changeBillingCycle("yearly");
      } else if (activeSubscription.name.includes("Premium")) {
        matchedPlanId = "premium";
        changeBillingCycle(
          activeSubscription.name.includes("Annual") ? "yearly" : "monthly"
        );
      }
      changePlan(matchedPlanId);
    } else {
      changePlan("starter");
    }
  }, [activeSubscription, changeBillingCycle, changePlan]);
  const plans = getPlansWithPricing();
  if (loaderData == null ? void 0 : loaderData.needsShopParam) {
    return /* @__PURE__ */ jsx("div", { className: "bg-gray-100 min-h-screen p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx(Navigation, { createButtonText: "Create Pop-Up" }),
      /* @__PURE__ */ jsx("div", { className: "bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Shop Parameter Required" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "Please access this page from your Shopify admin or include the shop parameter in the URL." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/auth/login"),
            className: "mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors",
            children: "Go to Login"
          }
        )
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 min-h-screen p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx(Navigation, { createButtonText: "Create Pop-Up" }),
      !isAuthenticated && /* @__PURE__ */ jsx("div", { className: "bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Authentication Required" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "You need to be authenticated to change subscription plans." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(`/auth?shop=${shop || "your-shop"}`),
            className: "bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors",
            children: "Sign In"
          }
        )
      ] }) }),
      error && /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-2", children: error }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setError(null),
            className: "text-red-600 hover:text-red-800 text-sm underline",
            children: "Dismiss"
          }
        )
      ] }),
      success && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6", children: /* @__PURE__ */ jsx("p", { children: success }) }),
      activeSubscription && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-lg mb-1", children: "Current Subscription" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
            "Plan:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: activeSubscription.name })
          ] }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
            "Status:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-medium capitalize", children: activeSubscription.status })
          ] }) }),
          activeSubscription.trialDays > 0 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
            "Trial:",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              activeSubscription.trialDays,
              " days"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
            "Next Billing:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: new Date(
              activeSubscription.currentPeriodEnd
            ).toLocaleDateString() })
          ] }) })
        ] })
      ] }),
      !activeSubscription && isAuthenticated && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-lg mb-1", children: "Current Plan: Free Starter" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: "You're currently on the free Starter plan. Upgrade anytime to unlock more features!" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: "PRICING" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Start with our free plan or upgrade for more features. Real-time subscription management." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-200 rounded-full p-1 inline-flex mt-4 md:mt-0", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `${billingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-gray-700"} px-6 py-2 rounded-full font-medium transition-colors`,
              onClick: () => handleBillingCycleChange("monthly"),
              children: "Monthly"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `${billingCycle === "yearly" ? "bg-indigo-600 text-white" : "text-gray-700"} px-6 py-2 rounded-full font-medium transition-colors`,
              onClick: () => handleBillingCycleChange("yearly"),
              children: "Yearly"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: plans.map((plan) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `bg-white rounded-lg p-8 shadow-sm relative ${plan.popular ? "border-2 border-indigo-600" : ""} ${plan.id === "starter" ? "border-2 border-green-400" : ""} ${currentPlan.id === plan.id ? "ring-2 ring-blue-500" : ""}`,
          children: [
            plan.popular && /* @__PURE__ */ jsx("div", { className: "absolute -top-4 left-0 right-0 mx-auto w-max bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium", children: "Most Picked" }),
            plan.id === "starter" && /* @__PURE__ */ jsx("div", { className: "absolute -top-4 left-0 right-0 mx-auto w-max bg-green-600 text-white px-6 py-2 rounded-lg font-medium", children: "Free Forever" }),
            currentPlan.id === plan.id && /* @__PURE__ */ jsx("div", { className: "absolute -top-4 left-0 right-0 mx-auto w-max bg-blue-600 text-white px-6 py-2 rounded-lg font-medium", children: "Current Plan" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-8 right-8 bg-indigo-100 p-3 rounded-full", children: plan.id === "starter" ? /* @__PURE__ */ jsx(
              "svg",
              {
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M13 10V3L4 14H11V21L20 10H13Z",
                    stroke: "#4F46E5",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              }
            ) : /* @__PURE__ */ jsxs(
              "svg",
              {
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M4.5 16.5C3.12 15.78 2.25 14.28 2.25 12.75C2.25 10.41 4.14 8.52 6.48 8.52C6.71 8.52 6.94 8.54 7.17 8.59C7.35 8.63 7.53 8.52 7.59 8.34C8.19 6.45 9.9 5.02 12 5.02C14.1 5.02 15.81 6.45 16.41 8.34C16.47 8.52 16.65 8.63 16.83 8.59C17.06 8.55 17.29 8.52 17.52 8.52C19.86 8.52 21.75 10.41 21.75 12.75C21.75 14.28 20.88 15.78 19.5 16.5",
                      stroke: "#4F46E5",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M7.5 16.5V18.75C7.5 19.58 8.17 20.25 9 20.25H15C15.83 20.25 16.5 19.58 16.5 18.75V16.5",
                      stroke: "#4F46E5",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M12 16.5V11.25",
                      stroke: "#4F46E5",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.75 13.5L12 11.25L14.25 13.5",
                      stroke: "#4F46E5",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2 mt-4", children: plan.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold", children: formatPrice(plan.price) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 ml-2", children: plan.price === 0 ? "forever" : billingCycle === "yearly" ? "per year" : "per month" })
            ] }),
            billingCycle === "yearly" && plan.yearlyPrice < plan.monthlyPrice * 12 && plan.price > 0 && /* @__PURE__ */ jsxs("p", { className: "text-green-600 text-sm font-medium", children: [
              "Save",
              " ",
              formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice),
              " ",
              "annually"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 my-4" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-8", children: plan.features.map((feature, index2) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                      d: "M5 13l4 4L19 7"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: feature })
            ] }, index2)) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `w-full ${currentPlan.id === plan.id ? "bg-blue-100 text-blue-700 cursor-default" : !isAuthenticated ? "bg-gray-300 text-gray-500 cursor-not-allowed" : plan.id === "starter" ? "bg-green-600 text-white hover:bg-green-700" : "bg-indigo-600 text-white hover:bg-indigo-700"} py-3 px-4 rounded-lg font-medium transition-colors`,
                onClick: () => handlePlanSelect(plan.id),
                disabled: currentPlan.id === plan.id || isProcessing || !isAuthenticated,
                children: currentPlan.id === plan.id ? "Current Plan" : !isAuthenticated ? "Authentication Required" : isProcessing ? "Processing..." : plan.id === "starter" ? "Start Free" : "Get Started"
              }
            )
          ]
        },
        plan.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "How does real-time billing work?" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Changes take effect immediately. Free plan has no billing. Paid plans are processed through Shopify's secure billing system." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Can I change my plan anytime?" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Yes! You can upgrade, downgrade, or switch to the free plan at any time. Changes are instant." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "What happens when I upgrade?" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "You'll be redirected to Shopify to confirm billing. Once confirmed, your new features are available immediately." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "How do I cancel?" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Simply switch to the free Starter plan anytime. Your subscription will be cancelled automatically." })
          ] })
        ] })
      ] })
    ] }),
    showConfirmModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Confirm Plan Change" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        "Are you sure you want to switch to the",
        " ",
        (_a2 = availablePlans.find((p) => p.id === selectedPlanId)) == null ? void 0 : _a2.name,
        " plan",
        selectedPlanId !== "starter" && ` with ${billingCycle} billing`,
        "?",
        selectedPlanId === "starter" ? /* @__PURE__ */ jsx("span", { className: "block mt-2 text-sm text-green-600", children: "✅ This will switch you to the free plan. No billing required." }) : /* @__PURE__ */ jsx("span", { className: "block mt-2 text-sm text-gray-500", children: "💳 You will be redirected to Shopify to complete the billing setup." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowConfirmModal(false),
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors",
            disabled: isProcessing,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmPlanChange,
            className: `px-4 py-2 ${selectedPlanId === "starter" ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white rounded-md transition-colors relative`,
            disabled: isProcessing,
            children: isProcessing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "opacity-0", children: "Confirm" }),
              /* @__PURE__ */ jsx("span", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "animate-spin h-5 w-5 text-white",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ jsx(
                      "circle",
                      {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      }
                    )
                  ]
                }
              ) })
            ] }) : "Confirm"
          }
        )
      ] })
    ] }) })
  ] });
}
const route43 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Pricing,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const index = "_index_2zwis_6";
const heading = "_heading_2zwis_16";
const text = "_text_2zwis_17";
const content = "_content_2zwis_27";
const form = "_form_2zwis_32";
const label = "_label_2zwis_40";
const input = "_input_2zwis_48";
const button = "_button_2zwis_52";
const list = "_list_2zwis_56";
const styles = {
  index,
  heading,
  text,
  content,
  form,
  label,
  input,
  button,
  list
};
const loader$6 = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login) };
};
function App$1() {
  const { showForm } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: styles.index, children: /* @__PURE__ */ jsxs("div", { className: styles.content, children: [
    /* @__PURE__ */ jsx("h1", { className: styles.heading, children: "A short heading about [your app]" }),
    /* @__PURE__ */ jsx("p", { className: styles.text, children: "A tagline about [your app] that describes your value proposition." }),
    showForm && /* @__PURE__ */ jsxs(Form, { className: styles.form, method: "post", action: "/auth/login", children: [
      /* @__PURE__ */ jsxs("label", { className: styles.label, children: [
        /* @__PURE__ */ jsx("span", { children: "Shop domain" }),
        /* @__PURE__ */ jsx("input", { className: styles.input, type: "text", name: "shop" }),
        /* @__PURE__ */ jsx("span", { children: "e.g: my-shop-domain.myshopify.com" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: styles.button, type: "submit", children: "Log in" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: styles.list, children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] })
    ] })
  ] }) });
}
const route44 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const loader$5 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
const route45 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
async function loader$4({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    if (session && session.shop) {
      return redirect("/app");
    }
    return redirect("/auth/login");
  } catch (error) {
    console.log("Index loader - authentication check failed:", error == null ? void 0 : error.message);
    if (isClientSideNavigation(request)) {
      return redirect("/app");
    }
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    if (shop) {
      return redirect(`/auth?shop=${shop}`);
    }
    return redirect("/auth/login");
  }
}
function Index$1() {
  return null;
}
const route46 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index$1,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
async function loader$3({ request }) {
  var _a2, _b, _c, _d, _e;
  const { admin, session, billing } = await authenticate.admin(request);
  const { shop } = session;
  console.log("App - Authenticated with shop:", shop);
  const discountCodes = [];
  const subscriptions = await getSubscriptionStatus(admin.graphql);
  const activeSubscriptions = subscriptions.data.app.installation.activeSubscriptions;
  console.log("App - Active subscriptions:", activeSubscriptions);
  if (activeSubscriptions.length < 1) {
    console.log("App - No active subscriptions found, redirecting to billing");
    await billing.require({
      plans: [MONTLY_PLAN, ANNUAL_PLAN],
      isTest: true,
      onFailure: async () => billing.request({
        plan: MONTLY_PLAN,
        isTest: true
      }),
      returnUrl: `https://${shop}/admin/apps/spinorama/app`
    });
    console.log(
      "App - Billing requirement completed, redirecting to create billing"
    );
  }
  try {
    const discountCode = await getDiscountCodes(admin.graphql);
    const nodes = ((_b = (_a2 = discountCode == null ? void 0 : discountCode.data) == null ? void 0 : _a2.discountNodes) == null ? void 0 : _b.edges) || [];
    for (const { node } of nodes) {
      const discount = node.discount;
      const title = (discount == null ? void 0 : discount.title) || "N/A";
      const summary = (discount == null ? void 0 : discount.summary) || "N/A";
      if (((_d = (_c = discount == null ? void 0 : discount.codes) == null ? void 0 : _c.edges) == null ? void 0 : _d.length) > 0) {
        for (const codeEdge of discount.codes.edges) {
          const code = ((_e = codeEdge == null ? void 0 : codeEdge.node) == null ? void 0 : _e.code) || "N/A";
          discountCodes.push({ title, summary, code });
        }
      } else {
        discountCodes.push({ title, summary, code: null });
      }
    }
  } catch (discountError) {
    console.log("App - Could not fetch discount codes:", discountError.message);
  }
  let activeCampaign = null;
  try {
    activeCampaign = await getActiveCampaign(shop);
    if (activeCampaign) {
      await syncActiveCampaignToMetafields(admin.graphql, shop);
    }
  } catch (campaignError) {
    console.log("App - Could not fetch/sync campaign:", campaignError.message);
  }
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
    mongoDbUri: !!process.env.MONGODB_URI,
    shop,
    shopFormatted: shop.replace(/\.myshopify\.com$/i, ""),
    isAuthenticated: true,
    hasCampaign: !!activeCampaign,
    // discountCodes: [],
    needsSubscription: true,
    discountCodes,
    fallbackMode: false
  });
}
function App() {
  const { currentPlan, discountCodes, setDiscountCodes } = usePlan();
  const data = useLoaderData();
  console.log("App - Discount codes:", discountCodes);
  useEffect(() => {
    var _a2;
    if ((_a2 = data == null ? void 0 : data.discountCodes) == null ? void 0 : _a2.length) {
      console.log(
        "App - Setting discountCodes in context:",
        data.discountCodes
      );
      setDiscountCodes(data.discountCodes);
    } else {
      console.log("App - No discountCodes to set");
    }
  }, [data]);
  if (data.fallbackMode && !data.isAuthenticated && !data.shop) {
    return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsx(Navigation, {}),
      /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6", children: /* @__PURE__ */ jsx("p", { className: "text-yellow-800", children: "⚠️ Running in offline mode. Some features may be limited. Please refresh the page to restore full functionality." }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: "Welcome to Shopify Campaign Creator" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Create engaging spin-to-win campaigns for your Shopify store to boost conversions and customer engagement." }),
          /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.reload(),
              className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors",
              children: "Refresh Page"
            }
          ) })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx(Navigation, {}),
    /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-4", children: /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Welcome to Shopify Campaign Creator" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Create engaging spin-to-win campaigns for your Shopify store to boost conversions and customer engagement." }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 p-6 rounded-lg", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Current Plan" }),
          /* @__PURE__ */ jsx("p", { className: "text-indigo-600 font-bold text-2xl mb-1", children: currentPlan.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-500 mb-4", children: [
            currentPlan.campaignLimit,
            " campaigns allowed"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-green-50 p-6 rounded-lg", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Quick Start" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Create your first campaign in minutes with our easy-to-use wizard." }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/campaigns/create",
              className: "bg-green-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-green-700 transition-colors",
              children: "Create Campaign"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 p-6 rounded-lg", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Learn More" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Check out our tutorial to learn how to create effective campaigns." }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/tutorial",
              className: "bg-purple-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-purple-700 transition-colors",
              children: "View Tutorial"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Getting Started" }),
        /* @__PURE__ */ jsxs("ol", { className: "list-decimal pl-6 space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: 'Create a new campaign from the "Create Campaign" button' }),
          /* @__PURE__ */ jsx("li", { children: "Choose your campaign type and customize the appearance" }),
          /* @__PURE__ */ jsx("li", { children: "Set up your prizes and wheel segments" }),
          /* @__PURE__ */ jsx("li", { children: "Configure display rules and targeting" }),
          /* @__PURE__ */ jsx("li", { children: "Launch your campaign and start collecting leads!" })
        ] })
      ] })
    ] }) })
  ] });
}
const route47 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function AdminLayout({ children }) {
  const location = useLocation();
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const toggleMobileNavigationActive = useCallback(
    () => setMobileNavigationActive((active) => !active),
    []
  );
  useCallback((value) => {
    setSearchValue(value);
  }, []);
  const handleSearchFieldChange = useCallback((value) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);
  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((active) => !active),
    []
  );
  const userMenuActions = [
    {
      items: [
        { content: "Profile", url: "/app/settings/profile" },
        { content: "Sign out", onAction: () => console.log("Sign out") }
      ]
    }
  ];
  /* @__PURE__ */ jsx(
    TopBar.UserMenu,
    {
      actions: userMenuActions,
      name: "Admin User",
      detail: "Premium Plan",
      initials: "AU",
      open: userMenuActive,
      onToggle: toggleUserMenuActive
    }
  );
  /* @__PURE__ */ jsx(
    TopBar.SearchField,
    {
      onChange: handleSearchFieldChange,
      value: searchValue,
      placeholder: "Search"
    }
  );
  /* @__PURE__ */ jsx(
    TopBar.Menu,
    {
      activatorContent: /* @__PURE__ */ jsx(Button, { icon: NotificationIcon, variant: "tertiary" })
    }
  );
  const isActive = (path) => location.pathname === path;
  const navigationMarkup = /* @__PURE__ */ jsx(Navigation$1, { location: location.pathname, children: /* @__PURE__ */ jsx(
    Navigation$1.Section,
    {
      items: [
        {
          url: "/app",
          label: "Home",
          icon: HomeIcon,
          selected: isActive("/app")
        },
        {
          url: "/app/campaigns",
          label: "Campaigns",
          icon: ConfettiIcon,
          selected: isActive("/app/campaigns")
        },
        {
          url: "/app/subscribers",
          label: "Subscribers",
          icon: PersonIcon,
          selected: isActive("/app/subscribers")
        },
        {
          url: "/app/revenue",
          label: "Revenue",
          icon: FinanceIcon,
          selected: isActive("/app/revenue")
        },
        {
          url: "/app/integrations",
          label: "Integrations",
          icon: AppsIcon,
          selected: isActive("/app/integrations")
        },
        {
          url: "/app/settings",
          label: "Settings",
          icon: SettingsFilledIcon,
          selected: isActive("/app/settings")
        }
      ]
    }
  ) });
  return /* @__PURE__ */ jsx(
    Frame,
    {
      navigation: navigationMarkup,
      showMobileNavigation: mobileNavigationActive,
      onNavigationDismiss: toggleMobileNavigationActive,
      children
    }
  );
}
const loader$2 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
function NewCampaign() {
  const [selectedType, setSelectedType] = useState("spin");
  const navigate = useNavigate();
  const { smDown, mdDown } = useBreakpoints();
  const handleTypeSelect = useCallback((type) => {
    setSelectedType(type);
  }, []);
  const handleCreateGame = useCallback(
    (type) => {
      navigate(`/app/game/add?type=${type}`);
    },
    [navigate]
  );
  const handlePreview = useCallback((type) => {
    alert(`Previewing ${type} game`);
  }, []);
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs(
    Page$5,
    {
      title: "New Campaign",
      backAction: {
        content: "Campaigns",
        onAction: () => navigate("/app/campaigns")
      },
      children: [
        /* @__PURE__ */ jsx(TitleBar, { title: "New Campaign" }),
        /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
          /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", fontWeight: "semibold", children: "SELECT CAMPAIGN TYPE" }),
          /* @__PURE__ */ jsxs(Layout, { children: [
            /* @__PURE__ */ jsx(Layout.Section, { oneThird: !smDown, children: /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  border: selectedType === "spin" ? "2px solid #2c6ecb" : "1px solid #dfe3e8",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                  height: "100%",
                  marginBottom: smDown ? "16px" : "0"
                },
                onClick: () => handleTypeSelect("spin"),
                children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", align: "center", children: [
                  /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          background: "#f6f6f7",
                          borderRadius: "8px 8px 0 0",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                flex: 1,
                                height: "8px",
                                background: "#d9d9d9",
                                borderRadius: "4px",
                                marginLeft: "8px"
                              }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          background: "#6b6c6d",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        },
                        children: /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20at%2011.49.46%E2%80%AFPM-9fOjoQjhkiDMLXc38TprvvQ630DD5N.png",
                            alt: "Spin the Wheel Preview",
                            style: { width: "80%", maxWidth: "250px" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          background: "white",
                          borderRadius: "0 0 8px 8px",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "center"
                        },
                        children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              border: "1px solid #dfe3e8"
                            }
                          }
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h3", alignment: "center", children: "SPIN THE WHEEL" }),
                  /* @__PURE__ */ jsxs(InlineStack, { gap: "300", align: "center", children: [
                    /* @__PURE__ */ jsx(Button, { onClick: () => handleCreateGame("spin"), children: "Game Create" }),
                    /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => handlePreview("spin"), children: "Preview" })
                  ] })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsx(Layout.Section, { oneThird: !smDown, children: /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  border: selectedType === "coupons" ? "2px solid #2c6ecb" : "1px solid #dfe3e8",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                  height: "100%",
                  marginBottom: smDown ? "16px" : "0"
                },
                onClick: () => handleTypeSelect("coupons"),
                children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", align: "center", children: [
                  /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          background: "#f6f6f7",
                          borderRadius: "8px 8px 0 0",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                flex: 1,
                                height: "8px",
                                background: "#d9d9d9",
                                borderRadius: "4px",
                                marginLeft: "8px"
                              }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          background: "#6b6c6d",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        },
                        children: /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20at%2011.49.46%E2%80%AFPM-9fOjoQjhkiDMLXc38TprvvQ630DD5N.png",
                            alt: "Wheel of Coupons Preview",
                            style: { width: "80%", maxWidth: "250px" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          background: "white",
                          borderRadius: "0 0 8px 8px",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "center"
                        },
                        children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              border: "1px solid #dfe3e8"
                            }
                          }
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h3", alignment: "center", children: "WHEEL OF COUPONS" }),
                  /* @__PURE__ */ jsxs(InlineStack, { gap: "300", align: "center", children: [
                    /* @__PURE__ */ jsx(Button, { onClick: () => handleCreateGame("coupons"), children: "Game Create" }),
                    /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => handlePreview("coupons"), children: "Preview" })
                  ] })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsx(Layout.Section, { oneThird: !smDown, children: /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  border: selectedType === "reveal" ? "2px solid #2c6ecb" : "1px solid #dfe3e8",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                  height: "100%"
                },
                onClick: () => handleTypeSelect("reveal"),
                children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", align: "center", children: [
                  /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          background: "#f6f6f7",
                          borderRadius: "8px 8px 0 0",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#d9d9d9"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                flex: 1,
                                height: "8px",
                                background: "#d9d9d9",
                                borderRadius: "4px",
                                marginLeft: "8px"
                              }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          background: "#6b6c6d",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        },
                        children: /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20at%2011.49.46%E2%80%AFPM-9fOjoQjhkiDMLXc38TprvvQ630DD5N.png",
                            alt: "Reveal Your Coupon Preview",
                            style: { width: "80%", maxWidth: "250px" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          background: "white",
                          borderRadius: "0 0 8px 8px",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "center"
                        },
                        children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              border: "1px solid #dfe3e8"
                            }
                          }
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h3", alignment: "center", children: "REVEAL YOUR COUPON" }),
                  /* @__PURE__ */ jsxs(InlineStack, { gap: "300", align: "center", children: [
                    /* @__PURE__ */ jsx(Button, { onClick: () => handleCreateGame("reveal"), children: "Game Create" }),
                    /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => handlePreview("reveal"), children: "Preview" })
                  ] })
                ] })
              }
            ) })
          ] })
        ] })
      ]
    }
  ) });
}
const route48 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NewCampaign,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function Page$2() {
  return /* @__PURE__ */ jsx("div", { children: "Page" });
}
const route49 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
function Subscribers() {
  const [selected, setSelected] = useState(0);
  const [modalActive, setModalActive] = useState(false);
  const [importModalActive, setImportModalActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterPopoverActive, setFilterPopoverActive] = useState(false);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
  }, []);
  const handleTagInputChange = useCallback((value) => {
    setTagInputValue(value);
  }, []);
  const handleAddTag = useCallback(() => {
    if (tagInputValue && !selectedTags.includes(tagInputValue)) {
      setSelectedTags([...selectedTags, tagInputValue]);
      setTagInputValue("");
    }
  }, [tagInputValue, selectedTags]);
  const handleRemoveTag = useCallback(
    (tag) => {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    },
    [selectedTags]
  );
  const tabs = [
    {
      id: "all-subscribers",
      content: "All",
      accessibilityLabel: "All subscribers",
      panelID: "all-subscribers-content"
    },
    {
      id: "active-subscribers",
      content: "Active",
      accessibilityLabel: "Active subscribers",
      panelID: "active-subscribers-content"
    },
    {
      id: "unsubscribed",
      content: "Unsubscribed",
      accessibilityLabel: "Unsubscribed",
      panelID: "unsubscribed-content"
    }
  ];
  const subscriberData = [
    [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
        /* @__PURE__ */ jsx(Avatar, { customer: true, size: "small", name: "John Doe" }),
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "semibold", children: "John Doe" })
      ] }),
      "john.doe@example.com",
      /* @__PURE__ */ jsx(Badge, { status: "success", children: "Active" }),
      "Jun 15, 2023",
      /* @__PURE__ */ jsxs(InlineStack, { gap: "100", children: [
        /* @__PURE__ */ jsx(Tag, { children: "Customer" }),
        /* @__PURE__ */ jsx(Tag, { children: "VIP" })
      ] })
    ],
    [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
        /* @__PURE__ */ jsx(Avatar, { customer: true, size: "small", name: "Jane Smith" }),
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "semibold", children: "Jane Smith" })
      ] }),
      "jane.smith@example.com",
      /* @__PURE__ */ jsx(Badge, { status: "success", children: "Active" }),
      "Jul 22, 2023",
      /* @__PURE__ */ jsx(InlineStack, { gap: "100", children: /* @__PURE__ */ jsx(Tag, { children: "Customer" }) })
    ],
    [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
        /* @__PURE__ */ jsx(Avatar, { customer: true, size: "small", name: "Robert Johnson" }),
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "semibold", children: "Robert Johnson" })
      ] }),
      "robert.j@example.com",
      /* @__PURE__ */ jsx(Badge, { status: "success", children: "Active" }),
      "Aug 5, 2023",
      /* @__PURE__ */ jsx(InlineStack, { gap: "100", children: /* @__PURE__ */ jsx(Tag, { children: "New" }) })
    ],
    [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
        /* @__PURE__ */ jsx(Avatar, { customer: true, size: "small", name: "Emily Wilson" }),
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "semibold", children: "Emily Wilson" })
      ] }),
      "emily.wilson@example.com",
      /* @__PURE__ */ jsx(Badge, { status: "critical", children: "Unsubscribed" }),
      "Sep 12, 2023",
      /* @__PURE__ */ jsx(InlineStack, { gap: "100", children: /* @__PURE__ */ jsx(Tag, { children: "Former" }) })
    ],
    [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
        /* @__PURE__ */ jsx(Avatar, { customer: true, size: "small", name: "Michael Brown" }),
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "semibold", children: "Michael Brown" })
      ] }),
      "michael.brown@example.com",
      /* @__PURE__ */ jsx(Badge, { status: "success", children: "Active" }),
      "Oct 3, 2023",
      /* @__PURE__ */ jsxs(InlineStack, { gap: "100", children: [
        /* @__PURE__ */ jsx(Tag, { children: "Customer" }),
        /* @__PURE__ */ jsx(Tag, { children: "Engaged" })
      ] })
    ]
  ];
  return /* @__PURE__ */ jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxs(
      Page$5,
      {
        title: "Subscribers",
        primaryAction: {
          content: "Add subscriber",
          onAction: () => setModalActive(true)
        },
        secondaryActions: [
          {
            content: "Import",
            icon: ImportIcon,
            onAction: () => setImportModalActive(true)
          },
          {
            content: "Export",
            icon: ExportIcon,
            onAction: () => console.log("Export action")
          }
        ],
        children: [
          /* @__PURE__ */ jsx(TitleBar, { title: "Subscribers" }),
          /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
            /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsxs(InlineStack, { gap: "400", wrap: false, children: [
              /* @__PURE__ */ jsx(
                StatCard$1,
                {
                  title: "Total Subscribers",
                  value: "2,543",
                  icon: PersonIcon,
                  color: "#4B7DF3"
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard$1,
                {
                  title: "Active",
                  value: "2,210",
                  icon: PersonIcon,
                  color: "#50B83C"
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard$1,
                {
                  title: "Unsubscribed",
                  value: "333",
                  icon: PersonIcon,
                  color: "#DE3618"
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard$1,
                {
                  title: "Growth Rate",
                  value: "+12.4%",
                  icon: PersonIcon,
                  color: "#9C6ADE"
                }
              )
            ] }) }) }),
            /* @__PURE__ */ jsx(Card, { padding: "0", children: /* @__PURE__ */ jsx(
              Tabs,
              {
                tabs,
                selected,
                onSelect: handleTabChange,
                fitted: true,
                children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
                  /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "start", children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsx(
                      TextField,
                      {
                        placeholder: "Search subscribers",
                        value: searchValue,
                        onChange: setSearchValue,
                        prefix: /* @__PURE__ */ jsx(Icon, { source: SearchIcon }),
                        clearButton: true,
                        onClearButtonClick: () => setSearchValue("")
                      }
                    ) }),
                    /* @__PURE__ */ jsx(
                      Popover,
                      {
                        active: filterPopoverActive,
                        activator: /* @__PURE__ */ jsx(
                          Button,
                          {
                            icon: FilterIcon,
                            onClick: () => setFilterPopoverActive(!filterPopoverActive),
                            children: "Filter"
                          }
                        ),
                        onClose: () => setFilterPopoverActive(false),
                        children: /* @__PURE__ */ jsx(Popover.Pane, { children: /* @__PURE__ */ jsx(Box, { padding: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
                          /* @__PURE__ */ jsx(Text, { variant: "headingSm", as: "h3", children: "Filter subscribers" }),
                          /* @__PURE__ */ jsx(
                            Select,
                            {
                              label: "Status",
                              options: [
                                { label: "All", value: "all" },
                                { label: "Active", value: "active" },
                                {
                                  label: "Unsubscribed",
                                  value: "unsubscribed"
                                }
                              ],
                              onChange: () => {
                              },
                              value: "all"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            TextField,
                            {
                              label: "Tags",
                              value: tagInputValue,
                              onChange: handleTagInputChange,
                              placeholder: "Add tags",
                              connectedRight: /* @__PURE__ */ jsx(
                                Button,
                                {
                                  onClick: handleAddTag,
                                  icon: PlusIcon
                                }
                              )
                            }
                          ),
                          selectedTags.length > 0 && /* @__PURE__ */ jsx(InlineStack, { gap: "100", wrap: true, children: selectedTags.map((tag) => /* @__PURE__ */ jsx(
                            Tag,
                            {
                              onRemove: () => handleRemoveTag(tag),
                              children: tag
                            },
                            tag
                          )) }),
                          /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                            /* @__PURE__ */ jsx(
                              Button,
                              {
                                onClick: () => setFilterPopoverActive(false),
                                children: "Apply"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              Button,
                              {
                                variant: "plain",
                                onClick: () => setFilterPopoverActive(false),
                                children: "Cancel"
                              }
                            )
                          ] })
                        ] }) }) })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Popover,
                      {
                        active: sortPopoverActive,
                        activator: /* @__PURE__ */ jsx(
                          Button,
                          {
                            icon: SortIcon,
                            onClick: () => setSortPopoverActive(!sortPopoverActive),
                            children: "Sort"
                          }
                        ),
                        onClose: () => setSortPopoverActive(false),
                        children: /* @__PURE__ */ jsx(Popover.Pane, { children: /* @__PURE__ */ jsx(Box, { padding: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                          /* @__PURE__ */ jsx(Text, { variant: "headingSm", as: "h3", children: "Sort by" }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "plain",
                              onClick: () => setSortPopoverActive(false),
                              children: "Name A-Z"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "plain",
                              onClick: () => setSortPopoverActive(false),
                              children: "Name Z-A"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "plain",
                              onClick: () => setSortPopoverActive(false),
                              children: "Date added (newest first)"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "plain",
                              onClick: () => setSortPopoverActive(false),
                              children: "Date added (oldest first)"
                            }
                          )
                        ] }) }) })
                      }
                    )
                  ] }),
                  subscriberData.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      DataTable,
                      {
                        columnContentTypes: [
                          "text",
                          "text",
                          "text",
                          "text",
                          "text"
                        ],
                        headings: [
                          "Name",
                          "Email",
                          "Status",
                          "Date Added",
                          "Tags"
                        ],
                        rows: subscriberData
                      }
                    ),
                    /* @__PURE__ */ jsx(Box, { paddingBlockStart: "400", children: /* @__PURE__ */ jsx(InlineStack, { align: "center", distribute: "center", children: /* @__PURE__ */ jsx(
                      Pagination,
                      {
                        hasPrevious: true,
                        onPrevious: () => {
                          console.log("Previous");
                        },
                        hasNext: true,
                        onNext: () => {
                          console.log("Next");
                        }
                      }
                    ) }) })
                  ] }) : /* @__PURE__ */ jsx(
                    EmptyState,
                    {
                      heading: "Add your first subscriber",
                      action: {
                        content: "Add subscriber",
                        onAction: () => setModalActive(true)
                      },
                      image: "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png",
                      children: /* @__PURE__ */ jsx("p", { children: "Start building your subscriber list to send targeted campaigns" })
                    }
                  )
                ] }) })
              }
            ) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: modalActive,
        onClose: () => setModalActive(false),
        title: "Add new subscriber",
        primaryAction: {
          content: "Add",
          onAction: () => setModalActive(false)
        },
        secondaryActions: [
          {
            content: "Cancel",
            onAction: () => setModalActive(false)
          }
        ],
        children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsx(TextField, { label: "First name", autoComplete: "off" }),
          /* @__PURE__ */ jsx(TextField, { label: "Last name", autoComplete: "off" }),
          /* @__PURE__ */ jsx(TextField, { label: "Email", type: "email", autoComplete: "off" }),
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Unsubscribed", value: "unsubscribed" }
              ],
              onChange: () => {
              },
              value: "active"
            }
          ),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Tags",
              value: tagInputValue,
              onChange: handleTagInputChange,
              placeholder: "Add tags",
              connectedRight: /* @__PURE__ */ jsx(Button, { onClick: handleAddTag, icon: PlusIcon })
            }
          ),
          selectedTags.length > 0 && /* @__PURE__ */ jsx(InlineStack, { gap: "100", wrap: true, children: selectedTags.map((tag) => /* @__PURE__ */ jsx(Tag, { onRemove: () => handleRemoveTag(tag), children: tag }, tag)) })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: importModalActive,
        onClose: () => setImportModalActive(false),
        title: "Import subscribers",
        primaryAction: {
          content: "Import",
          onAction: () => setImportModalActive(false)
        },
        secondaryActions: [
          {
            content: "Cancel",
            onAction: () => setImportModalActive(false)
          }
        ],
        children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsx(Text, { variant: "bodyMd", as: "p", children: "Import subscribers from a CSV file. The file should have the following columns: email, first_name, last_name, status, tags." }),
          /* @__PURE__ */ jsx(Button, { fullWidth: true, children: "Choose file" }),
          /* @__PURE__ */ jsxs(Text, { variant: "bodySm", as: "p", children: [
            "Download a",
            " ",
            /* @__PURE__ */ jsx(Button, { variant: "plain", size: "slim", children: "sample CSV template" })
          ] })
        ] }) })
      }
    )
  ] });
}
function StatCard$1({ title, value, icon, color }) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
    /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
      /* @__PURE__ */ jsx(
        Box,
        {
          style: { background: `${color}20` },
          borderRadius: "100",
          padding: "200",
          children: /* @__PURE__ */ jsx(Icon, { source: icon, color: "base" })
        }
      ),
      /* @__PURE__ */ jsx(Text, { variant: "bodyMd", color: "subdued", children: title })
    ] }),
    /* @__PURE__ */ jsx(Text, { variant: "headingLg", children: value })
  ] }) });
}
const route50 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Subscribers,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function AdditionalPage() {
  return /* @__PURE__ */ jsxs(Page$5, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Additional page" }),
    /* @__PURE__ */ jsxs(Layout, { children: [
      /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "The app template comes with an additional page which demonstrates how to create multiple pages within app navigation using",
          " ",
          /* @__PURE__ */ jsx(
            Link$1,
            {
              url: "https://shopify.dev/docs/apps/tools/app-bridge",
              target: "_blank",
              removeUnderline: true,
              children: "App Bridge"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "To create your own page and have it show up in the app navigation, add a page inside ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes" }),
          ", and a link to it in the ",
          /* @__PURE__ */ jsx(Code, { children: "<NavMenu>" }),
          " component found in ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes/app.jsx" }),
          "."
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Resources" }),
        /* @__PURE__ */ jsx(List, { children: /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
          Link$1,
          {
            url: "https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav",
            target: "_blank",
            removeUnderline: true,
            children: "App nav best practices"
          }
        ) }) })
      ] }) }) })
    ] })
  ] });
}
function Code({ children }) {
  return /* @__PURE__ */ jsx(
    Box,
    {
      as: "span",
      padding: "025",
      paddingInlineStart: "100",
      paddingInlineEnd: "100",
      background: "bg-surface-active",
      borderWidth: "025",
      borderColor: "border",
      borderRadius: "100",
      children: /* @__PURE__ */ jsx("code", { children })
    }
  );
}
const route51 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdditionalPage
}, Symbol.toStringTag, { value: "Module" }));
function Page$1() {
  return /* @__PURE__ */ jsx("div", { children: "Page" });
}
const route52 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$1
}, Symbol.toStringTag, { value: "Module" }));
function Page() {
  return /* @__PURE__ */ jsx("div", { children: "Page" });
}
const route53 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
function Revenue() {
  const [timeframe, setTimeframe] = useState("30d");
  const handleTimeframeChange = useCallback((value) => {
    setTimeframe(value);
  }, []);
  const revenueData = [
    ["Summer Sale Campaign", "Jun 15, 2023", "2,210", "$8,450", "$3.82"],
    ["New Product Launch", "Jul 22, 2023", "1,830", "$12,350", "$6.75"],
    ["Customer Feedback Survey", "Aug 5, 2023", "1,540", "$5,230", "$3.40"],
    ["Holiday Special Offer", "Dec 1, 2022", "2,850", "$18,720", "$6.57"],
    ["Back to School Promotion", "Aug 25, 2022", "1,920", "$9,340", "$4.86"]
  ];
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs(
    Page$5,
    {
      title: "Revenue",
      primaryAction: {
        content: "Export report",
        onAction: () => console.log("Export report")
      },
      children: [
        /* @__PURE__ */ jsx(TitleBar, { title: "Revenue" }),
        /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Revenue Overview" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                label: "Time period",
                labelInline: true,
                options: [
                  { label: "Last 7 days", value: "7d" },
                  { label: "Last 30 days", value: "30d" },
                  { label: "Last 90 days", value: "90d" },
                  { label: "Last 12 months", value: "12m" },
                  { label: "Year to date", value: "ytd" },
                  { label: "All time", value: "all" }
                ],
                onChange: handleTimeframeChange,
                value: timeframe
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsxs(InlineStack, { gap: "400", wrap: false, children: [
            /* @__PURE__ */ jsx(
              StatCard,
              {
                title: "Total Revenue",
                value: "$54,090",
                trend: "+18%",
                trendDirection: "up",
                icon: FinanceIcon,
                color: "#4B7DF3"
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                title: "Avg. Order Value",
                value: "$85.32",
                trend: "+5.2%",
                trendDirection: "up",
                icon: OrderIcon,
                color: "#F49342"
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                title: "Revenue per Subscriber",
                value: "$21.27",
                trend: "+3.8%",
                trendDirection: "up",
                icon: PersonIcon,
                color: "#50B83C"
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                title: "Conversion Rate",
                value: "3.2%",
                trend: "-0.5%",
                trendDirection: "down",
                icon: ChartVerticalIcon,
                color: "#9C6ADE"
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Revenue Trend" }),
            /* @__PURE__ */ jsx(
              Box,
              {
                height: "300px",
                background: "bg-surface-secondary",
                borderRadius: "100",
                children: /* @__PURE__ */ jsx(
                  InlineStack,
                  {
                    align: "center",
                    distribute: "center",
                    blockAlign: "center",
                    height: "100%",
                    children: /* @__PURE__ */ jsx(Text, { variant: "bodyMd", color: "subdued", children: "Revenue chart visualization would appear here" })
                  }
                )
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Campaign Revenue" }),
            /* @__PURE__ */ jsx(
              DataTable,
              {
                columnContentTypes: [
                  "text",
                  "text",
                  "numeric",
                  "numeric",
                  "numeric"
                ],
                headings: [
                  "Campaign",
                  "Date",
                  "Recipients",
                  "Revenue",
                  "Revenue/Recipient"
                ],
                rows: revenueData
              }
            ),
            /* @__PURE__ */ jsx(Box, { paddingBlockStart: "400", children: /* @__PURE__ */ jsx(InlineStack, { align: "center", distribute: "center", children: /* @__PURE__ */ jsx(
              Pagination,
              {
                hasPrevious: true,
                onPrevious: () => {
                  console.log("Previous");
                },
                hasNext: true,
                onNext: () => {
                  console.log("Next");
                }
              }
            ) }) })
          ] }) }),
          /* @__PURE__ */ jsxs(Layout, { children: [
            /* @__PURE__ */ jsx(Layout.Section, { oneHalf: true, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
              /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Revenue by Source" }),
              /* @__PURE__ */ jsx(
                Box,
                {
                  height: "250px",
                  background: "bg-surface-secondary",
                  borderRadius: "100",
                  children: /* @__PURE__ */ jsx(
                    InlineStack,
                    {
                      align: "center",
                      distribute: "center",
                      blockAlign: "center",
                      height: "100%",
                      children: /* @__PURE__ */ jsx(Text, { variant: "bodyMd", color: "subdued", children: "Pie chart visualization would appear here" })
                    }
                  )
                }
              )
            ] }) }) }),
            /* @__PURE__ */ jsx(Layout.Section, { oneHalf: true, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
              /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Revenue by Product Category" }),
              /* @__PURE__ */ jsx(
                Box,
                {
                  height: "250px",
                  background: "bg-surface-secondary",
                  borderRadius: "100",
                  children: /* @__PURE__ */ jsx(
                    InlineStack,
                    {
                      align: "center",
                      distribute: "center",
                      blockAlign: "center",
                      height: "100%",
                      children: /* @__PURE__ */ jsx(Text, { variant: "bodyMd", color: "subdued", children: "Bar chart visualization would appear here" })
                    }
                  )
                }
              )
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Reports" }),
            /* @__PURE__ */ jsxs(InlineStack, { gap: "400", wrap: true, children: [
              /* @__PURE__ */ jsx(Button, { icon: PageIcon, children: "Revenue summary" }),
              /* @__PURE__ */ jsx(Button, { icon: PageIcon, children: "Campaign performance" }),
              /* @__PURE__ */ jsx(Button, { icon: PageIcon, children: "Subscriber value" }),
              /* @__PURE__ */ jsx(Button, { icon: PageIcon, children: "Custom report" })
            ] })
          ] }) })
        ] })
      ]
    }
  ) });
}
function StatCard({ title, value, trend, trendDirection, icon, color }) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
    /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
      /* @__PURE__ */ jsx(
        Box,
        {
          style: { background: `${color}20` },
          borderRadius: "100",
          padding: "200",
          children: /* @__PURE__ */ jsx(Icon, { source: icon, color: "base" })
        }
      ),
      /* @__PURE__ */ jsx(Text, { variant: "bodyMd", color: "subdued", children: title })
    ] }),
    /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "baseline", children: [
      /* @__PURE__ */ jsx(Text, { variant: "headingLg", children: value }),
      /* @__PURE__ */ jsx(
        Text,
        {
          variant: "bodySm",
          color: trendDirection === "up" ? "success" : "critical",
          children: trend
        }
      )
    ] })
  ] }) });
}
const route54 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Revenue,
  loader
}, Symbol.toStringTag, { value: "Module" }));
function Index() {
  return /* @__PURE__ */ jsx("div", { className: "bg-gray-100 min-h-screen p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx(Navigation, {}),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-4", children: "Ongoing Campaigns" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 mb-4 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded overflow-hidden mr-4", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/images/campaign-icon.png",
                  alt: "Campaign icon",
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Campaign Name" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Lorem ipsum dolor sit amet, consectetur adipiscing, sed do eiusmod tempor incididunt ut labore et..." })
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "text-[#4F46E5] bg-[#EEF1FF] p-2 rounded-lg h-10 w-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M13.75 2.5H6.25C5.56 2.5 5 3.06 5 3.75V16.25C5 16.94 5.56 17.5 6.25 17.5H13.75C14.44 17.5 15 16.94 15 16.25V3.75C15 3.06 14.44 2.5 13.75 2.5Z",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M8.75 6.25H11.25",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 mr-2", children: "Impression Count :" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: "300" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 mr-2", children: "Reward Distribution:" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: "80/100" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx("button", { className: "bg-[#4F46E5] text-white py-2 px-4 rounded-lg text-center", children: "View Analytics" }),
            /* @__PURE__ */ jsx("button", { className: "border border-red-500 text-red-500 py-2 px-4 rounded-lg text-center", children: "Deactivate" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded overflow-hidden mr-4", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/images/campaign-icon.png",
                  alt: "Campaign icon",
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Campaign Name" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Lorem ipsum dolor sit amet, consectetur adipiscing, sed do eiusmod tempor incididunt ut labore et..." })
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "text-[#4F46E5] bg-[#EEF1FF] p-2 rounded-lg h-10 w-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M13.75 2.5H6.25C5.56 2.5 5 3.06 5 3.75V16.25C5 16.94 5.56 17.5 6.25 17.5H13.75C14.44 17.5 15 16.94 15 16.25V3.75C15 3.06 14.44 2.5 13.75 2.5Z",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M8.75 6.25H11.25",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 mr-2", children: "Impression Count :" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: "300" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 mr-2", children: "Reward Distribution:" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: "80/100" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx("button", { className: "bg-[#4F46E5] text-white py-2 px-4 rounded-lg text-center", children: "View Analytics" }),
            /* @__PURE__ */ jsx("button", { className: "border border-red-500 text-red-500 py-2 px-4 rounded-lg text-center", children: "Deactivate" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-4", children: /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold", children: "Draft Campaigns" }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-6 mb-4 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-200 rounded-sm" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Campaign Name" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Description" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("button", { className: "text-gray-500 mr-2 bg-gray-100 p-2 rounded-lg h-10 w-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M16.875 4.375L3.125 4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M8.125 8.125V13.125",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M11.875 8.125V13.125",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("button", { className: "border border-[#4F46E5] text-[#4F46E5] py-2 px-4 rounded-lg", children: "Finish Editing" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-6 mb-4 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-200 rounded-sm" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Campaign Name" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Description" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("button", { className: "text-gray-500 mr-2 bg-gray-100 p-2 rounded-lg h-10 w-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M16.875 4.375L3.125 4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M8.125 8.125V13.125",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M11.875 8.125V13.125",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 11.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("button", { className: "border border-[#4F46E5] text-[#4F46E5] py-2 px-4 rounded-lg", children: "Finish Editing" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-200 rounded-sm" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Campaign Name" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Description" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("button", { className: "text-gray-500 mr-2 bg-gray-100 p-2 rounded-lg h-10 w-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M16.875 4.375L3.125 4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M8.125 8.125V13.125",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M11.875 8.125V13.125",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("button", { className: "border border-[#4F46E5] text-[#4F46E5] py-2 px-4 rounded-lg", children: "Finish Editing" })
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
}
const route55 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CHkwI3Ij.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/index-K0fwup_a.js", "/assets/index-CKWc00xI.js", "/assets/components-BE-nyE5z.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-TngPi3Mu.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/index-K0fwup_a.js", "/assets/index-CKWc00xI.js", "/assets/components-BE-nyE5z.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/CampaignContext-5nLN8YYL.js", "/assets/PlanContext-CgoqeIeO.js"], "css": [] }, "routes/api.update-campaign-metafields": { "id": "routes/api.update-campaign-metafields", "parentId": "root", "path": "api/update-campaign-metafields", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.update-campaign-metafields-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.sync-campaign-metafields": { "id": "routes/api.sync-campaign-metafields", "parentId": "root", "path": "api/sync-campaign-metafields", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.sync-campaign-metafields-ChG-6rmU.js", "imports": [], "css": [] }, "routes/webhooks[.]app[.]uninstalled": { "id": "routes/webhooks[.]app[.]uninstalled", "parentId": "root", "path": "webhooks.app.uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks_._app_._uninstalled-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.direct-campaign-data": { "id": "routes/api.direct-campaign-data", "parentId": "root", "path": "api/direct-campaign-data", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.direct-campaign-data-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.direct-campaign-save": { "id": "routes/api.direct-campaign-save", "parentId": "root", "path": "api/direct-campaign-save", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.direct-campaign-save-DekRaVJV.js", "imports": ["/assets/index-DVhyXCg0.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/api.get-active-campaign": { "id": "routes/api.get-active-campaign", "parentId": "root", "path": "api/get-active-campaign", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.get-active-campaign-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.test-db-connection": { "id": "routes/api.test-db-connection", "parentId": "root", "path": "api/test-db-connection", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.test-db-connection-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.update-metafields": { "id": "routes/api.update-metafields", "parentId": "root", "path": "api/update-metafields", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.update-metafields-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.debug-metafeilds": { "id": "routes/api.debug-metafeilds", "parentId": "root", "path": "api/debug-metafeilds", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.debug-metafeilds-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.active-campaign": { "id": "routes/api.active-campaign", "parentId": "root", "path": "api/active-campaign", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.active-campaign-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.billing.current": { "id": "routes/api.billing.current", "parentId": "root", "path": "api/billing/current", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.billing.current-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.embedded-script": { "id": "routes/api.embedded-script", "parentId": "root", "path": "api/embedded-script", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.embedded-script-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.billing.cancel": { "id": "routes/api.billing.cancel", "parentId": "root", "path": "api/billing/cancel", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.billing.cancel-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.billing.create": { "id": "routes/api.billing.create", "parentId": "root", "path": "api/billing/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.billing.create-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.direct-db-test": { "id": "routes/api.direct-db-test", "parentId": "root", "path": "api/direct-db-test", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.direct-db-test-DtMTUZsP.js", "imports": ["/assets/index-DVhyXCg0.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/api.discount-codes": { "id": "routes/api.discount-codes", "parentId": "root", "path": "api/discount-codes", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.discount-codes-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.serve-campaign": { "id": "routes/api.serve-campaign", "parentId": "root", "path": "api/serve-campaign", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.serve-campaign-ChG-6rmU.js", "imports": [], "css": [] }, "routes/api.redeem-coupon": { "id": "routes/api.redeem-coupon", "parentId": "root", "path": "api/redeem-coupon", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.redeem-coupon-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.sync-campaign": { "id": "routes/api.sync-campaign", "parentId": "root", "path": "api/sync-campaign", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.sync-campaign-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.wheel-config": { "id": "routes/api.wheel-config", "parentId": "root", "path": "api/wheel-config", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.wheel-config-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.save-result": { "id": "routes/api.save-result", "parentId": "root", "path": "api/save-result", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.save-result-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.spin-result": { "id": "routes/api.spin-result", "parentId": "root", "path": "api/spin-result", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.spin-result-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/create-campaign": { "id": "routes/create-campaign", "parentId": "root", "path": "create-campaign", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/create-campaign-ChG-6rmU.js", "imports": [], "css": [] }, "routes/api.save-email": { "id": "routes/api.save-email", "parentId": "root", "path": "api/save-email", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.save-email-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.campaigns": { "id": "routes/api.campaigns", "parentId": "root", "path": "api/campaigns", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.campaigns-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.campaigns.status.$id": { "id": "routes/api.campaigns.status.$id", "parentId": "routes/api.campaigns", "path": "status/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.campaigns.status._id-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.campaigns.$id": { "id": "routes/api.campaigns.$id", "parentId": "routes/api.campaigns", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.campaigns._id-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.db-status": { "id": "routes/api.db-status", "parentId": "root", "path": "api/db-status", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.db-status-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.campaign": { "id": "routes/api.campaign", "parentId": "root", "path": "api/campaign", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.campaign-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-Qof2dYF6.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/components-BE-nyE5z.js", "/assets/Page-wxI3g79T.js", "/assets/context-4r-eLkfq.js", "/assets/Card-OGnFM9d-.js", "/assets/FormLayout-BKn6Y4JZ.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js", "/assets/index-CKWc00xI.js"], "css": [] }, "routes/campaigns": { "id": "routes/campaigns", "parentId": "root", "path": "campaigns", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/campaigns-Cpd8pMbv.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/CampaignContext-5nLN8YYL.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/Navigation-CD5DRML2.js", "/assets/index-CKWc00xI.js", "/assets/components-BE-nyE5z.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/campaigns.edit.$id": { "id": "routes/campaigns.edit.$id", "parentId": "routes/campaigns", "path": "edit/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/campaigns.edit._id-ST0f9MsK.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/CampaignContext-5nLN8YYL.js", "/assets/Navigation-CD5DRML2.js", "/assets/StepFour-LL3KnXSO.js", "/assets/index-CKWc00xI.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/components-BE-nyE5z.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/campaigns.create": { "id": "routes/campaigns.create", "parentId": "routes/campaigns", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/campaigns.create-DAEpyTH0.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/CampaignContext-5nLN8YYL.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/StepFour-LL3KnXSO.js", "/assets/index-CKWc00xI.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/campaigns.index": { "id": "routes/campaigns.index", "parentId": "routes/campaigns", "path": "index", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/campaigns.index-Dk0VkISE.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/CampaignContext-5nLN8YYL.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/Navigation-CD5DRML2.js", "/assets/components-BE-nyE5z.js", "/assets/index-CKWc00xI.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/campaigns.$id": { "id": "routes/campaigns.$id", "parentId": "routes/campaigns", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/campaigns._id-Cez-m3IL.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/CampaignContext-5nLN8YYL.js", "/assets/Navigation-CD5DRML2.js", "/assets/index-CKWc00xI.js", "/assets/components-BE-nyE5z.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/campaigns.$id.edit": { "id": "routes/campaigns.$id.edit", "parentId": "routes/campaigns.$id", "path": "edit", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/campaigns._id.edit-q2iITwPx.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/CampaignContext-5nLN8YYL.js", "/assets/Navigation-CD5DRML2.js", "/assets/StepFour-LL3KnXSO.js", "/assets/index-CKWc00xI.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/components-BE-nyE5z.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/settings": { "id": "routes/settings", "parentId": "root", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/settings-BBuoj9lU.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/components-BE-nyE5z.js", "/assets/index-CKWc00xI.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/tutorial": { "id": "routes/tutorial", "parentId": "root", "path": "tutorial", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/tutorial-BQPDUs8c.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/Navigation-CD5DRML2.js", "/assets/index-CKWc00xI.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/components-BE-nyE5z.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/webhooks": { "id": "routes/webhooks", "parentId": "root", "path": "webhooks", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.app.uninstalled": { "id": "routes/webhooks.app.uninstalled", "parentId": "routes/webhooks", "path": "app/uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.uninstalled-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.save-result": { "id": "routes/webhooks.save-result", "parentId": "routes/webhooks", "path": "save-result", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.save-result-Dc4gpkfY.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/webhooks.save-email": { "id": "routes/webhooks.save-email", "parentId": "routes/webhooks", "path": "save-email", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.save-email-Dc4gpkfY.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/pricing": { "id": "routes/pricing", "parentId": "root", "path": "pricing", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/pricing-DW2dNxVS.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/Navigation-CD5DRML2.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/index-CKWc00xI.js", "/assets/components-BE-nyE5z.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-DWygtlqI.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/components-BE-nyE5z.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js", "/assets/index-CKWc00xI.js"], "css": ["/assets/route-Cvk3W028.css"] }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/index": { "id": "routes/index", "parentId": "root", "path": "index", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-C6d-v1ok.js", "imports": [], "css": [] }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app-Cq3fmYVo.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/Navigation-CD5DRML2.js", "/assets/PlanContext-CgoqeIeO.js", "/assets/components-BE-nyE5z.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-CKWc00xI.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/app.campaigns.new": { "id": "routes/app.campaigns.new", "parentId": "routes/app", "path": "campaigns/new", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.campaigns.new-DnVI4rfE.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/index-Co8mFjs7.js", "/assets/AdminLayout-fcwE0Egu.js", "/assets/index-CKWc00xI.js", "/assets/Page-wxI3g79T.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js", "/assets/context-4r-eLkfq.js"], "css": [] }, "routes/app.integrations": { "id": "routes/app.integrations", "parentId": "routes/app", "path": "integrations", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.integrations-Dc4gpkfY.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/app.subscribers": { "id": "routes/app.subscribers", "parentId": "routes/app", "path": "subscribers", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.subscribers-CYvFtMAf.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/index-Co8mFjs7.js", "/assets/AdminLayout-fcwE0Egu.js", "/assets/Page-wxI3g79T.js", "/assets/Card-OGnFM9d-.js", "/assets/FormLayout-BKn6Y4JZ.js", "/assets/Select-Cej0p8YT.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js", "/assets/index-CKWc00xI.js", "/assets/context-4r-eLkfq.js"], "css": [] }, "routes/app.additional": { "id": "routes/app.additional", "parentId": "routes/app", "path": "additional", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.additional-BG4UK4Wy.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/index-Co8mFjs7.js", "/assets/Page-wxI3g79T.js", "/assets/Card-OGnFM9d-.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js"], "css": [] }, "routes/app.game.$id": { "id": "routes/app.game.$id", "parentId": "routes/app", "path": "game/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.game._id-Dc4gpkfY.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/app.game.add": { "id": "routes/app.game.add", "parentId": "routes/app", "path": "game/add", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.game.add-Dc4gpkfY.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/_commonjsHelpers-D6-XlEtG.js"], "css": [] }, "routes/app.revenue": { "id": "routes/app.revenue", "parentId": "routes/app", "path": "revenue", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.revenue-2Ph8AkJH.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/index-Co8mFjs7.js", "/assets/AdminLayout-fcwE0Egu.js", "/assets/Page-wxI3g79T.js", "/assets/Card-OGnFM9d-.js", "/assets/Select-Cej0p8YT.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-K0fwup_a.js", "/assets/index-CKWc00xI.js", "/assets/context-4r-eLkfq.js"], "css": [] }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app._index-Cap_gh92.js", "imports": ["/assets/index-Dxzwlmmu.js", "/assets/Navigation-CD5DRML2.js", "/assets/_commonjsHelpers-D6-XlEtG.js", "/assets/index-CKWc00xI.js", "/assets/components-BE-nyE5z.js", "/assets/index-K0fwup_a.js"], "css": [] } }, "url": "/assets/manifest-973f6993.js", "version": "973f6993" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": true, "v3_singleFetch": false, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.update-campaign-metafields": {
    id: "routes/api.update-campaign-metafields",
    parentId: "root",
    path: "api/update-campaign-metafields",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/api.sync-campaign-metafields": {
    id: "routes/api.sync-campaign-metafields",
    parentId: "root",
    path: "api/sync-campaign-metafields",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/webhooks[.]app[.]uninstalled": {
    id: "routes/webhooks[.]app[.]uninstalled",
    parentId: "root",
    path: "webhooks.app.uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.direct-campaign-data": {
    id: "routes/api.direct-campaign-data",
    parentId: "root",
    path: "api/direct-campaign-data",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/api.direct-campaign-save": {
    id: "routes/api.direct-campaign-save",
    parentId: "root",
    path: "api/direct-campaign-save",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/api.get-active-campaign": {
    id: "routes/api.get-active-campaign",
    parentId: "root",
    path: "api/get-active-campaign",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/api.test-db-connection": {
    id: "routes/api.test-db-connection",
    parentId: "root",
    path: "api/test-db-connection",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/api.update-metafields": {
    id: "routes/api.update-metafields",
    parentId: "root",
    path: "api/update-metafields",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/api.debug-metafeilds": {
    id: "routes/api.debug-metafeilds",
    parentId: "root",
    path: "api/debug-metafeilds",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/api.active-campaign": {
    id: "routes/api.active-campaign",
    parentId: "root",
    path: "api/active-campaign",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/api.billing.current": {
    id: "routes/api.billing.current",
    parentId: "root",
    path: "api/billing/current",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/api.embedded-script": {
    id: "routes/api.embedded-script",
    parentId: "root",
    path: "api/embedded-script",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/api.billing.cancel": {
    id: "routes/api.billing.cancel",
    parentId: "root",
    path: "api/billing/cancel",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/api.billing.create": {
    id: "routes/api.billing.create",
    parentId: "root",
    path: "api/billing/create",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/api.direct-db-test": {
    id: "routes/api.direct-db-test",
    parentId: "root",
    path: "api/direct-db-test",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/api.discount-codes": {
    id: "routes/api.discount-codes",
    parentId: "root",
    path: "api/discount-codes",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/api.serve-campaign": {
    id: "routes/api.serve-campaign",
    parentId: "root",
    path: "api/serve-campaign",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/api.redeem-coupon": {
    id: "routes/api.redeem-coupon",
    parentId: "root",
    path: "api/redeem-coupon",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/api.sync-campaign": {
    id: "routes/api.sync-campaign",
    parentId: "root",
    path: "api/sync-campaign",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/api.wheel-config": {
    id: "routes/api.wheel-config",
    parentId: "root",
    path: "api/wheel-config",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/api.save-result": {
    id: "routes/api.save-result",
    parentId: "root",
    path: "api/save-result",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/api.spin-result": {
    id: "routes/api.spin-result",
    parentId: "root",
    path: "api/spin-result",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/create-campaign": {
    id: "routes/create-campaign",
    parentId: "root",
    path: "create-campaign",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/api.save-email": {
    id: "routes/api.save-email",
    parentId: "root",
    path: "api/save-email",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/api.campaigns": {
    id: "routes/api.campaigns",
    parentId: "root",
    path: "api/campaigns",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/api.campaigns.status.$id": {
    id: "routes/api.campaigns.status.$id",
    parentId: "routes/api.campaigns",
    path: "status/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/api.campaigns.$id": {
    id: "routes/api.campaigns.$id",
    parentId: "routes/api.campaigns",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/api.db-status": {
    id: "routes/api.db-status",
    parentId: "root",
    path: "api/db-status",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/api.campaign": {
    id: "routes/api.campaign",
    parentId: "root",
    path: "api/campaign",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/campaigns": {
    id: "routes/campaigns",
    parentId: "root",
    path: "campaigns",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/campaigns.edit.$id": {
    id: "routes/campaigns.edit.$id",
    parentId: "routes/campaigns",
    path: "edit/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/campaigns.create": {
    id: "routes/campaigns.create",
    parentId: "routes/campaigns",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/campaigns.index": {
    id: "routes/campaigns.index",
    parentId: "routes/campaigns",
    path: "index",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  },
  "routes/campaigns.$id": {
    id: "routes/campaigns.$id",
    parentId: "routes/campaigns",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route35
  },
  "routes/campaigns.$id.edit": {
    id: "routes/campaigns.$id.edit",
    parentId: "routes/campaigns.$id",
    path: "edit",
    index: void 0,
    caseSensitive: void 0,
    module: route36
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route37
  },
  "routes/tutorial": {
    id: "routes/tutorial",
    parentId: "root",
    path: "tutorial",
    index: void 0,
    caseSensitive: void 0,
    module: route38
  },
  "routes/webhooks": {
    id: "routes/webhooks",
    parentId: "root",
    path: "webhooks",
    index: void 0,
    caseSensitive: void 0,
    module: route39
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "routes/webhooks",
    path: "app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route40
  },
  "routes/webhooks.save-result": {
    id: "routes/webhooks.save-result",
    parentId: "routes/webhooks",
    path: "save-result",
    index: void 0,
    caseSensitive: void 0,
    module: route41
  },
  "routes/webhooks.save-email": {
    id: "routes/webhooks.save-email",
    parentId: "routes/webhooks",
    path: "save-email",
    index: void 0,
    caseSensitive: void 0,
    module: route42
  },
  "routes/pricing": {
    id: "routes/pricing",
    parentId: "root",
    path: "pricing",
    index: void 0,
    caseSensitive: void 0,
    module: route43
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route44
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route45
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: "index",
    index: void 0,
    caseSensitive: void 0,
    module: route46
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route47
  },
  "routes/app.campaigns.new": {
    id: "routes/app.campaigns.new",
    parentId: "routes/app",
    path: "campaigns/new",
    index: void 0,
    caseSensitive: void 0,
    module: route48
  },
  "routes/app.integrations": {
    id: "routes/app.integrations",
    parentId: "routes/app",
    path: "integrations",
    index: void 0,
    caseSensitive: void 0,
    module: route49
  },
  "routes/app.subscribers": {
    id: "routes/app.subscribers",
    parentId: "routes/app",
    path: "subscribers",
    index: void 0,
    caseSensitive: void 0,
    module: route50
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: route51
  },
  "routes/app.game.$id": {
    id: "routes/app.game.$id",
    parentId: "routes/app",
    path: "game/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route52
  },
  "routes/app.game.add": {
    id: "routes/app.game.add",
    parentId: "routes/app",
    path: "game/add",
    index: void 0,
    caseSensitive: void 0,
    module: route53
  },
  "routes/app.revenue": {
    id: "routes/app.revenue",
    parentId: "routes/app",
    path: "revenue",
    index: void 0,
    caseSensitive: void 0,
    module: route54
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route55
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
