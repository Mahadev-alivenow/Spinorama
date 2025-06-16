import type React from "react"

interface UrgencyBarPreviewProps {
  text: string
  couponCode: string
  minutes: string
  seconds: string
  primaryColor: string
}

const UrgencyBarPreview: React.FC<UrgencyBarPreviewProps> = ({
  text = "Your coupon code:",
  couponCode = "ABCDEFG_101",
  minutes = "10",
  seconds = "00",
  primaryColor = "#FF5722",
}) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 py-3 px-4 text-white flex items-center justify-center"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="flex items-center text-sm">
        <span>{text}</span>
        <span className="font-bold mx-2">{couponCode}</span>
        <span>
          is reserved for {minutes}:{seconds} mins. You can apply it at checkout.
        </span>
      </div>

      <button className="ml-4 text-white">×</button>
    </div>
  )
}

export default UrgencyBarPreview

