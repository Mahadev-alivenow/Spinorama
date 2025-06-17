import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useRef, useState } from "react";

export default function Tutorial() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle create campaign click
  const handleCreateClick = () => {
    navigate("/campaigns/create");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <Navigation createButtonText="Create Campaign" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-4xl font-bold mb-4">STEP-BY-STEP GUIDE</h1>
            <p className="text-lg mb-6">
              How to get more customers is one of the biggest challenges in
              e-commerce, EcomSend puts it all at your fingertips. EcomSend
              works out of the box without a single line of code. Need help?
              Contact us via online chat or email, we are 24/7.
            </p>

            <div className="flex space-x-4 mt-8">
              <button className="bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-medium">
                Watch Tutorial
              </button>
              <button
                className="border border-[#4F46E5] text-[#4F46E5] px-8 py-3 rounded-lg font-medium"
                onClick={handleCreateClick}
              >
                Create Campaign
              </button>
            </div>
          </div>

          {/* Right Column - Video */}
          {/* <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Tutorial video thumbnail"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 3L19 12L5 21V3Z" fill="white" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
              05:20
            </div>
          </div> */}

          {/* Right Column - Video */}
          <div
            className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={handlePlayPause}
          >
            {/* Video tag without controls */}
            <video
              ref={videoRef}
              src="/tutorial-video/tutorial.mp4"
              poster="/placeholder.png?height=400&width=600"
              className="w-full h-auto rounded-lg"
            />

            {/* Play icon if not playing */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-4">
                  {/* Play icon */}
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 3L19 12L5 21V3Z" fill="#ffffff" />
                  </svg>
                </div>
              </div>
            )}

            {/* <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-gray-50 px-3 py-1 rounded">
              05:20
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

