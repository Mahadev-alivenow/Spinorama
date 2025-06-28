import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import {
  connectToDatabase,
  syncActiveCampaignToMetafields,
} from "../models/Subscription.server";

export async function action({ request }) {
  console.log("=== Campaign Toggle Route Called ===");

  try {
    // Authenticate first
    const { session, admin } = await authenticate.admin(request);
    const shopName = session.shop;
    const graphql = admin.graphql;
    console.log("Authentication successful for shop:", shopName);

    // Get form data
    const formData = await request.formData();
    const campaignId = formData.get("campaignId");
    const action = formData.get("action"); // "activate" or "deactivate"

    console.log("Campaign ID:", campaignId, "Action:", action);

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

    // Handle metafields sync
    if (newStatus === "active") {
      try {
        console.log("Syncing active campaign to metafields...");
        const syncResult = await syncActiveCampaignToMetafields(
          graphql,
          shopName,
        );

        if (syncResult && syncResult.success) {
          console.log("Sync successful");
          return json({
            success: true,
            message:
              "Campaign activated and synced to storefront successfully!",
            status: newStatus,
            campaignId: campaignId,
          });
        } else {
          console.log("Sync failed:", syncResult);
          return json({
            success: true,
            message:
              "Campaign activated but sync to storefront may take a moment.",
            status: newStatus,
            campaignId: campaignId,
            syncWarning: true,
          });
        }
      } catch (syncError) {
        console.error("Sync error:", syncError);
        return json({
          success: true,
          message:
            "Campaign activated but sync to storefront may take a moment.",
          status: newStatus,
          campaignId: campaignId,
          syncWarning: true,
        });
      }
    } else {
      // For deactivation, clear metafields
      try {
        console.log("Clearing metafields for deactivated campaign...");

        // Get app installation ID
        const appIdQuery = await graphql(`
          #graphql
          query {
            currentAppInstallation {
              id
            }
          }
        `);

        const appIdResult = await appIdQuery.json();
        if (appIdResult.data?.currentAppInstallation?.id) {
          const appInstallationID = appIdResult.data.currentAppInstallation.id;

          const clearMetafields = [
            {
              namespace: "wheel-of-wonders",
              key: "activeCampaignId",
              type: "single_line_text_field",
              value: "",
              ownerId: appInstallationID,
            },
            {
              namespace: "wheel-of-wonders",
              key: "showFloatingButton",
              type: "boolean",
              value: "false",
              ownerId: appInstallationID,
            },
          ];

          await graphql(
            `
              mutation CreateAppDataMetafield(
                $metafields: [MetafieldsSetInput!]!
              ) {
                metafieldsSet(metafields: $metafields) {
                  metafields {
                    id
                    namespace
                    key
                    value
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
            `,
            { variables: { metafields: clearMetafields } },
          );

          console.log("Metafields cleared successfully");
        }
      } catch (clearError) {
        console.error("Error clearing metafields:", clearError);
      }

      return json({
        success: true,
        message: "Campaign deactivated successfully!",
        status: newStatus,
        campaignId: campaignId,
      });
    }
  } catch (error) {
    console.error("Campaign toggle error:", error);
    return json(
      {
        success: false,
        error: `Failed to toggle campaign: ${error.message}`,
      },
      { status: 500 },
    );
  }
}
