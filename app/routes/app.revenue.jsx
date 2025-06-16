import { useState, useCallback } from "react";
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
  Select,
  DataTable,
  Pagination,
} from "@shopify/polaris";
import {
  FinanceIcon,
  ChartVerticalIcon,
  OrderIcon,
  PersonIcon,
  PageIcon,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import AdminLayout from "../components/AdminLayout";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Revenue() {
  const [timeframe, setTimeframe] = useState("30d");

  const handleTimeframeChange = useCallback((value) => {
    setTimeframe(value);
  }, []);

  const revenueData = [
    ["Summer Sale Campaign", "Jun 15, 2023", "2,210", "$8,450", "$3.82"],
    ["New Product Launch", "Jul 22, 2023", "1,830", "$12,350", "$6.75"],
    ["Customer Feedback Survey", "Aug 5, 2023", "1,540", "$5,230", "$3.40"],
    ["Holiday Special Offer", "Dec 1, 2022", "2,850", "$18,720", "$6.57"],
    ["Back to School Promotion", "Aug 25, 2022", "1,920", "$9,340", "$4.86"],
  ];

  return (
    <AdminLayout>
      <Page
        title="Revenue"
        primaryAction={{
          content: "Export report",
          onAction: () => console.log("Export report"),
        }}
      >
        <TitleBar title="Revenue" />
        <BlockStack gap="500">
          {/* Time Period Selector */}
          <Card>
            <InlineStack align="space-between">
              <Text variant="headingMd" as="h2">
                Revenue Overview
              </Text>
              <Select
                label="Time period"
                labelInline
                options={[
                  { label: "Last 7 days", value: "7d" },
                  { label: "Last 30 days", value: "30d" },
                  { label: "Last 90 days", value: "90d" },
                  { label: "Last 12 months", value: "12m" },
                  { label: "Year to date", value: "ytd" },
                  { label: "All time", value: "all" },
                ]}
                onChange={handleTimeframeChange}
                value={timeframe}
              />
            </InlineStack>
          </Card>

          {/* Revenue Stats */}
          <Layout>
            <Layout.Section>
              <InlineStack gap="400" wrap={false}>
                <StatCard
                  title="Total Revenue"
                  value="$54,090"
                  trend="+18%"
                  trendDirection="up"
                  icon={FinanceIcon}
                  color="#4B7DF3"
                />
                <StatCard
                  title="Avg. Order Value"
                  value="$85.32"
                  trend="+5.2%"
                  trendDirection="up"
                  icon={OrderIcon}
                  color="#F49342"
                />
                <StatCard
                  title="Revenue per Subscriber"
                  value="$21.27"
                  trend="+3.8%"
                  trendDirection="up"
                  icon={PersonIcon}
                  color="#50B83C"
                />
                <StatCard
                  title="Conversion Rate"
                  value="3.2%"
                  trend="-0.5%"
                  trendDirection="down"
                  icon={ChartVerticalIcon}
                  color="#9C6ADE"
                />
              </InlineStack>
            </Layout.Section>
          </Layout>

          {/* Revenue Chart */}
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Revenue Trend
              </Text>
              <Box
                height="300px"
                background="bg-surface-secondary"
                borderRadius="100"
              >
                <InlineStack
                  align="center"
                  distribute="center"
                  blockAlign="center"
                  height="100%"
                >
                  <Text variant="bodyMd" color="subdued">
                    Revenue chart visualization would appear here
                  </Text>
                </InlineStack>
              </Box>
            </BlockStack>
          </Card>

          {/* Campaign Revenue */}
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Campaign Revenue
              </Text>
              <DataTable
                columnContentTypes={[
                  "text",
                  "text",
                  "numeric",
                  "numeric",
                  "numeric",
                ]}
                headings={[
                  "Campaign",
                  "Date",
                  "Recipients",
                  "Revenue",
                  "Revenue/Recipient",
                ]}
                rows={revenueData}
              />
              <Box paddingBlockStart="400">
                <InlineStack align="center" distribute="center">
                  <Pagination
                    hasPrevious
                    onPrevious={() => {
                      console.log("Previous");
                    }}
                    hasNext
                    onNext={() => {
                      console.log("Next");
                    }}
                  />
                </InlineStack>
              </Box>
            </BlockStack>
          </Card>

          {/* Revenue by Source */}
          <Layout>
            <Layout.Section oneHalf>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Revenue by Source
                  </Text>
                  <Box
                    height="250px"
                    background="bg-surface-secondary"
                    borderRadius="100"
                  >
                    <InlineStack
                      align="center"
                      distribute="center"
                      blockAlign="center"
                      height="100%"
                    >
                      <Text variant="bodyMd" color="subdued">
                        Pie chart visualization would appear here
                      </Text>
                    </InlineStack>
                  </Box>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Revenue by Product Category
                  </Text>
                  <Box
                    height="250px"
                    background="bg-surface-secondary"
                    borderRadius="100"
                  >
                    <InlineStack
                      align="center"
                      distribute="center"
                      blockAlign="center"
                      height="100%"
                    >
                      <Text variant="bodyMd" color="subdued">
                        Bar chart visualization would appear here
                      </Text>
                    </InlineStack>
                  </Box>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>

          {/* Download Reports */}
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Reports
              </Text>
              <InlineStack gap="400" wrap>
                <Button icon={PageIcon}>Revenue summary</Button>
                <Button icon={PageIcon}>Campaign performance</Button>
                <Button icon={PageIcon}>Subscriber value</Button>
                <Button icon={PageIcon}>Custom report</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </Page>
    </AdminLayout>
  );
}

function StatCard({ title, value, trend, trendDirection, icon, color }) {
  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack gap="200" align="center">
          <Box
            style={{ background: `${color}20` }}
            borderRadius="100"
            padding="200"
          >
            <Icon source={icon} color="base" />
          </Box>
          <Text variant="bodyMd" color="subdued">
            {title}
          </Text>
        </InlineStack>
        <InlineStack gap="200" align="baseline">
          <Text variant="headingLg">{value}</Text>
          <Text
            variant="bodySm"
            color={trendDirection === "up" ? "success" : "critical"}
          >
            {trend}
          </Text>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
