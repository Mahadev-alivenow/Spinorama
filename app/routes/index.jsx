import { redirect } from "@remix-run/node";
import { authenticate, isClientSideNavigation } from "../shopify.server";

export async function loader({ request }) {
  try {
    // Check if user is already authenticated
    const { admin, session } = await authenticate.admin(request);

    if (session && session.shop) {
      // User is authenticated, redirect to the app
      return redirect("/app");
    }

    // If we get here without a session, redirect to auth
    return redirect("/auth/login");
  } catch (error) {
    console.log("Index loader - authentication check failed:", error?.message);

    // Check if this is client-side navigation
    if (isClientSideNavigation(request)) {
      // For client navigation, redirect to app (it will handle fallback)
      return redirect("/app");
    }

    // For direct navigation, check if we have shop parameter
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (shop) {
      return redirect(`/auth?shop=${shop}`);
    }

    // Default to login page
    return redirect("/auth/login");
  }
}

export default function Index() {
  // This component won't be rendered since we're redirecting in the loader
  return null;
}
