import type React from "react"
import WheelPreview from "./WheelPreview"

interface LandingScreenPreviewProps {
  title: string
  subtitle: string
  emailPlaceholder: string
  buttonText: string
  termsEnabled: boolean
  termsText: string
  primaryColor: string
  secondaryColor: string
  wheelSectors: "four" | "six" | "eight"
  layout: "right" | "left"
}

const LandingScreenPreview: React.FC<LandingScreenPreviewProps> = ({
  title = "GO AHEAD GIVE IT A SPIN!",
  subtitle = "This is a demo of our spin to Win displays",
  emailPlaceholder = "Enter your email",
  buttonText = "SPIN NOW",
  termsEnabled = true,
  termsText = "I accept the T&C and Privacy Policy",
  primaryColor = "#FF5722",
  secondaryColor = "#FFFFFF",
  wheelSectors = "eight",
  layout = "right",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex">
      {layout === "left" && (
        <div className="w-64 relative">
          <WheelPreview primaryColor={primaryColor} secondaryColor={secondaryColor} sectors={wheelSectors} />
        </div>
      )}

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
          {title}
        </h2>

        <p className="text-sm mb-4 text-gray-700">{subtitle}</p>

        {termsEnabled && (
          <div className="flex items-center mb-4 text-xs text-gray-600">
            <input type="checkbox" className="mr-2" />
            <span>{termsText}</span>
          </div>
        )}

        <div className="w-full mb-4">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder={emailPlaceholder}
          />
        </div>

        <button className="w-full py-3 rounded font-bold text-white" style={{ backgroundColor: primaryColor }}>
          {buttonText}
        </button>

        <p className="text-xs text-gray-500 mt-3">No, I don't feel lucky today!</p>
      </div>

      {layout === "right" && (
        <div className="w-64 relative">
          <WheelPreview primaryColor={primaryColor} secondaryColor={secondaryColor} sectors={wheelSectors} />
        </div>
      )}
    </div>
  )
}

export default LandingScreenPreview

