import { json } from "@remix-run/node";
import crypto from "crypto";

export async function action({ request }: { request: Request }) {
  const hmacHeader = request.headers.get("X-Shopify-Hmac-SHA256");
  const shopDomain = request.headers.get("X-Shopify-Shop-Domain");
  const topic = request.headers.get("X-Shopify-Topic");

  // Read request body
  const rawBody = await request.text();

  // Verify webhook
  if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
    return json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  // Parse the webhook data
  const webhookData = JSON.parse(rawBody);

  // Handle different topics
  switch (topic) {
    case "customers/redact":
      // Handle customer data redaction
      await handleCustomerRedact(webhookData);
      break;
    case "shop/redact":
      // Handle shop data redaction
      await handleShopRedact(webhookData);
      break;
    case "customers/data_request":
      // Handle customer data request
      await handleCustomerDataRequest(webhookData);
      break;
    default:
      return json({ error: "Unknown webhook topic" }, { status: 400 });
  }

  return json({ message: "Webhook handled successfully" }, { status: 200 });
}

// Function to verify Shopify webhook signature
function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET || "";
  const generatedHash = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(hmacHeader || "", "utf8"),
    Buffer.from(generatedHash, "utf8"),
  );
}

// Handle customer redaction request
async function handleCustomerRedact(webhookData: any) {
  // Example: Remove customer data from your database
  console.log("Customer Redaction: ", webhookData);
  // Add logic to remove customer data
}

// Handle shop redaction request
async function handleShopRedact(webhookData: any) {
  // Example: Remove shop data from your database
  console.log("Shop Redaction: ", webhookData);
  // Add logic to remove shop data
}

// Handle customer data request
async function handleCustomerDataRequest(webhookData: any) {
  // Example: Provide customer data to Shopify
  console.log("Customer Data Request: ", webhookData);
  // Add logic to retrieve and send customer data to Shopify
}
