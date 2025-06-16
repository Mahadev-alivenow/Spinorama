import { json } from "@remix-run/node";
import {
  connectToDatabase,
  setShopName,
  getShopName,
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

// GET - Fetch all campaigns
export async function loader({ request }) {
  try {
    // Get the shop name
    const shopName = await getEffectiveShopName(request);

    const { db, dbName } = await connectToDatabase(shopName);
    console.log(`Fetching campaigns from database: ${dbName}`);

    const campaigns = await db.collection("campaigns").find({}).toArray();

    return json({
      campaigns,
      shop: shopName,
      dbName,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new campaign
export async function action({ request }) {
  try {
    const campaignData = await request.json();

    // Get the shop name
    const shopName = await getEffectiveShopName(request);

    // Remove any existing _id field and add shop name
    const { _id, ...campaignToCreate } = campaignData;

    if (!campaignToCreate.shop) {
      campaignToCreate.shop = shopName;
    }

    const { db, dbName } = await connectToDatabase(shopName);
    console.log(`Creating campaign in database: ${dbName}`);

    const result = await db.collection("campaigns").insertOne(campaignToCreate);

    return json(
      {
        ...campaignToCreate,
        _id: result.insertedId,
        shop: shopName,
        dbName,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    return json({ error: error.message }, { status: 500 });
  }
}
