import { useState } from "react";
import { Link, useLocation, useParams } from "@remix-run/react";

export default function Footer({ campaignName = "My Campaign", progress = 0 }) {
  const location = useLocation();
  const { id } = useParams();
  const currentPath = location.pathname;
  const pathParts = currentPath.split('/');
  const currentStep = pathParts[pathParts.length - 1];
  
  // Get next and previous steps
  const steps = ["theme", "configure", "landing", "wheel", "results", "button", "rules", "launch"];
  const currentIndex = steps.indexOf(currentStep);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  return (
    <footer className="border-t border-gray-200 bg-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-gray-700">
          <span className="font-medium">{campaignName}</span>
        </div>
        
        <div className="w-1/3">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{progress}% complete</div>
        </div>
        
        <div className="flex space-x-4">
          {prevStep && (
            <Link
              to={`/campaigns/${id}/${prevStep}`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </Link>
          )}
          
          {nextStep && (
            <Link
              to={`/campaigns/${id}/${nextStep}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Continue
            </Link>
          )}
          
          {currentStep === "launch" && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Launch Campaign
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}