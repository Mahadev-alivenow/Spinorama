import { json } from "@remix-run/node";

import { connectToDatabase } from "../../lib/mongodb.server";

export async function loader({ request }) {
  try {
    // Get campaign ID and shop name from query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const shop = url.searchParams.get("shop");

    if (!id) {
      return json(
        { error: "Campaign ID parameter is required" },
        { status: 400 },
      );
    }

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

    // Connect to MongoDB
    const { db } = await connectToDatabase(shop);
    const campaignsCollection = db.collection("campaigns");

    // Find the campaign by ID
    const campaign = await campaignsCollection.findOne({ id: id });

    if (!campaign) {
      return json({ error: "Campaign not found" }, { status: 404, headers });
    }

    // Return the full campaign data
    return json(campaign, { headers });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}
