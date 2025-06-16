import PropTypes from "prop-types";

function WheelPreview({ lookType, colorType, primaryColor, secondaryColor }) {
  // Generate wheel segments based on color type
  const getWheelSegments = () => {
    const segments = [];
    const segmentCount = colorType === "four" ? 4 : colorType === "six" ? 6 : 8;

    for (let i = 0; i < segmentCount; i++) {
      if (colorType === "single") {
        segments.push({
          color: i % 2 === 0 ? primaryColor : "#ffffff",
          text: "",
        });
      } else {
        segments.push({
          color: i % 2 === 0 ? primaryColor : secondaryColor,
          text: "",
        });
      }
    }

    return segments;
  };

  const segments = getWheelSegments();

  return (
    <div className="space-y-4">
      {/* Desktop preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center space-x-1 mb-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>

        <div className="bg-white p-4 rounded border">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold uppercase">
              GO AHEAD GIVE IT A SPIN!
            </h3>
            <p className="text-sm text-gray-500">
              This is a chance of your life to win amazing rewards
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative w-64 h-64">
              {/* Wheel */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {segments.map((segment, index) => {
                  const startAngle =
                    (index * (360 / segments.length) * Math.PI) / 180;
                  const endAngle =
                    ((index + 1) * (360 / segments.length) * Math.PI) / 180;

                  const x1 = 50 + 50 * Math.cos(startAngle);
                  const y1 = 50 + 50 * Math.sin(startAngle);
                  const x2 = 50 + 50 * Math.cos(endAngle);
                  const y2 = 50 + 50 * Math.sin(endAngle);

                  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

                  const pathData = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `Z`,
                  ].join(" ");

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={segment.color}
                      stroke="#000"
                      strokeWidth="0.5"
                    />
                  );
                })}

                {/* Center circle */}
                <circle cx="50" cy="50" r="5" fill="#000" />

                {/* Pointer */}
                <circle cx="50" cy="15" r="3" fill="#000" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <button
              className="px-6 py-2 text-white font-bold rounded"
              style={{ backgroundColor: primaryColor }}
            >
              SPIN NOW
            </button>
            <p className="text-xs text-gray-500 mt-1">
              You'll see what you'll win instantly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

WheelPreview.propTypes = {
  lookType: PropTypes.string.isRequired,
  colorType: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
};

export default WheelPreview;
