"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create a context for plan data
const PlanContext = createContext(null);

// Define plan details
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
      "20 Campaign",
    ],
    popular: false,
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
      "Conversion Booster",
    ],
    popular: true,
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
      "Custom Branding",
    ],
    popular: false,
  },
};

// Plan provider component
export function PlanProvider({ children, initialDiscountCodes = [] }) {
  const [discountCodes, setDiscountCodes] = useState(() => {
    // Try to get from localStorage first (most reliable)
    if (typeof window !== "undefined") {
      try {
        const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
        if (storedCodes) {
          const parsedCodes = JSON.parse(storedCodes);
          if (parsedCodes && parsedCodes.length > 0) {
            console.log(
              "PlanProvider - Using localStorage discount codes:",
              parsedCodes.length,
            );
            return parsedCodes;
          }
        }
      } catch (e) {
        console.error("Error parsing stored discount codes:", e);
      }
    }

    // Then try global window object
    if (
      typeof window !== "undefined" &&
      window.GLOBAL_DISCOUNT_CODES &&
      window.GLOBAL_DISCOUNT_CODES.length > 0
    ) {
      console.log(
        "PlanProvider - Using global discount codes:",
        window.GLOBAL_DISCOUNT_CODES.length,
      );
      return window.GLOBAL_DISCOUNT_CODES;
    }

    // Finally use initial props
    console.log(
      "PlanProvider - Using initial discount codes:",
      initialDiscountCodes,
    );
    return initialDiscountCodes;
  });

  console.log("PlanProvider initialized with discount codes:", discountCodes);

  // Update discount codes when initialDiscountCodes changes or when global codes are available
  useEffect(() => {
    // Don't overwrite existing codes with empty arrays
    if (discountCodes.length === 0) {
      if (typeof window !== "undefined") {
        // Try localStorage first
        try {
          const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
          if (storedCodes) {
            const parsedCodes = JSON.parse(storedCodes);
            if (parsedCodes && parsedCodes.length > 0) {
              console.log(
                "PlanProvider - Updating from localStorage:",
                parsedCodes.length,
              );
              setDiscountCodes(parsedCodes);
              return;
            }
          }
        } catch (e) {
          console.error("Error parsing stored discount codes:", e);
        }

        // Then try global window object
        if (
          window.GLOBAL_DISCOUNT_CODES &&
          window.GLOBAL_DISCOUNT_CODES.length > 0
        ) {
          console.log(
            "PlanProvider - Updating from global:",
            window.GLOBAL_DISCOUNT_CODES.length,
          );
          setDiscountCodes(window.GLOBAL_DISCOUNT_CODES);
          return;
        }
      }

      // Finally use initial props if they're not empty
      if (initialDiscountCodes && initialDiscountCodes.length > 0) {
        console.log(
          "PlanProvider - Updating from initial props:",
          initialDiscountCodes.length,
        );
        setDiscountCodes(initialDiscountCodes);
      }
    }
  }, [initialDiscountCodes, discountCodes.length]);

  // Function to fetch discount codes from API and update global state
  const fetchAndSetDiscountCodes = async () => {
    try {
      console.log("PlanProvider - Fetching discount codes from API...");
      const response = await fetch("/api/discount-codes");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch discount codes: ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.success && data.codes && data.codes.length > 0) {
        console.log("PlanProvider - Successfully fetched codes:", data.codes);
        setDiscountCodes(data.codes);

        // Update global window object and localStorage
        if (typeof window !== "undefined") {
          window.GLOBAL_DISCOUNT_CODES = data.codes;
          try {
            localStorage.setItem(
              "GLOBAL_DISCOUNT_CODES",
              JSON.stringify(data.codes),
            );
          } catch (e) {
            console.error("Failed to store discount codes in localStorage:", e);
          }
        }

        return data.codes;
      } else {
        // If API returns empty, try to use existing codes
        if (discountCodes.length > 0) {
          console.log(
            "PlanProvider - API returned no codes, using existing codes:",
            discountCodes.length,
          );
          return discountCodes;
        }

        throw new Error(data.error || "No discount codes available");
      }
    } catch (error) {
      console.error("PlanProvider - Error fetching discount codes:", error);

      // If fetch fails, try to use existing codes
      if (discountCodes.length > 0) {
        console.log(
          "PlanProvider - Fetch failed, using existing codes:",
          discountCodes.length,
        );
        return discountCodes;
      }

      throw error;
    }
  };

  // Initialize current plan and billing cycle from localStorage or default values
  const [currentPlan, setCurrentPlan] = useState(() => {
    // Try to get the plan from localStorage on initial load
    if (typeof window !== "undefined") {
      const storedPlan = localStorage.getItem("currentPlan");
      return storedPlan ? JSON.parse(storedPlan) : PLANS.starter;
    }
    return PLANS.starter;
  });

  const [billingCycle, setBillingCycle] = useState(() => {
    // Try to get the billing cycle from localStorage on initial load
    if (typeof window !== "undefined") {
      const storedCycle = localStorage.getItem("billingCycle");
      return storedCycle || "monthly";
    }
    return "monthly";
  });

  // Update localStorage when plan changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPlan", JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  // Update localStorage when billing cycle changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("billingCycle", billingCycle);
    }
  }, [billingCycle]);

  // Change the current plan
  const changePlan = (planId) => {
    if (PLANS[planId]) {
      setCurrentPlan(PLANS[planId]);
      return true;
    }
    return false;
  };

  // Change the billing cycle
  const changeBillingCycle = (cycle) => {
    if (cycle === "monthly" || cycle === "yearly") {
      setBillingCycle(cycle);
      return true;
    }
    return false;
  };

  // Get all available plans
  const getPlans = () => {
    return Object.values(PLANS);
  };

  // Check if user can create more campaigns
  const canCreateCampaign = (campaignCount) => {
    return campaignCount < currentPlan.campaignLimit;
  };

  return (
    <PlanContext.Provider
      value={{
        currentPlan,
        billingCycle,
        changePlan,
        changeBillingCycle,
        getPlans,
        canCreateCampaign,
        discountCodes, // <-- expose discount codes globally
        setDiscountCodes, // <-- allow setting discount codes
        fetchAndSetDiscountCodes, // <-- method to fetch codes
        PLANS,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

// Custom hook to use plan context
export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
