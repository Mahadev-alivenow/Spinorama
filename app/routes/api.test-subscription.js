import { json } from "@remix-run/node";
// import { authenticate } from "../../shopify.server";
import { authenticate } from "../shopify.server";

import {
  setLocalSubscriptionStatus,
  hasActiveSubscription,
  createSubscriptionMetafield,
} from "../models/Subscription.server";

// API endpoint to test subscription functionality
export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;
    const { action: testAction, status } = await request.json();

    console.log(
      `🧪 Testing subscription action: ${testAction} for shop: ${shop}`,
    );

    switch (testAction) {
      case "set_active":
        // Simulate active subscription
        await setLocalSubscriptionStatus(shop, "active", "Test Plan");
        await createSubscriptionMetafield(admin.graphql, true, shop);

        return json({
          success: true,
          message: "Subscription set to active",
          shop,
        });

      case "set_inactive":
        // Simulate inactive subscription
        await setLocalSubscriptionStatus(shop, "inactive");
        await createSubscriptionMetafield(admin.graphql, false, shop);

        return json({
          success: true,
          message: "Subscription set to inactive",
          shop,
        });

      case "check_status":
        // Check current subscription status
        const subscriptionStatus = await hasActiveSubscription(
          admin.graphql,
          shop,
        );

        return json({
          success: true,
          subscriptionStatus,
          shop,
        });

      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Test subscription error:", error);
    return json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function loader() {
  return json({ message: "Use POST to test subscription functionality" });
}
