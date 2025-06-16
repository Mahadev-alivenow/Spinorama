import { authenticate } from "../shopify.server";
import db from "../db.server";
import { createSubscriptionMetafield } from "../models/Subscription.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  console.log(`Received webhook: ${topic} for shop: ${shop}`);

  if (!admin && topic !== "APP_UNINSTALLED") {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    console.log("No admin context available");
    return new Response(null, { status: 200 });
  }

  try {
    switch (topic) {
      case "APP_UNINSTALLED":
        if (session) {
          await db.session.deleteMany({ where: { shop } });
          console.log(`Successfully deleted sessions for ${shop}`);
        }
        break;

      case "APP_SUBSCRIPTIONS_UPDATE":
        console.log("Processing subscription update:", payload);

        if (payload.app_subscription.status === "ACTIVE") {
          await createSubscriptionMetafield(admin.graphql, "true");
          console.log("Subscription activated");
        } else {
          await createSubscriptionMetafield(admin.graphql, "false");
          console.log("Subscription deactivated");
        }
        break;

      case "CUSTOMERS_DATA_REQUEST":
      case "CUSTOMERS_REDACT":
      case "SHOP_REDACT":
        console.log(`Received ${topic} webhook - no action needed`);
        break;

      default:
        console.log(`Unhandled webhook topic: ${topic}`);
        return new Response("Unhandled webhook topic", { status: 404 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(`Webhook processing error: ${error.message}`, {
      status: 500,
    });
  }
};
