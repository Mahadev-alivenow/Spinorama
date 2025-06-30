import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import {
  getActiveCampaign,
  getDiscountCodes,
  getSubscriptionStatus,
  syncActiveCampaignToMetafields,
} from "../models/Subscription.server";
import { PlanProvider } from "../context/PlanContext";
import { CampaignProvider } from "../context/CampaignContext";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { data } from "autoprefixer";
// import styles from "./styles/global.css?url";
import styles from "../styles/global.css?url";

// export const links = () => [{ rel: "stylesheet", href: polarisStyles }];
export const links = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ request }) => {
  
  const discountCodes = [];
  let activeCampaign = null;

  // await authenticate.admin(request);

  const url = new URL(request.url);
  const host = url.searchParams.get("host");

  const shop = url.searchParams.get("shop");
  const embedded = url.searchParams.get("embedded");

  if (!host) {
    throw new Error("Missing host query param in URL");
  }

  try {
    // const { getDiscountCodes } = await import("./models/Subscription.server");

    if (
      shop ||
      embedded ||
      host ||
      request.headers.get("x-shopify-shop-domain")
    ) {
      console.log(
        "Root loader - attempting authentication for Shopify app request...",
      );

      const { admin, session } = await authenticate.admin(request);

      // const subscriptions = await getSubscriptionStatus(admin.graphql);
      // const activeSubscriptions =
      //   subscriptions.data.app.installation.activeSubscriptions;

      // console.log("App - Active subscriptions:", activeSubscriptions);

      // if (activeSubscriptions.length > 0) {
      //   console.log("has active subscription", activeSubscriptions);
      // }else {
      //   console.log("No active subscription found for shop:", shop);
      //   return redirect(
      //     `https://admin.shopify.com/store/${shop}/charges/spinorama/pricing_plans`,
      //   );

      // }
      if (admin && session) {
        console.log("Root loader - attempting to fetch discount codes...");
        const discountCode = await getDiscountCodes(admin.graphql);
        const nodes = discountCode?.data?.discountNodes?.edges || [];

        console.log("Root loader - raw discount nodes:", nodes.length);

        for (const { node } of nodes) {
          const discount = node.discount;
          const title = discount?.title || "N/A";
          const summary = discount?.summary || "N/A";

          if (discount?.codes?.edges?.length > 0) {
            for (const codeEdge of discount.codes.edges) {
              const code = codeEdge?.node?.code || "N/A";
              discountCodes.push({
                id: node.id,
                title,
                summary,
                code,
                type: discount.__typename || "DiscountCodeBasic",
              });
            }
          } else {
            discountCodes.push({
              id: node.id,
              title,
              summary,
              code: null,
              type: discount.__typename || "DiscountCodeBasic",
            });
          }
        }

        console.log("Root loader - processed discount codes:", discountCodes);

        // Try to get active campaign, but don't fail if it errors
        try {
          activeCampaign = await getActiveCampaign(shop);
          if (activeCampaign) {
            await syncActiveCampaignToMetafields(admin.graphql, shop);
          }
        } catch (campaignError) {
          console.log(
            "App - Could not fetch/sync campaign:",
            campaignError.message,
          );
          // Continue without campaign
        }
      } else {
        console.log(
          "Root loader - authentication successful but no admin/session available",
        );
      }
    } else {
      console.log(
        "Root loader - not a Shopify app request, skipping authentication",
      );
    }
  } catch (error) {
    console.log(
      "Root loader - could not fetch discount codes:",
      error?.message || "Unknown error",
    );

    if (error && error.status === 302) {
      console.log(
        "Root loader - received redirect response, this is normal for unauthenticated requests",
      );
    }
  }

  return json({
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
    },
    apiKey: process.env.SHOPIFY_API_KEY || "",
    discountCodes,
    host,
    shop,
    hasCampaign: !!activeCampaign,
  });
};

export default function App() {
  const data = useLoaderData();
const location = useLocation();
  const apiKey = data.apiKey || process.env.SHOPIFY_API_KEY || "";
  const query = new URLSearchParams(location.search);
  const shop = data.shop || query.get("shop") || "";
  const host = data.host || process.env.HOST || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (data.discountCodes && data.discountCodes.length > 0) {
        window.GLOBAL_DISCOUNT_CODES = data.discountCodes;
        console.log(
          "Root - Setting global discount codes:",
          data.discountCodes,
        );

        try {
          localStorage.setItem(
            "GLOBAL_DISCOUNT_CODES",
            JSON.stringify(data.discountCodes),
          );
        } catch (e) {
          console.error("Failed to store discount codes in localStorage:", e);
        }
      } else {
        try {
          const storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
          if (storedCodes) {
            const parsedCodes = JSON.parse(storedCodes);
            if (parsedCodes && parsedCodes.length > 0) {
              window.GLOBAL_DISCOUNT_CODES = parsedCodes;
              console.log(
                "Root - Using stored discount codes from localStorage:",
                parsedCodes.length,
              );
            }
          }
        } catch (e) {
          console.error(
            "Failed to retrieve discount codes from localStorage:",
            e,
          );
        }
      }
    }
  }, [data.discountCodes]);

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} host={host}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
      </NavMenu>
      <PlanProvider initialDiscountCodes={data.discountCodes || []}>
        <CampaignProvider>
          <Outlet />
          <Toaster position="top-right" />
        </CampaignProvider>
      </PlanProvider>
    </AppProvider>
  );
}


// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
