"use client"

import type React from "react"
import ThemeToggle from "../ThemeToggle"

interface Template {
  id: string
  name: string
  colors: string[]
  background: string
}

interface TemplateSelectorProps {
  templates: Template[]
  onSelect: (templateId: string) => void
  theme: "light" | "dark"
  onThemeChange: (theme: "light" | "dark") => void
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelect, theme, onThemeChange }) => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3"
          >
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-xl font-medium">Choose your template</h2>
        </div>

        <ThemeToggle theme={theme} onChange={onThemeChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((template) => (
          <div key={template.id} className="relative cursor-pointer" onClick={() => onSelect(template.id)}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 flex items-center justify-center p-4" style={{ background: template.background }}>
                <div
                  className="w-40 h-40 rounded-full relative"
                  style={{
                    background: `conic-gradient(
                      ${template.colors[0]} 0deg, 
                      ${template.colors[0]} 45deg, 
                      ${template.colors[1]} 45deg, 
                      ${template.colors[1]} 90deg, 
                      ${template.colors[0]} 90deg, 
                      ${template.colors[0]} 135deg, 
                      ${template.colors[1]} 135deg, 
                      ${template.colors[1]} 180deg, 
                      ${template.colors[0]} 180deg, 
                      ${template.colors[0]} 225deg, 
                      ${template.colors[1]} 225deg, 
                      ${template.colors[1]} 270deg, 
                      ${template.colors[0]} 270deg, 
                      ${template.colors[0]} 315deg, 
                      ${template.colors[1]} 315deg, 
                      ${template.colors[1]} 360deg
                    )`,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-12 -right-6 w-32 bg-white rounded-lg shadow-lg overflow-hidden border-4 border-white">
              <div className="p-3 flex flex-col items-center" style={{ background: template.background }}>
                <div className="text-xs font-bold mb-1 text-center" style={{ color: template.colors[0] }}>
                  GO AHEAD GIVE
                  <br />
                  IT A SPIN!
                </div>

                <div
                  className="w-16 h-16 rounded-full my-2"
                  style={{
                    background: `conic-gradient(
                      ${template.colors[0]} 0deg, 
                      ${template.colors[0]} 45deg, 
                      ${template.colors[1]} 45deg, 
                      ${template.colors[1]} 90deg, 
                      ${template.colors[0]} 90deg, 
                      ${template.colors[0]} 135deg, 
                      ${template.colors[1]} 135deg, 
                      ${template.colors[1]} 180deg, 
                      ${template.colors[0]} 180deg, 
                      ${template.colors[0]} 225deg, 
                      ${template.colors[1]} 225deg, 
                      ${template.colors[1]} 270deg, 
                      ${template.colors[0]} 270deg, 
                      ${template.colors[0]} 315deg, 
                      ${template.colors[1]} 315deg, 
                      ${template.colors[1]} 360deg
                    )`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                  </div>
                </div>

                <div className="w-full h-4 bg-white bg-opacity-80 rounded mb-2"></div>

                <button
                  className="w-full py-1 text-white text-xs font-bold rounded"
                  style={{ backgroundColor: template.colors[0] }}
                >
                  SPIN NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TemplateSelector

