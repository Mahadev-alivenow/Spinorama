"use client";

export default function StepSidebar({ activeStep, onStepClick }) {
  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex-col items-center p-4 rounded-lg mb-2 ${
          activeStep === 2
            ? "bg-indigo-800"
            : "hover:bg-indigo-600 cursor-pointer"
        }`}
        onClick={() => onStepClick && onStepClick(2)}
      >
        <div className="w-8 h-8 flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        </div>
        <span className="font-medium">Layout</span>
      </div>

      <div
        className={`flex-col items-center p-4 rounded-lg mb-2 ${
          activeStep === 3
            ? "bg-indigo-800"
            : "hover:bg-indigo-600 cursor-pointer opacity-70"
        }`}
        onClick={() => onStepClick && onStepClick(3)}
      >
        <div className="w-8 h-8 flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <span className="font-medium">Content</span>
      </div>

      <div
        className={`flex-col items-center p-4 rounded-lg ${
          activeStep === 4
            ? "bg-indigo-800"
            : "hover:bg-indigo-600 cursor-pointer opacity-70"
        }`}
        onClick={() => onStepClick && onStepClick(4)}
      >
        <div className="w-8 h-8 flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        <span className="font-medium">Campaign rules</span>
      </div>
    </div>
  );
}
