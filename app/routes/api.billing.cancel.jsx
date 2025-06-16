import { json } from "@remix-run/node";

export async function action({ request }) {
  const { authenticate, billing } = await import("../shopify.server");

  try {
    // Authenticate the request
    const { admin, session } = await authenticate.admin(request);

    // Parse the request body
    const body = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return json({ error: "Subscription ID is required" }, { status: 400 });
    }

    // Cancel the subscription
    // Note: This is a simplified example. In a real app, you would use the GraphQL Admin API
    // to cancel the subscription using the subscriptionId
    const cancelResponse = await admin.graphql(
      `
      mutation cancelAppSubscription($id: ID!) {
        appSubscriptionCancel(id: $id) {
          appSubscription {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
      {
        variables: {
          id: subscriptionId,
        },
      },
    );

    const responseJson = await cancelResponse.json();

    if (responseJson.errors) {
      return json(
        {
          success: false,
          message: responseJson.errors[0].message,
        },
        { status: 400 },
      );
    }

    if (responseJson.data.appSubscriptionCancel.userErrors.length > 0) {
      return json(
        {
          success: false,
          message:
            responseJson.data.appSubscriptionCancel.userErrors[0].message,
        },
        { status: 400 },
      );
    }

    return json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription: responseJson.data.appSubscriptionCancel.appSubscription,
    });
  } catch (error) {
    console.error("Billing cancellation error:", error);
    return json(
      {
        success: false,
        message:
          error.message ||
          "An error occurred while cancelling your subscription",
      },
      { status: 500 },
    );
  }
}

export async function loader() {
  return json({ message: "Use POST to cancel a subscription" });
}
