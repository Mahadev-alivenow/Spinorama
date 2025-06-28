// If you want a simple test route for syncing
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import {
  getActiveCampaign,
  syncActiveCampaignToMetafields,
} from "../models/Subscription.server";

export const loader = async ({ request }) => {
  try {
    // Step 1: Authenticate to get shop and GraphQL client
    const { admin, session } = await authenticate.admin(request);
    const shopName = session.shop;
    const graphql = admin.graphql;

    console.log("Test - Authenticated with shop:", shopName);

    // Step 2: Get active campaign (pass shopName as parameter)
    const activeCampaign = await getActiveCampaign(shopName);
    console.log("Test - Active campaign:", activeCampaign);

    // Step 3: Sync metafields (pass graphql and shopName as parameters)
    if (activeCampaign) {
      const syncResult = await syncActiveCampaignToMetafields(
        graphql,
        shopName,
      );
      console.log("Test - Sync result:", syncResult);

      return json({
        success: true,
        message: "Sync completed",
        activeCampaign: activeCampaign,
        syncResult: syncResult,
      });
    } else {
      return json({
        success: false,
        message: "No active campaign found",
        shopName: shopName,
      });
    }
  } catch (error) {
    console.error("Test - Error:", error);

    return json({
      success: false,
      error: error.message,
    });
  }
};

export default function TestSync() {
  return (
    <div>
      <h1>Test Sync Route</h1>
      <p>Check the console for sync results</p>
    </div>
  );
}
