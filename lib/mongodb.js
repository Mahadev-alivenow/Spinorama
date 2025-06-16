import { MongoClient } from "mongodb";

// Connection URI
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Please add your MongoDB URI to .env file");
}

let client;
let clientPromise;

// Connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Create a global MongoDB connection promise
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise && uri) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log("Connected to MongoDB (Development)");
        return client;
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB (Development):", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  if (uri) {
    client = new MongoClient(uri, options);
    clientPromise = client
      .connect()
      .then((client) => {
        console.log("Connected to MongoDB (Production)");
        return client;
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB (Production):", err);
        throw err;
      });
  }
}

// Helper function to get database connection
export async function getDb(shopName = null) {
  if (!clientPromise) {
    throw new Error(
      "MongoDB connection not initialized. Check your MONGODB_URI.",
    );
  }

  const client = await clientPromise;

  // If shopName is provided, use it as the database name
  // Otherwise, fall back to a default name
  const dbName = shopName ? formatShopName(shopName) : "shopify-campaigns";

  return client.db(dbName);
}

// Helper function to get a specific collection
export async function getCollection(collectionName, shopName = null) {
  const db = await getDb(shopName);
  return db.collection(collectionName);
}

// Helper function to format shop name for use as database name
// MongoDB database names have some restrictions
function formatShopName(shopName) {
  if (!shopName) return "shopify-campaigns";

  // Remove 'myshopify.com' if present
  let formattedName = shopName.replace(/\.myshopify\.com$/i, "");

  // Replace invalid characters with underscores
  formattedName = formattedName.replace(/[/\\. "$*<>:|?]/g, "_");

  // Prepend 'shop_' to ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(formattedName)) {
    formattedName = "shop_" + formattedName;
  }

  console.log(`Formatted shop name: ${shopName} -> ${formattedName}`);
  return formattedName;
}

// Export the clientPromise for use in other files
export default clientPromise;
