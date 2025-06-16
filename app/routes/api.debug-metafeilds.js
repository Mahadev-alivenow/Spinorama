import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;

    // Get app installation ID
    const appIdQuery = await admin.graphql(`
      #graphql
      query {
        currentAppInstallation {
          id
          metafields(first: 20) {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `);

    const appIdQueryData = await appIdQuery.json();
    const metafields =
      appIdQueryData.data.currentAppInstallation.metafields.edges.map(
        (edge) => edge.node,
      );

    return json({
      success: true,
      shop,
      metafields,
    });
  } catch (error) {
    console.error("Error fetching metafields:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}
