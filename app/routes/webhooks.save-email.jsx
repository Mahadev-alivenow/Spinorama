import React from 'react'

function Page() {
  return (
    <div>Page</div>
  )
}

export default Page

// import { json } from "@remix-run/node";
// import { saveEmail } from "../models/Subscription.server";

// export async function action({ request, context }) {
//   try {
//     // Only allow POST requests
//     if (request.method !== "POST") {
//       return json({ error: "Method not allowed" }, { status: 405 });
//     }

//     // Parse the request body
//     const { email, campaignId, shop } = await request.json();

//     // Validate required fields
//     if (!email) {
//       return json({ error: "Email is required" }, { status: 400 });
//     }

//     if (!shop) {
//       return json({ error: "Shop is required" }, { status: 400 });
//     }

//     // Save the email using the server-side function
//     const result = await saveEmail(
//       context.admin.graphql,
//       email,
//       campaignId,
//       shop,
//     );

//     if (!result.success) {
//       return json({ error: result.error }, { status: 500 });
//     }

//     // Return success response
//     return json({
//       success: true,
//       message: "Email saved successfully",
//     });
//   } catch (error) {
//     console.error("Error saving email:", error);
//     return json({ error: "Failed to save email" }, { status: 500 });
//   }
// }

// // Handle OPTIONS requests for CORS preflight
// export async function loader({ request }) {
//   if (request.method === "OPTIONS") {
//     return new Response(null, {
//       status: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type",
//       },
//     });
//   }

//   return json({ error: "Method not allowed" }, { status: 405 });
// }
