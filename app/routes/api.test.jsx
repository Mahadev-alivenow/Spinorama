import { json } from "@remix-run/node";

export async function action({ request }) {
  console.log("Test route called successfully");
  return json({ success: true, message: "Test route working" });
}

export async function loader({ request }) {
  console.log("Test route GET called successfully");
  return json({ success: true, message: "Test route GET working" });
}
