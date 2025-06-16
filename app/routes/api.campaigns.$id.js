import { json } from "@remix-run/node";

import {
  connectToDatabase,
  getShopName,
  setShopName,
} from "../../lib/mongodb.server";
import { authenticate } from "../shopify.server";

// Helper function to get shop name from various sources
async function getEffectiveShopName(request) {
  // Try to get shop name from session
  try {
    const { session } = await authenticate.admin(request);
    const shopName = session.shop;
    console.log("Using shop name from session:", shopName);

    // Cache the shop name for future use
    setShopName(shopName);

    return shopName;
  } catch (authError) {
    console.log("Authentication failed:", authError.message);

    // Try to get shop name from URL or headers
    const url = new URL(request.url);
    const shopFromRequest =
      url.searchParams.get("shop") ||
      request.headers.get("x-shopify-shop-domain");

    // Use the shop from request, or cached shop, or default
    const shopName =
      shopFromRequest || getShopName() || "wheel-of-wonders.myshopify.com";
    console.log("Using shop name from fallback:", shopName);

    // Cache the shop name if we got it from request
    if (shopFromRequest) {
      setShopName(shopFromRequest);
    }

    return shopName;
  }
}

// GET - Fetch a single campaign
export async function loader({ params, request }) {
  try {
    const { id } = params;

    // Get the shop name
    const shopName = await getEffectiveShopName(request);

    const { db, dbName } = await connectToDatabase(shopName);
    console.log(`Fetching campaign ${id} from database: ${dbName}`);

    const campaign = await db.collection("campaigns").findOne({ id });

    if (!campaign) {
      return json({ error: "Campaign not found" }, { status: 404 });
    }

    return json({
      ...campaign,
      shop: shopName,
      dbName,
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return json({ error: error.message }, { status: 500 });
  }
}

// PUT/DELETE - Update or delete a campaign
export async function action({ request, params }) {
  const method = request.method.toLowerCase();

  // Get the shop name
  const shopName = await getEffectiveShopName(request);
  const { db, dbName } = await connectToDatabase(shopName);

  if (method === "put") {
    try {
      const { id } = params;
      const campaignData = await request.json();

      // Remove MongoDB-specific fields that shouldn't be updated
      const { _id, ...campaignToUpdate } = campaignData;

      // Add shop name to campaign if not already present
      if (!campaignToUpdate.shop) {
        campaignToUpdate.shop = shopName;
      }

      console.log(`Updating campaign ${id} in database: ${dbName}`);
      const result = await db
        .collection("campaigns")
        .updateOne({ id }, { $set: campaignToUpdate });

      if (result.matchedCount === 0) {
        return json({ error: "Campaign not found" }, { status: 404 });
      }

      // Return the updated campaign without the _id field
      return json({
        ...campaignToUpdate,
        id,
        shop: shopName,
        dbName,
      });
    } catch (error) {
      console.error("Error updating campaign:", error);
      return json({ error: error.message }, { status: 500 });
    }
  } else if (method === "delete") {
    try {
      const { id } = params;

      console.log(`Deleting campaign ${id} from database: ${dbName}`);
      const result = await db.collection("campaigns").deleteOne({ id });

      if (result.deletedCount === 0) {
        return json({ error: "Campaign not found" }, { status: 404 });
      }

      return json({
        success: true,
        shop: shopName,
        dbName,
      });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      return json({ error: error.message }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
