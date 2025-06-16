import { json } from "@remix-run/node";
// import { createCampaignLayoutMetafields } from "../../models/Subscription.server";

import { authenticate } from "../shopify.server";
import { createCampaignLayoutMetafields } from "../models/Subscription.server";

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);

  try {
    // Get the shop name from the session
    const shopName = session.shop;

    // Update campaign metafields
    const result = await createCampaignLayoutMetafields(
      admin.graphql,
      shopName,
    );

    if (!result) {
      return json(
        { success: false, message: "No active campaign found" },
        { status: 404 },
      );
    }

    return json({
      success: true,
      message: "Campaign metafields updated successfully",
    });
  } catch (error) {
    console.error("Error updating campaign metafields:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function loader() {
  return json({ message: "Use POST to update campaign metafields" });
}
