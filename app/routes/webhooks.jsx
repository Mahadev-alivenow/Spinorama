// app/routes/webhooks.jsx

import { json } from "@remix-run/node";
// import crypto from "node:crypto";
import { authenticate } from "../shopify.server";
import db from "../db.server";
let crypto;
if (typeof window === "undefined") {
  console.log("only on server---------------");
  (async () => {
    crypto = await import("crypto"); // Require crypto only in server environment
  })();
}

export async function action({ request }) {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (request.method.toUpperCase() !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const bodyText = await request.text();
  console.log("Raw bodyText:", bodyText);

  // Verify the webhook is from Shopify
  const hmacHeader = request.headers.get("X-Shopify-Hmac-Sha256");
  console.log("Received HMAC Header:", hmacHeader);

  const isValid = verifyShopifyWebhook(bodyText, hmacHeader);

  console.log("isValid:", isValid);

  if (!isValid) {
    console.error("HMAC verification failed");
    return new Response("Forbidden", { status: 403 });
  } else {
    return new Response("Success", { status: 200 });
  }

  // Parse the webhook payload
  let data;
  try {
    data = JSON.parse(bodyText);
    console.log("Webhook data:", data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new Response("Bad Request", { status: 400 });
  }

  // Handle the event based on its type
  switch (data.type) {
    case "APP_UNINSTALLED":
      if (session) {
        console.log("Handling request for app uninstalled.");
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "request_customer_data":
      console.log("Handling request for customer data.");
      // Handle customer data request
      break;
    case "delete_customer_data":
      console.log("Handling deletion of customer data.");
      // Handle customer data deletion
      break;
    case "delete_shop_data":
      console.log("Handling deletion of shop data.");
      // Handle shop data deletion
      break;
    default:
      console.log("Unknown webhook type:", data.type);
      return new Response("Webhook type not supported", { status: 400 });
  }

  // Respond to Shopify
  return json({ success: true });
}

// Helper function to verify Shopify's HMAC signature
async function verifyShopifyWebhook(data, hmacHeader) {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error("SHOPIFY_API_SECRET is not set");
    return false;
  }

  // const crypto = await import('crypto');
  const hash = crypto
    .createHmac("sha256", secret)
    .update(data, "utf8") // Specify 'utf8' to ensure the correct encoding
    .digest("base64");

  console.log("Calculated HMAC Hash:", hash);
  return hash === hmacHeader;
}
