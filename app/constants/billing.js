// Billing plan constants that can be shared between client and server
export const BILLING_PLANS = {
  MONTHLY: "Monthly Plan",
  ANNUAL: "Annual Plan",
};

// Plan configurations
export const PLAN_CONFIGS = {
  starter: {
    id: "starter",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    campaignLimit: 1,
    features: [
      "1 Active Campaign",
      "Basic Wheel Customization",
      "Email Collection",
      "Basic Analytics",
    ],
  },
  lite: {
    id: "lite",
    name: "Lite",
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    campaignLimit: 5,
    popular: true,
    features: [
      "5 Active Campaigns",
      "Advanced Wheel Customization",
      "Email Collection & Export",
      "Advanced Analytics",
      "Custom Branding",
      "Priority Support",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    monthlyPrice: 12.99,
    yearlyPrice: 119.99,
    campaignLimit: -1, // Unlimited
    features: [
      "Unlimited Campaigns",
      "Full Customization",
      "Advanced Integrations",
      "A/B Testing",
      "White Label Solution",
      "Dedicated Support",
    ],
  },
};
