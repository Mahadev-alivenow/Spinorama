import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

export default function PreviewPanel({ children, mode = "landing" }) {
  const [viewMode, setViewMode] = useState("desktop");

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">Preview</h3>
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("desktop")}
            className={`p-2 rounded-lg ${
              viewMode === "desktop"
                ? "bg-white shadow-sm"
                : "text-gray-600"
            }`}
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`p-2 rounded-lg ${
              viewMode === "mobile"
                ? "bg-white shadow-sm"
                : "text-gray-600"
            }`}
          >
            <Smartphone size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center overflow-auto">
        {viewMode === "desktop" ? (
          <div className="desktop-preview">
            <div className="desktop-preview-header">
              <div className="desktop-preview-circle desktop-preview-red"></div>
              <div className="desktop-preview-circle desktop-preview-yellow"></div>
              <div className="desktop-preview-circle desktop-preview-green"></div>
            </div>
            <div className="p-4 h-[calc(100%-36px)] overflow-auto">
              {children}
            </div>
          </div>
        ) : (
          <div className="mobile-preview">
            <div className="h-full overflow-auto">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}