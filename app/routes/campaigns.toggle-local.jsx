import { json } from "@remix-run/node";
import { connectToDatabase } from "../models/Subscription.server";

export async function action({ request }) {
  console.log("=== Local Campaign Toggle Route Called ===");

  try {
    // Get form data
    const formData = await request.formData();
    const campaignId = formData.get("campaignId");
    const action = formData.get("action");
    const shopName =
      formData.get("shopName") || "wheel-of-wonders.myshopify.com";

    console.log(
      "Campaign ID:",
      campaignId,
      "Action:",
      action,
      "Shop:",
      shopName,
    );

    if (!campaignId) {
      return json(
        { success: false, error: "Campaign ID is required" },
        { status: 400 },
      );
    }

    // Connect to database and update campaign status
    const { db } = await connectToDatabase(shopName);

    // Get the campaign
    const campaign = await db
      .collection("campaigns")
      .findOne({ id: campaignId });
    if (!campaign) {
      return json(
        { success: false, error: "Campaign not found" },
        { status: 404 },
      );
    }

    const newStatus = action === "activate" ? "active" : "draft";

    // If activating, deactivate all other campaigns first
    if (newStatus === "active") {
      await db
        .collection("campaigns")
        .updateMany(
          { id: { $ne: campaignId }, status: "active" },
          { $set: { status: "draft" } },
        );
      console.log("Deactivated other active campaigns");
    }

    // Update the target campaign
    await db
      .collection("campaigns")
      .updateOne({ id: campaignId }, { $set: { status: newStatus } });
    console.log(`Campaign ${campaignId} status updated to ${newStatus}`);

    // For now, skip metafields sync since authentication is not working
    const message =
      newStatus === "active"
        ? "Campaign activated successfully! (Storefront sync will be available once authentication is fixed)"
        : "Campaign deactivated successfully!";

    return json({
      success: true,
      message: message,
      status: newStatus,
      campaignId: campaignId,
      authWarning: true,
    });
  } catch (error) {
    console.error("Local campaign toggle error:", error);
    return json(
      {
        success: false,
        error: `Failed to toggle campaign: ${error.message}`,
      },
      { status: 500 },
    );
  }
}
