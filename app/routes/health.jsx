import { json } from "@remix-run/node";

export async function loader() {
  return json({
    status: "ok",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000,
  });
}
