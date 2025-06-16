"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLoaderData, useFetcher } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Navigation from "../components/Navigation";
import { usePlan } from "../context/PlanContext";
import { BILLING_PLANS } from "../constants/billing";

// Format price for display
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

// Loader to fetch current subscription status and shop info
export async function loader({ request }) {
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
        needsShopParam: true,
      });
    }

    try {
      // Import Shopify authentication
      const { authenticate } = await import("../shopify.server");
      const { getSubscriptionStatus } = await import(
        "../models/Subscription.server"
      );

      console.log("Pricing loader - Attempting authentication");

      // Authenticate with Shopify
      const { admin, session } = await authenticate.admin(request);
      const { shop } = session;

      console.log("Pricing loader - Authentication successful for shop:", shop);

      // Fetch current subscription status
      let activeSubscription = null;
      let availablePlans = [];

      try {
        // Get current subscription
        console.log("Pricing loader - Fetching subscription status");
        const subscriptionResult = await getSubscriptionStatus(admin.graphql);
        const subscriptions =
          subscriptionResult?.data?.app?.installation?.activeSubscriptions ||
          [];

        console.log(
          "Pricing loader - Found subscriptions:",
          subscriptions.length,
        );

        if (subscriptions.length > 0) {
          activeSubscription = subscriptions[0];
          console.log(
            "Pricing loader - Active subscription:",
            activeSubscription.name,
          );
        }

        // Define available plans
        availablePlans = [
          {
            id: "starter",
            name: "Standard Package",
            monthlyPrice: 0,
            yearlyPrice: 0,
            shopifyPlanId: null, // Free plan
            campaignLimit: 20,
            features: [
              "Show on specific pages",
              "Up to 500 Spins/Month",
              "Basic Analytics",
              "Email Support",
              "20 Campaign",
            ],
            popular: false,
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
              "Conversion Booster",
            ],
            popular: true,
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
              "Advanced Analytics",
            ],
            popular: false,
          },
        ];
      } catch (error) {
        console.error(
          "Pricing loader - Failed to fetch subscription data:",
          error,
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
          id: session.id,
        },
      });
    } catch (authError) {
      console.error("Pricing loader - Authentication failed:", authError);

      // Redirect to auth with shop parameter
      throw redirect(`/auth?shop=${shopParam}`);
    }
  } catch (error) {
    console.error("Pricing loader - General error:", error);

    // If it's already a redirect, re-throw it
    if (
      error instanceof Response &&
      error.status >= 300 &&
      error.status < 400
    ) {
      throw error;
    }

    return json({
      isAuthenticated: false,
      shop: null,
      activeSubscription: null,
      error: "Failed to load pricing data",
    });
  }
}

