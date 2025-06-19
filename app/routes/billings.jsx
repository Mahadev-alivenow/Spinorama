import { json, redirect } from "@remix-run/node"
import { useLoaderData, Form } from "@remix-run/react"
import { authenticate } from "../shopify.server"

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request)
    const { shop } = session

    return json({
      shop,
      shopFormatted: shop.replace(/\.myshopify\.com$/i, ""),
    })
  } catch (error) {
    console.error("Billing loader error:", error)
    return redirect("/auth")
  }
}

export async function action({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request)
    const { shop } = session

    // Create a subscription charge using Shopify's GraphQL API
    const subscriptionMutation = await admin.graphql(
      `#graphql
      mutation AppSubscriptionCreate($name: String!, $returnUrl: URL!, $test: Boolean, $lineItems: [AppSubscriptionLineItemInput!]!) {
        appSubscriptionCreate(name: $name, returnUrl: $returnUrl, test: $test, lineItems: $lineItems) {
          appSubscription {
            id
            status
          }
          confirmationUrl
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          name: "Spinorama Monthly Plan",
          returnUrl: `${process.env.SHOPIFY_APP_URL}/billing/callback`,
          test: process.env.NODE_ENV === "development", // Set to false in production
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: { amount: 5, currencyCode: "USD" },
                  interval: "EVERY_30_DAYS",
                },
              },
            },
          ],
        },
      },
    )

    const subscriptionData = await subscriptionMutation.json()

    if (subscriptionData.data?.appSubscriptionCreate?.userErrors?.length > 0) {
      console.error("Subscription creation errors:", subscriptionData.data.appSubscriptionCreate.userErrors)
      return json({ error: "Failed to create subscription" }, { status: 400 })
    }

    const confirmationUrl = subscriptionData.data?.appSubscriptionCreate?.confirmationUrl

    if (confirmationUrl) {
      // Redirect to Shopify's subscription confirmation page
      return redirect(confirmationUrl)
    } else {
      return json({ error: "No confirmation URL received" }, { status: 400 })
    }
  } catch (error) {
    console.error("Billing action error:", error)
    return json({ error: "Failed to process subscription" }, { status: 500 })
  }
}

export default function Billing() {
  const data = useLoaderData()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-4">Subscribe to Spinorama</h1>
        <p className="text-gray-600 mb-6">Unlock all features with our monthly subscription plan.</p>

        <div className="bg-indigo-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Monthly Plan</h2>
          <p className="text-3xl font-bold text-indigo-600 mb-2">$5/month</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ 20 spin-to-win campaigns</li>
            <li>✓ Email collection & analytics</li>
            <li>✓ Customizable wheels and rewards</li>
            <li>✓ Lead collection with discounts</li>
            <li>✓ Priority support</li>
          </ul>
        </div>

        <Form method="post">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Subscribe Now
          </button>
        </Form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You will be redirected to Shopify to confirm your subscription. Cancel anytime from your Shopify admin.
        </p>
      </div>
    </div>
  )
}
