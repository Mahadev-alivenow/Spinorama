import { useLoaderData } from "@remix-run/react";
import { getDb } from "~/utils/db.server";

export async function loader() {
  const db = await getDb();
  const data = await db.collection("shopdashboards").find({}).toArray();
  return data;
}

export default function BodyExtension() {
  const data = useLoaderData();

  return (
    <div>
      <h2>Custom Body Extension with MongoDB Data</h2>
      <ul>
        {data.map((item) => (
          <li key={item._id}>{item.username}</li>
        ))}
      </ul>
    </div>
  );
}
