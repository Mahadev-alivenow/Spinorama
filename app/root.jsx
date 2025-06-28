import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { Toaster } from "react-hot-toast";
import { CampaignProvider } from "./context/CampaignContext";
import { PlanProvider } from "./context/PlanContext";
import { useEffect } from "react";
import styles from "./styles/global.css?url";
import { AppProvider } from "@shopify/shopify-app-remix/react";

// Export CSS styles
export const links = () => [{ rel: "stylesheet", href: styles }];

// ✅ STEP 1: Add Content-Security-Policy (CSP) headers to allow iframe embedding in Shopify
export const headers = () => {
  return {
    "Content-Security-Policy":
      "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
  };
};

// Loader to fetch discount codes from Shopify (if authenticated)
export const loader = async ({ request }) => {
  const discountCodes = [];

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const embedded = url.searchParams.get("embedded");
  const host =
    url.searchParams.get("host") ||
    request.headers.get("x-shopify-shop-domain");

  try {
    const { authenticate } = await import("./shopify.server");
    const { getDiscountCodes } = await import("./models/Subscription.server");

    // const url = new URL(request.url);
    // const shop = url.searchParams.get("shop");
    // const embedded = url.searchParams.get("embedded");
    // const host = url.searchParams.get("host");

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
    host: process.env.HOST || "",
    shop: shop || "", // ✅ Add this
  });
};

export default function App() {
  const location = useLocation();

  const data = useLoaderData();
  const apiKey = data.apiKey || process.env.SHOPIFY_API_KEY || "";
  const query = new URLSearchParams(location.search);
  const shop = data.shop || query.get("shop") || "";
  const host =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("host")
      : undefined || data.host || process.env.HOST || "";

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

  if (!shop || !host) {
    console.error("Missing shop or host for AppBridge", { shop, host });
    return <div>Missing Shopify parameters.</div>; // Optional fallback
  }
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <title>Spinorama App</title>
        <link rel="icon" href="/favicon.ico" />
        <Meta />
        <Links />
        {/* ✅ Load Shopify App Bridge scripts in head with blocking behavior */}
        {/* <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <script src="https://unpkg.com/@shopify/app-bridge@3"></script> */}
      </head>
      <body>
        <AppProvider apiKey={apiKey} host={host} shop={shop} isEmbeddedApp>
          <PlanProvider initialDiscountCodes={data.discountCodes || []}>
            <CampaignProvider>
              <Outlet />
              <Toaster position="top-right" />
            </CampaignProvider>
          </PlanProvider>
          <ScrollRestoration />
          <Scripts />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                    window.ENV = ${JSON.stringify(data.ENV)};
                    let storedCodes;
                    try {
                      storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
                      storedCodes = storedCodes ? JSON.parse(storedCodes) : [];
                    } catch (e) {
                      console.error("Error parsing stored discount codes:", e);
                      storedCodes = [];
                    }
                    const serverCodes = ${JSON.stringify(data.discountCodes || [])};
                    window.GLOBAL_DISCOUNT_CODES = serverCodes.length > 0 ? serverCodes : storedCodes;
                    console.log("Global discount codes initialized:", window.GLOBAL_DISCOUNT_CODES);
                  `,
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
