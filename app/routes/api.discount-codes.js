import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    console.log("🔍 Authenticating admin...");
    const { admin } = await authenticate.admin(request);

    console.log("✅ Authenticated. Sending GraphQL query...");
    const response = await admin.graphql(`
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
      `);

    const data = await response.json();
    console.log("📦 GraphQL response:", data);

    if (data.errors) {
      console.error("❌ GraphQL errors:", data.errors);
      return json(
        { codes: [], error: "Failed to fetch discount codes" },
        { status: 500 },
      );
    }

    // Extract discount codes from the response
    const codes = [];

    if (data.data?.discountNodes?.edges) {
      data.data.discountNodes.edges.forEach((edge) => {
        const discount = edge.node.discount;
        if (discount && discount.codes?.edges) {
          discount.codes.edges.forEach((codeEdge) => {
            if (codeEdge.node.code) {
              codes.push({
                id: edge.node.id,
                code: codeEdge.node.code,
                title: discount.title || "N/A",
                summary: discount.summary || "N/A",
                type: discount.__typename || "Unknown",
              });
            }
          });
        }
      });
    }

    console.log(`Found ${codes.length} discount codes`);

    return json({
      codes,
      count: codes.length,
      success: true,
    });
  } catch (error) {
    console.error("💥 Error in loader:", error);
    console.error("📜 Stack trace:", error.stack); // <--- ADD THIS

    return json(
      { codes: [], error: error.message, success: false },
      { status: 500 },
    );
  }
}

// export async function loader({ request }) {
//   try {
//     const { admin } = await authenticate.admin(request);

//     const response = await admin.graphql(`
//       query getDiscountCodes {
//         discountNodes(first: 50) {
//           edges {
//             node {
//               id
//               discount {
//                 __typename
//                 ... on DiscountCodeBasic {
//                   title
//                   summary
//                   codes(first: 10) {
//                     edges {
//                       node {
//                         code
//                       }
//                     }
//                   }
//                 }
//                 ... on DiscountCodeBxgy {
//                   title
//                   summary
//                   codes(first: 10) {
//                     edges {
//                       node {
//                         code
//                       }
//                     }
//                   }
//                 }
//                 ... on DiscountCodeFreeShipping {
//                   title
//                   summary
//                   codes(first: 10) {
//                     edges {
//                       node {
//                         code
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     `);

//     const data = await response.json();

//     if (data.errors) {
//       console.error("GraphQL errors:", data.errors);
//       return json(
//         { codes: [], error: "Failed to fetch discount codes" },
//         { status: 500 },
//       );
//     }

    // // Extract discount codes from the response
    // const codes = [];

    // if (data.data?.discountNodes?.edges) {
    //   data.data.discountNodes.edges.forEach((edge) => {
    //     const discount = edge.node.discount;
    //     if (discount && discount.codes?.edges) {
    //       discount.codes.edges.forEach((codeEdge) => {
    //         if (codeEdge.node.code) {
    //           codes.push({
    //             id: edge.node.id,
    //             code: codeEdge.node.code,
    //             title: discount.title || "N/A",
    //             summary: discount.summary || "N/A",
    //             type: discount.__typename || "Unknown",
    //           });
    //         }
    //       });
    //     }
    //   });
    // }

    // console.log(`Found ${codes.length} discount codes`);

    // return json({
    //   codes,
    //   count: codes.length,
    //   success: true,
    // });
//   } catch (error) {
//     console.error("Error fetching discount codes:", error);
//     return json(
//       {
//         codes: [],
//         error: error.message,
//         success: false,
//       },
//       { status: 500 },
//     );
//   }
// }
