// MarketCompetitorCard.jsx
import React from "react";

const MarketCompetitorCard = ({ phones, userConfig, isModalView = false }) => {
  // Safe string value formatter to prevent long string clumps without spacing (Sensors, Extras)
  const formatListValue = (value) => {
    if (!value) return "Not Available";
    if (Array.isArray(value)) {
      if (value.length === 0) return "None";
      return value.map(item => typeof item === 'object' ? item.name : item).join(", ");
    }
    // If it is a string missing expected formatting commas, try to split camelcase values elegantly
    if (typeof value === "string") {
      const cleaned = value.replace(/([A-Z])/g, ' $1').trim();
      return cleaned.replace(/\s+/g, ' ').split(" ").join(", ");
    }
    return String(value);
  };

  // Same formatting as BuildSummaryCard
  const cameraText = userConfig.camera?.isValid
    ? userConfig.camera.slots
        .map((s) => `${s.mp}MP ${s.type}${s.ois ? " (OIS)" : ""}`)
        .join(" + ")
    : "Not Selected";

  const userSpecs = {
    processor: userConfig.processor?.name || "Not Selected",
    ram: userConfig.ram?.size && userConfig.ram?.type
        ? `${userConfig.ram.size}GB ${userConfig.ram.type}`
        : "Not Selected",
    storage: userConfig.storage?.capacity && userConfig.storage?.type
        ? `${
            userConfig.storage.capacity === 1024
              ? "1TB"
              : userConfig.storage.capacity === 2048
              ? "2TB"
              : `${userConfig.storage.capacity}GB`
          } ${userConfig.storage.type}`
        : "Not Selected",
    display: userConfig.display?.isValid
      ? `${userConfig.display.panelType} | ${userConfig.display.refreshRate}Hz | ${userConfig.display.resolution} | ${userConfig.display.size}"`
      : "Not Selected",
    battery: userConfig.battery?.isValid
      ? `${userConfig.battery.capacity}mAh | ${userConfig.battery.chargingSpeed}W | ${userConfig.battery.type}`
      : "Not Selected",
    camera: cameraText,
    connectivity: userConfig.connectivity?.network?.type &&
      userConfig.connectivity?.wifi?.type &&
      userConfig.connectivity?.bluetooth?.type
        ? `${userConfig.connectivity.network.type} | ${userConfig.connectivity.wifi.type} | ${userConfig.connectivity.bluetooth.type}`
        : "Not Selected",
    audio: userConfig.audio
      ? [
          userConfig.audio.speakers || null,
          userConfig.audio.dolbyAtmos || null,
          userConfig.audio.hiResAudio || null,
        ]
          .filter(Boolean)
          .join(" | ")
      : "Not Selected",
    thermal: userConfig.thermal?.name || "Not Selected",
    phoneBuild: userConfig.phoneBuild?.material || "Not Selected",
    haptics: userConfig.haptics?.name || "Not Selected",
    sensors: userConfig.sensors?.length > 0
        ? userConfig.sensors.map((s) => s.name).join(", ")
        : "Not Selected",
    components: userConfig.components?.length > 0
        ? userConfig.components.map((c) => c.name).join(", ")
        : "None",
  };

  // Extract numeric values
  const extractNumber = (value) => {
    if (!value) return null;
    const match = value.toString().match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  // Compare values
  const compareValues = (key, userValue, competitorValue) => {
    if (key === "ram" || key === "storage" || key === "battery") {
      const userNum = extractNumber(userValue);
      const compNum = extractNumber(competitorValue);

      if (!userNum || !compNum) {
        return { userClass: "text-white", compClass: "text-white" };
      }

      if (userNum === compNum) {
        return {
          userClass: "text-emerald-400 font-semibold",
          compClass: "text-emerald-400 font-semibold",
        };
      }

      if (userNum > compNum) {
        return {
          userClass: "text-emerald-400 font-semibold",
          compClass: "text-white",
        };
      }

      return {
        userClass: "text-white",
        compClass: "text-emerald-400 font-semibold",
      };
    }

    const u = userValue?.toString().toLowerCase() || "";
    const c = competitorValue?.toString().toLowerCase() || "";

    if (u.includes(c) || c.includes(u)) {
      return {
        userClass: "text-emerald-400 font-semibold",
        compClass: "text-emerald-400 font-semibold",
      };
    }

    return { userClass: "text-white", compClass: "text-white" };
  };

  const rows = [
    ["Processor", "processor"],
    ["RAM", "ram"],
    ["Storage", "storage"],
    ["Display", "display"],
    ["Battery", "battery"],
    ["Camera", "camera"],
    ["Connectivity", "connectivity"],
    ["Audio", "audio"],
    ["Thermal", "thermal"],
    ["Build", "phoneBuild"],
    ["Haptics", "haptics"],
    ["Sensors", "sensors"],
    ["Extras", "components"],
  ];

  return (
    <div className={isModalView ? "space-y-6 w-full text-white" : "mt-8 bg-[#111827] border border-indigo-500/20 rounded-2xl p-4 sm:p-6 text-white w-full shadow-2xl"}>
      {!isModalView && (
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-6">
          Competitor Comparison
        </h2>
      )}

      <div className="space-y-6">
        {phones.map((phone, index) => {
          // Normalizes brand duplicates (e.g. stops "Samsung Samsung S26")
          const brandStr = phone.brand || "";
          const modelStr = phone.model || "";
          const computedTitleName = modelStr.toLowerCase().startsWith(brandStr.toLowerCase())
            ? modelStr
            : `${brandStr} ${modelStr}`;

          return (
            <div
              key={index}
              className="border border-gray-700/80 bg-gray-950/20 rounded-xl p-4 sm:p-5 shadow-inner"
            >
              <h3 className="text-base sm:text-lg font-bold text-yellow-400 mb-4 pb-1 border-b border-white/5">
                {computedTitleName} — <span className="text-emerald-400">₹{phone.price?.toLocaleString()}</span>
              </h3>

              {/* Flex Table Header Block - Hidden gracefully on mobile */}
              <div className="hidden sm:grid grid-cols-3 gap-4 mb-3 font-semibold border-b border-gray-700 pb-2 text-xs sm:text-sm tracking-wide">
                <div className="text-gray-400">Component</div>
                <div className="text-indigo-400">Your Build</div>
                <div className="text-yellow-400">Competitor</div>
              </div>

              {/* Data Rows Container */}
              <div className="space-y-3 sm:space-y-0">
                {rows.map(([label, key]) => {
                  const compValueRaw = phone[key];
                  // If key mapping defaults mismatch across datasets, evaluate alternatives fallback keys safely
                  const compFormatted = (key === "phoneBuild") 
                    ? (phone.phoneBuild || phone.build || phone.material) 
                    : (key === "components") 
                    ? (phone.components || phone.extras) 
                    : compValueRaw;

                  const comparison = compareValues(
                    key,
                    userSpecs[key],
                    typeof compFormatted === "string" ? compFormatted : formatListValue(compFormatted)
                  );

                  return (
                    <div
                      key={key}
                      className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4 py-2.5 sm:py-3 border-b border-gray-800 last:border-0 text-xs sm:text-sm transition-colors hover:bg-white/[0.01]"
                    >
                      {/* Component Descriptor Column Label */}
                      <div className="text-gray-400 font-medium sm:font-normal">
                        {label}
                      </div>

                      {/* Side-by-side content block adaptive fallback grids on small screen size viewports */}
                      <div className="grid grid-cols-2 gap-2 sm:contents">
                        {/* Your Setup Column Frame */}
                        <div className="bg-gray-900/40 sm:bg-transparent p-2 sm:p-0 rounded-lg border border-indigo-500/5 sm:border-0">
                          <span className="text-[9px] uppercase tracking-wider text-gray-600 block sm:hidden font-mono mb-0.5">Your Build</span>
                          <div className={`${comparison.userClass} break-words`}>
                            {userSpecs[key]}
                          </div>
                        </div>

                        {/* Benchmark Competitor Match Column Frame */}
                        <div className="bg-gray-900/40 sm:bg-transparent p-2 sm:p-0 rounded-lg border border-white/5 sm:border-0">
                          <span className="text-[9px] uppercase tracking-wider text-gray-600 block sm:hidden font-mono mb-0.5">Competitor</span>
                          <div className={`${comparison.compClass} break-words`}>
                            {typeof compFormatted === "string" ? compFormatted : formatListValue(compFormatted)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketCompetitorCard;
