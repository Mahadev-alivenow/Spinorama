import { json } from "@remix-run/node";
import { getActiveCampaign } from "../models/Subscription.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  try {
    // Get the shop name from the session
    const shopName = session.shop;
    console.log("Testing DB connection for shop:", shopName);

    // Get active campaign
    const activeCampaign = await getActiveCampaign(shopName);

    if (!activeCampaign) {
      return json({
        success: false,
        message: "No active campaign found",
        dbConnected: true,
      });
    }

    // Return basic campaign info
    return json({
      success: true,
      dbConnected: true,
      campaign: {
        id: activeCampaign.id,
        name: activeCampaign.name,
        status: activeCampaign.status,
        layout: activeCampaign.layout || {},
        primaryColor: activeCampaign.primaryColor,
      },
    });
  } catch (error) {
    console.error("Error testing DB connection:", error);
    return json(
      {
        success: false,
        dbConnected: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
