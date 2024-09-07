
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
console.log(`${process.env.MONGO_URI}`);
const uri = `${process.env.MONGO_URI}`; // Replace with your connection string
// const uri = "mongodb://localhost:27017/"; // Replace with your connection string
const client = new MongoClient(uri);

async function testConnection() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  } finally {
    await client.close();
  }
}

testConnection();
