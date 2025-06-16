"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "@remix-run/react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  billingCycle: string;
  onSuccess: (transactionId: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  price,
  billingCycle,
  onSuccess,
}: PaymentModalProps) {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    // Validate form
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError("All fields are required");
      setIsProcessing(false);
      return;
    }

    // Enhanced card number validation - remove spaces and check length
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      setError("Invalid card number. Please enter a 16-digit number.");
      setIsProcessing(false);
      return;
    }

    // Validate expiry date format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError("Invalid expiry date. Please use MM/YY format.");
      setIsProcessing(false);
      return;
    }

    // Validate CVV (3 or 4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("Invalid CVV. Please enter 3 or 4 digits.");
      setIsProcessing(false);
      return;
    }

    // Test card validation - simulate declined for specific test numbers
    if (cleanCardNumber === "4111111111111111") {
      // This is a common test card number - simulate a decline
      setTimeout(() => {
        setIsProcessing(false);
        setError("Payment declined. Please try a different card.");
      }, 2000);
      return;
    }

    // Simulate payment processing for valid cards
    setTimeout(() => {
      setIsProcessing(false);

      // Generate a mock transaction ID
      const transactionId = `tx_${Date.now()}`;

      // Call the success callback
      onSuccess(transactionId);

      // Close the modal
      onClose();

      // Redirect to confirmation page
      navigate(`/billing/confirm?charge_id=${transactionId}`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Your Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Plan</p>
            <p className="font-medium">{planName}</p>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-600">Billing</p>
              <p className="font-medium capitalize">{billingCycle}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium">${price.toFixed(2)} USD</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Card Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4F46E5] text-white py-3 rounded-lg font-medium disabled:opacity-70"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing...
              </div>
            ) : (
              `Pay $${price.toFixed(2)}`
            )}
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              This is a demo payment form. No real payments will be processed.
            </p>
            <p className="mt-1">
              Use any valid-looking credit card information.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
