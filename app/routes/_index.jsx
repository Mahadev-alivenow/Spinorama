import { Link } from "@remix-run/react";
import { useCampaign } from "../context/CampaignContext";
import Navigation from "../components/Navigation";
import { authenticate } from "../shopify.server";
import { redirect } from "@remix-run/node";

// export async function loader({ request }) {
//   try {
//     // This ensures that if a user is already authenticated, they're redirected to the app
//     // If not, they'll be redirected to the auth flow
//     const { admin, session } = await authenticate.admin(request);

//     if (session?.shop) {
//       console.log("Index loader - authenticated, redirecting to app");
//       return redirect("/app");
//     }
//   } catch (error) {
//     console.log("Index loader - auth failed:", error);

//     // Check if this is a client-side navigation
//     const isClientNavigation =
//       request.headers.get("purpose") === "prefetch" ||
//       request.headers.get("sec-fetch-dest") === "empty";

//     // For client navigation, try to redirect to app anyway
//     if (isClientNavigation) {
//       return redirect("/app");
//     }

//     // For direct navigation, let the auth flow handle it
//     if (error && error.status === 302) {
//       throw error;
//     }
//   }

//   return redirect("/app");
// }

export default function Index() {
  const { userPlan, allCampaigns } = useCampaign();

  return (
    <div className="container mx-auto px-4 py-6">
      <Navigation />

      <div className="mt-16 text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Shopify Campaign Creator
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create engaging campaigns for your Shopify store
        </p>

        <div className="mb-8 inline-block bg-indigo-50 px-6 py-3 rounded-lg">
          <p className="text-indigo-800">
            <span className="font-medium">Current Plan:</span>{" "}
            {userPlan.name.charAt(0).toUpperCase() + userPlan.name.slice(1)}
            <span className="mx-2">•</span>
            <span className="font-medium">
              {allCampaigns.length}/{userPlan.campaignLimit}
            </span>{" "}
            campaigns used
          </p>
        </div>

        <Link
          to="/campaigns/create"
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors"
        >
          Create Your First Campaign
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Create Campaigns</h2>
          <p className="text-gray-600">
            Design custom campaigns with our easy-to-use builder
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Track Performance</h2>
          <p className="text-gray-600">
            Monitor campaign performance with detailed analytics
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Boost Sales</h2>
          <p className="text-gray-600">
            Increase conversion rates and drive more sales
          </p>
        </div>
      </div>
    </div>
  );
}
