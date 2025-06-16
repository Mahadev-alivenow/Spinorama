"use client";

import { useState, useRef } from "react";
import { Copy } from "lucide-react";

export default function SpinningWheel({
  sectors = 8,
  prizes = [],
  onSpinEnd = () => {},
  primaryColor = "#FF4D2A",
  size = 300,
}) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const wheelRef = useRef(null);

  // Default prizes if none provided
  const defaultPrizes = [
    { label: "20% OFF", chance: 10 },
    { label: "10% OFF", chance: 20 },
    { label: "5% OFF", chance: 30 },
    { label: "Free Shipping", chance: 10 },
    { label: "Buy 1 Get 1", chance: 5 },
    { label: "Try Again", chance: 25 },
    { label: "30% OFF", chance: 5 },
    { label: "50% OFF", chance: 2 },
  ];

  const actualPrizes =
    prizes.length > 0 ? prizes : defaultPrizes.slice(0, sectors);

  // Normalize prizes to match sector count
  const normalizedPrizes = Array(sectors)
    .fill(null)
    .map((_, i) => {
      return actualPrizes[i % actualPrizes.length];
    });

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Determine winner based on chance
    const chances = normalizedPrizes.map((prize) => prize.chance || 1);
    const total = chances.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;

    let winningIndex = 0;
    for (let i = 0; i < chances.length; i++) {
      random -= chances[i];
      if (random <= 0) {
        winningIndex = i;
        break;
      }
    }

    // Calculate rotation to land on the winning sector
    // Each sector is 360/sectors degrees, and we want to land in the middle
    const sectorSize = 360 / sectors;
    const sectorMiddle = sectorSize / 2;

    // The wheel rotates clockwise, so we need to adjust the winning index
    const adjustedWinningIndex = sectors - winningIndex - 1;

    // Calculate the target rotation
    // We add 5 full rotations (1800 degrees) for a good spin effect
    const targetRotation =
      1800 + adjustedWinningIndex * sectorSize + sectorMiddle;

    // Set the rotation with a smooth animation
    setRotation(targetRotation);

    // Set the winner after the animation completes
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(normalizedPrizes[winningIndex]);
      onSpinEnd(normalizedPrizes[winningIndex]);
    }, 5000); // Match this with the CSS animation duration
  };

  const renderSectors = () => {
    const sectorSize = 360 / sectors;
    return normalizedPrizes.map((prize, index) => {
      const startAngle = index * sectorSize;
      const endAngle = (index + 1) * sectorSize;

      // Calculate the SVG path for the sector
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;

      const x1 = 50 + 50 * Math.cos(startRad);
      const y1 = 50 + 50 * Math.sin(startRad);
      const x2 = 50 + 50 * Math.cos(endRad);
      const y2 = 50 + 50 * Math.sin(endRad);

      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

      const pathData = `M50,50 L${x1},${y1} A50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`;

      // Alternate colors
      const fill = index % 2 === 0 ? primaryColor : "white";

      return (
        <g key={index}>
          <path d={pathData} fill={fill} stroke="#ccc" strokeWidth="0.5" />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            transform={`rotate(${startAngle + sectorSize / 2}, 50, 50) translate(0, -30)`}
            fontSize="6"
            fontWeight="bold"
            fill={index % 2 === 0 ? "white" : primaryColor}
          >
            {prize.label}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          ref={wheelRef}
          viewBox="0 0 100 100"
          className="w-full h-full transition-transform duration-5000 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {renderSectors()}
          {/* Wheel border */}
          <circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="#ccc"
            strokeWidth="1"
          />
          {/* Dots around the wheel */}
          {Array(sectors * 2)
            .fill(null)
            .map((_, i) => {
              const angle = i * (360 / (sectors * 2));
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 48 * Math.cos(rad);
              const y = 50 + 48 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="1" fill="white" />;
            })}
        </svg>
        {/* Center of wheel */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full"></div>
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-black"></div>
        </div>
      </div>

      <button
        className="mt-4 bg-[#FF4D2A] text-white px-6 py-2 rounded-lg font-bold"
        onClick={spinWheel}
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "SPIN NOW"}
      </button>

      {winner && (
        <div className="mt-4 text-center">
          <h3 className="font-bold">You won: {winner.label}!</h3>
          {winner.code && (
            <div className="mt-2">
              <p className="text-sm">Use code:</p>
              <div className="flex items-center justify-center mt-1">
                <div className="bg-gray-100 px-4 py-2 rounded font-mono">
                  {winner.code}
                </div>
                <button
                  className="ml-2 text-[#FF4D2A]"
                  onClick={() => navigator.clipboard.writeText(winner.code)}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
