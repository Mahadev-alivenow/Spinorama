import { Link, useLocation } from "@remix-run/react";

export default function Navigation({ createButtonText = "Create Campaign" }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex justify-between mb-8">
      <div className="bg-gray-100 rounded-lg shadow-sm p-1 flex items-center flex-1 mr-4">
        <Link
          to="/index"
          className={`${
            currentPath === "/app" || currentPath === "/app"
              ? "bg-indigo-600 text-white"
              : "text-gray-700"
          } px-8 py-3 rounded-lg font-medium text-center flex-1`}
        >
          Home
        </Link>
        <Link
          to="/campaigns"
          className={`${
            currentPath.startsWith("/campaigns")
              ? "bg-indigo-600 text-white"
              : "text-gray-700"
          } px-8 py-3 rounded-lg font-medium text-center flex-1`}
        >
          All Campaigns
        </Link>
        {/* <Link
          to="/pricing"
          className={`${
            currentPath === "/pricing"
              ? "bg-indigo-600 text-white"
              : "text-gray-700"
          } px-8 py-3 rounded-lg font-medium text-center flex-1`}
        >
          Pricing
        </Link> */}
        <Link
          to="/tutorial"
          className={`${
            currentPath === "/tutorial"
              ? "bg-indigo-600 text-white"
              : "text-gray-700"
          } px-8 py-3 rounded-lg font-medium text-center flex-1`}
        >
          Tutorial
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to={
            currentPath.includes("/campaigns/create")
              ? "/campaigns"
              : "/campaigns/create"
          }
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap"
        >
          {createButtonText}
        </Link>
      </div>
    </div>
  );
}
