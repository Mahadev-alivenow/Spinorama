"use client";

import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Navigation from "../components/Navigation";
import { usePlan } from "../context/PlanContext";
import { useEffect } from "react";
import { ANNUAL_PLAN, authenticate, MONTLY_PLAN } from "../shopify.server";
import { getActiveCampaign, getDiscountCodes, getSubscriptionStatus, syncActiveCampaignToMetafields } from "../models/Subscription.server";


// export async function loader({ request }) {
//   const { authenticateWithFallback, isClientSideNavigation } = await import(
//     "../shopify.server"
//   );
//   const {
//     getActiveCampaign,
//     getDiscountCodes,
//     getSubscriptionStatus,
//     syncActiveCampaignToMetafields,
//   } = await import("../models/Subscription.server");
//   const { setShopName } = await import("../../lib/mongodb.server");

//   const discountCodes = [];
//   const isClientNavigation = isClientSideNavigation(request);

//   try {
//     const authResult = await authenticateWithFallback(request);

//     if (!authResult.success) {
//       // Handle fallback case for client navigation
//       if (authResult.fallback && isClientNavigation) {
//         console.log("App - Using fallback data for client navigation");

//         // Try to get cached data from a previous successful auth
//         const fallbackShop = authResult.shop || "unknown-shop";

//         return json({
//           apiKey: process.env.SHOPIFY_API_KEY || "",
//           mongoDbUri: !!process.env.MONGODB_URI,
//           shop: fallbackShop,
//           shopFormatted: fallbackShop.replace(/\.myshopify\.com$/i, ""),
//           isAuthenticated: false,
//           hasCampaign: false,
//           discountCodes: [],
//           fallbackMode: true,
//         });
//       }

//       // For direct navigation, redirect to auth
//       const url = new URL(request.url);
//       const shop = url.searchParams.get("shop");

//       if (shop) {
//         return Response.redirect(`/auth?shop=${shop}`, 302);
//       }

//       return Response.redirect(`/auth/login`, 302);
//     }

//     const { admin, billing, session } = authResult;
//     const { shop } = session;

//     setShopName(shop);
//     console.log("App - Authenticated with shop:", shop);

//     // Try to get subscription status, but don't fail if it errors
//     let activeSubscriptions = [];
//     try {
//       const subscriptions = await getSubscriptionStatus(admin.graphql);
//       activeSubscriptions =
//         subscriptions.data.app.installation.activeSubscriptions;
//     } catch (subError) {
//       console.log(
//         "App - Could not fetch subscription status:",
//         subError.message,
//       );
//       if (isClientNavigation) {
//         // For client navigation, continue with empty subscriptions
//         activeSubscriptions = [];
//       } else {
//         throw subError;
//       }
//     }

    // // Try to get discount codes, but don't fail if it errors
    // try {
    //   const discountCode = await getDiscountCodes(admin.graphql);
    //   const nodes = discountCode?.data?.discountNodes?.edges || [];

    //   for (const { node } of nodes) {
    //     const discount = node.discount;
    //     const title = discount?.title || "N/A";
    //     const summary = discount?.summary || "N/A";

    //     if (discount?.codes?.edges?.length > 0) {
    //       for (const codeEdge of discount.codes.edges) {
    //         const code = codeEdge?.node?.code || "N/A";
    //         discountCodes.push({ title, summary, code });
    //       }
    //     } else {
    //       discountCodes.push({ title, summary, code: null });
    //     }
    //   }
    // } catch (discountError) {
    //   console.log(
    //     "App - Could not fetch discount codes:",
    //     discountError.message,
    //   );
    //   // Continue with empty discount codes
    // }

    // // Try to get active campaign, but don't fail if it errors
    // let activeCampaign = null;
    // try {
    //   activeCampaign = await getActiveCampaign(shop);
    //   if (activeCampaign) {
    //     await syncActiveCampaignToMetafields(admin.graphql, shop);
    //   }
    // } catch (campaignError) {
    //   console.log(
    //     "App - Could not fetch/sync campaign:",
    //     campaignError.message,
    //   );
    //   // Continue without campaign
    // }

//     // Handle billing requirements more gracefully
//     if (activeSubscriptions.length < 1 && !isClientNavigation) {
//       try {
//         await billing.require({
//           plans: [MONTLY_PLAN, ANNUAL_PLAN],
//           isTest: true,
//           onFailure: async () =>
//             billing.request({
//               plan: MONTLY_PLAN,
//               isTest: true,
//             }),
//           returnUrl: `https://${shop}/admin/apps/spinorama/app`,
//         });
//       } catch (billingError) {
//         console.log("App - Billing requirement failed:", billingError.message);
//         // For client navigation, continue without billing check
//         if (!isClientNavigation) {
//           return json({ error: "No active subscriptions found" });
//         }
//       }
//     }

//     return json({
//       apiKey: process.env.SHOPIFY_API_KEY || "",
//       mongoDbUri: !!process.env.MONGODB_URI,
//       shop,
//       shopFormatted: shop.replace(/\.myshopify\.com$/i, ""),
//       isAuthenticated: true,
//       hasCampaign: !!activeCampaign,
//       discountCodes,
//       fallbackMode: false,
//     });
//   } catch (error) {
//     console.error("App - Loader auth error:", error);

//     // For client navigation, provide fallback data instead of failing
//     if (isClientNavigation) {
//       const url = new URL(request.url);
//       const shop = url.searchParams.get("shop") || "unknown-shop";

