"use client";

import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import {
  getCurrentSubscription,
  cancelSubscription,
} from "../utils/pricingStore";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Load current subscription if any
    const currentSubscription = getCurrentSubscription();
    setSubscription(currentSubscription);
  }, []);

  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      cancelSubscription();
      setSubscription(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center text-white font-bold">
          U
        </div>
        <span className="hidden md:inline-block">User</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10">
          <div className="p-4 border-b">
            <p className="font-medium">User Account</p>
            <p className="text-sm text-gray-500">user@example.com</p>
          </div>

          {subscription ? (
            <div className="p-4 border-b">
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-sm text-gray-700 capitalize">
                {subscription.name} ({subscription.billingCycle})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Next billing:{" "}
                {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>
              <Link
                to="/pricing"
                className="text-[#4F46E5] text-sm hover:underline mt-2 inline-block"
              >
                Manage Subscription
              </Link>
            </div>
          ) : (
            <div className="p-4 border-b">
              <p className="text-sm font-medium">No Active Subscription</p>
              <Link
                to="/pricing"
                className="text-[#4F46E5] text-sm hover:underline mt-1 inline-block"
              >
                View Pricing Plans
              </Link>
            </div>
          )}

          <div className="p-4">
            <Link
              to="/settings"
              className="block py-2 text-sm text-gray-700 hover:bg-gray-100 rounded px-2"
            >
              Settings
            </Link>
            <Link
              to="/help"
              className="block py-2 text-sm text-gray-700 hover:bg-gray-100 rounded px-2"
            >
              Help & Support
            </Link>
            {subscription && (
              <button
                onClick={handleCancelSubscription}
                className="block w-full text-left py-2 text-sm text-red-600 hover:bg-gray-100 rounded px-2"
              >
                Cancel Subscription
              </button>
            )}
            <button className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-100 rounded px-2">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
