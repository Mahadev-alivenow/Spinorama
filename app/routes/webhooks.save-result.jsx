import { json } from "@remix-run/node";
import { saveWinningResult } from "../models/Subscription.server";

export async function action({ request, context }) {
  try {
    // Only allow POST requests
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    // Parse the request body
    const { coupon, campaignId, email, shop } = await request.json();

    // Validate required fields
    if (!coupon) {
      return json({ error: "Coupon is required" }, { status: 400 });
    }

    if (!shop) {
      return json({ error: "Shop is required" }, { status: 400 });
    }

    // Save the winning result using the server-side function
    const result = await saveWinningResult(
      context.admin.graphql,
      coupon,
      campaignId,
      email,
      shop,
    );

    if (!result.success) {
      return json({ error: result.error }, { status: 500 });
    }

    // Return success response
    return json({
      success: true,
      message: "Winning result saved successfully",
    });
  } catch (error) {
    console.error("Error saving winning result:", error);
    return json({ error: "Failed to save winning result" }, { status: 500 });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
