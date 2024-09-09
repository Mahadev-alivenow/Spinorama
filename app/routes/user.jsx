import { json } from "@remix-run/node";
import { db } from "../utils/db.server";
import { useActionData } from "@remix-run/react";

export const action = async ({ request }) => {
  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS", // Allowed HTTP methods
        "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
        "Access-Control-Max-Age": "86400", // Cache the preflight response for 1 day
      },
    });
  }

  // Proceed with the form submission if the request is POST
  if (request.method === "POST") {
    const formData = await request.formData();
    const username = formData.get("username");
    const email = formData.get("email");

    if (!username || !email) {
      return json(
        { error: "Username and email are required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      );
    }

    // Connect to MongoDB
    const database = await db();
    const users = database.collection("shopifyUsers");

    // Check if the email already exists in the database
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return json(
        { error: "Email is already in use" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      );
    }

    // Save the new user data
    const newUser = { username, email, createdAt: new Date() };
    await users.insertOne(newUser);

    return json(
      { message: "User created successfully" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  }

  // If it's not an OPTIONS or POST request, return a method not allowed response
  return json(
    { error: "Method Not Allowed" },
    {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
};

// Frontend form component
export default function UserForm() {
  const actionData = useActionData();

  return (
    <div>
      <h1>Create a new user</h1>
      <Form method="post">
        <label>Name:</label>
        <input type="text" name="username" required />
        <br />
        <label>Email:</label>
        <input type="email" name="email" required />
        <br />
        <button type="submit">Submit</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      {actionData?.message && (
        <p style={{ color: "green" }}>{actionData.message}</p>
      )}
    </div>
  );
}
