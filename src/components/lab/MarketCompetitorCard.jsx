import React from "react";

const MarketCompetitorCard = ({ phones, userConfig }) => {
  // Same formatting as BuildSummaryCard
  const cameraText = userConfig.camera?.isValid
    ? userConfig.camera.slots
        .map(
          (s) =>
            `${s.mp}MP ${s.type}${s.ois ? " (OIS)" : ""}`
        )
        .join(" + ")
    : "Not Selected";

  const userSpecs = {
    // Processor
    processor: userConfig.processor?.name || "Not Selected",

    // RAM
    ram:
      userConfig.ram?.size && userConfig.ram?.type
        ? `${userConfig.ram.size}GB ${userConfig.ram.type}`
        : "Not Selected",

    // Storage
    storage:
      userConfig.storage?.capacity &&
      userConfig.storage?.type
        ? `${
            userConfig.storage.capacity === 1024
              ? "1TB"
              : userConfig.storage.capacity === 2048
              ? "2TB"
              : `${userConfig.storage.capacity}GB`
          } ${userConfig.storage.type}`
        : "Not Selected",

    // Display
    display: userConfig.display?.isValid
      ? `${userConfig.display.panelType} | ${userConfig.display.refreshRate}Hz | ${userConfig.display.resolution} | ${userConfig.display.size}"`
      : "Not Selected",

    // Battery
    battery: userConfig.battery?.isValid
      ? `${userConfig.battery.capacity}mAh | ${userConfig.battery.chargingSpeed}W | ${userConfig.battery.type}`
      : "Not Selected",

    // Camera
    camera: cameraText,

    // Connectivity
    connectivity:
      userConfig.connectivity?.network?.type &&
      userConfig.connectivity?.wifi?.type &&
      userConfig.connectivity?.bluetooth?.type
        ? `${userConfig.connectivity.network.type} | ${userConfig.connectivity.wifi.type} | ${userConfig.connectivity.bluetooth.type}`
        : "Not Selected",

    // Audio (show only selected fields)
    audio: userConfig.audio
      ? [
          userConfig.audio.speakers || null,
          userConfig.audio.dolbyAtmos || null,
          userConfig.audio.hiResAudio || null,
        ]
          .filter(Boolean)
          .join(" | ")
      : "Not Selected",

    // Thermal
    thermal:
      userConfig.thermal?.name || "Not Selected",

    // Build
    phoneBuild:
      userConfig.phoneBuild?.material ||
      "Not Selected",

    // Haptics
    haptics:
      userConfig.haptics?.name || "Not Selected",

    // Sensors
    sensors:
      userConfig.sensors?.length > 0
        ? userConfig.sensors
            .map((s) => s.name)
            .join(", ")
        : "Not Selected",

    // Extras
    components:
      userConfig.components?.length > 0
        ? userConfig.components
            .map((c) => c.name)
            .join(", ")
        : "None",
  };

  // Extract numeric values
  const extractNumber = (value) => {
    if (!value) return null;
    const match =
      value.toString().match(/\d+/);
    return match
      ? parseInt(match[0])
      : null;
  };

  // Compare values
  const compareValues = (
    key,
    userValue,
    competitorValue
  ) => {
    // Numeric comparison
    if (
      key === "ram" ||
      key === "storage" ||
      key === "battery"
    ) {
      const userNum =
        extractNumber(userValue);
      const compNum =
        extractNumber(competitorValue);

      if (!userNum || !compNum) {
        return {
          userClass: "text-white",
          compClass: "text-white",
        };
      }

      // Equal
      if (userNum === compNum) {
        return {
          userClass:
            "text-emerald-400 font-semibold",
          compClass:
            "text-emerald-400 font-semibold",
        };
      }

      // User better
      if (userNum > compNum) {
        return {
          userClass:
            "text-emerald-400 font-semibold",
          compClass: "text-white",
        };
      }

      // Competitor better
      return {
        userClass: "text-white",
        compClass:
          "text-emerald-400 font-semibold",
      };
    }

    // Text comparison
    const u =
      userValue?.toString().toLowerCase() ||
      "";
    const c =
      competitorValue
        ?.toString()
        .toLowerCase() || "";

    if (
      u.includes(c) ||
      c.includes(u)
    ) {
      return {
        userClass:
          "text-emerald-400 font-semibold",
        compClass:
          "text-emerald-400 font-semibold",
      };
    }

    return {
      userClass: "text-white",
      compClass: "text-white",
    };
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
    <div className="mt-8 bg-[#111827] border border-indigo-500/20 rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-bold text-indigo-400 mb-6">
        Competitor Comparison
      </h2>

      {phones.map((phone, index) => (
        <div
          key={index}
          className="mb-8 border border-gray-700 rounded-xl p-5"
        >
          <h3 className="text-lg font-bold text-yellow-400 mb-4">
            {phone.brand} {phone.model} — ₹
            {phone.price}
          </h3>

          {/* Header */}
          <div className="grid grid-cols-3 gap-4 mb-3 font-semibold border-b border-gray-700 pb-2">
            <div className="text-gray-400">
              Component
            </div>
            <div className="text-indigo-400">
              Your Build
            </div>
            <div className="text-yellow-400">
              Competitor
            </div>
          </div>

          {/* Rows */}
          {rows.map(([label, key]) => {
            const comparison =
              compareValues(
                key,
                userSpecs[key],
                phone[key]
              );

            return (
              <div
                key={key}
                className="grid grid-cols-3 gap-4 py-2 border-b border-gray-800 text-sm"
              >
                <div className="text-gray-400">
                  {label}
                </div>

                <div
                  className={
                    comparison.userClass
                  }
                >
                  {userSpecs[key]}
                </div>

                <div
                  className={
                    comparison.compClass
                  }
                >
                  {phone[key] ||
                    "Not Available"}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MarketCompetitorCard;