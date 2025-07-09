import { json, redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { createAppSubscription } from "../models/Subscription.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;

    console.log("Subscribe - Creating subscription for shop:", shop);

    const isDevelopment = process.env.NODE_ENV === "development";
    const returnUrl = `${process.env.HOST}/app`;

    const confirmationUrl = await createAppSubscription(
      admin,
      shop,
      returnUrl,
      isDevelopment,
    );

    console.log(
      "Subscribe - Redirecting to confirmation URL:",
      confirmationUrl,
    );
    return redirect(confirmationUrl);
  } catch (error) {
    console.error("Subscribe - Error creating subscription:", error);

    // Redirect back to app with error
    return redirect("/app?error=subscription_failed");
  }
}

export default function Subscribe() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Creating your subscription...</p>
      </div>
    </div>
  );
}
