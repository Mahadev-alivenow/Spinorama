// 1. Import necessary modules from Remix and MongoDB
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Form } from "react-router-dom";
import { db } from "../utils/db.server"; // Ensure you have a MongoDB connection file like db.server.ts

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
          status: 409,
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