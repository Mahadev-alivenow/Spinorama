import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import { useLocation } from "@remix-run/react";
import { useMemo } from "react";

export default function ShopifyAppBridgeProvider({ children, apiKey }) {
  const location = useLocation();

  const host = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("host") || "";
  }, [location.search]);

  if (!host) return null;

  return (
    <AppBridgeProvider
      config={{
        apiKey,
        host,
        forceRedirect: true,
      }}
    >
      {children}
    </AppBridgeProvider>
  );
}
