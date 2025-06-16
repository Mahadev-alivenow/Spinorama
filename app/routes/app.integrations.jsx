import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Button,
  Icon,
  Badge,
  TextField,
  Modal,
  Banner,
} from "@shopify/polaris";
import {
  AppsIcon,
  ShopcodesIcon,
  EmailIcon,
  ChartVerticalFilledIcon,
  SocialPostIcon,
  PaymentIcon,
  ConnectIcon,
  DiscountIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import AdminLayout from "../components/AdminLayout";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Integrations() {
  const [connectModalActive, setConnectModalActive] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [apiKey, setApiKey] = useState("");

  const handleConnectClick = (integration) => {
    setSelectedIntegration(integration);
    setConnectModalActive(true);
  };

  const integrations = [
    {
      id: "shopify",
      name: "Shopify",
      description:
        "Connect your Shopify store to sync products, customers, and orders.",
      icon: ShopcodesIcon,
      color: "#95BF47",
      status: "connected",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description:
        "Sync your email lists with Mailchimp for advanced email marketing.",
      icon: EmailIcon,
      color: "#FFE01B",
      status: "disconnected",
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      description:
        "Track campaign performance with Google Analytics integration.",
      icon: ChartVerticalFilledIcon,
      color: "#F4B400",
      status: "disconnected",
    },
    {
      id: "facebook",
      name: "Facebook",
      description:
        "Connect to Facebook to sync audiences and run integrated campaigns.",
      icon: SocialPostIcon,
      color: "#1877F2",
      status: "connected",
    },
    {
      id: "instagram",
      name: "Instagram",
      description:
        "Connect to Instagram to showcase products and run integrated campaigns.",
      icon: SocialPostIcon,
      color: "#C13584",
      status: "disconnected",
    },
    {
      id: "stripe",
      name: "Stripe",
      description:
        "Process payments and track revenue with Stripe integration.",
      icon: PaymentIcon,
      color: "#6772E5",
      status: "connected",
    },
  ];

  return (
    <AdminLayout>
      <Page title="Integrations">
        <TitleBar title="Integrations" />
        <BlockStack gap="500">
          <Banner title="Enhance your marketing with integrations">
            <p>
              Connect your favorite tools and services to streamline your
              marketing workflow and improve campaign performance.
            </p>
          </Banner>

          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="500">
                  <Text variant="headingMd" as="h2">
                    Connected Services
                  </Text>
                  {integrations.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnectClick={handleConnectClick}
                    />
                  ))}
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Integration Help
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Need help setting up integrations? Our documentation
                    provides step-by-step guides for connecting each service.
                  </Text>
                  <Button url="#" variant="primary" fullWidth>
                    View Documentation
                  </Button>
                  <Text variant="bodyMd" as="p">
                    Can't find what you need? Contact our support team for
                    assistance.
                  </Text>
                  <Button url="#" variant="plain" fullWidth>
                    Contact Support
                  </Button>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Page>

      <Modal
        open={connectModalActive}
        onClose={() => setConnectModalActive(false)}
        title={`Connect ${selectedIntegration?.name || ""}`}
        primaryAction={{
          content: "Connect",
          onAction: () => setConnectModalActive(false),
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setConnectModalActive(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text variant="bodyMd" as="p">
              Enter your API key to connect{" "}
              {selectedIntegration?.name || "this service"}.
            </Text>
            <TextField
              label="API Key"
              value={apiKey}
              onChange={setApiKey}
              autoComplete="off"
            />
            <Text variant="bodySm" as="p">
              Don't have an API key?{" "}
              <Button variant="plain" size="slim">
                Get one here
              </Button>
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </AdminLayout>
  );
}

function IntegrationCard({ integration, onConnectClick }) {
  const { name, description, icon, color, status } = integration;

  return (
    <Box
      paddingBlockStart="400"
      paddingBlockEnd="400"
      paddingInlineStart="400"
      paddingInlineEnd="400"
      borderColor="border"
      borderWidth="025"
      borderRadius="200"
    >
      <InlineStack gap="400" align="start" blockAlign="center">
        <Box
          style={{ background: `${color}20` }}
          borderRadius="100"
          padding="300"
        >
          <Icon source={icon} color="base" />
        </Box>
        <div style={{ flex: 1 }}>
          <BlockStack gap="100">
            <InlineStack gap="200" align="center">
              <Text variant="headingSm" as="h3">
                {name}
              </Text>
              <Badge status={status === "connected" ? "success" : "default"}>
                {status === "connected" ? "Connected" : "Not connected"}
              </Badge>
            </InlineStack>
            <Text variant="bodyMd" as="p">
              {description}
            </Text>
          </BlockStack>
        </div>
        <InlineStack gap="200">
          {status === "connected" ? (
            <>
              <Button icon={SettingsIcon} variant="tertiary">
                Settings
              </Button>
              <Button icon={DiscountIcon} variant="tertiary">
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              icon={ConnectIcon}
              onClick={() => onConnectClick(integration)}
              variant="primary"
            >
              Connect
            </Button>
          )}
        </InlineStack>
      </InlineStack>
    </Box>
  );
}
