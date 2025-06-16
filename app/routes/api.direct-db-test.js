import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Set content type to JSON
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Get MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      return res.status(500).json({
        connected: false,
        error: "MongoDB URI is not defined in environment variables",
        timestamp: new Date().toISOString(),
      });
    }

    console.log("Direct DB Test: Attempting to connect to MongoDB...");

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

    // Test connection by listing collections
    const collections = await db.listCollections().toArray();

    // Close connection
    await client.close();

    // Return success response
    return res.status(200).json({
      connected: true,
      dbName: dbName,
      shop: "wheel-of-wonders.myshopify.com",
      collections: collections.map((c) => c.name),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Direct DB Test: Error connecting to MongoDB:", error);

    // Return error response
    return res.status(500).json({
      connected: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}
