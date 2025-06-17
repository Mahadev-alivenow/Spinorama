import { json } from "@remix-run/node";

export async function loader() {
  return json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 3000,
      host: process.env.HOST || "localhost",
      uptime: process.uptime(),
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}
