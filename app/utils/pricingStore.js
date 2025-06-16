// Simple client-side store for pricing plans using localStorage
// In a real app, this would be replaced with a database or API

export const pricingPlans = {
  monthly: [
    {
      id: "starter",
      name: "Standard Pack",
      price: 0,
      features: ["Show on specific pages", "Up to 500 Spins/Month"],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
    {
      id: "lite",
      name: "Lite",
      price: 6.99,
      features: [
        "Upto 300 impressions",
        "Multiple campaigns",
        "Show on specific pages",
        "A/B testing",
        "Conversion Booster",
      ],
      popular: true,
      buttonText: "Get Started",
      buttonVariant: "primary",
    },
    {
      id: "premium",
      name: "Premium",
      price: 14.99,
      features: [
        "Upto 1000 impressions",
        "Multiple campaigns",
        "Show on specific pages",
        "A/B testing",
        "Conversion Booster",
        "Priority Support",
        "Advanced Analytics",
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
  ],
  yearly: [
    {
      id: "starter",
      name: "Standard Pack",
      price: 4.99,
      features: ["Show on specific pages", "Up to 500 Spins/Month"],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
    {
      id: "lite",
      name: "Lite",
      price: 69.99,
      pricePerMonth: 5.83,
      discount: "Save 16%",
      features: [
        "Upto 300 impressions",
        "Multiple campaigns",
        "Show on specific pages",
        "A/B testing",
        "Conversion Booster",
      ],
      popular: true,
      buttonText: "Get Started",
      buttonVariant: "primary",
    },
    {
      id: "premium",
      name: "Premium",
      price: 149.99,
      pricePerMonth: 12.5,
      discount: "Save 17%",
      features: [
        "Upto 1000 impressions",
        "Multiple campaigns",
        "Show on specific pages",
        "A/B testing",
        "Conversion Booster",
        "Priority Support",
        "Advanced Analytics",
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
  ],
};

export function getCurrentSubscription() {
  if (typeof window === "undefined") return null;

  try {
    const storedSubscription = localStorage.getItem("subscription");
    if (storedSubscription) {
      return JSON.parse(storedSubscription);
    }
  } catch (error) {
    console.error("Error loading subscription from localStorage:", error);
  }

  return null;
}

export function saveSubscription(planId, billingCycle) {
  if (typeof window === "undefined") return;

  try {
    const plans =
      billingCycle === "yearly" ? pricingPlans.yearly : pricingPlans.monthly;
    const selectedPlan = plans.find((plan) => plan.id === planId);

    if (selectedPlan) {
      const subscription = {
        planId,
        billingCycle,
        price: selectedPlan.price,
        name: selectedPlan.name,
        startDate: new Date().toISOString(),
        nextBillingDate: getNextBillingDate(billingCycle),
      };

      localStorage.setItem("subscription", JSON.stringify(subscription));
      return subscription;
    }
  } catch (error) {
    console.error("Error saving subscription to localStorage:", error);
  }

  return null;
}

function getNextBillingDate(billingCycle) {
  const date = new Date();
  if (billingCycle === "yearly") {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString();
}

export function cancelSubscription() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("subscription");
  } catch (error) {
    console.error("Error canceling subscription:", error);
  }
}
