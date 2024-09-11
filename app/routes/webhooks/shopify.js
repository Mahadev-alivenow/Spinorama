import { json } from "@remix-run/node";
import { verifyShopifyWebhookSignature } from "~/shopify.server";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const action = async ({ request }) => {
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (request.method === "POST") {
    const rawBody = await request.text();
    const shopifyHmac = request.headers.get("X-Shopify-Hmac-SHA256");

    // Verify the HMAC from Shopify
    if (!verifyShopifyWebhookSignature(shopifySecret, rawBody, shopifyHmac)) {
      return json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    // Shopify webhook is verified, parse and handle the data
    const webhookData = JSON.parse(rawBody);
    const topic = request.headers.get("X-Shopify-Topic");

    console.log("Received Shopify webhook:", topic, webhookData);

    // Handle the webhook data here
    return json({ message: "Webhook received successfully" }, { status: 200 });
  }

  return json({ error: "Method Not Allowed" }, { status: 405 });
};
