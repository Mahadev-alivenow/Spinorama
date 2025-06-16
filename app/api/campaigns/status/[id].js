import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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

    // Find the campaign
    const campaign = await campaignsCollection.findOne({
      $or: [{ _id: campaignId }, { id: id }],
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Toggle the status
    const newStatus = campaign.status === "active" ? "draft" : "active";

    // Update the campaign
    const updateResult = await campaignsCollection.updateOne(
      { $or: [{ _id: campaignId }, { id: id }] },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return res.status(200).json({
      id: campaign._id || campaign.id,
      status: newStatus,
      message: `Campaign ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error(`Error toggling campaign status for ${req.query.id}:`, error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
