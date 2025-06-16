import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Set content type to JSON
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Get MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      return res.status(500).json({
        error: "MongoDB URI is not defined in environment variables",
        timestamp: new Date().toISOString(),
      });
    }

    // Get campaign data from request body
    const campaign = req.body;

    if (!campaign || !campaign.id) {
      return res.status(400).json({
        error: "Invalid campaign data - missing required fields",
        timestamp: new Date().toISOString(),
      });
    }

    console.log(
      "Direct Campaign Save: Attempting to save campaign:",
      campaign.id,
    );

    // Create a new MongoDB client
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    });

    // Connect to MongoDB
    await client.connect();

    // Get database name
    const dbName = "wheel-of-wonders";
    const db = client.db(dbName);

    // Get campaigns collection
    const campaignsCollection = db.collection("campaigns");

    // Check if campaign already exists
    const existingCampaign = await campaignsCollection.findOne({
      id: campaign.id,
    });

    let result;

    if (existingCampaign) {
      // Update existing campaign
      result = await campaignsCollection.updateOne(
        { id: campaign.id },
        { $set: { ...campaign, updatedAt: new Date().toISOString() } },
      );

      console.log(
        `Direct Campaign Save: Updated campaign ${campaign.id}, matched: ${result.matchedCount}, modified: ${result.modifiedCount}`,
      );
    } else {
      // Insert new campaign
      result = await campaignsCollection.insertOne({
        ...campaign,
        createdAt: campaign.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(
        `Direct Campaign Save: Created new campaign ${campaign.id}, inserted ID: ${result.insertedId}`,
      );
    }

    // Close connection
    await client.close();

    // Return success response
    return res.status(200).json({
      success: true,
      campaign: campaign,
      operation: existingCampaign ? "updated" : "created",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Direct Campaign Save: Error saving campaign:", error);

    // Return error response
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}
