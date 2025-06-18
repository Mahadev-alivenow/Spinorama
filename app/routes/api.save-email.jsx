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

    // First, try to update existing campaign
    const updateResult = await db.collection("campaigns").updateOne(
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

    // If campaign exists, return success
    if (updateResult.matchedCount > 0) {
      return json(
        {
          success: true,
          message: "Email saved to existing campaign",
          campaignId,
        },
        { headers: corsHeaders },
      );
    }

    // Campaign doesn't exist, create a new one
    console.log(`Campaign ${campaignId} not found, creating new campaign...`);

    const newCampaign = {
      id: campaignId,
      name: `Campaign ${campaignId}`,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      emails: [
        {
          email,
          coupon,
          submittedAt: new Date(),
        },
      ],
      // Default campaign settings
      settings: {
        autoCreated: true,
        source: "email-submission",
      },
      // Basic campaign structure
      layout: {
        showFloatingButton: true,
        floatingButtonPosition: "bottomRight",
        floatingButtonText: "SPIN & WIN",
        floatingButtonHasText: true,
      },
      primaryColor: "#fe5300",
      // Campaign stats
      stats: {
        totalEmails: 1,
        totalSpins: 0,
        conversionRate: 0,
      },
    };

    const insertResult = await db
      .collection("campaigns")
      .insertOne(newCampaign);

    if (insertResult.acknowledged) {
      console.log(
        `Successfully created new campaign ${campaignId} and saved email`,
      );

      return json(
        {
          success: true,
          message: "New campaign created and email saved",
          campaignId,
          campaignCreated: true,
        },
        { headers: corsHeaders },
      );
    } else {
      throw new Error("Failed to create new campaign");
    }
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