//       return json({
//         apiKey: process.env.SHOPIFY_API_KEY || "",
//         mongoDbUri: !!process.env.MONGODB_URI,
//         shop: shop,
//         shopFormatted: shop.replace(/\.myshopify\.com$/i, ""),
//         isAuthenticated: false,
//         hasCampaign: false,
//         discountCodes: [],
//         fallbackMode: true,
//         error: "Authentication temporarily unavailable",
//       });
//     }

//     // For direct navigation, redirect to auth
//     const url = new URL(request.url);
//     const shop = url.searchParams.get("shop");

//     if (shop) {
//       return Response.redirect(`/auth?shop=${shop}`, 302);
//     }

//     return json(
//       {
//         error: "Authentication failed",
//         message: error.message,
//         isAuthenticated: false,
//         shop: "unknown-shop",
//         shopFormatted: "unknown-shop",
//       },
//       { status: 401 },
//     );
//   }
// }

export async function loader({ request }) {
  const { admin, session, billing } = await authenticate.admin(request);
  const { shop } = session;
  console.log("App - Authenticated with shop:", shop);
 const discountCodes = [];
  const subscriptions = await getSubscriptionStatus(admin.graphql);
  const activeSubscriptions =
    subscriptions.data.app.installation.activeSubscriptions;

  console.log("App - Active subscriptions:", activeSubscriptions);

  if (activeSubscriptions.length < 1) {
    console.log("App - No active subscriptions found, redirecting to billing");
    await billing.require({
      plans: [MONTLY_PLAN, ANNUAL_PLAN],
      isTest: true,
      onFailure: async () =>
        billing.request({
          plan: MONTLY_PLAN,
          isTest: true,
        }),
      returnUrl: `https://${shop}/admin/apps/spinorama/app`,
    });
    console.log(
      "App - Billing requirement completed, redirecting to create billing",
    );
  }

  // Try to get discount codes, but don't fail if it errors
  try {
    const discountCode = await getDiscountCodes(admin.graphql);
    const nodes = discountCode?.data?.discountNodes?.edges || [];

    for (const { node } of nodes) {
      const discount = node.discount;
      const title = discount?.title || "N/A";
      const summary = discount?.summary || "N/A";

      if (discount?.codes?.edges?.length > 0) {
        for (const codeEdge of discount.codes.edges) {
          const code = codeEdge?.node?.code || "N/A";
          discountCodes.push({ title, summary, code });
        }
      } else {
        discountCodes.push({ title, summary, code: null });
      }
    }
  } catch (discountError) {
    console.log("App - Could not fetch discount codes:", discountError.message);
    // Continue with empty discount codes
  }

  // Try to get active campaign, but don't fail if it errors
  let activeCampaign = null;
  try {
    activeCampaign = await getActiveCampaign(shop);
    if (activeCampaign) {
      await syncActiveCampaignToMetafields(admin.graphql, shop);
    }
  } catch (campaignError) {
    console.log("App - Could not fetch/sync campaign:", campaignError.message);
    // Continue without campaign
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
    fallbackMode: false,
  });
}

export default function App() {
  const { currentPlan, discountCodes, setDiscountCodes } = usePlan();
  const data = useLoaderData();

  console.log("App - Discount codes:", discountCodes);

  // On initial render, populate discount codes into context
  useEffect(() => {
    if (data?.discountCodes?.length) {
      console.log(
        "App - Setting discountCodes in context:",
        data.discountCodes,
      );
      setDiscountCodes(data.discountCodes);
    } else {
      console.log("App - No discountCodes to set");
    }
  }, [data]);

  // Only show fallback message if we're actually in fallback mode AND have no useful data
  if (data.fallbackMode && !data.isAuthenticated && !data.shop) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <div className="mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ Running in offline mode. Some features may be limited. Please
              refresh the page to restore full functionality.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to Shopify Campaign Creator
            </h1>
            <p className="text-gray-600 mb-6">
              Create engaging spin-to-win campaigns for your Shopify store to
              boost conversions and customer engagement.
            </p>
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Navigation />

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">
              Welcome to Shopify Campaign Creator
            </h1>
            {/* <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Shop:{" "}
                <span className="font-semibold">{data.shopFormatted}</span>
                {data.fallbackMode && (
                  <span className="text-orange-600 ml-2">
                    (Limited functionality)
                  </span>
                )}
              </div>
            </div> */}
          </div>
          <p className="text-gray-600 mb-6">
            Create engaging spin-to-win campaigns for your Shopify store to
            boost conversions and customer engagement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
              <p className="text-indigo-600 font-bold text-2xl mb-1">
                {currentPlan.name}
              </p>
              <p className="text-gray-500 mb-4">
                {currentPlan.campaignLimit} campaigns allowed
              </p>
              {/* <Link to="/pricing" className="text-indigo-600 hover:underline">
                View Plans →
              </Link> */}
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
              <p className="text-gray-600 mb-4">
                Create your first campaign in minutes with our easy-to-use
                wizard.
              </p>
              <Link
                to="/campaigns/create"
                className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-green-700 transition-colors"
              >
                Create Campaign
              </Link>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Learn More</h2>
              <p className="text-gray-600 mb-4">
                Check out our tutorial to learn how to create effective
                campaigns.
              </p>
              <Link
                to="/tutorial"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-purple-700 transition-colors"
              >
                View Tutorial
              </Link>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Create a new campaign from the "Create Campaign" button</li>
              <li>Choose your campaign type and customize the appearance</li>
              <li>Set up your prizes and wheel segments</li>
              <li>Configure display rules and targeting</li>
              <li>Launch your campaign and start collecting leads!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
