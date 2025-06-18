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

const app = express();
const BUILD_DIR = path.join(process.cwd(), "build");

// Serve static files first
app.use(express.static(path.join(process.cwd(), "public")));

// Parse JSON for regular API routes (but not webhooks)
app.use("/apps", express.json());
app.use("/health", express.json());
app.use("/ping", express.json());

// Webhook HMAC verification middleware - ONLY for webhook routes
function verifyWebhookHmac(req, res, next) {
  const shopifyHmac = req.headers["x-shopify-hmac-sha256"];
  const secret = process.env.SHOPIFY_API_SECRET;

  if (!secret) {
    console.error("SHOPIFY_API_SECRET is not defined");
    return res.status(500).send("Server configuration error");
  }

  if (!shopifyHmac) {
    console.error("Missing HMAC header");
    return res.status(401).send("Missing HMAC header");
  }

  // Get raw body for HMAC verification
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const calculatedHmac = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");

    const hmacValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHmac),
      Buffer.from(shopifyHmac),
    );

    if (hmacValid) {
      console.log("Webhook HMAC verification successful");
      // Parse the body as JSON for the webhook handler
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = body;
      }
      next();
    } else {
      console.error("Webhook HMAC verification failed");
      res.status(401).send("HMAC verification failed");
    }
  });
}

// Verify Shopify HMAC for app proxy requests
function verifyAppProxyHmac(req, res, next) {
  const { signature } = req.query;

  if (!signature) {
    return res.status(401).send("Unauthorized");
  }

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

// Enhanced health check endpoint
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

// Simple ping endpoint
app.get("/ping", (req, res) => {
  console.log("Ping endpoint accessed at:", new Date().toISOString());
  res.status(200).send("OK");
});

// Webhook endpoint - handle specific webhook routes with HMAC verification
app.post("/webhooks", verifyWebhookHmac, (req, res) => {
  console.log("Webhook received:", req.headers["x-shopify-topic"]);

  // Let Remix handle the webhook processing
  const remixHandler = createRequestHandler({
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
  });

  remixHandler(req, res);
});

// Handle GDPR webhooks specifically
app.post("/SHOP_REDACT", verifyWebhookHmac, (req, res) => {
  console.log("SHOP_REDACT webhook received");
  res.status(200).send("SHOP_REDACT webhook processed");
});

app.post("/CUSTOMERS_REDACT", verifyWebhookHmac, (req, res) => {
  console.log("CUSTOMERS_REDACT webhook received");
  res.status(200).send("CUSTOMERS_REDACT webhook processed");
});

app.post("/CUSTOMERS_DATA_REQUEST", verifyWebhookHmac, (req, res) => {
  console.log("CUSTOMERS_DATA_REQUEST webhook received");
  res.status(200).send("CUSTOMERS_DATA_REQUEST webhook processed");
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

      const activeCampaign = await getActiveCampaign(shop);

      if (!activeCampaign) {
        return res.status(404).json({ error: "No active campaign found" });
      }

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

      const { db } = await connectToDatabase(shop);
      const campaignsCollection = db.collection("campaigns");
      const campaign = await campaignsCollection.findOne({ id: id });

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

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

      const { db } = await connectToDatabase(shop);
      const subscribersCollection = db.collection("subscribers");

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

      const { db } = await connectToDatabase(shop);
      const redemptionsCollection = db.collection("redemptions");

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

// Serve the Remix app for all other routes
app.all("*", (req, res, next) => {
  // Skip webhook routes - they're handled above
  if (
    req.path.startsWith("/webhooks") ||
    req.path === "/SHOP_REDACT" ||
    req.path === "/CUSTOMERS_REDACT" ||
    req.path === "/CUSTOMERS_DATA_REQUEST"
  ) {
    return next();
  }

  const remixHandler =
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
        });

  return remixHandler(req, res, next);
});

// FORCE port to 3000 - no exceptions for any environment
const port = 3000;
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
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
