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
  Tabs,
  Icon,
  Badge,
  DataTable,
  Pagination,
  EmptyState,
  Modal,
  TextField,
  Select,
  Popover,
  Tag,
  Avatar,
} from "@shopify/polaris";
import {
  PersonIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  ImportIcon,
  ExportIcon,
  PlusIcon,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import AdminLayout from "../components/AdminLayout";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Subscribers() {
  const [selected, setSelected] = useState(0);
  const [modalActive, setModalActive] = useState(false);
  const [importModalActive, setImportModalActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterPopoverActive, setFilterPopoverActive] = useState(false);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
  }, []);

  const handleTagInputChange = useCallback((value) => {
    setTagInputValue(value);
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInputValue && !selectedTags.includes(tagInputValue)) {
      setSelectedTags([...selectedTags, tagInputValue]);
      setTagInputValue("");
    }
  }, [tagInputValue, selectedTags]);

  const handleRemoveTag = useCallback(
    (tag) => {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    },
    [selectedTags],
  );

  const tabs = [
    {
      id: "all-subscribers",
      content: "All",
      accessibilityLabel: "All subscribers",
      panelID: "all-subscribers-content",
    },
    {
      id: "active-subscribers",
      content: "Active",
      accessibilityLabel: "Active subscribers",
      panelID: "active-subscribers-content",
    },
    {
      id: "unsubscribed",
      content: "Unsubscribed",
      accessibilityLabel: "Unsubscribed",
      panelID: "unsubscribed-content",
    },
  ];

  const subscriberData = [
    [
      <InlineStack gap="200" align="center">
        <Avatar customer size="small" name="John Doe" />
        <Text variant="bodyMd" fontWeight="semibold">
          John Doe
        </Text>
      </InlineStack>,
      "john.doe@example.com",
      <Badge status="success">Active</Badge>,
      "Jun 15, 2023",
      <InlineStack gap="100">
        <Tag>Customer</Tag>
        <Tag>VIP</Tag>
      </InlineStack>,
    ],
    [
      <InlineStack gap="200" align="center">
        <Avatar customer size="small" name="Jane Smith" />
        <Text variant="bodyMd" fontWeight="semibold">
          Jane Smith
        </Text>
      </InlineStack>,
      "jane.smith@example.com",
      <Badge status="success">Active</Badge>,
      "Jul 22, 2023",
      <InlineStack gap="100">
        <Tag>Customer</Tag>
      </InlineStack>,
    ],
    [
      <InlineStack gap="200" align="center">
        <Avatar customer size="small" name="Robert Johnson" />
        <Text variant="bodyMd" fontWeight="semibold">
          Robert Johnson
        </Text>
      </InlineStack>,
      "robert.j@example.com",
      <Badge status="success">Active</Badge>,
      "Aug 5, 2023",
      <InlineStack gap="100">
        <Tag>New</Tag>
      </InlineStack>,
    ],
    [
      <InlineStack gap="200" align="center">
        <Avatar customer size="small" name="Emily Wilson" />
        <Text variant="bodyMd" fontWeight="semibold">
          Emily Wilson
        </Text>
      </InlineStack>,
      "emily.wilson@example.com",
      <Badge status="critical">Unsubscribed</Badge>,
      "Sep 12, 2023",
      <InlineStack gap="100">
        <Tag>Former</Tag>
      </InlineStack>,
    ],
    [
      <InlineStack gap="200" align="center">
        <Avatar customer size="small" name="Michael Brown" />
        <Text variant="bodyMd" fontWeight="semibold">
          Michael Brown
        </Text>
      </InlineStack>,
      "michael.brown@example.com",
      <Badge status="success">Active</Badge>,
      "Oct 3, 2023",
      <InlineStack gap="100">
        <Tag>Customer</Tag>
        <Tag>Engaged</Tag>
      </InlineStack>,
    ],
  ];

  return (
    <AdminLayout>
      <Page
        title="Subscribers"
        primaryAction={{
          content: "Add subscriber",
          onAction: () => setModalActive(true),
        }}
        secondaryActions={[
          {
            content: "Import",
            icon: ImportIcon,
            onAction: () => setImportModalActive(true),
          },
          {
            content: "Export",
            icon: ExportIcon,
            onAction: () => console.log("Export action"),
          },
        ]}
      >
        <TitleBar title="Subscribers" />
        <BlockStack gap="500">
          {/* Subscriber Stats */}
          <Layout>
            <Layout.Section>
              <InlineStack gap="400" wrap={false}>
                <StatCard
                  title="Total Subscribers"
                  value="2,543"
                  icon={PersonIcon}
                  color="#4B7DF3"
                />
                <StatCard
                  title="Active"
                  value="2,210"
                  icon={PersonIcon}
                  color="#50B83C"
                />
                <StatCard
                  title="Unsubscribed"
                  value="333"
                  icon={PersonIcon}
                  color="#DE3618"
                />
                <StatCard
                  title="Growth Rate"
                  value="+12.4%"
                  icon={PersonIcon}
                  color="#9C6ADE"
                />
              </InlineStack>
            </Layout.Section>
          </Layout>

          {/* Subscriber List */}
          <Card padding="0">
            <Tabs
              tabs={tabs}
              selected={selected}
              onSelect={handleTabChange}
              fitted
            >
              <Card>
                <BlockStack gap="400">
                  <InlineStack gap="200" align="start">
                    <div style={{ flex: 1 }}>
                      <TextField
                        placeholder="Search subscribers"
                        value={searchValue}
                        onChange={setSearchValue}
                        prefix={<Icon source={SearchIcon} />}
                        clearButton
                        onClearButtonClick={() => setSearchValue("")}
                      />
                    </div>
                    <Popover
                      active={filterPopoverActive}
                      activator={
                        <Button
                          icon={FilterIcon}
                          onClick={() =>
                            setFilterPopoverActive(!filterPopoverActive)
                          }
                        >
                          Filter
                        </Button>
                      }
                      onClose={() => setFilterPopoverActive(false)}
                    >
                      <Popover.Pane>
                        <Box padding="400">
                          <BlockStack gap="400">
                            <Text variant="headingSm" as="h3">
                              Filter subscribers
                            </Text>
                            <Select
                              label="Status"
                              options={[
                                { label: "All", value: "all" },
                                { label: "Active", value: "active" },
                                {
                                  label: "Unsubscribed",
                                  value: "unsubscribed",
                                },
                              ]}
                              onChange={() => {}}
                              value="all"
                            />
                            <TextField
                              label="Tags"
                              value={tagInputValue}
                              onChange={handleTagInputChange}
                              placeholder="Add tags"
                              connectedRight={
                                <Button
                                  onClick={handleAddTag}
                                  icon={PlusIcon}
                                />
                              }
                            />
                            {selectedTags.length > 0 && (
                              <InlineStack gap="100" wrap>
                                {selectedTags.map((tag) => (
                                  <Tag
                                    key={tag}
                                    onRemove={() => handleRemoveTag(tag)}
                                  >
                                    {tag}
                                  </Tag>
                                ))}
                              </InlineStack>
                            )}
                            <InlineStack gap="200">
                              <Button
                                onClick={() => setFilterPopoverActive(false)}
                              >
                                Apply
                              </Button>
                              <Button
                                variant="plain"
                                onClick={() => setFilterPopoverActive(false)}
                              >
                                Cancel
                              </Button>
                            </InlineStack>
                          </BlockStack>
                        </Box>
                      </Popover.Pane>
                    </Popover>
                    <Popover
                      active={sortPopoverActive}
                      activator={
                        <Button
                          icon={SortIcon}
                          onClick={() =>
                            setSortPopoverActive(!sortPopoverActive)
                          }
                        >
                          Sort
                        </Button>
                      }
                      onClose={() => setSortPopoverActive(false)}
                    >
                      <Popover.Pane>
                        <Box padding="400">
                          <BlockStack gap="200">
                            <Text variant="headingSm" as="h3">
                              Sort by
                            </Text>
                            <Button
                              variant="plain"
                              onClick={() => setSortPopoverActive(false)}
                            >
                              Name A-Z
                            </Button>
                            <Button
                              variant="plain"
                              onClick={() => setSortPopoverActive(false)}
                            >
                              Name Z-A
                            </Button>
                            <Button
                              variant="plain"
                              onClick={() => setSortPopoverActive(false)}
                            >
                              Date added (newest first)
                            </Button>
                            <Button
                              variant="plain"
                              onClick={() => setSortPopoverActive(false)}
                            >
                              Date added (oldest first)
                            </Button>
                          </BlockStack>
                        </Box>
                      </Popover.Pane>
                    </Popover>
                  </InlineStack>

                  {subscriberData.length > 0 ? (
                    <>
                      <DataTable
                        columnContentTypes={[
                          "text",
                          "text",
                          "text",
                          "text",
                          "text",
                        ]}
                        headings={[
                          "Name",
                          "Email",
                          "Status",
                          "Date Added",
                          "Tags",
                        ]}
                        rows={subscriberData}
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
                    </>
                  ) : (
                    <EmptyState
                      heading="Add your first subscriber"
                      action={{
                        content: "Add subscriber",
                        onAction: () => setModalActive(true),
                      }}
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                      <p>
                        Start building your subscriber list to send targeted
                        campaigns
                      </p>
                    </EmptyState>
                  )}
                </BlockStack>
              </Card>
            </Tabs>
          </Card>
        </BlockStack>
      </Page>

      {/* Add Subscriber Modal */}
      <Modal
        open={modalActive}
        onClose={() => setModalActive(false)}
        title="Add new subscriber"
        primaryAction={{
          content: "Add",
          onAction: () => setModalActive(false),
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setModalActive(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField label="First name" autoComplete="off" />
            <TextField label="Last name" autoComplete="off" />
            <TextField label="Email" type="email" autoComplete="off" />
            <Select
              label="Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Unsubscribed", value: "unsubscribed" },
              ]}
              onChange={() => {}}
              value="active"
            />
            <TextField
              label="Tags"
              value={tagInputValue}
              onChange={handleTagInputChange}
              placeholder="Add tags"
              connectedRight={
                <Button onClick={handleAddTag} icon={PlusIcon} />
              }
            />
            {selectedTags.length > 0 && (
              <InlineStack gap="100" wrap>
                {selectedTags.map((tag) => (
                  <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                    {tag}
                  </Tag>
                ))}
              </InlineStack>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Import Modal */}
      <Modal
        open={importModalActive}
        onClose={() => setImportModalActive(false)}
        title="Import subscribers"
        primaryAction={{
          content: "Import",
          onAction: () => setImportModalActive(false),
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setImportModalActive(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text variant="bodyMd" as="p">
              Import subscribers from a CSV file. The file should have the
              following columns: email, first_name, last_name, status, tags.
            </Text>
            <Button fullWidth>Choose file</Button>
            <Text variant="bodySm" as="p">
              Download a{" "}
              <Button variant="plain" size="slim">
                sample CSV template
              </Button>
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }) {
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
        <Text variant="headingLg">{value}</Text>
      </BlockStack>
    </Card>
  );
}
