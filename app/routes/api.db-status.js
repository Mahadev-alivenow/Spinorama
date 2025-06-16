import { json } from "@remix-run/node";
import { connectToDatabase } from "../../lib/mongodb.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    // Get the shop name from the session
    let shopName = null;
    try {
      const { session } = await authenticate.admin(request);
      shopName = session.shop;
      console.log("Using shop name for database:", shopName);
    } catch (authError) {
      // Extract shop name from request headers or URL if authentication fails
      const url = new URL(request.url);
      const shop =
        url.searchParams.get("shop") ||
        request.headers.get("x-shopify-shop-domain") ||
        "wheel-of-wonders.myshopify.com";

      shopName = shop;
      console.log("Authentication failed, using shop from request:", shopName);
    }

    // Try to connect to the database
    const { client, db } = await connectToDatabase(shopName);

    // Check if we can run a simple command
    await db.command({ ping: 1 });

    return json({
      connected: true,
      message: "Successfully connected to MongoDB",
      dbName: db.databaseName,
      shop: shopName,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return json({
      connected: false,
      error: error.message,
      message: "Failed to connect to MongoDB",
    });
  }
}
