"use client";

import { useState, useEffect, useRef } from "react";

export default function BasicWheel({
  prizes = [
    "10% OFF",
    "FREE SHIPPING",
    "15% OFF",
    "BUY 1 GET 1",
    "NO LUCK",
    "20% OFF",
    "5% OFF",
    "NO LUCK",
  ],
  colors = {
    primary: "#fe5300",
    secondary: "#ffffff",
  },
  onSpinEnd = () => {},
}) {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawWheel();
    }
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    const numSegments = prizes.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        i * segmentAngle,
        (i + 1) * segmentAngle,
      );
      ctx.closePath();

      // Alternate colors
      ctx.fillStyle = i % 2 === 0 ? colors.primary : colors.secondary;
      ctx.fill();

      // Add text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i * segmentAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = i % 2 === 0 ? "#ffffff" : colors.primary;
      ctx.font = "bold 14px Arial";
      ctx.fillText(prizes[i], radius - 20, 5);
      ctx.restore();
    }

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#333333";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    // Determine winning prize
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prizeAngle = (360 / prizes.length) * prizeIndex;

    // Calculate final rotation
    // Add multiple full rotations plus the angle needed to land on the prize
    const fullRotations = 5; // 5 full rotations for dramatic effect
    const finalRotation =
      fullRotations * 360 + (360 - prizeAngle) + Math.random() * 30 - 15;

    setRotation(finalRotation);

    // Set result after animation completes
    setTimeout(() => {
      setResult(prizes[prizeIndex]);
      setSpinning(false);
      onSpinEnd(prizes[prizeIndex]);
    }, 5000); // Should match the CSS animation duration
  };

  return (
    <div className="wheel-container relative">
      <div className="relative">
        <div
          className="wheel-spinner relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 5s cubic-bezier(0.15, 0.95, 0.35, 1.0)"
              : "none",
          }}
        >
          <canvas
            ref={canvasRef}
            width="300"
            height="300"
            className="w-full h-full"
          />
        </div>

        {/* Spinner pointer/indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: colors.primary }}
          />
        </div>

        {/* Spin button (in center of wheel) */}
        {!spinning && (
          <button
            onClick={spinWheel}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10
                     bg-white text-gray-800 font-bold rounded-full w-20 h-20 shadow-lg
                     border-4 hover:bg-gray-100 focus:outline-none"
            style={{ borderColor: colors.primary }}
          >
            SPIN
          </button>
        )}
      </div>
    </div>
  );
}
