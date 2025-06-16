import { json } from "@remix-run/node";
import { getActiveCampaign } from "../models/Subscription.server";

export async function loader({ request, context }) {
  try {
    // Get shop name from query parameters
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      return json({ error: "Shop parameter is required" }, { status: 400 });
    }

    // Get active campaign from MongoDB
    const activeCampaign = await getActiveCampaign(shop);

    if (!activeCampaign) {
      return json({ error: "No active campaign found" }, { status: 404 });
    }

    // Return the active campaign data
    return json(activeCampaign);
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return json({ error: "Failed to fetch active campaign" }, { status: 500 });
  }
}
