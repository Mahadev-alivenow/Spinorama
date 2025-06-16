"use client";

import { useState, useEffect } from "react";

export default function DbStatusIndicator() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    checkDbStatus();
  }, []);

  const checkDbStatus = async () => {
    try {
      const response = await fetch("/api/debug-metafields");
      const data = await response.json();

      if (data.success) {
        const wheelOfWondersMetafields = data.metafields.filter(
          (metafield) => metafield.namespace === "wheel-of-wonders",
        );

        if (wheelOfWondersMetafields.length > 0) {
          setStatus("connected");
          setMessage("Metafields are set up correctly");
        } else {
          setStatus("warning");
          setMessage("Connected, but campaign metafields are not set up");
        }
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to check database status");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to check database status");
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center cursor-pointer"
        onMouseEnter={() => setShowMessage(true)}
        onMouseLeave={() => setShowMessage(false)}
      >
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></div>
        <span className="text-sm">
          {status === "connected"
            ? "Connected"
            : status === "warning"
              ? "Warning"
              : status === "error"
                ? "Error"
                : "Checking..."}
        </span>
      </div>

      {showMessage && message && (
        <div className="absolute right-0 mt-1 w-64 p-2 bg-white shadow-lg rounded-md text-xs z-10">
          {message}
        </div>
      )}
    </div>
  );
}
