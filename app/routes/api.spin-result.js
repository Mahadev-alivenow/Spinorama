import { connectToDatabase } from "../../lib/mongodb.server";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { campaignId, sectorId, userEmail, shop, sessionId } =
      await request.json();

    if (!campaignId || !sectorId) {
      return Response.json(
        { error: "Missing required fields: campaignId, sectorId" },
        { status: 400 },
      );
    }

    // Connect to database
    const { db } = await connectToDatabase(shop);

    // Get wheel configuration
    const wheelConfigCollection = db.collection("wheel_configurations");
    const wheelConfig = await wheelConfigCollection.findOne({ campaignId });

    if (!wheelConfig) {
      return Response.json(
        { error: "Wheel configuration not found" },
        { status: 404 },
      );
    }

    // Find the sector that was spun
    const sector = wheelConfig.wheelConfig.sectors.find(
      (s) => s.id === sectorId,
    );

    if (!sector) {
      return Response.json({ error: "Invalid sector" }, { status: 400 });
    }

    // Log the spin result
    const spinResultsCollection = db.collection("spin_results");
    const spinResult = {
      campaignId,
      sectorId,
      sector: {
        rewardType: sector.rewardType,
        reward: sector.reward,
        discountCodeId: sector.discountCodeId,
        discountValue: sector.discountValue,
        discountType: sector.discountType,
      },
      userEmail: userEmail || null,
      shop: shop || "default",
      sessionId: sessionId || null,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
      redeemed: false,
    };

    const result = await spinResultsCollection.insertOne(spinResult);

    // Prepare response
    const response = {
      success: true,
      resultId: result.insertedId,
      sector: {
        id: sector.id,
        rewardType: sector.rewardType,
        reward: sector.reward,
        isDiscount: !!sector.discountCodeId,
        discountValue: sector.discountValue,
        discountType: sector.discountType,
      },
      message: sector.discountCodeId
        ? "Congratulations! You won a discount!"
        : "Better luck next time!",
    };

    // If it's a discount code, we might want to do additional processing
    if (sector.discountCodeId) {
      console.log(
        `User won discount: ${sector.reward} (${sector.discountValue}% off)`,
      );

      // Here you could integrate with Shopify to track usage, create customer-specific codes, etc.
      // For now, we'll just log it
    }

    return Response.json(response);
  } catch (error) {
    console.error("Error processing spin result:", error);
    return Response.json(
      { error: "Failed to process spin result", details: error.message },
      { status: 500 },
    );
  }
};

// GET endpoint to fetch spin results/analytics
export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const campaignId = url.searchParams.get("campaignId");
    const shop = url.searchParams.get("shop");
    const limit = Number.parseInt(url.searchParams.get("limit")) || 50;

    // Connect to database
    const { db } = await connectToDatabase(shop);
    const collection = db.collection("spin_results");

    // Build query
    const query = {};
    if (campaignId) query.campaignId = campaignId;
    if (shop) query.shop = shop;

    // Fetch results
    const results = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Get analytics
    const analytics = await collection
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: "$sector.rewardType",
            count: { $sum: 1 },
            discountWins: {
              $sum: {
                $cond: [{ $ne: ["$sector.discountCodeId", null] }, 1, 0],
              },
            },
          },
        },
      ])
      .toArray();

    return Response.json({
      success: true,
      results,
      analytics,
      totalSpins: results.length,
    });
  } catch (error) {
    console.error("Error fetching spin results:", error);
    return Response.json(
      { error: "Failed to fetch spin results", details: error.message },
      { status: 500 },
    );
  }
};
