import { json } from "@remix-run/node";

export async function loader({ request }) {
  const { authenticate } = await import("../shopify.server");
  const { getSubscriptionStatus } = await import(
    "../models/Subscription.server"
  );

  try {
    // Authenticate the request
    const { admin, session } = await authenticate.admin(request);

    // Get current subscription status
    const subscriptions = await getSubscriptionStatus(admin.graphql);
    const activeSubscriptions =
      subscriptions.data.app.installation.activeSubscriptions;

    return json({
      success: true,
      activeSubscriptions,
      hasActiveSubscription: activeSubscriptions.length > 0,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return json(
      {
        success: false,
        message:
          error.message ||
          "An error occurred while fetching subscription status",
        hasActiveSubscription: false,
      },
      { status: 500 },
    );
  }
}
