import type React from "react"

interface Prize {
  id: number
  label: string
  code: string
  chance: number
}

interface WheelPreviewProps {
  primaryColor: string
  secondaryColor: string
  sectors: "four" | "six" | "eight"
  prizes?: Prize[]
  showPrizes?: boolean
}

const WheelPreview: React.FC<WheelPreviewProps> = ({
  primaryColor = "#FF5722",
  secondaryColor = "#FFFFFF",
  sectors = "eight",
  prizes = [],
  showPrizes = false,
}) => {
  const getGradient = () => {
    if (sectors === "four") {
      return `conic-gradient(
        ${primaryColor} 0deg, 
        ${primaryColor} 90deg, 
        ${secondaryColor} 90deg, 
        ${secondaryColor} 180deg, 
        ${primaryColor} 180deg, 
        ${primaryColor} 270deg, 
        ${secondaryColor} 270deg, 
        ${secondaryColor} 360deg
      )`
    } else if (sectors === "six") {
      return `conic-gradient(
        ${primaryColor} 0deg, 
        ${primaryColor} 60deg, 
        ${secondaryColor} 60deg, 
        ${secondaryColor} 120deg, 
        ${primaryColor} 120deg, 
        ${primaryColor} 180deg, 
        ${secondaryColor} 180deg, 
        ${secondaryColor} 240deg, 
        ${primaryColor} 240deg, 
        ${primaryColor} 300deg, 
        ${secondaryColor} 300deg, 
        ${secondaryColor} 360deg
      )`
    } else {
      return `conic-gradient(
        ${primaryColor} 0deg, 
        ${primaryColor} 45deg, 
        ${secondaryColor} 45deg, 
        ${secondaryColor} 90deg, 
        ${primaryColor} 90deg, 
        ${primaryColor} 135deg, 
        ${secondaryColor} 135deg, 
        ${secondaryColor} 180deg, 
        ${primaryColor} 180deg, 
        ${primaryColor} 225deg, 
        ${secondaryColor} 225deg, 
        ${secondaryColor} 270deg, 
        ${primaryColor} 270deg, 
        ${primaryColor} 315deg, 
        ${secondaryColor} 315deg, 
        ${secondaryColor} 360deg
      )`
    }
  }

  const renderPrizeLabels = () => {
    if (!showPrizes) return null

    const sectorCount = sectors === "four" ? 4 : sectors === "six" ? 6 : 8
    const angleStep = 360 / sectorCount
    const radius = 110 // Distance from center

    return Array.from({ length: sectorCount }).map((_, index) => {
      const angle = index * angleStep + angleStep / 2
      const radians = (angle - 90) * (Math.PI / 180)
      const x = radius * Math.cos(radians)
      const y = radius * Math.sin(radians)

      const prize = prizes[index % prizes.length] || { label: `${index * 10}% OFF` }

      return (
        <div
          key={index}
          className="absolute text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            color: index % 2 === 0 ? secondaryColor : primaryColor,
            maxWidth: "60px",
            textAlign: "center",
          }}
        >
          {prize.label}
        </div>
      )
    })
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative w-56 h-56 rounded-full"
        style={{
          background: getGradient(),
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        {renderPrizeLabels()}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center z-10">
            <div className="w-4 h-4 rounded-full bg-white"></div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-gray-800"></div>
      </div>

      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer">
        ×
      </div>
    </div>
  )
}

export default WheelPreview