// Action to handle plan changes - ONLY for paid plans
export async function action({ request }) {
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
      shopifyPlanName,
    });

    // Import Shopify authentication
    const { authenticate } = await import("../shopify.server");
    const { admin, session, billing } = await authenticate.admin(request);
    const { shop } = session;

    console.log("Pricing action - Authenticated for shop:", shop);

    // Handle free plan (starter) - cancel existing subscription
    if (planId === "starter") {
      console.log("Pricing action - Switching to free plan");

      try {
        // Get current subscription
        const { getSubscriptionStatus } = await import(
          "../models/Subscription.server"
        );
        const subscriptionResult = await getSubscriptionStatus(admin.graphql);
        const subscriptions =
          subscriptionResult?.data?.app?.installation?.activeSubscriptions ||
          [];

        if (subscriptions.length > 0) {
          console.log("Pricing action - Cancelling existing subscription");
          // Cancel subscription via GraphQL
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
                id: subscriptionId,
              },
            },
          );

          const cancelData = await cancelResult.json();
          console.log("Pricing action - Cancel result:", cancelData);

          if (cancelData.data?.appSubscriptionCancel?.userErrors?.length > 0) {
            console.error(
              "Pricing action - Cancel errors:",
              cancelData.data.appSubscriptionCancel.userErrors,
            );
          }
        }

        return json({
          success: true,
          message: "Successfully switched to Starter plan",
          planId: "starter",
        });
      } catch (error) {
        console.error("Pricing action - Error switching to free plan:", error);
        return json({
          success: true, // Still return success for free plan
          message: "Switched to Starter plan",
          planId: "starter",
        });
      }
    }
    // Handle paid plans - ONLY trigger billing for non-free plans
    else if (shopifyPlanName && planId !== "starter") {
      console.log("Pricing action - Processing paid plan:", shopifyPlanName);

      try {
        // Request billing for the paid plan using the billing object
        console.log(
          "Pricing action - Requesting billing for plan:",
          shopifyPlanName,
        );

        const response = await billing.request({
          plan: shopifyPlanName,
          isTest,
          returnUrl:
            returnUrl || `${new URL(request.url).origin}/app?shop=${shop}`,
        });

        console.log("Pricing action - Billing request successful");

        return json({
          success: true,
          confirmationUrl: response.confirmationUrl,
          planId,
          message: `Billing initiated for ${planId} plan`,
        });
      } catch (billingError) {
        console.error("Pricing action - Billing error:", billingError);
        return json(
          {
            success: false,
            message: billingError.message || "Failed to create subscription",
          },
          { status: 400 },
        );
      }
    }

    console.log("Pricing action - Invalid plan configuration");
    return json(
      {
        success: false,
        message: "Invalid plan configuration",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Pricing action - General error:", error);
    return json(
      {
        success: false,
        message: error.message || "Failed to process plan change",
      },
      { status: 500 },
    );
  }
}

