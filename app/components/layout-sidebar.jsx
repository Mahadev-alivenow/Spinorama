"use client";

import PropTypes from "prop-types";
import { useNavigate } from "@remix-run/react";

function LayoutSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Navigate to the appropriate route based on the selected tab
    if (tab === "layout") {
      navigate("/create-campaign");
    } else if (tab === "content") {
      navigate("/create-campaign/content");
    } else if (tab === "rules") {
      navigate("/create-campaign/rules");
    }
  };

  return (
    <div className="w-24 bg-indigo-700 text-white min-h-[calc(100vh-200px)] mr-8 rounded-lg">
      <div className="flex flex-col items-center py-6 space-y-12">
        <div
          className={`flex flex-col items-center cursor-pointer ${activeTab === "layout" ? "text-white" : "text-indigo-300"}`}
          onClick={() => handleTabChange("layout")}
        >
          <div
            className={`w-12 h-12 ${activeTab === "layout" ? "bg-white" : "bg-indigo-600"} rounded-lg flex items-center justify-center mb-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${activeTab === "layout" ? "text-indigo-700" : "text-white"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Layout</span>
        </div>

        <div
          className={`flex flex-col items-center cursor-pointer ${activeTab === "content" ? "text-white" : "text-indigo-300"}`}
          onClick={() => handleTabChange("content")}
        >
          <div
            className={`w-12 h-12 ${activeTab === "content" ? "bg-white" : "bg-indigo-600"} rounded-lg flex items-center justify-center mb-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${activeTab === "content" ? "text-indigo-700" : "text-white"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Content</span>
        </div>

        <div
          className={`flex flex-col items-center cursor-pointer ${activeTab === "rules" ? "text-white" : "text-indigo-300"}`}
          onClick={() => handleTabChange("rules")}
        >
          <div
            className={`w-12 h-12 ${activeTab === "rules" ? "bg-white" : "bg-indigo-600"} rounded-lg flex items-center justify-center mb-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${activeTab === "rules" ? "text-indigo-700" : "text-white"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Campaign rules</span>
        </div>
      </div>
    </div>
  );
}

LayoutSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default LayoutSidebar;
