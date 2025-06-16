import type React from "react"
import type { ReactNode } from "react"

interface BrowserFrameProps {
  children: ReactNode
  viewMode: "mobile" | "desktop"
}

const BrowserFrame: React.FC<BrowserFrameProps> = ({ children, viewMode }) => {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-lg mx-auto ${
        viewMode === "mobile" ? "w-80" : "w-full max-w-4xl"
      }`}
    >
      <div className="bg-gray-200 px-4 py-2 flex items-center space-x-2 border-b border-gray-300">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      <div className="bg-gray-100 p-4 h-[calc(100%-2.5rem)] overflow-auto">{children}</div>
    </div>
  )
}

export default BrowserFrame

