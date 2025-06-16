"use client";

import { json } from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { getActiveCampaign } from "../models/Subscription.server";
import { useState } from "react";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  // Get active campaign
  const activeCampaign = await getActiveCampaign(shop);

  // Get app metafields
  const metafieldsQuery = await admin.graphql(`
    #graphql
    query {
      currentAppInstallation {
        id
        metafields(first: 20) {
          edges {
            node {
              id
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  `);

  const metafieldsData = await metafieldsQuery.json();
  const metafields =
    metafieldsData.data.currentAppInstallation.metafields.edges.map(
      (edge) => edge.node,
    );

  return json({
    shop,
    activeCampaign,
    metafields,
  });
}

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "sync-metafields") {
    try {
      const response = await fetch(
        `${process.env.APP_URL}/api/sync-campaign-metafields`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shop }),
        },
      );

      const result = await response.json();
      return json({
        success: true,
        message: "Campaign synced to metafields successfully",
        result,
      });
    } catch (error) {
      return json({ success: false, message: error.message });
    }
  }

  if (action === "test-db") {
    try {
      const activeCampaign = await getActiveCampaign(shop);
      return json({
        success: true,
        message: activeCampaign
          ? `Database connection successful. Found active campaign: ${activeCampaign.name}`
          : "Database connection successful, but no active campaign found.",
      });
    } catch (error) {
      return json({ success: false, message: error.message });
    }
  }

  return json({ success: false, message: "Invalid action" });
}

export default function Settings() {
  const data = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showMetafields, setShowMetafields] = useState(false);

  const isLoading = navigation.state === "submitting";

  const wheelOfWondersMetafields = data.metafields.filter(
    (metafield) => metafield.namespace === "wheel-of-wonders",
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Campaign Settings</h2>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Active Campaign</h3>
          {data.activeCampaign ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="font-medium text-green-800">
                {data.activeCampaign.name}
              </p>
              <p className="text-sm text-green-700">
                ID: {data.activeCampaign.id}
              </p>
              <p className="text-sm text-green-700">
                Status: {data.activeCampaign.status}
              </p>
              <p className="text-sm text-green-700">
                Created:{" "}
                {new Date(data.activeCampaign.createdAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-yellow-700">No active campaign found.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form method="post">
            <input type="hidden" name="action" value="test-db" />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading && navigation.formData?.get("action") === "test-db"
                ? "Testing..."
                : "Test Database Connection"}
            </button>
          </Form>

          <Form method="post">
            <input type="hidden" name="action" value="sync-metafields" />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              disabled={isLoading || !data.activeCampaign}
            >
              {isLoading &&
              navigation.formData?.get("action") === "sync-metafields"
                ? "Syncing..."
                : "Sync Active Campaign to Store"}
            </button>
          </Form>
        </div>

        {actionData && (
          <div
            className={`mt-4 p-4 rounded ${actionData.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            <p>{actionData.message}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">App Metafields</h2>
          <button
            onClick={() => setShowMetafields(!showMetafields)}
            className="text-blue-600 hover:underline"
          >
            {showMetafields ? "Hide" : "Show"} Metafields
          </button>
        </div>

        {showMetafields && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Namespace
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wheelOfWondersMetafields.length > 0 ? (
                  wheelOfWondersMetafields.map((metafield) => (
                    <tr key={metafield.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metafield.namespace}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {metafield.key}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metafield.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metafield.type}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No wheel-of-wonders metafields found. Click "Sync Active
                      Campaign to Store" to create them.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
