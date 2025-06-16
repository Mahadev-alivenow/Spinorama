"use client";

import { useState, useCallback, useRef } from "react";
import {
  Button,
  ButtonGroup,
  TextField,
  Checkbox,
  Text,
  Card,
  DropZone,
  Thumbnail,
  LegacyStack,
  ColorPicker,
  hsbToRgb,
  rgbToHsb,
  Select,
  useBreakpoints,
  Navigation,
  Frame,
  Banner,
  InlineStack,
  BlockStack,
  Divider,
  RangeSlider,
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
  PinIcon,
  DiscountIcon,
  PlusIcon,
  DuplicateIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { SpinningWheel } from "../components/SpinningWheel";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

// Helper function to convert HSB to hex
const hsbToHex = (hsb) => {
  const rgb = hsbToRgb(hsb);
  return `#${((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1)}`;
};

export default function GameEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameType = searchParams.get("type") || "spin";
  const { smDown, mdDown } = useBreakpoints();

  const brandLogoRef = useRef(null);
  const audioRef = useRef(null);

  // Helper function to convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          red: Number.parseInt(result[1], 16),
          green: Number.parseInt(result[2], 16),
          blue: Number.parseInt(result[3], 16),
        }
      : { red: 0, green: 0, blue: 0 };
  };

  // Function to apply a color palette to all elements
  const applyColorPalette = (palette) => {
    // Apply colors to different elements
    setColors({
      ...colors,
      background: rgbToHsb(hexToRgb(palette[0])),
      button: rgbToHsb(hexToRgb(palette[1])),
      buttonText: rgbToHsb(hexToRgb(palette[2])),
      buttonShadow: rgbToHsb(hexToRgb(palette[3])),
      couponText: rgbToHsb(hexToRgb(palette[4])),
      couponCodeColor: rgbToHsb(hexToRgb(palette[5] || palette[0])),
    });

    // Apply colors to wheel segments
    const newPrizes = [...gameContent.prizes];
    newPrizes.forEach((prize, index) => {
      prize.color = palette[index % palette.length];
    });
    setGameContent({ ...gameContent, prizes: newPrizes });

    // Apply wheel color
    setDesignSettings({
      ...designSettings,
      wheelColor: rgbToHsb(hexToRgb(palette[0])),
    });
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeIntroScreen, setActiveIntroScreen] = useState(true);
  const [logoFiles, setLogoFiles] = useState({
    desktop: [],
    mobile: [],
    brand: [],
  });
  const [showWinningScreen, setShowWinningScreen] = useState(false);
  const [winningPrize, setWinningPrize] = useState(null);

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
    buttonText: {
      hue: 0,
      brightness: 0,
      saturation: 0,
    },
    buttonShadow: {
      hue: 0,
      brightness: 0.5,
      saturation: 1,
    },
    couponCodeColor: {
      hue: 0,
      brightness: 0,
      saturation: 0,
    },
    disclaimerText: {
      hue: 0,
      brightness: 1,
      saturation: 0,
    },
    popupBackground: {
      hue: 0,
      brightness: 0.5,
      saturation: 0,
    },
  });

  // Design settings
  const [designSettings, setDesignSettings] = useState({
    colorizeWheel: false,
    wheelColor: {
      hue: 0,
      brightness: 1,
      saturation: 1,
    },
    font: "Roboto, sans-serif",
    designType: "present",
    wheelSize: 400,
    animationDuration: 5,
    rotations: 8,
    showPointer: true,
    pointerStyle: "triangle",
    pointerColor: "#ffffff",
    pointerStrokeColor: "#000000",
    pointerSize: 1,
    pivotSize: 1,
    pivotColor: "#ffffff",
    pivotStrokeColor: "#000000",
    pivotStrokeWidth: 1,
  });

  // Game settings
  const [gameSettings, setGameSettings] = useState({
    collectEmail: true,
    collectName: false,
    collectPhone: false,
    showBranding: true,
    enableSound: true,
    soundVolume: 50,
    redirectUrl: "",
    winScreenDuration: 5,
    showCouponCode: true,
    couponCodeFormat: "CODE-{prize}",
    allowRetry: false,
    maxAttempts: 1,
  });

  // Trigger settings
  const [triggerSettings, setTriggerSettings] = useState({
    showOnPageLoad: true,
    delay: 3,
    showOnExitIntent: false,
    showOncePerSession: true,
    showOnScroll: false,
    scrollPercentage: 50,
    showOnInactivity: false,
    inactivityTime: 30,
  });

  // Game content
  const [gameContent, setGameContent] = useState({
    title: "WANT TO UNLOCK TODAY'S EXCLUSIVE DISCOUNT?",
    subtitle: "ENTER YOUR EMAIL TO REVEAL YOUR SPECIAL OFFER!",
    buttonText: "SPIN THE WHEEL!",
    emailPlaceholder: "Enter your Email",
    namePlaceholder: "Enter your Name",
    phonePlaceholder: "Enter your Phone",
    disclaimer:
      "By entering your email, you agree to receive marketing emails.",
    winTitle: "CONGRATULATIONS!",
    winSubtitle: "You've won:",
    couponButtonText: "COPY CODE & REDEEM",
    prizes: [
      {
        label: "5% OFF",
        probability: 15,
        color: "#e57373",
        couponCode: "SPIN05",
      },
      {
        label: "10% OFF",
        probability: 15,
        color: "#d32f2f",
        couponCode: "SPIN10",
      },
      {
        label: "20% OFF",
        probability: 10,
        color: "#e57373",
        couponCode: "SPIN20",
      },
      {
        label: "25% OFF",
        probability: 10,
        color: "#e57373",
        couponCode: "SPIN25",
      },
      {
        label: "30% OFF",
        probability: 5,
        color: "#d32f2f",
        couponCode: "SPIN30",
      },
      {
        label: "40% OFF",
        probability: 5,
        color: "#e57373",
        couponCode: "SPIN40",
      },
    ],
  });

  // Wheel animation
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);

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
    alert(`Game created successfully!`);
    navigate("/app/campaigns");
  }, [navigate]);

  const handleDesignTypeChange = useCallback((value) => {
    setDesignSettings((prev) => ({
      ...prev,
      designType: value,
    }));
  }, []);

  const handleFontChange = useCallback((value) => {
    setDesignSettings((prev) => ({
      ...prev,
      font: value,
    }));
  }, []);

  const handleColorizeWheelChange = useCallback((checked) => {
    setDesignSettings((prev) => ({
      ...prev,
      colorizeWheel: checked,
    }));
  }, []);

  const handleWheelColorChange = useCallback((color) => {
    setDesignSettings((prev) => ({
      ...prev,
      wheelColor: color,
    }));
  }, []);

  const handleRemoveLogo = useCallback((type) => {
    setLogoFiles((prev) => ({
      ...prev,
      [type]: [],
    }));
  }, []);

  const playWheelSound = useCallback(() => {
    if (gameSettings.enableSound && audioRef.current) {
      audioRef.current.volume = gameSettings.soundVolume / 100;
      audioRef.current.play();
    }
  }, [gameSettings.enableSound, gameSettings.soundVolume]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
    setShowWinningScreen(true);

    // Reset for next spin (but keep the wheel at the winning position)
    setTimeout(() => {
      if (!gameSettings.showWinScreen) {
        setShowWinningScreen(false);
      }
    }, gameSettings.winScreenDuration * 1000);
  }, [gameSettings.winScreenDuration, gameSettings.showWinScreen]);

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    playWheelSound();

    // Calculate total probability
    const totalProbability = gameContent.prizes.reduce(
      (sum, prize) => sum + prize.probability,
      0,
    );

    // Generate a random number between 0 and total probability
    const random = Math.random() * totalProbability;

    // Find the prize based on probability
    let cumulativeProbability = 0;
    let selectedIndex = 0;

    for (let i = 0; i < gameContent.prizes.length; i++) {
      cumulativeProbability += gameContent.prizes[i].probability;
      if (random <= cumulativeProbability) {
        selectedIndex = i;
        break;
      }
    }

    // Calculate the rotation angle
    const numSegments = gameContent.prizes.length;
    const segmentAngle = 360 / numSegments;

    // The wheel starts with segment 0 at the top
    // We need to rotate it so that the selected segment is at the top (pointer)
    // We add 360 * rotations for multiple spins
    const rotations = designSettings.rotations;
    const destinationAngle = (360 - selectedIndex * segmentAngle) % 360;
    const spinAngle = destinationAngle + 360 * rotations;

    // Set the selected prize
    setSelectedPrize(gameContent.prizes[selectedIndex]);
    setWinningPrize(gameContent.prizes[selectedIndex]);

    // Animate the wheel
    setSpinDegrees(spinAngle);
  }, [
    gameContent.prizes,
    isSpinning,
    designSettings.rotations,
    playWheelSound,
  ]);

  const handleAddPrize = useCallback(() => {
    const newPrize = {
      label: "NEW PRIZE",
      probability: 10,
      color: "#4caf50",
      couponCode: `SPIN${gameContent.prizes.length + 1}`,
    };
    setGameContent((prev) => ({
      ...prev,
      prizes: [...prev.prizes, newPrize],
    }));
  }, [gameContent.prizes]);

  const handleDuplicatePrize = useCallback(
    (index) => {
      const prizeToDuplicate = gameContent.prizes[index];
      const newPrize = {
        ...prizeToDuplicate,
        label: `${prizeToDuplicate.label} (Copy)`,
        couponCode: `${prizeToDuplicate.couponCode}C`,
      };
      const newPrizes = [...gameContent.prizes];
      newPrizes.splice(index + 1, 0, newPrize);
      setGameContent((prev) => ({
        ...prev,
        prizes: newPrizes,
      }));
    },
    [gameContent.prizes],
  );

  const handleDeletePrize = useCallback(
    (index) => {
      if (gameContent.prizes.length <= 2) {
        alert("You need at least 2 prizes on the wheel.");
        return;
      }
      const newPrizes = [...gameContent.prizes];
      newPrizes.splice(index, 1);
      setGameContent((prev) => ({
        ...prev,
        prizes: newPrizes,
      }));
    },
    [gameContent.prizes],
  );

  const navigationItems = [
    {
      label: "DESIGN",
      icon: ImageIcon,
      selected: selectedTab === 0,
      onClick: () => setSelectedTab(0),
    },
    {
      label: "TEXT",
      icon: TextIcon,
      selected: selectedTab === 1,
      onClick: () => setSelectedTab(1),
    },
    {
      label: "PRIZES",
      icon: DiscountIcon,
      selected: selectedTab === 2,
      onClick: () => setSelectedTab(2),
    },
    {
      label: "SETTINGS",
      icon: SettingsIcon,
      selected: selectedTab === 3,
      onClick: () => setSelectedTab(3),
    },
    {
      label: "TRIGGER",
      icon: PinIcon,
      selected: selectedTab === 4,
      onClick: () => setSelectedTab(4),
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

  const fontOptions = [
    { label: "Roboto, sans-serif", value: "Roboto, sans-serif" },
    { label: "Arial, sans-serif", value: "Arial, sans-serif" },
    { label: "Helvetica, sans-serif", value: "Helvetica, sans-serif" },
    { label: "Times New Roman, serif", value: "Times New Roman, serif" },
    { label: "Georgia, serif", value: "Georgia, serif" },
    { label: "Montserrat, sans-serif", value: "Montserrat, sans-serif" },
    { label: "Open Sans, sans-serif", value: "Open Sans, sans-serif" },
    { label: "Lato, sans-serif", value: "Lato, sans-serif" },
  ];

  const designTypeOptions = [
    { label: "PRESENT DESIGN", value: "present" },
    { label: "CUSTOM DESIGN", value: "custom" },
  ];

  const colorPalettes = [
    ["#f8bbd0", "#e57373", "#ffffff", "#d32f2f", "#ffffff", "#f8bbd0"],
    ["#80deea", "#0277bd", "#ffffff", "#01579b", "#ffffff", "#80deea"],
    ["#a5d6a7", "#4caf50", "#ffffff", "#2e7d32", "#ffffff", "#a5d6a7"],
    ["#ffcc80", "#ff9800", "#ffffff", "#ef6c00", "#ffffff", "#ffcc80"],
    ["#b39ddb", "#673ab7", "#ffffff", "#4527a0", "#ffffff", "#b39ddb"],
    ["#90caf9", "#2196f3", "#ffffff", "#0d47a1", "#ffffff", "#90caf9"],
  ];

  const pointerStyleOptions = [
    { label: "Triangle", value: "triangle" },
    { label: "Arrow", value: "arrow" },
    { label: "Circle", value: "circle" },
  ];

  const renderWinningScreen = () => {
    if (!showWinningScreen || !winningPrize) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          padding: "20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {gameContent.winTitle}
        </h2>

        <p
          style={{
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          {gameContent.winSubtitle}
        </p>

        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: hsbToHex(colors.couponCodeColor),
            marginBottom: "30px",
            padding: "20px 40px",
            border: "2px dashed white",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        >
          {winningPrize.label}
        </div>

        {gameSettings.showCouponCode && (
          <>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Your Coupon Code:
            </div>

            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: hsbToHex(colors.couponCodeColor),
                marginBottom: "30px",
                padding: "15px 30px",
                border: "2px solid white",
                borderRadius: "5px",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            >
              {winningPrize.couponCode}
            </div>

            <button
              style={{
                backgroundColor: hsbToHex(colors.button),
                color: hsbToHex(colors.buttonText),
                border: "none",
                borderRadius: "4px",
                padding: "15px 30px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: `0 4px 0 ${hsbToHex(colors.buttonShadow)}`,
                marginTop: "20px",
              }}
              onClick={() => {
                navigator.clipboard.writeText(winningPrize.couponCode);
                if (gameSettings.redirectUrl) {
                  window.open(gameSettings.redirectUrl, "_blank");
                }
              }}
            >
              {gameContent.couponButtonText}
            </button>
          </>
        )}

        <button
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255, 255, 255, 0.7)",
            marginTop: "30px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => setShowWinningScreen(false)}
        >
          Close
        </button>
      </div>
    );
  };

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
          flexWrap: smDown ? "wrap" : "nowrap",
          gap: smDown ? "8px" : "0",
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
          <Button onClick={() => window.open("/preview", "_blank")}>
            Preview
          </Button>
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
            width: "200px",
            background: "#1a2433",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Frame>
            <Navigation location="">
              <Navigation.Section
                items={navigationItems.map((item) => ({
                  label: item.label,
                  icon: item.icon,
                  selected: item.selected,
                  onClick: item.onClick,
                }))}
              />
            </Navigation>
          </Frame>
        </div>

        {/* Settings Panel */}
        <div
          style={{
            width: smDown ? "250px" : "300px",
            background: "white",
            borderRight: "1px solid #dfe3e8",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {selectedTab === 0 && (
            <BlockStack gap="500">
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
                  BRAND LOGO
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Card sectioned>
                    <DropZone
                      allowMultiple={false}
                      onDrop={(files, acceptedFiles, rejectedFiles) =>
                        handleDropZoneDrop(
                          "brand",
                          acceptedFiles,
                          rejectedFiles,
                        )
                      }
                      label="Upload brand logo"
                    >
                      {uploadedFiles("brand")}
                      {fileUpload("brand")}
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
                      <Button
                        size="slim"
                        icon={DeleteIcon}
                        onClick={() => handleRemoveLogo("brand")}
                      />
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <Text variant="headingMd" as="h2">
                  WHEEL LOGO
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
                      label="Upload wheel center logo"
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
                      <Button
                        size="slim"
                        icon={DeleteIcon}
                        onClick={() => handleRemoveLogo("desktop")}
                      />
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <Text variant="headingMd" as="h2">
                  WHEEL SETTINGS
                </Text>
                <Card sectioned>
                  <BlockStack gap="400">
                    <RangeSlider
                      label="Wheel Size"
                      value={designSettings.wheelSize}
                      onChange={(value) =>
                        setDesignSettings((prev) => ({
                          ...prev,
                          wheelSize: value,
                        }))
                      }
                      min={300}
                      max={600}
                      step={10}
                      output
                    />
                    <RangeSlider
                      label="Animation Duration (seconds)"
                      value={designSettings.animationDuration}
                      onChange={(value) =>
                        setDesignSettings((prev) => ({
                          ...prev,
                          animationDuration: value,
                        }))
                      }
                      min={3}
                      max={10}
                      step={0.5}
                      output
                    />
                    <RangeSlider
                      label="Wheel Rotations"
                      value={designSettings.rotations}
                      onChange={(value) =>
                        setDesignSettings((prev) => ({
                          ...prev,
                          rotations: value,
                        }))
                      }
                      min={3}
                      max={15}
                      step={1}
                      output
                    />
                    <Checkbox
                      label="Show Pointer"
                      checked={designSettings.showPointer}
                      onChange={(checked) =>
                        setDesignSettings((prev) => ({
                          ...prev,
                          showPointer: checked,
                        }))
                      }
                    />
                    {designSettings.showPointer && (
                      <Select
                        label="Pointer Style"
                        options={pointerStyleOptions}
                        value={designSettings.pointerStyle}
                        onChange={(value) =>
                          setDesignSettings((prev) => ({
                            ...prev,
                            pointerStyle: value,
                          }))
                        }
                      />
                    )}
                  </BlockStack>
                </Card>
              </div>

              <div>
                <Text variant="headingMd" as="h2">
                  PIVOT SETTINGS
                </Text>
                <Card sectioned>
                  <BlockStack gap="400">
                    <RangeSlider
                      label="Pivot Size"
                      value={designSettings.pivotSize}
                      onChange={(value) =>
                        setDesignSettings((prev) => ({
                          ...prev,
                          pivotSize: value,
                        }))
                      }
                      min={0.5}
                      max={2}
                      step={0.1}
                      output
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Pivot Color</Text>
                      <ColorPicker
                        onChange={(color) =>
                          setDesignSettings((prev) => ({
                            ...prev,
                            pivotColor: hsbToHex(color),
                          }))
                        }
                        color={rgbToHsb(hexToRgb(designSettings.pivotColor))}
                        allowAlpha={false}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Pivot Stroke Color</Text>
                      <ColorPicker
                        onChange={(color) =>
                          setDesignSettings((prev) => ({
                            ...prev,
                            pivotStrokeColor: hsbToHex(color),
                          }))
                        }
                        color={rgbToHsb(
                          hexToRgb(designSettings.pivotStrokeColor),
                        )}
                        allowAlpha={false}
                      />
                    </div>
                    <RangeSlider
                      label="Pivot Stroke Width"
                      value={designSettings.pivotStrokeWidth}
                      onChange={(value) =>
                        setDesignSettings((prev) => ({
                          ...prev,
                          pivotStrokeWidth: value,
                        }))
                      }
                      min={0}
                      max={5}
                      step={0.5}
                      output
                    />
                  </BlockStack>
                </Card>
              </div>

              <div>
                <Text variant="headingMd" as="h2">
                  COLORS
                </Text>
                <div style={{ marginTop: "16px" }}>
                  <BlockStack gap="300">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Background</Text>
                      <ColorPicker
                        onChange={(color) =>
                          handleColorChange("background", color)
                        }
                        color={colors.background}
                        allowAlpha={false}
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
                      <ColorPicker
                        onChange={(color) =>
                          handleColorChange("couponText", color)
                        }
                        color={colors.couponText}
                        allowAlpha={false}
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
                      <ColorPicker
                        onChange={(color) => handleColorChange("button", color)}
                        color={colors.button}
                        allowAlpha={false}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Button Text</Text>
                      <ColorPicker
                        onChange={(color) =>
                          handleColorChange("buttonText", color)
                        }
                        color={colors.buttonText}
                        allowAlpha={false}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Button Shadow</Text>
                      <ColorPicker
                        onChange={(color) =>
                          handleColorChange("buttonShadow", color)
                        }
                        color={colors.buttonShadow}
                        allowAlpha={false}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Coupon Code Color</Text>
                      <ColorPicker
                        onChange={(color) =>
                          handleColorChange("couponCodeColor", color)
                        }
                        color={colors.couponCodeColor}
                        allowAlpha={false}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Disclaimer Text</Text>
                      <ColorPicker
                        onChange={(color) =>
                          handleColorChange("disclaimerText", color)
                        }
                        color={colors.disclaimerText}
                        allowAlpha={false}
                      />
                    </div>
                  </BlockStack>
                </div>
              </div>

              <div>
                <ButtonGroup segmented fullWidth>
                  <Button
                    pressed={designSettings.designType === "present"}
                    onClick={() => handleDesignTypeChange("present")}
                  >
                    PRESENT DESIGN
                  </Button>
                  <Button
                    pressed={designSettings.designType === "custom"}
                    onClick={() => handleDesignTypeChange("custom")}
                  >
                    CUSTOM DESIGN
                  </Button>
                </ButtonGroup>

                <div style={{ marginTop: "16px" }}>
                  {colorPalettes.map((palette, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        marginBottom: "8px",
                        border: "1px solid #dfe3e8",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      {palette.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          style={{
                            backgroundColor: color,
                            height: "32px",
                            flex: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // Apply the color palette
                            applyColorPalette(palette);
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    label="Colorize Wheel"
                    checked={designSettings.colorizeWheel}
                    onChange={handleColorizeWheelChange}
                  />
                  <ColorPicker
                    onChange={(color) => handleWheelColorChange(color)}
                    color={designSettings.wheelColor}
                    allowAlpha={false}
                  />
                </div>

                <div style={{ marginTop: "16px" }}>
                  <Text variant="headingMd" as="h2">
                    FONT
                  </Text>
                  <div style={{ marginTop: "8px" }}>
                    <Select
                      options={fontOptions}
                      value={designSettings.font}
                      onChange={handleFontChange}
                    />
                  </div>
                </div>
              </div>
            </BlockStack>
          )}

          {selectedTab === 1 && (
            <BlockStack gap="500">
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
              <TextField
                label="Disclaimer"
                value={gameContent.disclaimer}
                onChange={(value) =>
                  setGameContent({ ...gameContent, disclaimer: value })
                }
                multiline={2}
              />

              <Divider />

              <Text variant="headingMd" as="h2">
                WINNING SCREEN TEXT
              </Text>

              <TextField
                label="Win Title"
                value={gameContent.winTitle}
                onChange={(value) =>
                  setGameContent({ ...gameContent, winTitle: value })
                }
              />
              <TextField
                label="Win Subtitle"
                value={gameContent.winSubtitle}
                onChange={(value) =>
                  setGameContent({ ...gameContent, winSubtitle: value })
                }
              />
              <TextField
                label="Coupon Button Text"
                value={gameContent.couponButtonText}
                onChange={(value) =>
                  setGameContent({ ...gameContent, couponButtonText: value })
                }
              />
            </BlockStack>
          )}

          {selectedTab === 2 && (
            <BlockStack gap="500">
              <InlineStack alignment="space-between">
                <Text variant="headingMd" as="h2">
                  WHEEL PRIZES
                </Text>
                <Button size="slim" icon={PlusIcon} onClick={handleAddPrize}>
                  Add Prize
                </Button>
              </InlineStack>

              {gameContent.prizes.map((prize, index) => (
                <Card sectioned key={index}>
                  <BlockStack gap="300">
                    <InlineStack alignment="space-between">
                      <Text variant="headingMd" as="h3">
                        Prize {index + 1}
                      </Text>
                      <ButtonGroup>
                        <Button
                          size="slim"
                          icon={DuplicateIcon}
                          onClick={() => handleDuplicatePrize(index)}
                        />
                        <Button
                          size="slim"
                          icon={DeleteIcon}
                          onClick={() => handleDeletePrize(index)}
                        />
                      </ButtonGroup>
                    </InlineStack>

                    <TextField
                      label="Prize Label"
                      value={prize.label}
                      onChange={(value) => {
                        const newPrizes = [...gameContent.prizes];
                        newPrizes[index].label = value;
                        setGameContent({ ...gameContent, prizes: newPrizes });
                      }}
                    />
                    <TextField
                      label="Coupon Code"
                      value={prize.couponCode}
                      onChange={(value) => {
                        const newPrizes = [...gameContent.prizes];
                        newPrizes[index].couponCode = value;
                        setGameContent({ ...gameContent, prizes: newPrizes });
                      }}
                    />
                    <TextField
                      label="Probability (%)"
                      type="number"
                      value={prize.probability.toString()}
                      onChange={(value) => {
                        const newPrizes = [...gameContent.prizes];
                        newPrizes[index].probability =
                          Number.parseInt(value, 10) || 0;
                        setGameContent({ ...gameContent, prizes: newPrizes });
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="bodyMd">Segment Color</Text>
                      <ColorPicker
                        onChange={(color) => {
                          const newPrizes = [...gameContent.prizes];
                          newPrizes[index].color = hsbToHex(color);
                          setGameContent({ ...gameContent, prizes: newPrizes });
                        }}
                        color={rgbToHsb(
                          hexToRgb(gameContent.prizes[index].color),
                        )}
                        allowAlpha={false}
                      />
                    </div>
                  </BlockStack>
                </Card>
              ))}

              <Banner status="info">
                Total probability:{" "}
                {gameContent.prizes.reduce(
                  (sum, prize) => sum + prize.probability,
                  0,
                )}
                %. For best results, total should equal 100%.
              </Banner>
            </BlockStack>
          )}

          {selectedTab === 3 && (
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                GAME SETTINGS
              </Text>

              <Card sectioned title="Form Fields">
                <BlockStack gap="300">
                  <Checkbox
                    label="Collect email"
                    checked={gameSettings.collectEmail}
                    onChange={(checked) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        collectEmail: checked,
                      }))
                    }
                  />
                  <Checkbox
                    label="Collect name"
                    checked={gameSettings.collectName}
                    onChange={(checked) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        collectName: checked,
                      }))
                    }
                  />
                  <Checkbox
                    label="Collect phone"
                    checked={gameSettings.collectPhone}
                    onChange={(checked) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        collectPhone: checked,
                      }))
                    }
                  />
                </BlockStack>
              </Card>

              <Card sectioned title="Display Settings">
                <BlockStack gap="300">
                  <Checkbox
                    label="Show branding"
                    checked={gameSettings.showBranding}
                    onChange={(checked) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        showBranding: checked,
                      }))
                    }
                  />
                  <Checkbox
                    label="Show coupon code"
                    checked={gameSettings.showCouponCode}
                    onChange={(checked) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        showCouponCode: checked,
                      }))
                    }
                  />
                  <TextField
                    label="Coupon Code Format"
                    value={gameSettings.couponCodeFormat}
                    onChange={(value) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        couponCodeFormat: value,
                      }))
                    }
                    helpText="Use {prize} as placeholder for the prize label"
                  />
                  <RangeSlider
                    label="Win Screen Duration (seconds)"
                    value={gameSettings.winScreenDuration}
                    onChange={(value) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        winScreenDuration: value,
                      }))
                    }
                    min={3}
                    max={15}
                    step={1}
                    output
                  />
                </BlockStack>
              </Card>

              <Card sectioned title="Sound Settings">
                <BlockStack gap="300">
                  <Checkbox
                    label="Enable sound"
                    checked={gameSettings.enableSound}
                    onChange={(checked) =>
                      setGameSettings((prev) => ({
                        ...prev,
                        enableSound: checked,
                      }))
                    }
                  />
                  {gameSettings.enableSound && (
                    <RangeSlider
                      label="Sound Volume"
                      value={gameSettings.soundVolume}
                      onChange={(value) =>
                        setGameSettings((prev) => ({
                          ...prev,
                          soundVolume: value,
                        }))
                      }
                      min={0}
                      max={100}
                      step={5}
                      output
                      suffix="%"
                    />
                  )}
                </BlockStack>
              </Card>

              <Card sectioned title="Redirect Settings">
                <TextField
                  label="Redirect URL"
                  placeholder="https://example.com/thank-you"
                  value={gameSettings.redirectUrl}
                  onChange={(value) =>
                    setGameSettings((prev) => ({ ...prev, redirectUrl: value }))
                  }
                  helpText="User will be redirected to this URL after copying the coupon code"
                />
              </Card>
            </BlockStack>
          )}

          {selectedTab === 4 && (
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                TRIGGER SETTINGS
              </Text>

              <Card sectioned title="Display Triggers">
                <BlockStack gap="300">
                  <Checkbox
                    label="Show on page load"
                    checked={triggerSettings.showOnPageLoad}
                    onChange={(checked) =>
                      setTriggerSettings((prev) => ({
                        ...prev,
                        showOnPageLoad: checked,
                      }))
                    }
                  />
                  {triggerSettings.showOnPageLoad && (
                    <TextField
                      label="Delay (seconds)"
                      type="number"
                      value={triggerSettings.delay.toString()}
                      onChange={(value) =>
                        setTriggerSettings((prev) => ({
                          ...prev,
                          delay: Number(value) || 0,
                        }))
                      }
                    />
                  )}

                  <Checkbox
                    label="Show on exit intent"
                    checked={triggerSettings.showOnExitIntent}
                    onChange={(checked) =>
                      setTriggerSettings((prev) => ({
                        ...prev,
                        showOnExitIntent: checked,
                      }))
                    }
                  />

                  <Checkbox
                    label="Show on scroll"
                    checked={triggerSettings.showOnScroll}
                    onChange={(checked) =>
                      setTriggerSettings((prev) => ({
                        ...prev,
                        showOnScroll: checked,
                      }))
                    }
                  />
                  {triggerSettings.showOnScroll && (
                    <RangeSlider
                      label="Scroll Percentage"
                      value={triggerSettings.scrollPercentage}
                      onChange={(value) =>
                        setTriggerSettings((prev) => ({
                          ...prev,
                          scrollPercentage: value,
                        }))
                      }
                      min={10}
                      max={100}
                      step={5}
                      output
                      suffix="%"
                    />
                  )}

                  <Checkbox
                    label="Show on inactivity"
                    checked={triggerSettings.showOnInactivity}
                    onChange={(checked) =>
                      setTriggerSettings((prev) => ({
                        ...prev,
                        showOnInactivity: checked,
                      }))
                    }
                  />
                  {triggerSettings.showOnInactivity && (
                    <TextField
                      label="Inactivity Time (seconds)"
                      type="number"
                      value={triggerSettings.inactivityTime.toString()}
                      onChange={(value) =>
                        setTriggerSettings((prev) => ({
                          ...prev,
                          inactivityTime: Number(value) || 30,
                        }))
                      }
                    />
                  )}
                </BlockStack>
              </Card>

              <Card sectioned title="Display Frequency">
                <Checkbox
                  label="Show once per session"
                  checked={triggerSettings.showOncePerSession}
                  onChange={(checked) =>
                    setTriggerSettings((prev) => ({
                      ...prev,
                      showOncePerSession: checked,
                    }))
                  }
                />
              </Card>
            </BlockStack>
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
              background: hsbToHex(colors.background) || "black",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: designSettings.font,
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
                <SpinningWheel
                  prizes={gameContent.prizes}
                  spinDegrees={spinDegrees}
                  isSpinning={isSpinning}
                  wheelSize={designSettings.wheelSize}
                  wheelLogo={
                    logoFiles.desktop.length > 0 ? logoFiles.desktop[0] : null
                  }
                  colorizeWheel={designSettings.colorizeWheel}
                  wheelColor={designSettings.wheelColor}
                  couponTextColor={colors.couponText}
                  showPointer={designSettings.showPointer}
                  pointerStyle={designSettings.pointerStyle}
                  pointerColor={designSettings.pointerColor}
                  pointerStrokeColor={designSettings.pointerStrokeColor}
                  pointerSize={designSettings.pointerSize}
                  pivotSize={designSettings.pivotSize}
                  pivotColor={designSettings.pivotColor}
                  pivotStrokeColor={designSettings.pivotStrokeColor}
                  pivotStrokeWidth={designSettings.pivotStrokeWidth}
                  animationDuration={designSettings.animationDuration}
                  onSpinComplete={handleSpinComplete}
                />

                {/* Audio element for wheel spinning sound */}
                <audio ref={audioRef} preload="auto">
                  <source
                    src="https://assets.mixkit.co/sfx/preview/mixkit-slot-machine-wheel-1932.mp3"
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
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
                {/* Brand Logo */}
                {logoFiles.brand.length > 0 && (
                  <div style={{ marginBottom: "20px", maxWidth: "200px" }}>
                    <img
                      src={
                        window.URL.createObjectURL(logoFiles.brand[0]) ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="Brand Logo"
                      style={{ width: "100%", height: "auto" }}
                      ref={brandLogoRef}
                    />
                  </div>
                )}

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

                {gameSettings.collectEmail && (
                  <div style={{ width: "100%", marginBottom: "10px" }}>
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
                )}

                {gameSettings.collectName && (
                  <div style={{ width: "100%", marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder={gameContent.namePlaceholder}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "none",
                        fontSize: "16px",
                      }}
                    />
                  </div>
                )}

                {gameSettings.collectPhone && (
                  <div style={{ width: "100%", marginBottom: "20px" }}>
                    <input
                      type="tel"
                      placeholder={gameContent.phonePlaceholder}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "none",
                        fontSize: "16px",
                      }}
                    />
                  </div>
                )}

                <button
                  style={{
                    backgroundColor: hsbToHex(colors.button),
                    color: hsbToHex(colors.buttonText),
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                    boxShadow: `0 4px 0 ${hsbToHex(colors.buttonShadow)}`,
                  }}
                  onClick={spinWheel}
                  disabled={isSpinning}
                >
                  {gameContent.buttonText}
                </button>

                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "12px",
                    opacity: 0.7,
                    maxWidth: "300px",
                    color: hsbToHex(colors.disclaimerText),
                  }}
                >
                  {gameContent.disclaimer}
                </p>
              </div>
            </div>

            {/* Vertical "SPIN THE WHEEL" text on the right side */}
            {previewMode === "desktop" && gameSettings.showBranding && (
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%) rotate(90deg)",
                  transformOrigin: "center right",
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "8px 16px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  fontSize: "14px",
                }}
              >
                SPIN THE WHEEL
              </div>
            )}

            {/* Winning Screen */}
            {renderWinningScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}
