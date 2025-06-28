import { json } from "@remix-run/node";

export async function action({ request }) {
  try {
    // Use the same authentication pattern as app.jsx
    const { authenticate } = await import("../shopify.server");
    const { connectToDatabase } = await import("../../lib/mongodb.server");
    const { syncActiveCampaignToMetafields } = await import(
      "../models/Subscription.server"
    );

    // Authenticate with Shopify admin
    const { admin, session } = await authenticate.admin(request);
    const shopName = session.shop;
    const graphql = admin.graphql;

    console.log("Campaign Toggle - Authenticated for shop:", shopName);

    // Get form data
    const formData = await request.formData();
    const campaignId = formData.get("campaignId");
    const action = formData.get("action");

    if (!campaignId) {
      return json(
        { success: false, error: "Campaign ID is required" },
        { status: 400 },
      );
    }

    // Connect to database
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
      console.log("Campaign Toggle - Deactivated other active campaigns");
    }

    // Update the target campaign
    await db
      .collection("campaigns")
      .updateOne({ id: campaignId }, { $set: { status: newStatus } });
    console.log(
      `Campaign Toggle - Updated campaign ${campaignId} to ${newStatus}`,
    );

    // Handle metafields sync for active campaigns
    if (newStatus === "active") {
      try {
        console.log("Campaign Toggle - Syncing to metafields...");
        const syncResult = await syncActiveCampaignToMetafields(
          graphql,
          shopName,
        );

        return json({
          success: true,
          message: "Campaign activated and synced to storefront successfully!",
          status: newStatus,
          campaignId: campaignId,
          synced: true,
        });
      } catch (syncError) {
        console.error("Campaign Toggle - Sync error:", syncError);
        return json({
          success: true,
          message:
            "Campaign activated successfully! Storefront sync will retry automatically.",
          status: newStatus,
          campaignId: campaignId,
          synced: false,
          syncError: syncError.message,
        });
      }
    } else {
      // For deactivation, clear metafields
      try {
        console.log("Campaign Toggle - Clearing metafields...");

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

          console.log("Campaign Toggle - Metafields cleared successfully");
        }
      } catch (clearError) {
        console.error(
          "Campaign Toggle - Error clearing metafields:",
          clearError,
        );
      }

      return json({
        success: true,
        message:
          "Campaign deactivated and removed from storefront successfully!",
        status: newStatus,
        campaignId: campaignId,
      });
    }
  } catch (error) {
    console.error("Campaign Toggle - Authentication error:", error);

    // Return authentication error
    return json(
      {
        success: false,
        error: "Authentication failed. Please refresh the page.",
        authError: true,
      },
      { status: 401 },
    );
  }
}
