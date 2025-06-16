import { useState, useCallback } from "react";
import {
  Page,
  Button,
  ButtonGroup,
  TextField,
  Checkbox,
  Icon,
  Text,
  Card,
  Tabs,
  DropZone,
  Thumbnail,
  LegacyStack,
  ColorPicker,
  hsbToRgb,
  rgbToHsb,
} from "@shopify/polaris";
import {
  ArrowLeftIcon,
  DeleteIcon,
  RefreshIcon,
  MobileIcon,
  DesktopIcon,
  TextIcon,
  ImageIcon,
  SettingsIcon,
  PinFilledIcon,
  DiscountCodeIcon,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
// import { authenticate } from "../../shopify.server";

// import AdminLayout from "../../components/AdminLayout";
import { useNavigate, useParams } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import AdminLayout from "../components/AdminLayout";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function GameEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gameType = id.split("-")[0]; // Extract game type from ID

  const [selectedTab, setSelectedTab] = useState(0);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeIntroScreen, setActiveIntroScreen] = useState(true);
  const [logoFiles, setLogoFiles] = useState({
    desktop: [],
    mobile: [],
  });

  // Color settings
  const [colors, setColors] = useState({
    background: {
      hue: 0,
      brightness: 0,
      saturation: 0,
    },
    coverText: {
      hue: 0,
      brightness: 1,
      saturation: 0,
    },
    coverTextMobile: {
      hue: 0,
      brightness: 0,
      saturation: 0,
    },
    couponText: {
      hue: 0,
      brightness: 1,
      saturation: 0,
    },
    button: {
      hue: 0,
      brightness: 1,
      saturation: 0,
    },
  });

  // Game content
  const [gameContent, setGameContent] = useState({
    title: "WANT TO UNLOCK TODAY'S EXCLUSIVE DISCOUNT?",
    subtitle: "ENTER YOUR EMAIL TO REVEAL YOUR SPECIAL OFFER!",
    buttonText: "SPIN THE WHEEL!",
    emailPlaceholder: "Enter your Email",
    prizes: [
      { label: "5% OFF", probability: 15 },
      { label: "10% OFF", probability: 15 },
      { label: "20% OFF", probability: 10 },
      { label: "25% OFF", probability: 10 },
      { label: "30% OFF", probability: 5 },
      { label: "40% OFF", probability: 5 },
    ],
  });

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
  }, []);

  const handleColorChange = useCallback((colorType, color) => {
    setColors((prevColors) => ({
      ...prevColors,
      [colorType]: color,
    }));
  }, []);

  const handleDropZoneDrop = useCallback(
    (type, acceptedFiles, rejectedFiles) => {
      setLogoFiles((prev) => ({
        ...prev,
        [type]: acceptedFiles,
      }));
    },
    [],
  );

  const handleCreateGame = useCallback(() => {
    // In a real app, this would save the game configuration
    alert(`Game "${id}" created successfully!`);
    navigate("/app/campaigns");
  }, [id, navigate]);

  const tabs = [
    {
      id: "design",
      content: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon source={ImageIcon} />
          <span style={{ marginLeft: "8px" }}>DESIGN</span>
        </span>
      ),
    },
    {
      id: "text",
      content: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon source={TextIcon} />
          <span style={{ marginLeft: "8px" }}>TEXT</span>
        </span>
      ),
    },
    {
      id: "coupons",
      content: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon source={DiscountCodeIcon} />
          <span style={{ marginLeft: "8px" }}>COUPONS</span>
        </span>
      ),
    },
    {
      id: "settings",
      content: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon source={SettingsIcon} />
          <span style={{ marginLeft: "8px" }}>SETTINGS</span>
        </span>
      ),
    },
    {
      id: "trigger",
      content: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Icon source={PinFilledIcon} />
          <span style={{ marginLeft: "8px" }}>TRIGGER</span>
        </span>
      ),
    },
  ];

  const fileUpload = (type) =>
    !logoFiles[type].length && (
      <DropZone.FileUpload actionHint="or drop files to upload" />
    );

  const uploadedFiles = (type) =>
    logoFiles[type].length > 0 && (
      <LegacyStack>
        {logoFiles[type].map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={window.URL.createObjectURL(file)}
            />
            <div>{file.name}</div>
          </LegacyStack>
        ))}
      </LegacyStack>
    );

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #dfe3e8",
          background: "white",
        }}
      >
        <Button
          icon={ArrowLeftIcon}
          onClick={() => navigate("/app/campaigns")}
          plain
        >
          Back
        </Button>

        <ButtonGroup segmented>
          <Button
            icon={DesktopIcon}
            pressed={previewMode === "desktop"}
            onClick={() => setPreviewMode("desktop")}
          />
          <Button
            icon={MobileIcon}
            pressed={previewMode === "mobile"}
            onClick={() => setPreviewMode("mobile")}
          />
        </ButtonGroup>

        <div style={{ display: "flex", gap: "12px" }}>
          <Button>Preview</Button>
          <Button primary onClick={handleCreateGame}>
            Create game
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: "64px",
            background: "#1a2433",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Tabs
            tabs={tabs}
            selected={selectedTab}
            onSelect={handleTabChange}
            fitted
            vertical
          />
        </div>

        {/* Settings Panel */}
        <div
          style={{
            width: "300px",
            background: "white",
            borderRight: "1px solid #dfe3e8",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {selectedTab === 0 && (
            <LegacyStack vertical spacing="loose">
              <div>
                <Text variant="headingMd" as="h2">
                  INTRO SCREEN
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Checkbox
                    label="ACTIVE INTRO SCREEN"
                    checked={activeIntroScreen}
                    onChange={setActiveIntroScreen}
                  />
                </div>
              </div>

              <div>
                <Text variant="headingMd" as="h2">
                  DESKTOP LOGO
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Card sectioned>
                    <DropZone
                      allowMultiple={false}
                      onDrop={(files, acceptedFiles, rejectedFiles) =>
                        handleDropZoneDrop(
                          "desktop",
                          acceptedFiles,
                          rejectedFiles,
                        )
                      }
                      label="Upload logo"
                    >
                      {uploadedFiles("desktop")}
                      {fileUpload("desktop")}
                    </DropZone>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "8px",
                        gap: "8px",
                      }}
                    >
                      <Button size="slim" icon={RefreshIcon} />
                      <Button size="slim" icon={DeleteIcon} />
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <Text variant="headingMd" as="h2">
                  MOBILE LOGO
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Card sectioned>
                    <DropZone
                      allowMultiple={false}
                      onDrop={(files, acceptedFiles, rejectedFiles) =>
                        handleDropZoneDrop(
                          "mobile",
                          acceptedFiles,
                          rejectedFiles,
                        )
                      }
                      label="Upload logo"
                    >
                      {uploadedFiles("mobile")}
                      {fileUpload("mobile")}
                    </DropZone>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "8px",
                        gap: "8px",
                      }}
                    >
                      <Button size="slim" icon={RefreshIcon} />
                      <Button size="slim" icon={DeleteIcon} />
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <Text variant="headingMd" as="h2">
                  COLORS
                </Text>
                <div style={{ marginTop: "16px" }}>
                  <LegacyStack vertical spacing="tight">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Background</Text>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: `rgb(${hsbToRgb(colors.background).red}, ${hsbToRgb(colors.background).green}, ${hsbToRgb(colors.background).blue})`,
                          border: "1px solid #dfe3e8",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Cover Text</Text>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: `rgb(${hsbToRgb(colors.coverText).red}, ${hsbToRgb(colors.coverText).green}, ${hsbToRgb(colors.coverText).blue})`,
                          border: "1px solid #dfe3e8",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Cover Text Mobile</Text>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: `rgb(${hsbToRgb(colors.coverTextMobile).red}, ${hsbToRgb(colors.coverTextMobile).green}, ${hsbToRgb(colors.coverTextMobile).blue})`,
                          border: "1px solid #dfe3e8",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Coupon Text</Text>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: `rgb(${hsbToRgb(colors.couponText).red}, ${hsbToRgb(colors.couponText).green}, ${hsbToRgb(colors.couponText).blue})`,
                          border: "1px solid #dfe3e8",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Button</Text>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: `rgb(${hsbToRgb(colors.button).red}, ${hsbToRgb(colors.button).green}, ${hsbToRgb(colors.button).blue})`,
                          border: "1px solid #dfe3e8",
                        }}
                      />
                    </div>
                  </LegacyStack>
                </div>
              </div>
            </LegacyStack>
          )}

          {selectedTab === 1 && (
            <LegacyStack vertical spacing="loose">
              <TextField
                label="Title"
                value={gameContent.title}
                onChange={(value) =>
                  setGameContent({ ...gameContent, title: value })
                }
                multiline={3}
              />
              <TextField
                label="Subtitle"
                value={gameContent.subtitle}
                onChange={(value) =>
                  setGameContent({ ...gameContent, subtitle: value })
                }
                multiline={2}
              />
              <TextField
                label="Button Text"
                value={gameContent.buttonText}
                onChange={(value) =>
                  setGameContent({ ...gameContent, buttonText: value })
                }
              />
              <TextField
                label="Email Placeholder"
                value={gameContent.emailPlaceholder}
                onChange={(value) =>
                  setGameContent({ ...gameContent, emailPlaceholder: value })
                }
              />
            </LegacyStack>
          )}

          {selectedTab === 2 && (
            <LegacyStack vertical spacing="loose">
              <Text variant="headingMd" as="h2">
                WHEEL PRIZES
              </Text>
              {gameContent.prizes.map((prize, index) => (
                <Card sectioned key={index}>
                  <LegacyStack vertical spacing="tight">
                    <TextField
                      label={`Prize ${index + 1}`}
                      value={prize.label}
                      onChange={(value) => {
                        const newPrizes = [...gameContent.prizes];
                        newPrizes[index].label = value;
                        setGameContent({ ...gameContent, prizes: newPrizes });
                      }}
                    />
                    <TextField
                      label="Probability (%)"
                      type="number"
                      value={prize.probability.toString()}
                      onChange={(value) => {
                        const newPrizes = [...gameContent.prizes];
                        newPrizes[index].probability = parseInt(value, 10) || 0;
                        setGameContent({ ...gameContent, prizes: newPrizes });
                      }}
                    />
                  </LegacyStack>
                </Card>
              ))}
            </LegacyStack>
          )}

          {selectedTab === 3 && (
            <LegacyStack vertical spacing="loose">
              <Text variant="headingMd" as="h2">
                GAME SETTINGS
              </Text>
              <Checkbox
                label="Collect email"
                checked={true}
                onChange={() => {}}
              />
              <Checkbox
                label="Show branding"
                checked={true}
                onChange={() => {}}
              />
              <Checkbox
                label="Enable sound"
                checked={true}
                onChange={() => {}}
              />
              <TextField
                label="Redirect URL"
                placeholder="https://example.com/thank-you"
              />
            </LegacyStack>
          )}

          {selectedTab === 4 && (
            <LegacyStack vertical spacing="loose">
              <Text variant="headingMd" as="h2">
                TRIGGER SETTINGS
              </Text>
              <Checkbox
                label="Show on page load"
                checked={true}
                onChange={() => {}}
              />
              <TextField label="Delay (seconds)" type="number" value="3" />
              <Checkbox
                label="Show on exit intent"
                checked={false}
                onChange={() => {}}
              />
              <Checkbox
                label="Show once per session"
                checked={true}
                onChange={() => {}}
              />
            </LegacyStack>
          )}
        </div>

        {/* Preview Area */}
        <div
          style={{
            flex: 1,
            background: "#f4f6f8",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: previewMode === "desktop" ? "800px" : "375px",
              height: previewMode === "desktop" ? "600px" : "667px",
              background: "black",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Game Preview */}
            <div
              style={{
                display: "flex",
                flexDirection: previewMode === "desktop" ? "row" : "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "20px",
              }}
            >
              {/* Wheel */}
              <div
                style={{
                  flex: previewMode === "desktop" ? "1" : "0 0 auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: previewMode === "desktop" ? "0" : "20px",
                }}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-27%20at%2012.28.50%E2%80%AFAM-1TtU1GWD652Arl79lpWxMj8LWAUJdo.png"
                  alt="Spinning Wheel"
                  style={{
                    width: previewMode === "desktop" ? "400px" : "300px",
                    height: previewMode === "desktop" ? "400px" : "300px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Form */}
              <div
                style={{
                  flex: previewMode === "desktop" ? "1" : "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {gameContent.title}
                  </h2>
                  <p style={{ fontSize: "16px" }}>{gameContent.subtitle}</p>
                </div>

                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <input
                    type="email"
                    placeholder={gameContent.emailPlaceholder}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "4px",
                      border: "none",
                      fontSize: "16px",
                    }}
                  />
                </div>

                <button
                  style={{
                    backgroundColor: "#e12c2c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {gameContent.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
