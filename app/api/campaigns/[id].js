import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db();
    const campaignsCollection = db.collection("campaigns");

    // Convert string ID to ObjectId if it's a MongoDB ObjectId
    let campaignId;
    try {
      campaignId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    } catch (error) {
      campaignId = id; // Use the string ID if it's not a valid ObjectId
    }

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        // Get a single campaign
        const campaign = await campaignsCollection.findOne({
          $or: [{ _id: campaignId }, { id: id }],
        });

        if (!campaign) {
          return res.status(404).json({ message: "Campaign not found" });
        }

        return res.status(200).json(campaign);

      case "PUT":
        // Update a campaign
        const updateData = req.body;
        updateData.updatedAt = new Date().toISOString();

        const updateResult = await campaignsCollection.updateOne(
          { $or: [{ _id: campaignId }, { id: id }] },
          { $set: updateData },
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ message: "Campaign not found" });
        }

        const updatedCampaign = await campaignsCollection.findOne({
          $or: [{ _id: campaignId }, { id: id }],
        });

        return res.status(200).json(updatedCampaign);

      case "DELETE":
        // Delete a campaign
        const deleteResult = await campaignsCollection.deleteOne({
          $or: [{ _id: campaignId }, { id: id }],
        });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ message: "Campaign not found" });
        }

        return res
          .status(200)
          .json({ message: "Campaign deleted successfully" });

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(`Error handling campaign ${req.query.id}:`, error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
