import { json } from "@remix-run/node";
import { connectToDatabase } from "../../lib/mongodb.server";

export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { email, coupon, shop, campaignId } = await request.json();

    if (!email || !coupon) {
      return json({ error: "Email and coupon are required" }, { status: 400 });
    }

    if (!shop) {
      return json({ error: "Shop is required" }, { status: 400 });
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase(shop);
    const redemptionsCollection = db.collection("redemptions");

    // Save the redemption data
    await redemptionsCollection.insertOne({
      email,
      coupon,
      campaignId,
      timestamp: new Date(),
      redeemed: true,
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    return json({ error: "Failed to redeem coupon" }, { status: 500 });
  }
}
