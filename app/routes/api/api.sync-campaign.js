import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import {
  getActiveCampaign,
  createCampaignLayoutMetafields,
  createSubscriptionMetafield,
} from "../models/Subscription.server";

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);

  try {
    // Get the shop name from the session
    const shopName = session.shop;

    // Get active campaign
    const activeCampaign = await getActiveCampaign(shopName);

    if (!activeCampaign) {
      return json(
        { success: false, message: "No active campaign found" },
        { status: 404 },
      );
    }

    // Update metafields with campaign data
    await createCampaignLayoutMetafields(admin.graphql, shopName);

    // Also update the hasPlan metafield to ensure the button is shown
    await createSubscriptionMetafield(
      admin.graphql,
      "true",
      activeCampaign.layout?.floatingButtonPosition || "bottom-right",
    );

    return json({
      success: true,
      message: "Campaign synced successfully",
      campaign: {
        id: activeCampaign.id,
        name: activeCampaign.name,
        status: activeCampaign.status,
        layout: activeCampaign.layout,
      },
    });
  } catch (error) {
    console.error("Error syncing campaign:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function loader() {
  return json({ message: "Use POST to sync campaign" });
}
