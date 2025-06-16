import { json } from "@remix-run/node";
import { checkDatabaseConnection, getShopName } from "~/lib/mongodb.server";
import { authenticate } from "~/shopify.server";

export async function loader({ request }) {
  try {
    // Try to get shop name from session
    let shopName = null;
    try {
      const { session } = await authenticate.admin(request);
      shopName = session.shop;
      console.log("Got shop name from session:", shopName);
    } catch (authError) {
      // Try to get shop name from URL or headers
      const url = new URL(request.url);
      shopName =
        url.searchParams.get("shop") ||
        request.headers.get("x-shopify-shop-domain") ||
        getShopName() ||
        "wheel-of-wonders.myshopify.com";

      console.log("Using shop name from fallback:", shopName);
    }

    // Check database connection with the shop name
    const dbStatus = await checkDatabaseConnection(shopName);

    return json({
      connected: dbStatus.connected,
      error: dbStatus.error,
      dbName: dbStatus.dbName,
      shop: shopName,
    });
  } catch (error) {
    console.error("Error checking database status:", error);
    return json(
      {
        connected: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
