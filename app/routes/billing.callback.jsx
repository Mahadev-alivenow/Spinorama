import { redirect } from "@remix-run/node"
import { authenticate } from "../shopify.server"
import { createSubscriptionMetafield } from "../models/Subscription.server"

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request)
    const { shop } = session

    // Check if the subscription was approved
    const url = new URL(request.url)
    const charge_id = url.searchParams.get("charge_id")

    if (charge_id) {
      // Query the subscription status
      const subscriptionQuery = await admin.graphql(
        `#graphql
        query GetAppSubscription($id: ID!) {
          node(id: $id) {
            ... on AppSubscription {
              id
              name
              status
              currentPeriodEnd
            }
          }
        }`,
        {
          variables: {
            id: `gid://shopify/AppSubscription/${charge_id}`,
          },
        },
      )

      const subscriptionData = await subscriptionQuery.json()
      const subscription = subscriptionData.data?.node

      if (subscription && subscription.status === "ACTIVE") {
        // Update subscription metafield
        await createSubscriptionMetafield(admin.graphql, true, shop)

        // Redirect to app with success message
        return redirect("/app?subscription=success")
      } else {
        // Subscription not active, redirect with error
        return redirect("/app?subscription=failed")
      }
    }

    // No charge_id, redirect to app
    return redirect("/app")
  } catch (error) {
    console.error("Billing callback error:", error)
    return redirect("/app?subscription=error")
  }
}

export default function BillingCallback() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Subscription...</h1>
        <p className="text-gray-600">Please wait while we confirm your subscription.</p>
      </div>
    </div>
  )
}
