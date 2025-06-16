// app/routes/api/save-result.jsx
import { json } from "@remix-run/node";
import { connectToDatabase } from "../../lib/mongodb.server";

// Shared CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Preflight handler
export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  return json(
    { error: "Method not allowed" },
    { status: 405, headers: corsHeaders },
  );
}

// POST handler
export async function action({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const { email, coupon, campaignId } = await request.json();

    // Validate
    if (!email) {
      return json(
        { error: "Email is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!coupon) {
      return json(
        { error: "Coupon is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!campaignId) {
      return json(
        { error: "Campaign ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Connect (shop name scoping omitted since we no longer store shop)
    const { db, isConnected } = await connectToDatabase();

    if (!isConnected) {
      console.warn("DB down; logging result only", {
        email,
        coupon,
        campaignId,
      });
      return json(
        { success: true, message: "Result logged (DB down)" },
        { headers: corsHeaders },
      );
    }

    // Append to campaign.results array
    const result = await db.collection("campaigns").updateOne(
      { id: campaignId },
      {
        $push: {
          results: {
            email,
            coupon,
            awardedAt: new Date(),
          },
        },
      },
      { upsert: false },
    );

    if (result.matchedCount === 0) {
      return json(
        { error: "Campaign not found", campaignId },
        { status: 404, headers: corsHeaders },
      );
    }

    return json(
      {
        success: true,
        message: "Result saved to campaign",
        modifiedCount: result.modifiedCount,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Failed to save result:", error);
    return json(
      {
        success: false,
        error: "Unexpected error",
        details: error.message,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
