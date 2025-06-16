import type React from "react"

interface TriggerPreviewProps {
  showBar: boolean
  text: string
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  primaryColor: string
}

const TriggerPreview: React.FC<TriggerPreviewProps> = ({
  showBar = true,
  text = "SPIN & WIN",
  position = "topRight",
  primaryColor = "#FF5722",
}) => {
  if (!showBar) return null

  const getPositionStyles = () => {
    switch (position) {
      case "topLeft":
        return { top: "20%", left: "20px" }
      case "topRight":
        return { top: "20%", right: "20px" }
      case "bottomLeft":
        return { bottom: "20%", left: "20px" }
      case "bottomRight":
        return { bottom: "20%", right: "20px" }
      default:
        return { top: "20%", right: "20px" }
    }
  }

  return (
    <div className="fixed flex items-center" style={{ ...getPositionStyles() }}>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: primaryColor }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 16L16 12L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="py-2 px-4 text-white font-bold rounded-r-full" style={{ backgroundColor: primaryColor }}>
        {text}
      </div>
    </div>
  )
}

export default TriggerPreview

