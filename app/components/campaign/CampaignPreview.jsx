import { useCampaign } from "../../context/CampaignContext";

export default function CampaignPreview() {
  const { campaignData } = useCampaign();

  // Determine the main color based on color type selection
  const mainColor =
    campaignData.color === "singleTone"
      ? campaignData.primaryColor
      : campaignData.secondaryColor;

  // Secondary color for dual tone
  const accentColor =
    campaignData.color === "dualTone"
      ? campaignData.primaryColor
      : campaignData.primaryColor;

  return (
    <div className="campaign-preview-container">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            Preview
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          {/* Desktop Preview */}
          <div className="p-6 border-b">
            <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="text-center p-4 max-w-md mx-auto">
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: mainColor }}
                >
                  {campaignData.name || "GO AHEAD GIVE IT A SPIN!"}
                </h3>

                <div className="relative w-64 h-64 mx-auto my-4">
                  {/* Spin Wheel - Apply dual tone if selected */}
                  <div
                    className="w-full h-full rounded-full relative"
                    style={{
                      background:
                        campaignData.color === "dualTone"
                          ? `conic-gradient(
                        ${mainColor} 0deg, 
                        ${mainColor} 90deg, 
                        ${accentColor} 90deg, 
                        ${accentColor} 180deg, 
                        ${mainColor} 180deg, 
                        ${mainColor} 270deg, 
                        ${accentColor} 270deg, 
                        ${accentColor} 360deg
                      )`
                          : `conic-gradient(
                        ${mainColor} 0deg, 
                        ${mainColor} 90deg, 
                        white 90deg, 
                        white 180deg, 
                        ${mainColor} 180deg, 
                        ${mainColor} 270deg, 
                        white 270deg, 
                        white 360deg
                      )`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black"></div>
                    </div>
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-3 text-center"
                    placeholder="Enter your email"
                  />

                  <button
                    className="w-full py-2 px-4 rounded font-bold text-white"
                    style={{ backgroundColor: mainColor }}
                  >
                    SPIN NOW
                  </button>

                  <p className="text-xs text-gray-500 mt-2">
                    *Terms and conditions apply
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="p-6">
            <div className="w-40 mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-100 h-6 flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
              </div>

              <div className="bg-white p-2">
                <div className="flex justify-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs">S</span>
                  </div>
                </div>

                <div className="text-center">
                  <h4
                    className="text-xs font-bold"
                    style={{ color: mainColor }}
                  >
                    {campaignData.name || "GO AHEAD GIVE IT A SPIN!"}
                  </h4>

                  <p className="text-[6px] text-gray-500 my-1">
                    This is a special promotion just for you
                  </p>

                  <button
                    className="w-full py-1 text-[8px] rounded font-bold text-white mt-2"
                    style={{ backgroundColor: mainColor }}
                  >
                    SPIN NOW
                  </button>

                  <p className="text-[4px] text-gray-500 mt-1">
                    *Terms and conditions apply
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
