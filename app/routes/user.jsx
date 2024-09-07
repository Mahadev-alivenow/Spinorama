// 1. Import necessary modules from Remix and MongoDB
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Form } from "react-router-dom";
import { db } from "../utils/db.server"; // Ensure you have a MongoDB connection file like db.server.ts

// 2. Define the action function that handles the form submission
export const action = async ({ request }) => {
  // 3. Get the submitted form data
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");

  console.log(formData);
  // 4. Validate the form data
  if (!username || !email) {
    return json({ error: "Username and email are required" }, { status: 400 });
  }

  // 5. Connect to MongoDB
  //   const client = await client();
  // console.log(clientPromise);
  const database = await db();
  const users = database.collection("shopifyUsers");

  // const db = await clientPromise.db(process.env.DB_NAME);
  // const users = db.collection("users");

  // 6. Check if the email already exists in the database
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return json({ error: "Email is already in use" }, { status: 400 });
  }

  // 7. Save the new user data
  const newUser = { username, email, createdAt: new Date() };
  await users.insertOne(newUser);
  console.log("inserted : ", newUser);
  // 8. Redirect to a success page (optional)
  // return redirect("/success");
  return json({ message: "User created successfully" }, { status: 200 });
};

// 9. Create the frontend form (see next section)
export default function UserForm() {
  const actionData = useActionData();
  console.log(actionData);
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
    </div>
  );
}
