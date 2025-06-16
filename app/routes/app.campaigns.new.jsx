"use client";

import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Text,
  Button,
  InlineStack,
  BlockStack,
  useBreakpoints,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
// import { authenticate } from "../../../shopify.server";

// import AdminLayout from "../../../components/AdminLayout";
import { useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import AdminLayout from "../components/AdminLayout";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function NewCampaign() {
  const [selectedType, setSelectedType] = useState("spin");
  const navigate = useNavigate();
  const { smDown, mdDown } = useBreakpoints();

  const handleTypeSelect = useCallback((type) => {
    setSelectedType(type);
  }, []);

  const handleCreateGame = useCallback(
    (type) => {
      // Redirect to the game editor
      navigate(`/app/game/add?type=${type}`);
    },
    [navigate],
  );

  const handlePreview = useCallback((type) => {
    // In a real app, this would show a preview of the selected game type
    alert(`Previewing ${type} game`);
  }, []);

  return (
    <AdminLayout>
      <Page
        title="New Campaign"
        backAction={{
          content: "Campaigns",
          onAction: () => navigate("/app/campaigns"),
        }}
      >
        <TitleBar title="New Campaign" />
        <BlockStack gap="500">
          <Text variant="headingMd" as="h2" fontWeight="semibold">
            SELECT CAMPAIGN TYPE
          </Text>

          <Layout>
            <Layout.Section oneThird={!smDown}>
              <div
                style={{
                  border:
                    selectedType === "spin"
                      ? "2px solid #2c6ecb"
                      : "1px solid #dfe3e8",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                  height: "100%",
                  marginBottom: smDown ? "16px" : "0",
                }}
                onClick={() => handleTypeSelect("spin")}
              >
                <BlockStack gap="400" align="center">
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        background: "#f6f6f7",
                        borderRadius: "8px 8px 0 0",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          flex: 1,
                          height: "8px",
                          background: "#d9d9d9",
                          borderRadius: "4px",
                          marginLeft: "8px",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        background: "#6b6c6d",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20at%2011.49.46%E2%80%AFPM-9fOjoQjhkiDMLXc38TprvvQ630DD5N.png"
                        alt="Spin the Wheel Preview"
                        style={{ width: "80%", maxWidth: "250px" }}
                      />
                    </div>
                    <div
                      style={{
                        background: "white",
                        borderRadius: "0 0 8px 8px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px solid #dfe3e8",
                        }}
                      ></div>
                    </div>
                  </div>

                  <Text variant="headingMd" as="h3" alignment="center">
                    SPIN THE WHEEL
                  </Text>

                  <InlineStack gap="300" align="center">
                    <Button onClick={() => handleCreateGame("spin")}>
                      Game Create
                    </Button>
                    <Button plain onClick={() => handlePreview("spin")}>
                      Preview
                    </Button>
                  </InlineStack>
                </BlockStack>
              </div>
            </Layout.Section>

            <Layout.Section oneThird={!smDown}>
              <div
                style={{
                  border:
                    selectedType === "coupons"
                      ? "2px solid #2c6ecb"
                      : "1px solid #dfe3e8",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                  height: "100%",
                  marginBottom: smDown ? "16px" : "0",
                }}
                onClick={() => handleTypeSelect("coupons")}
              >
                <BlockStack gap="400" align="center">
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        background: "#f6f6f7",
                        borderRadius: "8px 8px 0 0",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          flex: 1,
                          height: "8px",
                          background: "#d9d9d9",
                          borderRadius: "4px",
                          marginLeft: "8px",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        background: "#6b6c6d",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20at%2011.49.46%E2%80%AFPM-9fOjoQjhkiDMLXc38TprvvQ630DD5N.png"
                        alt="Wheel of Coupons Preview"
                        style={{ width: "80%", maxWidth: "250px" }}
                      />
                    </div>
                    <div
                      style={{
                        background: "white",
                        borderRadius: "0 0 8px 8px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px solid #dfe3e8",
                        }}
                      ></div>
                    </div>
                  </div>

                  <Text variant="headingMd" as="h3" alignment="center">
                    WHEEL OF COUPONS
                  </Text>

                  <InlineStack gap="300" align="center">
                    <Button onClick={() => handleCreateGame("coupons")}>
                      Game Create
                    </Button>
                    <Button plain onClick={() => handlePreview("coupons")}>
                      Preview
                    </Button>
                  </InlineStack>
                </BlockStack>
              </div>
            </Layout.Section>

            <Layout.Section oneThird={!smDown}>
              <div
                style={{
                  border:
                    selectedType === "reveal"
                      ? "2px solid #2c6ecb"
                      : "1px solid #dfe3e8",
                  borderRadius: "8px",
                  padding: "16px",
                  cursor: "pointer",
                  height: "100%",
                }}
                onClick={() => handleTypeSelect("reveal")}
              >
                <BlockStack gap="400" align="center">
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        background: "#f6f6f7",
                        borderRadius: "8px 8px 0 0",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#d9d9d9",
                        }}
                      ></div>
                      <div
                        style={{
                          flex: 1,
                          height: "8px",
                          background: "#d9d9d9",
                          borderRadius: "4px",
                          marginLeft: "8px",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        background: "#6b6c6d",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20at%2011.49.46%E2%80%AFPM-9fOjoQjhkiDMLXc38TprvvQ630DD5N.png"
                        alt="Reveal Your Coupon Preview"
                        style={{ width: "80%", maxWidth: "250px" }}
                      />
                    </div>
                    <div
                      style={{
                        background: "white",
                        borderRadius: "0 0 8px 8px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px solid #dfe3e8",
                        }}
                      ></div>
                    </div>
                  </div>

                  <Text variant="headingMd" as="h3" alignment="center">
                    REVEAL YOUR COUPON
                  </Text>

                  <InlineStack gap="300" align="center">
                    <Button onClick={() => handleCreateGame("reveal")}>
                      Game Create
                    </Button>
                    <Button plain onClick={() => handlePreview("reveal")}>
                      Preview
                    </Button>
                  </InlineStack>
                </BlockStack>
              </div>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Page>
    </AdminLayout>
  );
}
