import { useFetcher } from "@remix-run/react";

export default function Index() {
  const fetcher = useFetcher();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <div className="flex justify-between mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex items-center flex-1 mr-4">
            <button className="bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-medium">
              Home
            </button>
            <button className="text-gray-700 px-8 py-3 rounded-lg font-medium">
              All Campaigns
            </button>
            <button className="text-gray-700 px-8 py-3 rounded-lg font-medium">
              Pricing
            </button>
            <button className="text-gray-700 px-8 py-3 rounded-lg font-medium">
              Tutorial
            </button>
          </div>
          <button className="bg-[#4F46E5] text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap">
            Create Campaign
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ongoing Campaigns */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Ongoing Campaigns</h2>

            {/* Campaign Card 1 */}
            <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <div className="flex justify-between mb-4">
                <div className="flex">
                  <div className="w-12 h-12 rounded overflow-hidden mr-4">
                    <img
                      src="/images/campaign-icon.png"
                      alt="Campaign icon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Campaign Name</h3>
                    <p className="text-gray-500 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing, sed do
                      eiusmod tempor incididunt ut labore et...
                    </p>
                  </div>
                </div>
                <button className="text-[#4F46E5]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.75 2.5H6.25C5.56 2.5 5 3.06 5 3.75V16.25C5 16.94 5.56 17.5 6.25 17.5H13.75C14.44 17.5 15 16.94 15 16.25V3.75C15 3.06 14.44 2.5 13.75 2.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.75 6.25H11.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    Impression Count :
                  </span>
                  <span className="text-sm font-semibold">300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Reward Distribution:
                  </span>
                  <span className="text-sm font-semibold">80/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-[#4F46E5] text-white py-2 px-4 rounded-lg text-center">
                  View Analytics
                </button>
                <button className="border border-red-500 text-red-500 py-2 px-4 rounded-lg text-center">
                  Deactivate
                </button>
              </div>
            </div>

            {/* Campaign Card 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <div className="flex">
                  <div className="w-12 h-12 rounded overflow-hidden mr-4">
                    <img
                      src="/images/campaign-icon.png"
                      alt="Campaign icon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Campaign Name</h3>
                    <p className="text-gray-500 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing, sed do
                      eiusmod tempor incididunt ut labore et...
                    </p>
                  </div>
                </div>
                <button className="text-[#4F46E5]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.75 2.5H6.25C5.56 2.5 5 3.06 5 3.75V16.25C5 16.94 5.56 17.5 6.25 17.5H13.75C14.44 17.5 15 16.94 15 16.25V3.75C15 3.06 14.44 2.5 13.75 2.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.75 6.25H11.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    Impression Count :
                  </span>
                  <span className="text-sm font-semibold">300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Reward Distribution:
                  </span>
                  <span className="text-sm font-semibold">80/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-[#4F46E5] text-white py-2 px-4 rounded-lg text-center">
                  View Analytics
                </button>
                <button className="border border-red-500 text-red-500 py-2 px-4 rounded-lg text-center">
                  Deactivate
                </button>
              </div>
            </div>
          </div>

          {/* Draft Campaigns */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Draft Campaigns</h2>

            {/* Draft Campaign Card 1 */}
            <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center">
                      <div className="w-6 h-1 bg-gray-400 mb-1"></div>
                      <div className="w-6 h-1 bg-gray-400 mb-1"></div>
                      <div className="w-6 h-1 bg-gray-400"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Campaign Name</h3>
                    <p className="text-gray-500 text-sm">Description</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="text-gray-500 mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.875 4.375L3.125 4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.125 8.125V13.125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.875 8.125V13.125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="border border-[#4F46E5] text-[#4F46E5] py-2 px-4 rounded-lg">
                    Finish Editing
                  </button>
                </div>
              </div>
            </div>

            {/* Draft Campaign Card 2 */}
            <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center">
                      <div className="w-6 h-1 bg-gray-400 mb-1"></div>
                      <div className="w-6 h-1 bg-gray-400 mb-1"></div>
                      <div className="w-6 h-1 bg-gray-400"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Campaign Name</h3>
                    <p className="text-gray-500 text-sm">Description</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="text-gray-500 mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.875 4.375L3.125 4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.125 8.125V13.125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.875 8.125V13.125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="border border-[#4F46E5] text-[#4F46E5] py-2 px-4 rounded-lg">
                    Finish Editing
                  </button>
                </div>
              </div>
            </div>

            {/* Draft Campaign Card 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center">
                      <div className="w-6 h-1 bg-gray-400 mb-1"></div>
                      <div className="w-6 h-1 bg-gray-400 mb-1"></div>
                      <div className="w-6 h-1 bg-gray-400"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Campaign Name</h3>
                    <p className="text-gray-500 text-sm">Description</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="text-gray-500 mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.875 4.375L3.125 4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.125 8.125V13.125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.875 8.125V13.125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="border border-[#4F46E5] text-[#4F46E5] py-2 px-4 rounded-lg">
                    Finish Editing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
