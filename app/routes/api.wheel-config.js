import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { admin, session } = await authenticate.admin(request);
    const data = await request.json();

    const { campaignId, wheelConfig, timestamp, shop } = data;

    // Here you would save to your database (MongoDB, etc.)
    // For now, we'll just log and return success
    console.log("Saving wheel configuration:", {
      campaignId,
      wheelConfig,
      timestamp,
      shop: shop || session.shop,
    });

    // Example MongoDB save (uncomment when you have MongoDB setup)
    /*
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    await client.connect();
    const db = client.db('spintowin');
    const collection = db.collection('wheelConfigs');
    
    const result = await collection.insertOne({
      campaignId,
      wheelConfig,
      timestamp,
      shop: shop || session.shop,
      createdAt: new Date(),
    });
    
    await client.close();
    */

    return json({
      success: true,
      message: "Wheel configuration saved successfully",
      campaignId,
    });
  } catch (error) {
    console.error("Error saving wheel configuration:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
