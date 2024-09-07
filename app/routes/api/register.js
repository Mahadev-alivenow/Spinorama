// app/routes/api/storefront-submit.jsx
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { getDb } from "../../utils/db.server"; // Assume you have a utility to connect to MongoDB

export const action = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");

  // Basic validation
  if (!username || !email) {
    return json({ error: "Username and email are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Invalid email format." }, { status: 400 });
  }

  try {
    const db = await getDb();

    // Check if email already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return json(
        { error: "Email already exists. Please use a different email." },
        { status: 400 },
      );
    }

    // Insert new user into the database
    await db.collection("users").insertOne({
      username,
      email,
      createdAt: new Date(),
    });

    return json({ success: "User registered successfully." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
};
