"use client";

import { useState, useEffect, useRef } from "react";
import { X, Copy } from "lucide-react";

export default function SpinWheelPopup({
  isOpen = false,
  onClose,
  colors = { primary: "#fe5300", secondary: "#731b29" },
  style = "popup", // popup or fullscreen
  logo = null,
  theme = "light", // light or dark
  sectorCount = 8,
  wheelPosition = "right", // right or left
  title = "GO AHEAD GIVE IT A SPIN!",
  subtitle = "This is a demo of our Spin to Win displays",
  showEmail = true,
  showPrivacyPolicy = true,
  privacyPolicyText = "I accept the T&C and Privacy Notice.",
  buttonText = "SPIN NOW",
  showTerms = true,
  termsText = "No, I don't feel lucky today!",
  prizeOptions = [
    { type: "20% OFF", reward: "2000OFF", chance: 40 },
    { type: "10% OFF", reward: "1000OFF", chance: 10 },
    { type: "5% OFF", reward: "500OFF", chance: 6 },
    { type: "10% OFF", reward: "1000OFF", chance: 20 },
    { type: "Oops!", reward: "Better luck next time", chance: 6 },
    { type: "20% OFF", reward: "2000OFF", chance: 6 },
    { type: "10% OFF", reward: "1000OFF", chance: 6 },
    { type: "10% OFF", reward: "1000OFF", chance: 6 },
  ],
  resultTitle = "LUCKY DAY!",
  resultSubtitle = "You have won 10% discount for your shopping",
  resultButtonText = "REDEEM NOW",
  resultButtonDestination = "https://www.yourdomain.com/productlist",
  showCopyIcon = true,
  showResultAgain = true,
  resultTimer = { minutes: 10, seconds: 0 },
}) {
  const [email, setEmail] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [resultPrize, setResultPrize] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  // Adjust prize options to match sector count
  const adjustedPrizes = prizeOptions.slice(0, sectorCount);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      drawWheel();
    }
  }, [isOpen, colors, sectorCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && !spinning) {
      spinWheel();
    }
  };

  const spinWheel = () => {
    setSpinning(true);

    // Calculate winning sector based on probabilities
    const totalProbability = adjustedPrizes.reduce(
      (sum, prize) => sum + prize.chance,
      0,
    );
    let random = Math.random() * totalProbability;
    let winningIndex = 0;

    for (let i = 0; i < adjustedPrizes.length; i++) {
      random -= adjustedPrizes[i].chance;
      if (random <= 0) {
        winningIndex = i;
        break;
      }
    }

    // Calculate angle to land on the winning sector
    const sectorAngle = 360 / adjustedPrizes.length;
    const winningAngle = sectorAngle * winningIndex;

    // Add extra rotations (2-5 full rotations) + angle to the winning sector + slight offset
    const extraRotations = 2 + Math.floor(Math.random() * 3); // 2-5 rotations
    const destinationAngle =
      360 * extraRotations +
      (360 - winningAngle) +
      Math.random() * (sectorAngle * 0.8);

    setRotationAngle(destinationAngle);

    // Generate a random coupon code
    setCouponCode(
      `ABCDEFG_${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
    );

    // Show result after the animation completes
    setTimeout(() => {
      setResultPrize(adjustedPrizes[winningIndex]);
      setSpinning(false);
    }, 5000); // Match this with the CSS animation duration
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel sectors
    const sectorAngle = (2 * Math.PI) / adjustedPrizes.length;

    for (let i = 0; i < adjustedPrizes.length; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, i * sectorAngle, (i + 1) * sectorAngle);
      ctx.closePath();

      // Alternate colors
      ctx.fillStyle =
        i % 2 === 0 ? colors.primary : theme === "dark" ? "#000" : "#fff";
      ctx.fill();

      // Draw prize text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i * sectorAngle + sectorAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = i % 2 === 0 ? "#fff" : colors.primary;
      ctx.font = "bold 14px Arial";
      ctx.fillText(adjustedPrizes[i].type, radius - 20, 5);
      ctx.restore();
    }

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = colors.primary;
    ctx.stroke();

    // Draw small circles on the edge
    for (let i = 0; i < adjustedPrizes.length * 2; i++) {
      const angle = (i * Math.PI) / adjustedPrizes.length;
      const dotX = centerX + Math.cos(angle) * radius;
      const dotY = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(couponCode)
      .then(() => {
        alert("Coupon code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Don't render if not open
  if (!isOpen) return null;

  const bgColor = theme === "dark" ? "bg-black" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const displayStyleClass =
    style === "fullscreen"
      ? "fixed inset-0"
      : "fixed inset-0 flex items-center justify-center";

  return (
    <div
      className={`${displayStyleClass} z-50`}
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div
        className={`${style === "fullscreen" ? "w-full h-full" : "max-w-md w-full mx-auto rounded-lg"} ${bgColor} p-6 overflow-hidden relative`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} className="text-red-500" />
        </button>

        {resultPrize ? (
          // Result screen
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 inline-block px-4 py-2 mb-4">
              <h2 className={`text-2xl font-bold ${textColor} uppercase`}>
                {resultTitle}
              </h2>
            </div>
            <p className={`text-sm ${textColor} mb-4`}>{resultSubtitle}</p>

            <div className="mb-4">
              <p className={`text-sm ${textColor} mb-2`}>
                Your discount code is
              </p>
              <div className="flex items-center justify-center">
                <div className="border border-gray-300 rounded px-4 py-2 bg-white text-black font-bold">
                  {couponCode}
                </div>
                {showCopyIcon && (
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 p-2 bg-white rounded border border-gray-300"
                  >
                    <Copy size={20} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>

            <a
              href={resultButtonDestination}
              className="block w-full py-3 rounded-lg font-medium text-white uppercase"
              style={{ backgroundColor: colors.primary }}
            >
              {resultButtonText}
            </a>

            {/* Wheel in background */}
            <div className="opacity-30 mt-4">
              <canvas
                ref={canvasRef}
                width="240"
                height="240"
                className="w-full h-full"
              />
            </div>
          </div>
        ) : (
          // Landing screen
          <>
            {/* Logo */}
            {logo && (
              <div className="flex justify-center mb-4">
                <img
                  ref={logoRef}
                  src={logo || "/placeholder.svg"}
                  alt="Brand Logo"
                  className="h-10"
                />
              </div>
            )}

            {/* Content layout based on position */}
            <div
              className={`flex flex-col ${wheelPosition === "left" ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div
                className={`${wheelPosition === "left" ? "md:pl-4" : "md:pr-4"} flex-1`}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="border-2 border-dashed border-gray-300 inline-block px-4 py-2 mb-2">
                    <h2
                      className={`text-2xl font-bold ${textColor} uppercase`}
                      style={{ color: colors.primary }}
                    >
                      {title}
                    </h2>
                  </div>
                  <p className={`text-sm ${textColor} opacity-70`}>
                    {subtitle}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mb-4">
                  {showPrivacyPolicy && (
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mr-2"
                        defaultChecked
                      />
                      <label
                        htmlFor="terms"
                        className={`text-xs ${textColor} opacity-70`}
                      >
                        {privacyPolicyText}
                      </label>
                    </div>
                  )}

                  {showEmail && (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                      required
                    />
                  )}

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-medium text-white uppercase`}
                    style={{ backgroundColor: colors.primary }}
                    disabled={spinning}
                  >
                    {buttonText}
                  </button>

                  {showTerms && (
                    <p
                      className={`text-xs ${textColor} opacity-70 text-center mt-1`}
                    >
                      {termsText}
                    </p>
                  )}
                </form>
              </div>

              {/* Wheel */}
              <div className="relative mt-4 flex justify-center">
                <div
                  className="relative"
                  style={{
                    width: "240px",
                    height: "240px",
                  }}
                >
                  {/* Spinner wheel */}
                  <div
                    className="absolute inset-0 transition-transform duration-5000 ease-out"
                    style={{
                      transform: `rotate(${rotationAngle}deg)`,
                      transition: spinning
                        ? "transform 5s cubic-bezier(0.15, 0.95, 0.35, 1.0)"
                        : "none",
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      width="240"
                      height="240"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Pointer */}
                  <div
                    className="absolute top-0 left-1/2 -ml-4 w-8 h-8 z-10"
                    style={{ transform: "translateY(-50%)" }}
                  >
                    <div
                      className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent"
                      style={{ borderTopColor: colors.primary }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
