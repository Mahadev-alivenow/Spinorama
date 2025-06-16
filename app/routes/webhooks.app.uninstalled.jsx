import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  if (topic === "APP_UNINSTALLED") {
    console.log(`Processing app uninstallation for ${shop}`);
    try {
      // Delete all sessions for this shop
      if (shop) {
        await db.session.deleteMany({ where: { shop } });
        console.log(`Successfully deleted sessions for ${shop}`);
      }
    } catch (error) {
      console.error(
        `Error processing APP_UNINSTALLED webhook: ${error.message}`,
      );
    }
  }

  // Return a 200 response to acknowledge receipt of the webhook
  return new Response(null, { status: 200 });
};
