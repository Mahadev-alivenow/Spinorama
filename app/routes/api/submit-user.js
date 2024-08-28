import { json } from "@remix-run/node";
import clientPromise from "~/utils/db.server.js";

export async function action({ request }) {
  const client = await clientPromise;
  const db = client.db("shopify"); // Replace 'myDatabase' with your database name
  const collection = db.collection("shopdashboards"); // Replace 'users' with your collection name

  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");

  if (!username || !email) {
    return json({ error: "Username and email are required" }, { status: 400 });
  }

  const newUser = {
    username,
    email,
    createdAt: new Date(),
  };

  await collection.insertOne(newUser);

  console.log(newUser);

  return json({ success: true });
}
