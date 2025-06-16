import type React from "react"
import WheelPreview from "./WheelPreview"

interface WinScreenPreviewProps {
  title: string
  subtitle: string
  couponText: string
  couponCode: string
  buttonText: string
  primaryColor: string
  secondaryColor: string
  wheelSectors: "four" | "six" | "eight"
}

const WinScreenPreview: React.FC<WinScreenPreviewProps> = ({
  title = "LUCKY DAY!",
  subtitle = "You have won 10% discount for your shopping",
  couponText = "Your discount code is",
  couponCode = "ABCDEFG_010",
  buttonText = "REDEEM NOW",
  primaryColor = "#FF5722",
  secondaryColor = "#FFFFFF",
  wheelSectors = "eight",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex">
      <div className="w-64 relative">
        <WheelPreview primaryColor={primaryColor} secondaryColor={secondaryColor} sectors={wheelSectors} />
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
          {title}
        </h2>

        <p className="text-sm mb-4 text-gray-700">{subtitle}</p>

        <p className="text-sm mb-2">{couponText}</p>

        <div className="flex mb-4">
          <div className="border border-gray-300 rounded px-3 py-2 text-lg font-mono">{couponCode}</div>
          <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.25 10.625V15.625C16.25 15.9565 16.1183 16.2745 15.8839 16.5089C15.6495 16.7433 15.3315 16.875 15 16.875H4.375C4.04348 16.875 3.72554 16.7433 3.49112 16.5089C3.2567 16.2745 3.125 15.9565 3.125 15.625V5C3.125 4.66848 3.2567 4.35054 3.49112 4.11612C3.72554 3.8817 4.04348 3.75 4.375 3.75H9.375"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.125 3.125H16.875V6.875"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.75 11.25L16.875 3.125"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <button className="w-full py-3 rounded font-bold text-white" style={{ backgroundColor: primaryColor }}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default WinScreenPreview

