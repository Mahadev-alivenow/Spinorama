import { json } from "@remix-run/node";
import { createSubscriptionMetafield } from "../models/Subscription.server";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  try {
    const formData = await request.formData();
    const hasPlan = formData.get("hasPlan") || "false";
    const position = formData.get("position") || "bottom-right";

    const result = await createSubscriptionMetafield(
      admin.graphql,
      hasPlan,
      position,
    );

    return json({ success: true, message: "Metafields updated successfully" });
  } catch (error) {
    console.error("Error updating metafields:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function loader() {
  return json({ message: "Use POST to update metafields" });
}
