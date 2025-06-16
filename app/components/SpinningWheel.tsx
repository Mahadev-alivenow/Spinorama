"use client";

import { useRef, useEffect } from "react";
import { hsbToRgb } from "@shopify/polaris";

// Helper function to convert HSB to hex
const hsbToHex = (hsb) => {
  const rgb = hsbToRgb(hsb);
  return `#${((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1)}`;
};

export function SpinningWheel({
  prizes,
  spinDegrees,
  isSpinning,
  wheelSize = 400,
  wheelLogo,
  colorizeWheel = false,
  wheelColor,
  couponTextColor,
  showPointer = true,
  pointerStyle = "triangle",
  pointerColor = "#ffffff",
  pointerStrokeColor = "#000000",
  pointerSize = 1,
  pivotSize = 1,
  pivotColor = "#ffffff",
  pivotStrokeColor = "#000000",
  pivotStrokeWidth = 1,
  animationDuration = 5,
  onSpinComplete,
}) {
  const wheelRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (isSpinning && onSpinComplete) {
      const timer = setTimeout(() => {
        onSpinComplete();
      }, animationDuration * 1000);

      return () => clearTimeout(timer);
    }
  }, [isSpinning, animationDuration, onSpinComplete]);

  const numSegments = prizes.length;
  const segmentAngle = 360 / numSegments;
  const segments = [];
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const radius = wheelSize / 2 - 10; // Slightly smaller to fit within container
  const pivotRadius = (wheelSize / 10) * pivotSize;

  // Create wheel segments
  for (let i = 0; i < numSegments; i++) {
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;
    const prize = prizes[i];

    // Calculate the path for the segment
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    // Calculate text position - move it more toward the outer edge
    const textAngle = startAngle + segmentAngle / 2;
    const textRad = ((textAngle - 90) * Math.PI) / 180;
    const textDistance = radius * 0.65; // Position text at 65% of the radius
    const textX = centerX + textDistance * Math.cos(textRad);
    const textY = centerY + textDistance * Math.sin(textRad);

    // Calculate text rotation to make it more readable
    let textRotation = textAngle;
    if (textAngle > 90 && textAngle < 270) {
      textRotation += 180;
    }

    segments.push(
      <g key={i}>
        <path
          d={pathData}
          fill={colorizeWheel ? hsbToHex(wheelColor) : prize.color}
          stroke="#000"
          strokeWidth="1"
        />
        <text
          x={textX}
          y={textY}
          fill={couponTextColor ? hsbToHex(couponTextColor) : "#ffffff"}
          fontSize={`${wheelSize / 30}px`}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${textRotation}, ${textX}, ${textY})`}
        >
          {prize.label}
        </text>
      </g>,
    );
  }

  // Render pointer based on selected style
  const renderPointer = () => {
    if (!showPointer) return null;

    const pointerActualSize = (wheelSize / 20) * pointerSize;

    switch (pointerStyle) {
      case "triangle":
        return (
          <polygon
            points={`${centerX},${pointerActualSize} ${centerX + pointerActualSize},0 ${centerX - pointerActualSize},0`}
            fill={pointerColor}
            stroke={pointerStrokeColor}
            strokeWidth="1"
          />
        );
      case "arrow":
        return (
          <path
            d={`M${centerX - pointerActualSize},${pointerActualSize} L${centerX},0 L${centerX + pointerActualSize},${pointerActualSize} L${centerX},${pointerActualSize / 2} Z`}
            fill={pointerColor}
            stroke={pointerStrokeColor}
            strokeWidth="1"
          />
        );
      case "circle":
        return (
          <circle
            cx={centerX}
            cy={pointerActualSize / 2}
            r={pointerActualSize}
            fill={pointerColor}
            stroke={pointerStrokeColor}
            strokeWidth="1"
          />
        );
      default:
        return (
          <polygon
            points={`${centerX},${pointerActualSize} ${centerX + pointerActualSize},0 ${centerX - pointerActualSize},0`}
            fill={pointerColor}
            stroke={pointerStrokeColor}
            strokeWidth="1"
          />
        );
    }
  };

  // Render wheel pivot/center
  const renderPivot = () => {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={pivotRadius}
        fill={pivotColor}
        stroke={pivotStrokeColor}
        strokeWidth={pivotStrokeWidth}
      />
    );
  };

  // Render logo in the center
  const renderLogo = () => {
    if (wheelLogo) {
      return (
        <image
          href={
            typeof wheelLogo === "string"
              ? wheelLogo
              : window.URL.createObjectURL(wheelLogo)
          }
          x={centerX - pivotRadius * 0.8}
          y={centerY - pivotRadius * 0.8}
          height={pivotRadius * 1.6}
          width={pivotRadius * 1.6}
          preserveAspectRatio="xMidYMid meet"
          ref={logoRef}
        />
      );
    } else {
      return (
        <>
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={wheelSize / 40}
            fill="#ff5252"
          >
            YOUR
          </text>
          <text
            x={centerX}
            y={centerY + 5}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={wheelSize / 30}
            fontWeight="bold"
            fill="#ff5252"
          >
            LOGO
          </text>
        </>
      );
    }
  };

  return (
    <div
      className="wheel-container"
      style={{
        position: "relative",
        width: `${wheelSize}px`,
        height: `${wheelSize}px`,
        margin: "0 auto",
      }}
    >
      <svg
        width={wheelSize}
        height={wheelSize}
        viewBox={`0 0 ${wheelSize} ${wheelSize}`}
      >
        {showPointer && renderPointer()}

        <g
          transform={`rotate(${spinDegrees}, ${centerX}, ${centerY})`}
          style={{
            transition: isSpinning
              ? `transform ${animationDuration}s cubic-bezier(0.1, 0.7, 0.1, 1)`
              : "transform 0.5s ease-out",
            transformOrigin: "center center",
          }}
          ref={wheelRef}
        >
          {segments}
          {renderPivot()}
          {renderLogo()}
        </g>
      </svg>
    </div>
  );
}
