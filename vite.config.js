import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

installGlobals({ nativeFetch: true });

// Handle Shopify URL configuration
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST
  ? process.env.HOST.replace("https://", "")
  : "localhost";
const hmrConfig =
  host === "localhost"
    ? {
        protocol: "ws",
        host: "localhost",
        port: 8002,
        timeout: 30000,
      }
    : { protocol: "wss", host: host, timeout: 30000 };

export default defineConfig({
  server: {
    allowedHosts: [host, "thou-sparc-players-entire.trycloudflare.com"],
    cors: {
      preflightContinue: true,
    },
    port: port,
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
    hmr: hmrConfig,
    fs: {
      allow: ["app", "node_modules"],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: false,
        v3_routeConfig: true,
      },
      serverBuildPath: "build/server/index.js",
    }),
    tsconfigPaths(),
  ],
  define: {
    global: "globalThis",
  },
  build: {
    assetsInlineLimit: 0,
    cssCodeSplit: false, // Important: Keep CSS together
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          // Ensure CSS files have consistent naming
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@shopify/app-bridge-react", "@shopify/polaris"],
  },
  ssr: {
    noExternal: ["@shopify/app-bridge-react", "@shopify/polaris"],
  },
});
