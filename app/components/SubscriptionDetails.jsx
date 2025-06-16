"use client";

import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { cancelSubscription, formatPrice } from "../utils/shopifyBilling";
import { useToast } from "../hooks/useToast";
import ConfirmationModal from "./ConformationModal";


export default function SubscriptionDetails({ subscription }) {
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isFree, setIsFree] = useState(subscription.price === 0);

  // Use toast
  const { toast } = useToast();

  // Add state for the confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Replace the handleCancelSubscription function with a version that uses a custom modal
  const handleCancelSubscription = async () => {
    // Show the confirmation modal instead of using window.confirm
    setShowConfirmModal(true);
  };

  const handleConfirmCancellation = async () => {
    setShowConfirmModal(false);
    setIsCancelling(true);
    setError(null);
    setSuccess(null);

    try {
      await cancelSubscription();
      setSuccess("Your subscription has been cancelled successfully.");

      // Show toast notification
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
        variant: "destructive",
      });

      // Reload the page after a short delay
      setTimeout(() => {
        navigate("/pricing");
      }, 2000);
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setError("Failed to cancel subscription. Please try again.");

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Your Current Subscription</h2>

      {/* Success message */}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Plan</p>
          <p className="font-medium">{subscription.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Billing Cycle</p>
          <p className="font-medium capitalize">
            {isFree ? "Free" : subscription.billingCycle}
          </p>
        </div>
        {!isFree && (
          <div>
            <p className="text-sm text-gray-500">Next Billing Date</p>
            <p className="font-medium">
              {subscription.currentPeriodEnd === "N/A"
                ? "N/A"
                : new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="font-medium">
            {formatPrice(subscription.price)} {subscription.currency}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium">
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                subscription.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {subscription.status}
            </span>
          </p>
        </div>
        {!isFree && subscription.trialDays > 0 && (
          <div>
            <p className="text-sm text-gray-500">Trial Period</p>
            <p className="font-medium">{subscription.trialDays} days</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {!isFree && (
          <Link
            to="/billing/history"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Billing History
          </Link>
        )}
        <button
          onClick={handleCancelSubscription}
          disabled={isCancelling}
          className="border border-red-500 text-red-500 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors relative"
        >
          {isCancelling ? (
            <>
              <span className="opacity-0">Cancelling...</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-red-500"
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
            "Cancel Subscription"
          )}
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? This action cannot be undone."
        confirmText="Yes, Cancel Subscription"
        cancelText="No, Keep Subscription"
        onConfirm={handleConfirmCancellation}
        confirmButtonClass="bg-red-600 text-white"
      />
    </div>
  );
}
