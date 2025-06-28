// Add this as a new file: app/routes/test-auth.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;

    return json({
      success: true,
      shop: shop,
      message: "Authentication successful",
    });
  } catch (error) {
    return json({
      success: false,
      error: error.message,
    });
  }
}

export default function TestAuth() {
  return <div>Check console for auth test results</div>;
}
