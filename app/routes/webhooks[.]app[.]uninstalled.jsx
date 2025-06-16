import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  console.log("Received app uninstalled webhook");

  try {
    const { topic, shop } = await authenticate.webhook(request);

    console.log(`Authenticated webhook: ${topic} for shop: ${shop}`);

    if (topic === "APP_UNINSTALLED" && shop) {
      // Delete all sessions for this shop
      await db.session.deleteMany({ where: { shop } });
      console.log(`Successfully deleted sessions for ${shop}`);
    }

    // Return a 200 response to acknowledge receipt of the webhook
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(`Error processing APP_UNINSTALLED webhook: ${error.message}`);
    // Still return 200 to acknowledge receipt
    return new Response(null, { status: 200 });
  }
};
