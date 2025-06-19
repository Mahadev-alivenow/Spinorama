import { json } from "@remix-run/node";

export async function action({ request }) {
  try {
    // Import Shopify functions
    const { shopifyApp } = await import("../shopify.server");

    // Parse request body
    const data = await request.json();
    const { planName, returnUrl, isTest = false } = data;

    if (!planName) {
      return json({ success: false, message: "Plan name is required" });
    }

    try {
      // Authenticate the request
      const { session } = await shopifyApp.authenticate.admin(request);

      if (!session) {
        return json({
          success: false,
          requiresAuth: true,
          message: "Authentication required",
        });
      }

      // Create a billing URL
      const billingUrl = await shopifyApp.billing.request({
        session,
        plan: planName,
        isTest,
        returnUrl: returnUrl || `https://${session.shop}/admin/apps`,
      });

      return json({
        success: true,
        confirmationUrl: billingUrl,
      });
    } catch (authError) {
      console.error("Billing API - Authentication error:", authError);

      return json({
        success: false,
        requiresAuth: true,
        message: "Authentication failed. Please sign in again.",
        error: authError.message,
      });
    }
  } catch (error) {
    console.error("Billing API - Error:", error);

    return json({
      success: false,
      message: "Failed to create subscription",
      error: error.message,
    });
  }
}

export async function loader() {
  // Redirect GET requests to the pricing page
  return json({ message: "POST requests only" }, { status: 405 });
}
