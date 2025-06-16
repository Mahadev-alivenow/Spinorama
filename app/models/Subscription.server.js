import { MongoClient } from "mongodb";

// Connection URI
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Please add your MongoDB URI to .env file");
}

let client;
let clientPromise;

// Connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Create a global MongoDB connection promise
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise && uri) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log("Connected to MongoDB (Development)");
        return client;
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB (Development):", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  if (uri) {
    client = new MongoClient(uri, options);
    clientPromise = client
      .connect()
      .then((client) => {
        console.log("Connected to MongoDB (Production)");
        return client;
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB (Production):", err);
        throw err;
      });
  }
}

// Helper function to format shop name for use as database name
function formatShopName(shopName) {
  if (!shopName) return "wheel-of-wonders";

  // Remove 'myshopify.com' if present
  let formattedName = shopName.replace(/\.myshopify\.com$/i, "");

  // Replace invalid characters with underscores
  formattedName = formattedName.replace(/[/\\. "$*<>:|?]/g, "_");

  // Prepend 'shop_' to ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(formattedName)) {
    formattedName = "shop_" + formattedName;
  }

  console.log(`Formatted shop name: ${shopName} -> ${formattedName}`);
  return formattedName;
}

// Connect to MongoDB
export async function connectToDatabase(shopName = null) {
  if (!clientPromise) {
    throw new Error(
      "MongoDB connection not initialized. Check your MONGODB_URI.",
    );
  }

  try {
    const client = await clientPromise;

    // Use the provided shop name, or default to wheel-of-wonders
    const effectiveShopName = shopName || "wheel-of-wonders.myshopify.com";

    // Format the shop name for database use
    const dbName = formatShopName(effectiveShopName);

    console.log(
      `Connecting to database: ${dbName} (from shop: ${effectiveShopName})`,
    );

    const db = client.db(dbName);

    return { client, db, dbName };
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

// Get active campaign from MongoDB
export async function getActiveCampaign(shopName = null) {
  try {
    const { db } = await connectToDatabase(shopName);
    const campaignsCollection = db.collection("campaigns");

    console.log("Looking for active campaign...");
    const activeCampaign = await campaignsCollection.findOne({
      status: "active",
    });

    if (activeCampaign) {
      console.log(
        "Found active campaign:",
        activeCampaign.name,
        "ID:",
        activeCampaign.id,
      );
    } else {
      console.log("No active campaign found");
    }

    return activeCampaign;
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return null;
  }
}

export async function getSubscriptionStatus(graphql) {
  const result = await graphql(
    `
      #graphql
      query Shop {
        app {
          installation {
            launchUrl
            activeSubscriptions {
              id
              name
              createdAt
              returnUrl
              status
              currentPeriodEnd
              trialDays
              test
            }
          }
        }
      }
    `,
    { variables: {} },
  );

  const res = await result.json();
  return res;
}

// Create metafields for the active campaign
export async function syncActiveCampaignToMetafields(graphql, shopName) {
  try {
    // Get the active campaign from MongoDB
    const activeCampaign = await getActiveCampaign(shopName);

    if (!activeCampaign) {
      console.log("No active campaign found to sync to metafields");
      return { success: false, message: "No active campaign found" };
    }

    console.log("Syncing active campaign to metafields:", activeCampaign.name);

    // Extract layout and content information
    const layout = activeCampaign.layout || {};
    const content = activeCampaign.content || {};
    const rules = activeCampaign.rules || {};

    // Layout defaults
    const floatingButtonHasText =
      layout.floatingButtonHasText === true ? "true" : "false";
    const floatingButtonPosition =
      layout.floatingButtonPosition || "bottomRight";
    const floatingButtonText = layout.floatingButtonText || "";
    const showFloatingButton =
      layout.showFloatingButton === true ? "true" : "false";
    const primaryColor = activeCampaign.primaryColor || "#ffc700";
    const secondaryColor = activeCampaign.secondaryColor || "#ffffff";
    const tertiaryColor = activeCampaign.tertiaryColor || "#000000";
    const wheelSectors = String(layout.wheelSectors || "six");
    const envSelection = layout.theme || "light";
    const versionSelection = layout.popupLayout || "bottom";
    const displayStyle = layout.displayStyle || "popup";
    const colorTone = activeCampaign.color || "dualTone";
    const logoImage = layout.logo || "";

    // Content defaults
    const landing = content.landing || {};
    const headlineText = landing.title || "TRY YOUR LUCK";
    const headlineChildText =
      landing.subtitle || "This is a demo of our Spin to Win";
    const showLandingSubtitle =
      landing.showSubtitle === true ? "true" : "false";
    const showEmail = landing.showEmail === true ? "true" : "false";
    const emailPlaceholder = landing.emailPlaceholder || "Enter your Email";
    const showPrivacyPolicy =
      landing.showPrivacyPolicy === true ? "true" : "false";
    const termCondText =
      landing.privacyPolicyText || "I accept the terms and conditions";
    const landingButtonText = landing.buttonText || "SPIN";

    const result = content.result || {};
    const headlineResultText = result.title || "CONGRATULATIONS";
    const showResultSubtitle = result.showSubtitle === true ? "true" : "false";
    const resultSubtitle = result.subtitle || "";
    const showResultButton = result.showButton === true ? "true" : "false";
    const resultButtonText = result.buttonText || "REDEEM NOW";

    const wheel = content.wheel || {};
    const wheelSectorsData = wheel.sectors || [];
    const copySameCode = wheel.copySameCode === true ? "true" : "false";
    // Serialize sectors array for storage
    const wheelSectorsJson = JSON.stringify(wheelSectorsData);

    // Trigger settings
    const appearingRules = rules.appearingRules || {};
    const triggersJson = JSON.stringify({
      trigger_clicks_enabled: appearingRules.clicksCount?.enabled || false,
      trigger_clicks_value: appearingRules.clicksCount?.count || 0,

      trigger_exitIntent_enabled: appearingRules.exitIntent?.enabled || false,
      trigger_exitIntent_device: "desktop", // or dynamically detect if needed

      trigger_inactivity_enabled: false, // Not currently supported in rules, fallback
      trigger_inactivity_seconds: 10, // Default fallback

      trigger_pageCount_enabled: appearingRules.pageCount?.enabled || false,
      trigger_pageCount_pages: appearingRules.pageCount?.count || 1,

      trigger_pageScroll_enabled: appearingRules.pageScroll?.enabled || false,
      trigger_pageScroll_percentage:
        appearingRules.pageScroll?.percentage || 50,

      trigger_timeDelay_enabled: appearingRules.timeDelay?.enabled || false,
      trigger_timeDelay_seconds: appearingRules.timeDelay?.seconds || 5,
    });

    // App installation ID
    const appIdQuery = await graphql(`
      #graphql
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    const appInstallationID = (await appIdQuery.json()).data
      .currentAppInstallation.id;

    console.log("App Installation ID:", appInstallationID);

    // Build all metafields
    const metafieldsInput = [
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonHasText",
        type: "boolean",
        value: floatingButtonHasText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonPosition",
        type: "single_line_text_field",
        value: floatingButtonPosition,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonText",
        type: "single_line_text_field",
        value: floatingButtonText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "showFloatingButton",
        type: "boolean",
        value: showFloatingButton,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "displayStyle",
        type: "single_line_text_field",
        value: displayStyle,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "primaryColor",
        type: "single_line_text_field",
        value: primaryColor,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "secondaryColor",
        type: "single_line_text_field",
        value: secondaryColor,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "tertiaryColor",
        type: "single_line_text_field",
        value: tertiaryColor,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "activeCampaignId",
        type: "single_line_text_field",
        value: activeCampaign.id || "",
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "wheelSectors",
        type: "single_line_text_field",
        value: wheelSectors,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "wheelSectorsData",
        type: "json",
        value: wheelSectorsJson,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "envSelection",
        type: "single_line_text_field",
        value: envSelection,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "versionSelection",
        type: "single_line_text_field",
        value: versionSelection,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "colorTone",
        type: "single_line_text_field",
        value: colorTone,
        ownerId: appInstallationID,
      },
      //{ namespace: "wheel-of-wonders", key: "logoImage", type: "single_line_text_field", value: logoImage, ownerId: appInstallationID },
      // Landing page metafields
      {
        namespace: "wheel-of-wonders",
        key: "headlineText",
        type: "single_line_text_field",
        value: headlineText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "headlineChildText",
        type: "single_line_text_field",
        value: headlineChildText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "emailPlaceholder",
        type: "single_line_text_field",
        value: emailPlaceholder,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "termCondText",
        type: "single_line_text_field",
        value: termCondText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "landingButtonText",
        type: "single_line_text_field",
        value: landingButtonText,
        ownerId: appInstallationID,
      },
      // Result page metafields
      {
        namespace: "wheel-of-wonders",
        key: "headlineResultText",
        type: "single_line_text_field",
        value: headlineResultText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "resultSubtitle",
        type: "single_line_text_field",
        value: resultSubtitle,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "resultButtonText",
        type: "single_line_text_field",
        value: resultButtonText,
        ownerId: appInstallationID,
      },
      // Default coupon result
      {
        namespace: "wheel-of-wonders",
        key: "couponResult",
        type: "number_integer",
        value: "2",
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "triggersData",
        type: "json",
        value: triggersJson,
        ownerId: appInstallationID,
      },
    ];

    // Remove any entries with blank values to avoid Shopify errors
    const filteredMetafields = metafieldsInput.filter(
      (mf) => mf.value !== undefined && mf.value !== null && mf.value !== "",
    );

    // Execute mutation
    const metafieldsMutation = await graphql(
      `
        mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { variables: { metafields: filteredMetafields } },
    );

    const data = await metafieldsMutation.json();
    if (data.data?.metafieldsSet?.userErrors?.length) {
      console.error(
        "Metafield userErrors:",
        data.data.metafieldsSet.userErrors,
      );
      return { success: false, errors: data.data.metafieldsSet.userErrors };
    }

    console.log(
      "Successfully synced campaign to metafields :",
      data.data.metafieldsSet.metafields,
    );
    return {
      success: true,
      metafields: data.data.metafieldsSet.metafields,
      campaignId: activeCampaign.id,
    };
  } catch (error) {
    console.error("Error syncing campaign to metafields:", error)
    return { success: false, error: error.message }
  }
}

// Create metafields for the active campaign
// export async function syncActiveCampaignToMetafieldsRules(graphql, shopName) {
//   try {
//     const activeCampaign = await getActiveCampaign(shopName);

//     if (!activeCampaign) {
//       console.log("No active campaign found to sync to metafields");
//       return { success: false, message: "No active campaign found" };
//     }

//     console.log("Syncing active campaign to metafields:", activeCampaign.name);

//     const layout = activeCampaign.layout || {};
//     const content = activeCampaign.content || {};
//     const triggers = activeCampaign.triggers || {};

//     const floatingButtonHasText = layout.floatingButtonHasText === true ? "true" : "false";
//     const floatingButtonPosition = layout.floatingButtonPosition || "bottomRight";
//     const floatingButtonText = layout.floatingButtonText || "";
//     const showFloatingButton = layout.showFloatingButton === true ? "true" : "false";
//     const primaryColor = activeCampaign.primaryColor || "#ffc700";
//     const secondaryColor = activeCampaign.secondaryColor || "#ffffff";
//     const tertiaryColor = activeCampaign.tertiaryColor || "#000000";
//     const wheelSectors = String(layout.wheelSectors || "six");
//     const envSelection = layout.theme || "light";
//     const versionSelection = layout.popupLayout || "bottom";
//     const displayStyle = layout.displayStyle || "popup";
//     const colorTone = activeCampaign.color || "dualTone";
//     const logoImage = layout.logo || "";

//     const landing = content.landing || {};
//     const headlineText = landing.title || "TRY YOUR LUCK";
//     const headlineChildText = landing.subtitle || "This is a demo of our Spin to Win";
//     const showLandingSubtitle = landing.showSubtitle === true ? "true" : "false";
//     const showEmail = landing.showEmail === true ? "true" : "false";
//     const emailPlaceholder = landing.emailPlaceholder || "Enter your Email";
//     const showPrivacyPolicy = landing.showPrivacyPolicy === true ? "true" : "false";
//     const termCondText = landing.privacyPolicyText || "I accept the terms and conditions";
//     const landingButtonText = landing.buttonText || "SPIN";

//     const result = content.result || {};
//     const headlineResultText = result.title || "CONGRATULATIONS";
//     const showResultSubtitle = result.showSubtitle === true ? "true" : "false";
//     const resultSubtitle = result.subtitle || "";
//     const showResultButton = result.showButton === true ? "true" : "false";
//     const resultButtonText = result.buttonText || "REDEEM NOW";

//     const wheel = content.wheel || {};
//     const wheelSectorsData = wheel.sectors || [];
//     const copySameCode = wheel.copySameCode === true ? "true" : "false";
//     const wheelSectorsJson = JSON.stringify(wheelSectorsData);

//     // Trigger data (newly added)
//     const trigger_clicks_enabled = (triggers.clicksCount?.enabled === true) ? "true" : "false";
//     const trigger_clicks_value = String(triggers.clicksCount?.clicks ?? "2");

//     const trigger_exitIntent_enabled = (triggers.exitIntent?.enabled === true) ? "true" : "false";
//     const trigger_exitIntent_device = triggers.exitIntent?.device || "desktop";

//     const trigger_inactivity_enabled = (triggers.inactivity?.enabled === true) ? "true" : "false";
//     const trigger_inactivity_seconds = String(triggers.inactivity?.seconds ?? "30");

//     const trigger_pageCount_enabled = (triggers.pageCount?.enabled === true) ? "true" : "false";
//     const trigger_pageCount_pages = String(triggers.pageCount?.pages ?? "2");

//     const trigger_pageScroll_enabled = (triggers.pageScroll?.enabled === true) ? "true" : "false";
//     const trigger_pageScroll_percentage = String(triggers.pageScroll?.percentage ?? "20");

//     const trigger_timeDelay_enabled = (triggers.timeDelay?.enabled === true) ? "true" : "false";
//     const trigger_timeDelay_seconds = String(triggers.timeDelay?.seconds ?? "5");

//     // App installation ID
//     const appIdQuery = await graphql(`
//       #graphql
//       query {
//         currentAppInstallation { id }
//       }
//     `);
//     const appInstallationID = (await appIdQuery.json()).data.currentAppInstallation.id;
//     console.log("App Installation ID:", appInstallationID);

//     const metafieldsInput = [
      // // Trigger metafields
      // { namespace: "wheel-of-wonders", key: "trigger_clicks_enabled", type: "boolean", value: trigger_clicks_enabled, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_clicks_value", type: "number_integer", value: trigger_clicks_value, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_exitIntent_enabled", type: "boolean", value: trigger_exitIntent_enabled, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_exitIntent_device", type: "single_line_text_field", value: trigger_exitIntent_device, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_inactivity_enabled", type: "boolean", value: trigger_inactivity_enabled, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_inactivity_seconds", type: "number_integer", value: trigger_inactivity_seconds, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_pageCount_enabled", type: "boolean", value: trigger_pageCount_enabled, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_pageCount_pages", type: "number_integer", value: trigger_pageCount_pages, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_pageScroll_enabled", type: "boolean", value: trigger_pageScroll_enabled, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_pageScroll_percentage", type: "number_integer", value: trigger_pageScroll_percentage, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_timeDelay_enabled", type: "boolean", value: trigger_timeDelay_enabled, ownerId: appInstallationID },
      // { namespace: "wheel-of-wonders", key: "trigger_timeDelay_seconds", type: "number_integer", value: trigger_timeDelay_seconds, ownerId: appInstallationID },
//     ];

//     const filteredMetafields = metafieldsInput.filter(
//       mf => mf.value !== undefined && mf.value !== null && mf.value !== ""
//     );

//     const metafieldsMutation = await graphql(
//       `
//         mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
//           metafieldsSet(metafields: $metafields) {
//             metafields { id namespace key value }
//             userErrors { field message }
//           }
//         }
//       `,
//       { variables: { metafields: filteredMetafields } }
//     );

//     const data = await metafieldsMutation.json();
//     if (data.data?.metafieldsSet?.userErrors?.length) {
//       console.error("Metafield userErrors:", data.data.metafieldsSet.userErrors);
//       return { success: false, errors: data.data.metafieldsSet.userErrors };
//     }

//     console.log("Successfully synced campaign to metafieldsRules:", data.data.metafieldsSet.metafields);
//     return { success: true, metafields: data.data.metafieldsSet.metafields, campaignId: activeCampaign.id };
//   } catch (error) {
//     console.error("Error syncing campaign to metafields:", error);
//     return { success: false, error: error.message };
//   }
// }




export async function createSubscriptionMetafield(
  graphql,
  value,
  position = "bottom-right",
) {
  if (!value || (value !== "true" && value !== "false")) {
    throw new Error(
      `Invalid 'value' for hasPlan: must be "true" or "false", got: ${value}`,
    );
  }

  if (!position || typeof position !== "string") {
    position = "bottom-right"; // fallback
  }

  const appIdQuery = await graphql(`
    #graphql
    query {
      currentAppInstallation {
        id
      }
    }
  `);

  const appIdQueryData = await appIdQuery.json();
  const appInstallationID = appIdQueryData.data.currentAppInstallation.id;
  console.log("App Installation ID:", appInstallationID);

  const appMetafield = await graphql(
    `
      #graphql
      mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafields: [
          {
            namespace: "mtappsremixbillingdemo",
            key: "hasPlan",
            type: "boolean",
            value: value, // must be a string "true" or "false"
            ownerId: appInstallationID,
          },
          {
            namespace: "mtappsremixbillingdemo",
            key: "position",
            type: "single_line_text_field",
            value: position,
            ownerId: appInstallationID,
          },
        ],
      },
    },
  );

  const data = await appMetafield.json();

  // Log userErrors if present
  if (data.data?.metafieldsSet?.userErrors?.length > 0) {
    console.error("Metafield userErrors:", data.data.metafieldsSet.userErrors);
  }

  return data;
}


export async function getDiscountCodes(graphql) {
  const result = await graphql(
    `
      #graphql
      query getDiscountCodes {
        discountNodes(first: 50) {
          edges {
            node {
              id
              discount {
                __typename
                ... on DiscountCodeBasic {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
                ... on DiscountCodeBxgy {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
                ... on DiscountCodeFreeShipping {
                  title
                  summary
                  codes(first: 10) {
                    edges {
                      node {
                        code
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { variables: {} },
  );

  const res = await result.json();
  return res;
}


// Create metafields specifically for campaign layout
export async function createCampaignLayoutMetafields(graphql, shopName) {
  try {
    // Get the active campaign from MongoDB
    const activeCampaign = await getActiveCampaign(shopName);

    if (!activeCampaign) {
      console.log("No active campaign found to create layout metafields");
      return null;
    }

    console.log("Creating layout metafields for campaign:", activeCampaign.name);

    // Extract layout information
    const layout = activeCampaign.layout || {};
    
    // Layout-specific data
    const floatingButtonHasText = layout.floatingButtonHasText === true ? "true" : "false";
    const floatingButtonPosition = layout.floatingButtonPosition || "bottomRight";
    const floatingButtonText = layout.floatingButtonText || "";
    const showFloatingButton = layout.showFloatingButton === true ? "true" : "false";
    const wheelSectors = String(layout.wheelSectors || "six");
    const envSelection = layout.theme || "light";
    const versionSelection = layout.popupLayout || "bottom";
    const displayStyle = layout.displayStyle || "popup";
    const logoImage = layout.logo || "";

    // Colors
    const primaryColor = activeCampaign.primaryColor || "#ffc700";
    const secondaryColor = activeCampaign.secondaryColor || "#ffffff";
    const tertiaryColor = activeCampaign.tertiaryColor || "#000000";
    const colorTone = activeCampaign.color || "dualTone";

    // Get app installation ID
    const appIdQuery = await graphql(`
      #graphql
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    const appInstallationID = (await appIdQuery.json()).data.currentAppInstallation.id;

    console.log("App Installation ID:", appInstallationID);

    // Build layout-specific metafields
    const layoutMetafields = [
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonHasText",
        type: "boolean",
        value: floatingButtonHasText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonPosition",
        type: "single_line_text_field",
        value: floatingButtonPosition,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "floatingButtonText",
        type: "single_line_text_field",
        value: floatingButtonText,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "showFloatingButton",
        type: "boolean",
        value: showFloatingButton,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "displayStyle",
        type: "single_line_text_field",
        value: displayStyle,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "wheelSectors",
        type: "single_line_text_field",
        value: wheelSectors,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "envSelection",
        type: "single_line_text_field",
        value: envSelection,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "versionSelection",
        type: "single_line_text_field",
        value: versionSelection,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "primaryColor",
        type: "single_line_text_field",
        value: primaryColor,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "secondaryColor",
        type: "single_line_text_field",
        value: secondaryColor,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "tertiaryColor",
        type: "single_line_text_field",
        value: tertiaryColor,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "colorTone",
        type: "single_line_text_field",
        value: colorTone,
        ownerId: appInstallationID,
      },
      {
        namespace: "wheel-of-wonders",
        key: "activeCampaignId",
        type: "single_line_text_field",
        value: activeCampaign.id || "",
        ownerId: appInstallationID,
      },
    ];

    // Filter out empty values
    const filteredMetafields = layoutMetafields.filter(
      (mf) => mf.value !== undefined && mf.value !== null && mf.value !== "",
    );

    // Execute the metafields mutation
    const metafieldsMutation = await graphql(
      `
        mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { variables: { metafields: filteredMetafields } },
    );

    const data = await metafieldsMutation.json();
    
    if (data.data?.metafieldsSet?.userErrors?.length) {
      console.error("Layout metafield userErrors:", data.data.metafieldsSet.userErrors);
      return { success: false, errors: data.data.metafieldsSet.userErrors };
    }

    console.log("Successfully created layout metafields:", data.data.metafieldsSet.metafields);
    
    return {
      success: true,
      metafields: data.data.metafieldsSet.metafields,
      campaignId: activeCampaign.id,
    };

  } catch (error) {
    console.error("Error creating campaign layout metafields:", error);
    return { success: false, error: error.message };
  }
}