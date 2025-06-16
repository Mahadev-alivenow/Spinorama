
import { Shopify } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-remix";

// Initialize Shopify API
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: [
    "read_products",
    "write_products",
    "read_customers",
    "write_customers",
    "read_orders",
    "write_orders",
    "read_discounts",
    "write_discounts",
  ],
  appUrl: process.env.SHOPIFY_APP_URL,
});

export const authenticate = shopify.authenticate;
export default shopify;

/**
 * Authenticate a request to the Shopify API
 * @param {Request} request - The incoming request
 * @returns {Promise<{session: Session, admin: Admin}>} - The authenticated session and admin API client
 */
// export async function authenticateShopifyAPI(request) {
//   try {
//     // Get the session from the request
//     const session = await shopify.authenticateSession(request);

//     if (!session) {
//       return { session: null, admin: null };
//     }

//     // Create an admin API client
//     const admin = new Shopify.Clients.Graphql(
//       session.shop,
//       session.accessToken,
//     );

//     return { session, admin };
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return { session: null, admin: null };
//   }
// }
