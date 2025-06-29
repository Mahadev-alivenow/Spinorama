import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  BillingInterval,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { restResources } from "@shopify/shopify-api/rest/admin/2025-01";
import { BILLING_PLANS } from "./constants/billing";

// export const MONTLY_PLAN = BILLING_PLANS.MONTHLY;
// export const ANNUAL_PLAN = BILLING_PLANS.ANNUAL;

export const MONTLY_PLAN = "Monthly Subscription";
export const ANNUAL_PLAN = "Annual Subscription";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
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
    },
    [ANNUAL_PLAN]: {
      amount: 50,
      currencyCode: "USD",
      interval: BillingInterval.Annual,
      name: "Annual Subscription",
      price: 0,
      test: true,
    },
  },
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    APP_SUBSCRIPTIONS_UPDATE: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
    SHOP_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks",
    },
  },

  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  // Fix X-Frame-Options issues by ensuring proper embedded app handling
  isEmbeddedApp: true,
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

// Helper function to check if request is client-side navigation
export function isClientSideNavigation(request) {
  const purpose = request.headers.get("purpose");
  const fetchDest = request.headers.get("sec-fetch-dest");
  const fetchMode = request.headers.get("sec-fetch-mode");

  return (
    purpose === "prefetch" ||
    fetchDest === "empty" ||
    fetchMode === "navigate" ||
    request.headers.get("x-remix-transition") === "true"
  );
}

// Enhanced authenticate function that handles client navigation gracefully
export async function authenticateWithFallback(request) {
  try {
    const result = await shopify.authenticate.admin(request);
    return { success: true, ...result };
  } catch (error) {
    console.log("Authentication failed:", error?.message || "Unknown error");

    // If it's client-side navigation, return fallback data instead of throwing
    if (isClientSideNavigation(request)) {
      console.log("Client-side navigation detected, providing fallback");

      // Try to get shop from URL or headers
      const url = new URL(request.url);
      const shop =
        url.searchParams.get("shop") ||
        request.headers.get("x-shopify-shop-domain") ||
        "unknown-shop";

      return {
        success: false,
        fallback: true,
        shop: shop,
        error: error,
      };
    }

    // For direct navigation, re-throw the error to trigger redirect
    throw error;
  }
}

// export async function login(request) {
//   const url = new URL(request.url);
//   const shop = url.searchParams.get("shop");

//   if (!shop) {
//     // 🚨 this redirect must be avoided inside /auth route or you'll loop!
//     return redirect("/auth/login");
//   }

//   // Otherwise, initiate Shopify OAuth
//   return redirect(`https://${shop}/admin/oauth/authorize?...`);
// }


export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
