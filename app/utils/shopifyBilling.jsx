// Format price for display
export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

// Create a subscription in Shopify
export const createSubscription = async (
  planId,
  billingCycle,
  discountCode,
  returnUrl,
) => {
  // This would be replaced with actual Shopify API calls in production
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful subscription creation
      localStorage.setItem("subscriptionPlan", planId);
      localStorage.setItem("subscriptionBillingCycle", billingCycle);
      resolve({ confirmationUrl: "/campaigns" });
    }, 500);
  });
};

// Get current subscription from Shopify
export const getCurrentSubscription = async () => {
  // This would be replaced with actual Shopify API calls in production
  return new Promise((resolve) => {
    setTimeout(() => {
      const planId = localStorage.getItem("subscriptionPlan");
      const billingCycle = localStorage.getItem("subscriptionBillingCycle");

      if (planId) {
        // Create a mock subscription object
        resolve({
          planId: planId,
          billingCycle: billingCycle || "monthly",
          status: "ACTIVE",
          currency: "USD",
          currentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });
      } else {
        resolve(null);
      }
    }, 500);
  });
};