export default function Pricing() {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const { billingCycle, changeBillingCycle, changePlan, currentPlan } =
    usePlan();
  const fetcher = useFetcher();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Use plans from loader data or fallback to context
  const availablePlans = loaderData?.availablePlans || [];
  const isAuthenticated = loaderData?.isAuthenticated;
  const activeSubscription = loaderData?.activeSubscription;
  const shop = loaderData?.shop;

  // Handle billing cycle change
  const handleBillingCycleChange = (cycle) => {
    changeBillingCycle(cycle);
  };

  // Handle plan selection
  const handlePlanSelect = (planId) => {
    if (!isAuthenticated) {
      setError("Please authenticate first to change plans");
      return;
    }

    if (currentPlan.id === planId) return;

    setSelectedPlanId(planId);
    setShowConfirmModal(true);
  };

  // Get Shopify plan name based on plan and billing cycle
  const getShopifyPlanName = (plan, cycle) => {
    if (plan.id === "starter") return null; // Free plan

    if (cycle === "yearly") {
      return plan.shopifyYearlyPlanId || BILLING_PLANS.ANNUAL;
    } else {
      return plan.shopifyPlanId || BILLING_PLANS.MONTHLY;
    }
  };

  // Handle real-time subscription changes with billing logic
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

      // Use fetcher to call our action
      const formData = new FormData();
      formData.append("planId", selectedPlanId);
      formData.append("billingCycle", billingCycle);

      // For paid plans ONLY, add shopify plan name and billing info
      if (selectedPlanId !== "starter") {
        const shopifyPlanName = getShopifyPlanName(selectedPlan, billingCycle);
        console.log("Adding billing info for paid plan:", shopifyPlanName);
        formData.append("shopifyPlanName", shopifyPlanName);
        formData.append(
          "returnUrl",
          `${window.location.origin}/app?shop=${shop}`,
        );
        formData.append(
          "isTest",
          process.env.NODE_ENV === "development" ? "true" : "false",
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

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      console.log("Fetcher response:", fetcher.data);

      if (fetcher.data.success) {
        // Update local state
        changePlan(fetcher.data.planId);

        if (fetcher.data.confirmationUrl) {
          // For paid plans with confirmation URL
          setSuccess(`Redirecting to Shopify to confirm your subscription...`);

          // Redirect to Shopify for confirmation
          setTimeout(() => {
            window.top.location.href = fetcher.data.confirmationUrl; // Use window.top to break out of iframe
          }, 2000);
        } else {
          // For free plan or direct updates
          setSuccess(fetcher.data.message || "Plan updated successfully!");

          // Redirect back to app
          setTimeout(() => {
            navigate(`/app?shop=${shop}`);
          }, 2000);
        }
      } else {
        // Handle errors
        setError(fetcher.data.message || "Failed to change subscription");
      }

      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  }, [fetcher.data, changePlan, navigate, shop]);

  // Get plans with pricing based on billing cycle
  const getPlansWithPricing = () => {
    return availablePlans.map((plan) => {
      const basePrice =
        billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

      return {
        ...plan,
        price: basePrice,
      };
    });
  };

  // Sync current plan with active subscription
  useEffect(() => {
    if (activeSubscription) {
      let matchedPlanId = "starter"; // Default

      if (activeSubscription.name === BILLING_PLANS.MONTHLY) {
        matchedPlanId = "lite";
        changeBillingCycle("monthly");
      } else if (activeSubscription.name === BILLING_PLANS.ANNUAL) {
        matchedPlanId = "lite";
        changeBillingCycle("yearly");
      } else if (activeSubscription.name.includes("Premium")) {
        matchedPlanId = "premium";
        changeBillingCycle(
          activeSubscription.name.includes("Annual") ? "yearly" : "monthly",
        );
      }

      changePlan(matchedPlanId);
    } else {
      // No active subscription, default to starter
      changePlan("starter");
    }
  }, [activeSubscription, changeBillingCycle, changePlan]);

  const plans = getPlansWithPricing();

  // Show authentication required message
  if (loaderData?.needsShopParam) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Navigation createButtonText="Create Pop-Up" />
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-6">
            <div className="text-center">
              <p className="font-medium">Shop Parameter Required</p>
              <p className="text-sm mt-2">
                Please access this page from your Shopify admin or include the
                shop parameter in the URL.
              </p>
              <button
                onClick={() => navigate("/auth/login")}
                className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <Navigation createButtonText="Create Pop-Up" />

        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Authentication Required</p>
                <p className="text-sm">
                  You need to be authenticated to change subscription plans.
                </p>
              </div>
              <button
                onClick={() => navigate(`/auth?shop=${shop || "your-shop"}`)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="mb-2">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <p>{success}</p>
          </div>
        )}

        {/* Current Subscription Info */}
        {activeSubscription && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-1">Current Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-700">
                  Plan:{" "}
                  <span className="font-medium">{activeSubscription.name}</span>
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {activeSubscription.status}
                  </span>
                </p>
              </div>
              {activeSubscription.trialDays > 0 && (
                <div>
                  <p className="text-gray-700">
                    Trial:{" "}
                    <span className="font-medium">
                      {activeSubscription.trialDays} days
                    </span>
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-700">
                  Next Billing:{" "}
                  <span className="font-medium">
                    {new Date(
                      activeSubscription.currentPeriodEnd,
                    ).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Subscription Info */}
        {!activeSubscription && isAuthenticated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-1">
              Current Plan: Free Starter
            </h2>
            <p className="text-gray-700">
              You're currently on the free Starter plan. Upgrade anytime to
              unlock more features!
            </p>
          </div>
        )}

        {/* Pricing Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">PRICING</h1>
            <p className="text-gray-600">
              Start with our free plan or upgrade for more features. Real-time
              subscription management.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="bg-gray-200 rounded-full p-1 inline-flex mt-4 md:mt-0">
            <button
              className={`${billingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-gray-700"} px-6 py-2 rounded-full font-medium transition-colors`}
              onClick={() => handleBillingCycleChange("monthly")}
            >
              Monthly
            </button>
            <button
              className={`${billingCycle === "yearly" ? "bg-indigo-600 text-white" : "text-gray-700"} px-6 py-2 rounded-full font-medium transition-colors`}
              onClick={() => handleBillingCycleChange("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg p-8 shadow-sm relative ${
                plan.popular ? "border-2 border-indigo-600" : ""
              } ${plan.id === "starter" ? "border-2 border-green-400" : ""} ${
                currentPlan.id === plan.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
                  Most Picked
                </div>
              )}

              {plan.id === "starter" && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-green-600 text-white px-6 py-2 rounded-lg font-medium">
                  Free Forever
                </div>
              )}

              {currentPlan.id === plan.id && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">
                  Current Plan
                </div>
              )}

              <div className="absolute top-8 right-8 bg-indigo-100 p-3 rounded-full">
                {plan.id === "starter" ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 10V3L4 14H11V21L20 10H13Z"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 16.5C3.12 15.78 2.25 14.28 2.25 12.75C2.25 10.41 4.14 8.52 6.48 8.52C6.71 8.52 6.94 8.54 7.17 8.59C7.35 8.63 7.53 8.52 7.59 8.34C8.19 6.45 9.9 5.02 12 5.02C14.1 5.02 15.81 6.45 16.41 8.34C16.47 8.52 16.65 8.63 16.83 8.59C17.06 8.55 17.29 8.52 17.52 8.52C19.86 8.52 21.75 10.41 21.75 12.75C21.75 14.28 20.88 15.78 19.5 16.5"
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 16.5V18.75C7.5 19.58 8.17 20.25 9 20.25H15C15.83 20.25 16.5 19.58 16.5 18.75V16.5"
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16.5V11.25"
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.75 13.5L12 11.25L14.25 13.5"
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-2 mt-4">{plan.name}</h2>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  {plan.price === 0
                    ? "forever"
                    : billingCycle === "yearly"
                      ? "per year"
                      : "per month"}
                </span>
              </div>

              {billingCycle === "yearly" &&
                plan.yearlyPrice < plan.monthlyPrice * 12 &&
                plan.price > 0 && (
                  <p className="text-green-600 text-sm font-medium">
                    Save{" "}
                    {formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)}{" "}
                    annually
                  </p>
                )}

              <div className="border-t border-gray-100 my-4"></div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full ${
                  currentPlan.id === plan.id
                    ? "bg-blue-100 text-blue-700 cursor-default"
                    : !isAuthenticated
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : plan.id === "starter"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                } py-3 px-4 rounded-lg font-medium transition-colors`}
                onClick={() => handlePlanSelect(plan.id)}
                disabled={
                  currentPlan.id === plan.id || isProcessing || !isAuthenticated
                }
              >
                {currentPlan.id === plan.id
                  ? "Current Plan"
                  : !isAuthenticated
                    ? "Authentication Required"
                    : isProcessing
                      ? "Processing..."
                      : plan.id === "starter"
                        ? "Start Free"
                        : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">
                How does real-time billing work?
              </h3>
              <p className="text-gray-600">
                Changes take effect immediately. Free plan has no billing. Paid
                plans are processed through Shopify's secure billing system.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade, downgrade, or switch to the free plan at
                any time. Changes are instant.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">
                What happens when I upgrade?
              </h3>
              <p className="text-gray-600">
                You'll be redirected to Shopify to confirm billing. Once
                confirmed, your new features are available immediately.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">How do I cancel?</h3>
              <p className="text-gray-600">
                Simply switch to the free Starter plan anytime. Your
                subscription will be cancelled automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Plan Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to switch to the{" "}
              {availablePlans.find((p) => p.id === selectedPlanId)?.name} plan
              {selectedPlanId !== "starter" && ` with ${billingCycle} billing`}?
              {selectedPlanId === "starter" ? (
                <span className="block mt-2 text-sm text-green-600">
                  ✅ This will switch you to the free plan. No billing required.
                </span>
              ) : (
                <span className="block mt-2 text-sm text-gray-500">
                  💳 You will be redirected to Shopify to complete the billing
                  setup.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={confirmPlanChange}
                className={`px-4 py-2 ${
                  selectedPlanId === "starter"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-md transition-colors relative`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="opacity-0">Confirm</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
