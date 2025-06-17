import crypto from "crypto";
import express from "express";
import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import path from "path";

// Import your API handlers
import { getActiveCampaign } from "./models/Subscription.server";
import { connectToDatabase } from "../lib/mongodb.server";

// FORCE environment variables at the very top
console.log("=== ORIGINAL ENV VALUES ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("HOST:", process.env.HOST);

// Force the port to 3000 regardless of environment
process.env.PORT = "3000";
process.env.HOST = process.env.HOST || "0.0.0.0";

console.log("=== FORCED ENV VALUES ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("HOST:", process.env.HOST);
console.log("============================");

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

app.use(express.json()); // Parse JSON request bodies

// Verify Shopify HMAC for app proxy requests
function verifyAppProxyHmac(req, res, next) {
  const { signature } = req.query;

  if (!signature) {
    return res.status(401).send("Unauthorized");
  }

  // Get your Shopify API secret from environment variables
  const apiSecret = process.env.SHOPIFY_API_SECRET;

  if (!apiSecret) {
    console.error("SHOPIFY_API_SECRET is not defined in environment variables");
    return res.status(500).send("Server configuration error");
  }

  // Build the message from the query parameters (excluding signature)
  const message = Object.keys(req.query)
    .filter((key) => key !== "signature")
    .sort()
    .map((key) => `${key}=${req.query[key]}`)
    .join("");

  // Calculate the HMAC
  const calculatedSignature = crypto
    .createHmac("sha256", apiSecret)
    .update(message)
    .digest("hex");

  // Compare the calculated signature with the provided one
  if (calculatedSignature !== signature) {
    return res.status(401).send("Invalid signature");
  }

  next();
}

// Enhanced health check endpoint - MUST be before other routes
app.get("/health", async (req, res) => {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      port: process.env.PORT,
      host: process.env.HOST,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      shopifyAppUrl: process.env.SHOPIFY_APP_URL,
      forcedPort: "3000",
    };

    console.log("Health check accessed:", healthData);

    res.status(200).json(healthData);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Simple ping endpoint as backup
app.get("/ping", (req, res) => {
  console.log("Ping endpoint accessed at:", new Date().toISOString());
  res.status(200).send("OK");
});

// App proxy routes
app.get(
  "/apps/wheel-of-wonders/active-campaign",
  verifyAppProxyHmac,
  async (req, res) => {
    try {
      const { shop } = req.query;

      if (!shop) {
        return res.status(400).json({ error: "Shop parameter is required" });
      }

      // Get the active campaign from MongoDB
      const activeCampaign = await getActiveCampaign(shop);

      if (!activeCampaign) {
        return res.status(404).json({ error: "No active campaign found" });
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
      return res.json(buttonData);
    } catch (error) {
      console.error("Error fetching active campaign:", error);
      return res.status(500).json({ error: "Failed to fetch active campaign" });
    }
  },
);

app.get(
  "/apps/wheel-of-wonders/campaign",
  verifyAppProxyHmac,
  async (req, res) => {
    try {
      const { id, shop } = req.query;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Campaign ID parameter is required" });
      }

      if (!shop) {
        return res.status(400).json({ error: "Shop parameter is required" });
      }

      // Connect to MongoDB
      const { db } = await connectToDatabase(shop);
      const campaignsCollection = db.collection("campaigns");

      // Find the campaign by ID
      const campaign = await campaignsCollection.findOne({ id: id });

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      // Return the full campaign data
      return res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      return res.status(500).json({ error: "Failed to fetch campaign" });
    }
  },
);

app.post(
  "/apps/wheel-of-wonders/save-email",
  verifyAppProxyHmac,
  async (req, res) => {
    try {
      const { email, campaign, shop } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (!shop) {
        return res.status(400).json({ error: "Shop is required" });
      }

      // Connect to MongoDB
      const { db } = await connectToDatabase(shop);
      const subscribersCollection = db.collection("subscribers");

      // Save the email with campaign info and timestamp
      await subscribersCollection.insertOne({
        email,
        campaignId: campaign,
        timestamp: new Date(),
        source: "spin-wheel",
      });

      return res.json({ success: true });
    } catch (error) {
      console.error("Error saving email:", error);
      return res.status(500).json({ error: "Failed to save email" });
    }
  },
);

app.post(
  "/apps/wheel-of-wonders/redeem-coupon",
  verifyAppProxyHmac,
  async (req, res) => {
    try {
      const { email, coupon, shop, campaignId } = req.body;

      if (!email || !coupon) {
        return res.status(400).json({ error: "Email and coupon are required" });
      }

      if (!shop) {
        return res.status(400).json({ error: "Shop is required" });
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

      return res.json({ success: true });
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      return res.status(500).json({ error: "Failed to redeem coupon" });
    }
  },
);

// Serve the Remix app
app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? (req, res, next) => {
        purgeRequireCache();
        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      }),
);

// FORCE port to 3000 - no exceptions for any environment
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

// Start server with explicit host and port
app.listen(port, host, () => {
  console.log(`=== Shopify App Server Started ===`);
  console.log(`Server listening at http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Shopify App URL: ${process.env.SHOPIFY_APP_URL}`);
  console.log(`Health check: http://${host}:${port}/health`);
  console.log(`FORCED PORT: ${port} (ignoring any other port settings)`);
  console.log(`=====================================`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(require(BUILD_DIR));
  }
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
