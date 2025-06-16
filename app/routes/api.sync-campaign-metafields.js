import { json } from "@remix-run/node";
import {
  connectToDatabase,
  syncActiveCampaignToMetafields,
} from "../models/Subscription.server";
import { authenticate } from "../shopify.server";
// import { authenticate } from "./shopify.server";


export async function action({ request }) {
  try {
    // Authenticate and get shop info
    const { session, admin } = await authenticate.admin(request);
    const shopName = session.shop;
    const graphql = admin.graphql;

    // Get request body
    const requestBody = await request.json();
    const { campaignId, clear } = requestBody;

    if (clear) {
      // Clear metafields when no active campaign
      console.log("Clearing campaign metafields...");

      // Get app installation ID
      const appIdQuery = await graphql(`
        #graphql
        query {
          currentAppInstallation {
            id
          }
        }
      `);
      const appInstallationID = (await appIdQuery.json()).data
        .currentAppInstallation.id;

      // Clear key metafields
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
        {
          namespace: "wheel-of-wonders",
          key: "primaryColor",
          type: "single_line_text_field",
          value: "#ffc700",
          ownerId: appInstallationID,
        },
        {
          namespace: "wheel-of-wonders",
          key: "secondaryColor",
          type: "single_line_text_field",
          value: "#ffffff",
          ownerId: appInstallationID,
        },
        {
          namespace: "wheel-of-wonders",
          key: "tertiaryColor",
          type: "single_line_text_field",
          value: "#000000",
          ownerId: appInstallationID,
        },
      ];

      const metafieldsMutation = await graphql(
        `
          mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
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

      const data = await metafieldsMutation.json();

      if (data.data?.metafieldsSet?.userErrors?.length) {
        console.error(
          "Metafield userErrors:",
          data.data.metafieldsSet.userErrors,
        );
        return json({
          success: false,
          errors: data.data.metafieldsSet.userErrors,
        });
      }

      return json({
        success: true,
        message: "Metafields cleared successfully",
        metafields: data.data.metafieldsSet.metafields,
      });
    }

    if (!campaignId) {
      return json({ error: "Campaign ID is required" }, { status: 400 });
    }

    // Connect to database and get the campaign
    const { db } = await connectToDatabase(shopName);
    const campaign = await db.collection("campaigns").findOne({
      id: campaignId,
      status: "active",
    });

    if (!campaign) {
      return json({ error: "Active campaign not found" }, { status: 404 });
    }

    // Sync the campaign to metafields
    console.log("Syncing campaign to metafields:", campaign.name);
    const syncResult = await syncActiveCampaignToMetafields(graphql, shopName);

    if (syncResult.success) {
      return json({
        success: true,
        message: "Campaign synced to metafields successfully",
        campaignId: campaign.id,
        campaignName: campaign.name,
        metafields: syncResult.metafields,
      });
    } else {
      return json(
        {
          success: false,
          error: syncResult.error || "Failed to sync campaign",
          errors: syncResult.errors,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error syncing campaign to metafields:", error);
    return json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// Handle GET requests to sync the current active campaign
export async function loader({ request }) {
  try {
    // Authenticate and get shop info
    const { session, admin } = await authenticate.admin(request);
    const shopName = session.shop;
    const graphql = admin.graphql;

    // Sync the current active campaign
    const syncResult = await syncActiveCampaignToMetafields(graphql, shopName);

    if (syncResult.success) {
      return json({
        success: true,
        message: "Active campaign synced to metafields successfully",
        campaignId: syncResult.campaignId,
        metafields: syncResult.metafields,
      });
    } else {
      return json({
        success: false,
        error: syncResult.error || "No active campaign found or sync failed",
        errors: syncResult.errors,
      });
    }
  } catch (error) {
    console.error("Error syncing active campaign:", error);
    return json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export default function SyncCampaignMetafieldsRoute() {
  return null;
}
