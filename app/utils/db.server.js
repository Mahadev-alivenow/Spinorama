// src/utils/db.server.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

let client;
let clientPromise;

if (!client) {
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
    console.log("connected mongo db-------");
}

export async function db() {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME); // Replace "mydatabase" with your database name
}

// let client;
// let clientPromise;

// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(process.env.MONGODB_URI);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
//   console.log("connected mongo dev-------");
// } else {
//   client = new MongoClient(process.env.MONGODB_URI);
//   clientPromise = client.connect();
//   console.log("connected mongo server-------");
// }
// export default clientPromise;

// export async function getDb() {
//   const client = await clientPromise;
//   console.log(client.db(process.env.DB_NAME));
//   return client.db(process.env.DB_NAME);
// }
// import { MongoClient } from "mongodb";

// // Global declaration to avoid re-initializing MongoClient across hot reloads
// declare global {
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// // Ensure you have your MongoDB URI in the environment variables
// const uri = process.env.MONGO_URI || "";

// if (!uri) {
//   throw new Error("Please add your Mongo URI to the .env file");
// }

// // Only instantiate MongoClient once, and reuse it across requests
// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// // Export the connection function
// export async function getClient() {
//   return clientPromise;
// }
