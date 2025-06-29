
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import Navigation from "../components/Navigation";
import { usePlan } from "../context/PlanContext";
import { useEffect } from "react";
import { authenticate } from "../shopify.server";
import {
  getActiveCampaign,
  getDiscountCodes,
  hasActiveSubscription,
  createSubscriptionMetafield,
  syncActiveCampaignToMetafields,
} from "../models/Subscription.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;
    console.log("App - Authenticated with shop:", shop);

    const discountCodes = [];
    const isDevelopment = process.env.NODE_ENV === "production";

    // Check subscription status using our enhanced function
    const subscriptionStatus = await hasActiveSubscription(
      admin.graphql,
      shop,
      isDevelopment,
    );

    console.log("App - Subscription status:", subscriptionStatus);

    // Always update the subscription metafield
    await createSubscriptionMetafield(
      admin.graphql,
      subscriptionStatus.hasSubscription,
      shop,
    );

    // For testing in development, you can manually set subscription status
    if (isDevelopment) {
      // Uncomment this line to simulate an active subscription in development
      // await setLocalSubscriptionStatus(shop, "active", "Development Plan")
    }

    // Try to get discount codes
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
      console.log(
        "App - Could not fetch discount codes:",
        discountError.message,
      );
    }

    // Try to get and sync active campaign
    let activeCampaign = null;
    try {
      activeCampaign = await getActiveCampaign(shop);
      if (activeCampaign && subscriptionStatus.hasSubscription) {
        await syncActiveCampaignToMetafields(admin.graphql, shop);
      }
    } catch (campaignError) {
      console.log(
        "App - Could not fetch/sync campaign:",
        campaignError.message,
      );
    }

    return json({
      apiKey: process.env.SHOPIFY_API_KEY || "",
      mongoDbUri: !!process.env.MONGODB_URI,
      shop,
      shopFormatted: shop.replace(/\.myshopify\.com$/i, ""),
      isAuthenticated: true,
      hasActiveSubscription: subscriptionStatus.hasSubscription,
      needsSubscription: !subscriptionStatus.hasSubscription,
      hasCampaign: !!activeCampaign,
      discountCodes,
      fallbackMode: false,
      subscriptionPlan: subscriptionStatus.plan,
      subscriptionSource: subscriptionStatus.source,
      isDevelopment,
    });
  } catch (error) {
    console.error("App - Loader error:", error);

    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (shop) {
      return Response.redirect(`/auth?shop=${shop}`, 302);
    }

    return json(
      {
        error: "Authentication failed",
        message: error.message,
        isAuthenticated: false,
        hasActiveSubscription: false,
        needsSubscription: true,
        shop: "unknown-shop",
        shopFormatted: "unknown-shop",
      },
      { status: 401 },
    );
  }
}

export default function App() {
  const { currentPlan, discountCodes, setDiscountCodes } = usePlan();
  const data = useLoaderData();

  useEffect(() => {
    if (data?.discountCodes?.length) {
      setDiscountCodes(data.discountCodes);
    }
  }, [data, setDiscountCodes]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get("shop");
    const host = urlParams.get("host");

    // If missing, and we're inside iframe → redirect to top-level
    if (!shop || !host) {
      if (window.top === window.self) {
        // Not inside iframe — dev direct load
        return;
      }

      const appOrigin = new URL(window.location.origin);
      const redirectUrl = `/auth/toplevel?shop=${window.__SHOP_DOMAIN__}`; // Replace with a real fallback if you have one
      window.top.location.assign(redirectUrl);
    }
  }, []);
  // Show development info
  if (data.isDevelopment) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  Development Mode
                </h3>
                <p className="text-blue-700 mt-1">
                  Subscription Status: {data.subscriptionSource} | Has
                  Subscription:{" "}
                  {data.hasActiveSubscription ? "✅ Yes" : "❌ No"}
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  In development, subscription is simulated. To test without
                  subscription, modify the hasActiveSubscription function in
                  Subscription.server.js
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-4">Spinorama - Development</h1>
            <p className="text-gray-600 mb-6">
              You're in development mode. The app is simulating an active
              subscription for testing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Test Campaign</h2>
                <p className="text-gray-600 mb-4">
                  Create a test campaign to see how it works.
                </p>
                <Link
                  to="/campaigns/create"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-green-700 transition-colors"
                >
                  Create Test Campaign
                </Link>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">View Campaigns</h2>
                <p className="text-gray-600 mb-4">
                  See all your test campaigns.
                </p>
                <Link
                  to="/campaigns"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-purple-700 transition-colors"
                >
                  View Campaigns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription required message for users without active subscription
  if (data.needsSubscription || !data.hasActiveSubscription) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <div className="mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-yellow-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Subscription Required
                </h3>
                <p className="text-yellow-700 mt-1">
                  Please subscribe to unlock all features of Spinorama.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Spinorama</h1>
            <p className="text-gray-600 mb-6">
              Subscribe to unlock powerful spin-to-win campaigns for your
              Shopify store.
            </p>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-2">Premium Features</h2>
              <ul className="text-left space-y-2">
                <li>✓ 20 spin-to-win campaigns</li>
                <li>✓ Email collection & analytics</li>
                <li>✓ Customizable wheels and rewards</li>
                <li>✓ Lead collection with discounts</li>
                <li>✓ Engaging spin popups</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Visit the Shopify App Store to subscribe.
              </p>
              <a
                href={`https://admin.shopify.com/store/${data.shopFormatted}/charges/spinorama/pricing_plans`}
                target="_top"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
              >
                Subscribe Now
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show main app interface for subscribed users
  return (
    <div className="container mx-auto px-4 py-6">
      <Navigation />

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Welcome to Spinorama</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Shop:{" "}
                <span className="font-semibold">{data.shopFormatted}</span>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Subscribed ({data.subscriptionSource})
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Create engaging spin-to-win campaigns for your Shopify store to
            boost conversions and customer engagement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
              <p className="text-indigo-600 font-bold text-2xl mb-1">
                {data.subscriptionPlan?.name || "Monthly Plan"}
              </p>
              <p className="text-gray-500 mb-4">20 campaigns allowed</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
              <p className="text-gray-600 mb-4">
                Create your first campaign in minutes.
              </p>
              <Link
                to="/campaigns/create"
                className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-green-700 transition-colors"
              >
                Create Campaign
              </Link>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">View Campaigns</h2>
              <p className="text-gray-600 mb-4">
                Manage your existing campaigns.
              </p>
              <Link
                to="/campaigns"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-purple-700 transition-colors"
              >
                View Campaigns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


//app.jsx
