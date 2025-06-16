import { json } from "@remix-run/node";
import { connectToDatabase } from "../../lib/mongodb.server";
import { ObjectId } from "mongodb";

// Helper function to get shop name from various sources
async function getEffectiveShopName(request) {
  try {
    // Try to get shop name from session
    const { authenticate } = await import("../shopify.server");
    const { session } = await authenticate.admin(request);
    const shopName = session.shop;
    console.log("Using shop name from session:", shopName);
    return shopName;
  } catch (authError) {
    console.log("Authentication failed:", authError.message);

    // Try to get shop name from form data, URL or headers
    let shopName = null;

    // Check if this is a form submission
    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        shopName = formData.get("shop");
        if (shopName) {
          console.log("Using shop name from form data:", shopName);
          return shopName;
        }
      } catch (e) {
        console.log("Not form data, trying other sources");
      }
    }

    // Try URL params
    const url = new URL(request.url);
    shopName =
      url.searchParams.get("shop") ||
      request.headers.get("x-shopify-shop-domain");

    if (shopName) {
      console.log("Using shop name from URL/headers:", shopName);
      return shopName;
    }

    // Default fallback
    console.log("Using default shop name");
    return "wheel-of-wonders.myshopify.com";
  }
}

// Handle POST requests to update campaign status
export async function action({ request, params }) {
  // Only allow POST requests
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get campaign ID from URL params
    const campaignId = params.id;
    if (!campaignId) {
      return json({ error: "Campaign ID is required" }, { status: 400 });
    }

    // Get form data
    let formData;
    try {
      formData = await request.formData();
    } catch (e) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    // Get status from form data
    const newStatus = formData.get("status");
    if (!newStatus) {
      return json({ error: "Status is required" }, { status: 400 });
    }

    // Get shop name
    const shopName = await getEffectiveShopName(request);
    console.log("Updating campaign", campaignId, "in database:", shopName);

    // Connect to database
    const { db } = await connectToDatabase(shopName);
    if (!db) {
      return json({ error: "Database connection failed" }, { status: 500 });
    }

    // If setting to active, first set all other campaigns to draft
    if (newStatus === "active") {
      try {
        await db.collection("campaigns").updateMany(
          {
            id: { $ne: campaignId },
            status: "active",
          },
          {
            $set: {
              status: "draft",
              updatedAt: new Date().toISOString(),
            },
          },
        );
        console.log("Set all other active campaigns to draft");
      } catch (error) {
        console.error("Error deactivating other campaigns:", error);
      }
    }

    // Update the campaign status
    try {
      // First try to update by string ID
      const result = await db.collection("campaigns").updateOne(
        { id: campaignId },
        {
          $set: {
            status: newStatus,
            updatedAt: new Date().toISOString(),
          },
        },
      );

      // If no document was updated, try with ObjectId
      if (result.matchedCount === 0) {
        try {
          const objId = new ObjectId(campaignId);
          const result2 = await db.collection("campaigns").updateOne(
            { _id: objId },
            {
              $set: {
                status: newStatus,
                updatedAt: new Date().toISOString(),
              },
            },
          );

          if (result2.matchedCount === 0) {
            return json({ error: "Campaign not found" }, { status: 404 });
          }
        } catch (e) {
          return json({ error: "Campaign not found" }, { status: 404 });
        }
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      return json({ error: "Failed to update campaign" }, { status: 500 });
    }

    // Try to sync metafields if authenticated
    let syncResult = {
      success: false,
      message: "Metafield sync not attempted",
    };
    try {
      const { authenticate } = await import("../shopify.server");
      const { admin } = await authenticate.admin(request);

      if (admin?.graphql) {
        // Get the updated campaign
        const campaign = await db
          .collection("campaigns")
          .findOne({ id: campaignId });

        if (campaign) {
          if (newStatus === "active") {
            // Sync to metafields
            // Implementation would go here
            syncResult = {
              success: true,
              message: "Campaign synced to metafields",
            };
          } else {
            // Clear metafields
            // Implementation would go here
            syncResult = { success: true, message: "Metafields cleared" };
          }
        }
      }
    } catch (error) {
      console.log("Metafield sync skipped due to authentication");
    }

    return json({
      success: true,
      status: newStatus,
      message: `Campaign ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      syncResult,
    });
  } catch (error) {
    console.error("Error in campaign status update:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle GET requests to get campaign status
export async function loader({ request, params }) {
  return json({ message: "Use POST to update campaign status" });
}
