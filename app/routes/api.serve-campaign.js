import { json } from "@remix-run/node";
import { connectToDatabase, getShopName } from "../../lib/mongodb.server";

export async function loader({ request }) {
  try {
    // Get shop name from various sources
    let shopName = null;
    try {
      const url = new URL(request.url);
      shopName =
        url.searchParams.get("shop") ||
        request.headers.get("x-shopify-shop-domain") ||
        getShopName() ||
        "wheel-of-wonders.myshopify.com";
    } catch (error) {
      console.error("Error getting shop name:", error);
      return json({ error: "Invalid shop name" }, { status: 400 });
    }

    // Get visitor information from query parameters
    const url = new URL(request.url);
    const visitorId = url.searchParams.get("visitorId") || "anonymous";
    const currentUrl = url.searchParams.get("currentUrl") || "";
    const isNewVisitor = url.searchParams.get("isNewVisitor") === "true";
    const pageCount = Number.parseInt(
      url.searchParams.get("pageCount") || "1",
      10,
    );
    const deviceType = url.searchParams.get("deviceType") || "desktop";

    // Connect to the database
    const { db } = await connectToDatabase(shopName);

    // Get all active campaigns for this shop
    const campaigns = await db
      .collection("campaigns")
      .find({
        shop: shopName,
        status: "active",
      })
      .toArray();

    if (!campaigns || campaigns.length === 0) {
      return json({
        success: false,
        message: "No active campaigns found",
        shop: shopName,
      });
    }

    console.log(
      `Found ${campaigns.length} active campaigns for shop: ${shopName}`,
    );

    // Since we've implemented the single active campaign feature,
    // there should only be one active campaign, but we'll still filter
    // to ensure we get the most appropriate one based on rules

    // Filter campaigns based on rules
    const eligibleCampaigns = campaigns.filter((campaign) => {
      // Check page targeting rules
      if (campaign.rules?.pageTargeting?.enabled) {
        const targetUrls = campaign.rules.pageTargeting.urls || [];
        if (
          targetUrls.length > 0 &&
          !targetUrls.some((url) => currentUrl.includes(url))
        ) {
          return false;
        }
      }

      // Check visitor type rules
      if (campaign.rules?.displayFrequency?.enabled) {
        const visitorType = campaign.rules.displayFrequency.visitorType;
        if (
          (visitorType === "new" && !isNewVisitor) ||
          (visitorType === "return" && isNewVisitor)
        ) {
          return false;
        }
      }

      return true;
    });

    if (eligibleCampaigns.length === 0) {
      return json({
        success: false,
        message: "No eligible campaigns found based on rules",
        shop: shopName,
      });
    }

    // Get the campaign to serve (should be only one active campaign)
    const campaignToServe = eligibleCampaigns[0];

    // Check if we've shown this campaign to this visitor recently
    const lastView = await db.collection("campaign_views").findOne({
      campaignId: campaignToServe.id,
      visitorId,
    });

    // Apply frequency rules
    if (lastView && campaignToServe.rules?.displayFrequency?.enabled) {
      const frequency = campaignToServe.rules.displayFrequency.frequency;
      const lastViewTime = new Date(lastView.timestamp);
      const now = new Date();

      // Check if we should show based on frequency
      if (frequency === "once_a_day") {
        const daysSinceLastView = (now - lastViewTime) / (1000 * 60 * 60 * 24);
        if (daysSinceLastView < 1) {
          return json({
            success: false,
            message: "Campaign already shown to this visitor today",
            shop: shopName,
          });
        }
      } else if (frequency === "once_a_session") {
        // For simplicity, we'll consider a session as the current browser session
        return json({
          success: false,
          message: "Campaign already shown to this visitor this session",
          shop: shopName,
        });
      }
    }

    // Record this view
    await db.collection("campaign_views").insertOne({
      campaignId: campaignToServe.id,
      visitorId,
      timestamp: new Date().toISOString(),
      url: currentUrl,
      shop: shopName,
    });

    // Return the campaign to display
    return json({
      success: true,
      campaign: campaignToServe,
      shop: shopName,
    });
  } catch (error) {
    console.error("Error serving campaign:", error);
    return json({ error: error.message }, { status: 500 });
  }
}

export default function ServeCampaignRoute() {
  // This component won't render anything since it's just an API route
  return null;
}
