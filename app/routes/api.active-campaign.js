import { json } from "@remix-run/node";
import { getActiveCampaign } from "../models/Subscription.server";

export async function loader({ request }) {
  try {
    // Get shop name from query parameters
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      return json({ error: "Shop parameter is required" }, { status: 400 });
    }

    // Set CORS headers to allow requests from any origin
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS request for CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers,
      });
    }

    // Get active campaign from MongoDB
    const activeCampaign = await getActiveCampaign(shop);

    if (!activeCampaign) {
      return json(
        { error: "No active campaign found" },
        { status: 404, headers },
      );
    }

    // Return the active campaign data
    return json(activeCampaign, { headers });
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return json({ error: "Failed to fetch active campaign" }, { status: 500 });
  }
}
