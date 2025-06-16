import { json } from "@remix-run/node";
import { MongoClient } from "mongodb";

// Connection URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Helper function to format shop name for database
function formatShopName(shopName) {
  if (!shopName) return "wheel-of-wonders";

  // Remove 'myshopify.com' if present
  let formattedName = shopName.replace(/\.myshopify\.com$/i, "");

  // Replace invalid characters with underscores
  formattedName = formattedName.replace(/[/\\. "$*<>:|?]/g, "_");

  // Prepend 'shop_' to ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(formattedName)) {
    formattedName = "shop_" + formattedName;
  }

  return formattedName;
}

export async function loader({ request }) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS request for CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers,
    });
  }

  try {
    // Get shop name from query parameter
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      return json(
        { error: "Shop parameter is required" },
        { status: 400, headers },
      );
    }

    // Connect to MongoDB
    await client.connect();
    const dbName = formatShopName(shop);
    const db = client.db(dbName);
    const campaignsCollection = db.collection("campaigns");

    // Find the active campaign
    const activeCampaign = await campaignsCollection.findOne({
      status: "active",
    });

    if (!activeCampaign) {
      return json(
        { error: "No active campaign found" },
        { status: 404, headers },
      );
    }

    // Extract only the needed data for the button
    const buttonData = {
      floatingButtonPosition:
        activeCampaign.layout?.floatingButtonPosition || "bottomRight",
      floatingButtonHasText:
        activeCampaign.layout?.floatingButtonHasText === true,
      floatingButtonText:
        activeCampaign.layout?.floatingButtonText || "SPIN & WIN",
      showFloatingButton: activeCampaign.layout?.showFloatingButton !== false,
      primaryColor: activeCampaign.primaryColor || "#fe5300",
      id: activeCampaign.id,
    };

    // Return the button data
    return json(buttonData, { headers });
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return json(
      { error: "Failed to fetch active campaign" },
      { status: 500, headers },
    );
  } finally {
    // Close the connection
    await client.close();
  }
}
