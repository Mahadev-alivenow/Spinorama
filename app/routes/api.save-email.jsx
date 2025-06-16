import { json } from "@remix-run/node";
import { connectToDatabase } from "../../lib/mongodb.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// CORS preflight
export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  return json(
    { error: "Method not allowed" },
    { status: 405, headers: corsHeaders },
  );
}

// POST: Save email + coupon into campaigns collection
export async function action({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const { email, coupon = null, campaignId } = await request.json();

    if (!email || !campaignId) {
      return json(
        { error: "Missing required fields: email or campaignId" },
        { status: 400, headers: corsHeaders },
      );
    }

    const { db, isConnected } = await connectToDatabase();

    if (!isConnected) {
      console.warn("MongoDB not connected, logging only:", {
        email,
        coupon,
        campaignId,
      });
      return json(
        {
          success: true,
          message: "Email logged (DB not connected)",
        },
        { headers: corsHeaders },
      );
    }

    // Save the email and coupon to campaign's emails array
    const result = await db.collection("campaigns").updateOne(
      { id: campaignId },
      {
        $push: {
          emails: {
            email,
            coupon,
            submittedAt: new Date(),
          },
        },
      },
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
        message: "Email saved successfully",
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error saving email:", error);
    return json(
      {
        success: false,
        error: "Failed to save email",
        message: error.message,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
// adding a comment to ensure the code is complete asd