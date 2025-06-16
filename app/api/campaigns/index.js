import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const campaignsCollection = db.collection("campaigns");

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        // Get all campaigns
        const campaigns = await campaignsCollection.find({}).toArray();
        return res.status(200).json(campaigns);

      case "POST":
        // Create a new campaign
        const newCampaign = req.body;

        // Add timestamps
        newCampaign.createdAt =
          newCampaign.createdAt || new Date().toISOString();
        newCampaign.updatedAt = new Date().toISOString();

        const result = await campaignsCollection.insertOne(newCampaign);
        return res.status(201).json({
          ...newCampaign,
          _id: result.insertedId,
        });

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling campaigns:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
