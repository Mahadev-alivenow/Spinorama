// 1. Import necessary modules from Remix and MongoDB
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Form } from "react-router-dom";
import { db } from "../utils/db.server"; // Ensure you have a MongoDB connection file

// 2. Define the action function that handles the form submission and CORS headers
export const action = async ({ request }) => {
  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS", // Allowed HTTP methods
        "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
      },
    });
  }

  // 3. Get the submitted form data
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");

  // 4. Validate the form data
  if (!username || !email) {
    return json(
      { error: "Username and email are required" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
        },
      },
    );
  }

  // 5. Connect to MongoDB
  const database = await db();
  const users = database.collection("shopifyUsers");

  // 6. Check if the email already exists in the database
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return json(
      { error: "Email is already in use" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
        },
      },
    );
  }

  // 7. Save the new user data
  const newUser = { username, email, createdAt: new Date() };
  await users.insertOne(newUser);

  // 8. Return success response with CORS headers
  return json(
    { message: "User created successfully" },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://spiny-wheel.myshopify.com", // Allow Shopify domain
      },
    },
  );
};

// 9. Create the frontend form component
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
