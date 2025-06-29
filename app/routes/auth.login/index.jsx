import { redirect } from "@remix-run/node";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    console.log("Missing shop param at /auth, redirecting to /auth/login");
    return redirect("/auth/login");
  }

  return await login(request);
};
