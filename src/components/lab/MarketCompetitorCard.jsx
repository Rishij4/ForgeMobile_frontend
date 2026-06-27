// MarketCompetitorCard.jsx
import React from "react";

const MarketCompetitorCard = ({
  phones,
  userConfig,
  isModalView = false,
}) => {

  // ===============================
  // FORMATTER
  // ===============================

  const formatListValue = (value) => {
    if (!value) return "Not Available";

    if (Array.isArray(value)) {
      if (value.length === 0) return "None";

      return value
        .map((item) =>
          typeof item === "object"
            ? item.name
            : item
        )
        .join(", ");
    }

    return String(value);
  };


  // ===============================
  // USER BUILD SPECS
  // ===============================

  const cameraText =
    userConfig.camera?.isValid
      ? userConfig.camera.slots
          .map(
            (s) =>
              `${s.mp}MP ${s.type}${
                s.ois ? " (OIS)" : ""
              }`
          )
          .join(" + ")
      : "Not Selected";

  const userSpecs = {
    processor:
      userConfig.processor?.name ||
      "Not Selected",

    ram:
      userConfig.ram?.size &&
      userConfig.ram?.type
        ? `${userConfig.ram.size}GB ${userConfig.ram.type}`
        : "Not Selected",

    storage:
      userConfig.storage?.capacity &&
      userConfig.storage?.type
        ? `${
            userConfig.storage.capacity === 1024
              ? "1TB"
              : userConfig.storage.capacity ===
                2048
              ? "2TB"
              : `${userConfig.storage.capacity}GB`
          } ${userConfig.storage.type}`
        : "Not Selected",

    display:
      userConfig.display?.isValid
        ? `${userConfig.display.panelType} | ${userConfig.display.refreshRate}Hz | ${userConfig.display.resolution} | ${userConfig.display.size}"`
        : "Not Selected",

    battery:
      userConfig.battery?.isValid
        ? `${userConfig.battery.capacity}mAh | ${userConfig.battery.chargingSpeed}W | ${userConfig.battery.type}`
        : "Not Selected",

    camera: cameraText,

    connectivity:
      userConfig.connectivity?.network
        ?.type &&
      userConfig.connectivity?.wifi
        ?.type &&
      userConfig.connectivity
        ?.bluetooth?.type
        ? `${userConfig.connectivity.network.type} | ${userConfig.connectivity.wifi.type} | ${userConfig.connectivity.bluetooth.type}`
        : "Not Selected",

    audio: userConfig.audio
      ? [
          userConfig.audio.speakers ||
            null,
          userConfig.audio
            .dolbyAtmos || null,
          userConfig.audio
            .hiResAudio || null,
        ]
          .filter(Boolean)
          .join(" | ")
      : "Not Selected",

    thermal:
      userConfig.thermal?.name ||
      "Not Selected",

    phoneBuild:
      userConfig.phoneBuild
        ?.material || "Not Selected",

    haptics:
      userConfig.haptics?.name ||
      "Not Selected",

    sensors:
  userConfig.sensors?.length > 0
    ? userConfig.sensors.map(
        (s) => s.name
      )
    : [],

    components:
  userConfig.components?.length > 0
    ? userConfig.components.map(
        (c) => c.name
      )
    : [],
  };


  // ===============================
  // HELPERS
  // ===============================

  const getNumber = (val) => {
    if (!val) return 0;

    const match =
      val
        .toString()
        .match(/\d+(\.\d+)?/);

    return match
      ? parseFloat(match[0])
      : 0;
  };

  const compareFinal = (
    userWins,
    compWins
  ) => {
    if (
      userWins > 0 &&
      compWins === 0
    ) {
      return {
        userClass:
          "text-emerald-400 font-semibold",
        compClass: "text-white",
      };
    }

    if (
      compWins > 0 &&
      userWins === 0
    ) {
      return {
        userClass: "text-white",
        compClass:
          "text-emerald-400 font-semibold",
      };
    }

    if (
      userWins > 0 &&
      compWins > 0
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


  // ===============================
  // PROCESSOR
  // ===============================

  const compareProcessor = (
    user = "",
  comp = ""
  ) => {
    let userWins = 0;
    let compWins = 0;

    const chipMap = {
  "snapdragon 8 elite": 100,
  "snapdragon 8 gen 4": 98,
  "snapdragon 8 gen 3": 96,

  "apple a18 pro": 97,
  "apple a17 pro": 94,

  "dimensity 9400": 95,
  "dimensity 9300": 93,

  "tensor g5": 90,
  "tensor g4": 87,

  "exynos 2500": 92,
  "exynos 2400": 89,
};

    const findChip = (txt) => {
      const lower =
        txt.toLowerCase();

      for (const key in chipMap) {
        if (
          lower.includes(key)
        ) {
          return chipMap[key];
        }
      }

      return 50;
    };

    const userScore =
      findChip(user);

    const compScore =
      findChip(comp);

    if (
      userScore > compScore
    )
      userWins++;

    if (
      compScore > userScore
    )
      compWins++;

    const userNM =
      user.match(
        /(\d+)nm/i
      );

    const compNM =
      comp.match(
        /(\d+)nm/i
      );

    if (
      userNM &&
      compNM
    ) {
      const u =
        parseInt(
          userNM[1]
        );

      const c =
        parseInt(
          compNM[1]
        );

      if (u < c)
        userWins++;

      if (c < u)
        compWins++;
    }

    return compareFinal(
      userWins,
      compWins
    );
  };


  // ===============================
  // RAM
  // ===============================

  const compareRAM = (
    user = "",
  comp = ""
  ) => {
    let userWins = 0;
    let compWins = 0;

    const ramMap = {
      lpddr3: 1,
      lpddr4: 2,
      lpddr4x: 3,
      lpddr5: 4,
      lpddr5x: 5,
    };

    const userSize =
      getNumber(user);

    const compSize =
      getNumber(comp);

    if (
      userSize > compSize
    )
      userWins++;

    if (
      compSize > userSize
    )
      compWins++;

    const userType =
      Object.keys(
        ramMap
      ).find((k) =>
        user
          .toLowerCase()
          .includes(k)
      ) || "";

    const compType =
      Object.keys(
        ramMap
      ).find((k) =>
        comp
          .toLowerCase()
          .includes(k)
      ) || "";

    if (
      ramMap[
        userType
      ] >
      ramMap[
        compType
      ]
    )
      userWins++;

    if (
      ramMap[
        compType
      ] >
      ramMap[
        userType
      ]
    )
      compWins++;

    return compareFinal(
      userWins,
      compWins
    );
  };


  // ===============================
  // STORAGE
  // ===============================

  const compareStorage = (
    user = "",
  comp = ""
  ) => {
    let userWins = 0;
    let compWins = 0;

    const storageMap = {
      emmc: 1,
      "ufs 2.2": 2,
      "ufs 3.1": 3,
      "ufs 4.0": 4,
      nvme: 5,
    };

    const userCap =
      getNumber(user);

    const compCap =
      getNumber(comp);

    if (
      userCap > compCap
    )
      userWins++;

    if (
      compCap > userCap
    )
      compWins++;

    const userType =
      Object.keys(
        storageMap
      ).find((k) =>
        user
          .toLowerCase()
          .includes(k)
      ) || "";

    const compType =
      Object.keys(
        storageMap
      ).find((k) =>
        comp
          .toLowerCase()
          .includes(k)
      ) || "";

    if (
      storageMap[
        userType
      ] >
      storageMap[
        compType
      ]
    )
      userWins++;

    if (
      storageMap[
        compType
      ] >
      storageMap[
        userType
      ]
    )
      compWins++;

    return compareFinal(
      userWins,
      compWins
    );
  };


  // ===============================
  // DISPLAY
  // ===============================

  const compareDisplay = (
    user = "",
  comp = ""
  ) => {
    let userWins = 0;
    let compWins = 0;

    const panelMap = {
      lcd: 1,
      oled: 2,
      amoled: 3,
      "ltpo amoled": 4,
      "super retina xdr": 5,
    };

    const resolutionMap = {
      hd: 1,
      "fhd+": 2,
      "1.5k": 3,
      "qhd+": 4,
      "4k": 5,
    };

    const userHz =
      user.match(
        /(\d+)hz/i
      );

    const compHz =
      comp.match(
        /(\d+)hz/i
      );

    if (
      userHz &&
      compHz
    ) {
      if (
        +userHz[1] >
        +compHz[1]
      )
        userWins++;

      if (
        +compHz[1] >
        +userHz[1]
      )
        compWins++;
    }

    const userPanel =
      Object.keys(
        panelMap
      ).find((k) =>
        user
          .toLowerCase()
          .includes(k)
      ) || "";

    const compPanel =
      Object.keys(
        panelMap
      ).find((k) =>
        comp
          .toLowerCase()
          .includes(k)
      ) || "";

    if (
      panelMap[
        userPanel
      ] >
      panelMap[
        compPanel
      ]
    )
      userWins++;

    if (
      panelMap[
        compPanel
      ] >
      panelMap[
        userPanel
      ]
    )
      compWins++;

    const userRes =
      Object.keys(
        resolutionMap
      ).find((k) =>
        user
          .toLowerCase()
          .includes(k)
      ) || "";

    const compRes =
      Object.keys(
        resolutionMap
      ).find((k) =>
        comp
          .toLowerCase()
          .includes(k)
      ) || "";

    if (
      resolutionMap[
        userRes
      ] >
      resolutionMap[
        compRes
      ]
    )
      userWins++;

    if (
      resolutionMap[
        compRes
      ] >
      resolutionMap[
        userRes
      ]
    )
      compWins++;

    return compareFinal(
      userWins,
      compWins
    );
  };


  // ===============================
  // BATTERY
  // ===============================

  const compareBattery = (
    user = "",
  comp = ""
  ) => {
    let userWins = 0;
    let compWins = 0;

    const batteryMap = {
      "li-ion": 1,
      "li-po": 2,
      "silicon carbon": 3,
    };

    const userCapacity =
      getNumber(user);

    const compCapacity =
      getNumber(comp);

    if (
      userCapacity >
      compCapacity
    )
      userWins++;

    if (
      compCapacity >
      userCapacity
    )
      compWins++;

    const wattRegex =
      /(\d+)w/i;

    const userW =
      user.match(
        wattRegex
      );

    const compW =
      comp.match(
        wattRegex
      );

    if (
      userW &&
      compW
    ) {
      if (
        +userW[1] >
        +compW[1]
      )
        userWins++;

      if (
        +compW[1] >
        +userW[1]
      )
        compWins++;
    }

    const userType =
      Object.keys(
        batteryMap
      ).find((k) =>
        user
          .toLowerCase()
          .includes(k)
      ) || "";

    const compType =
      Object.keys(
        batteryMap
      ).find((k) =>
        comp
          .toLowerCase()
          .includes(k)
      ) || "";

    if (
      batteryMap[
        userType
      ] >
      batteryMap[
        compType
      ]
    )
      userWins++;

    if (
      batteryMap[
        compType
      ] >
      batteryMap[
        userType
      ]
    )
      compWins++;

    return compareFinal(
      userWins,
      compWins
    );
  };


  // ===============================
  // CAMERA
  // ===============================

  const compareCamera = (
  user = "",
  comp = ""
) => {
    let userWins = 0;
    let compWins = 0;

    const userMPs = [
      ...user.matchAll(
        /(\d+)mp/gi
      ),
    ];

    const compMPs = [
      ...comp.matchAll(
        /(\d+)mp/gi
      ),
    ];

    const userMax =
      Math.max(
        ...userMPs.map(
          (m) =>
            +m[1]
        ),
        0
      );

    const compMax =
      Math.max(
        ...compMPs.map(
          (m) =>
            +m[1]
        ),
        0
      );

    if (
      userMax > compMax
    )
      userWins++;

    if (
      compMax > userMax
    )
      compWins++;

    if (
      userMPs.length >
      compMPs.length
    )
      userWins++;

    if (
      compMPs.length >
      userMPs.length
    )
      compWins++;

    const userOIS =
      (
        user.match(
          /ois/gi
        ) || []
      ).length;

    const compOIS =
      (
        comp.match(
          /ois/gi
        ) || []
      ).length;

    if (
      userOIS > compOIS
    )
      userWins++;

    if (
      compOIS > userOIS
    )
      compWins++;

    return compareFinal(
      userWins,
      compWins
    );
  };
    // ===============================
  // CONNECTIVITY
  // ===============================

  const compareConnectivity = (
    user = "",
  comp = ""
  ) => {
    let userWins = 0;
    let compWins = 0;

    const wifiScore = (txt) => {
      txt = txt.toLowerCase();

      if (txt.includes("wifi 7"))
        return 4;

      if (txt.includes("wifi 6e"))
        return 3;

      if (txt.includes("wifi 6"))
        return 2;

      if (txt.includes("wifi 5"))
        return 1;

      return 0;
    };

    const networkScore = (txt) => {
      txt = txt.toLowerCase();

      if (txt.includes("6g"))
        return 3;

      if (txt.includes("5g"))
        return 2;

      if (txt.includes("4g"))
        return 1;

      return 0;
    };

    const bluetoothScore = (
      txt
    ) => {
      const match =
        txt.match(
          /bluetooth\s*([0-9.]+)/i
        );

      return match
        ? parseFloat(
            match[1]
          )
        : 0;
    };

    const userNet =
      networkScore(user);

    const compNet =
      networkScore(comp);

    if (
      userNet >
      compNet
    )
      userWins++;

    if (
      compNet >
      userNet
    )
      compWins++;

    const userWifi =
      wifiScore(user);

    const compWifi =
      wifiScore(comp);

    if (
      userWifi >
      compWifi
    )
      userWins++;

    if (
      compWifi >
      userWifi
    )
      compWins++;

    const userBT =
      bluetoothScore(
        user
      );

    const compBT =
      bluetoothScore(
        comp
      );

    if (
      userBT >
      compBT
    )
      userWins++;

    if (
      compBT >
      userBT
    )
      compWins++;

    return compareFinal(
      userWins,
      compWins
    );
  };


  // ===============================
  // AUDIO
  // ===============================

  const compareAudio = (
    user = "",
  comp = ""
  ) => {
    const score = (
      txt
    ) => {
      txt =
        txt.toLowerCase();

      let s = 0;

      if (
        txt.includes(
          "stereo"
        )
      )
        s++;

      if (
        txt.includes(
          "dolby"
        )
      )
        s++;

      if (
        txt.includes(
          "spatial"
        )
      )
        s++;

      if (
        txt.includes(
          "hi-res"
        )
      )
        s++;

      if (
        txt.includes(
          "headphone"
        )
      )
        s++;

      return s;
    };

    const userScore =
      score(user);

    const compScore =
      score(comp);

    return compareFinal(
      userScore >
        compScore
        ? 1
        : 0,

      compScore >
        userScore
        ? 1
        : 0
    );
  };


  // ===============================
  // THERMAL
  // ===============================

  const compareThermal = (
    user = "",
  comp = ""
  ) => {
    const score = (
      txt
    ) => {
      txt =
        txt.toLowerCase();

      if (
        txt.includes(
          "liquid"
        )
      )
        return 4;

      if (
        txt.includes(
          "vapor chamber"
        )
      )
        return 3;

      if (
        txt.includes(
          "copper"
        )
      )
        return 2;

      if (
        txt.includes(
          "graphite"
        )
      )
        return 1;

      return 0;
    };

    const userScore =
      score(user);

    const compScore =
      score(comp);

    return compareFinal(
      userScore >
        compScore
        ? 1
        : 0,

      compScore >
        userScore
        ? 1
        : 0
    );
  };


  // ===============================
  // BUILD MATERIAL
  // ===============================

  const compareBuild = (
    user = "",
  comp = ""
  ) => {
    const score = (
      txt
    ) => {
      txt =
        txt.toLowerCase();

      if (
        txt.includes(
          "ceramic"
        )
      )
        return 5;

      if (
        txt.includes(
          "titanium"
        )
      )
        return 4;

      if (
        txt.includes(
          "aluminum"
        )
      )
        return 3;

      if (
        txt.includes(
          "glass"
        )
      )
        return 2;

      if (
        txt.includes(
          "plastic"
        )
      )
        return 1;

      return 0;
    };

    const userScore =
      score(user);

    const compScore =
      score(comp);

    return compareFinal(
      userScore >
        compScore
        ? 1
        : 0,

      compScore >
        userScore
        ? 1
        : 0
    );
  };


  // ===============================
  // HAPTICS
  // ===============================

  const compareHaptics = (
    user = "",
  comp = ""
  ) => {
    const score = (
      txt
    ) => {
      txt =
        txt.toLowerCase();

      if (
        txt.includes(
          "taptic"
        )
      )
        return 5;

      if (
        txt.includes(
          "x-axis"
        )
      )
        return 4;

      if (
        txt.includes(
          "linear"
        )
      )
        return 3;

      if (
        txt.includes(
          "z-axis"
        )
      )
        return 2;

      return 1;
    };

    const userScore =
      score(user);

    const compScore =
      score(comp);

    return compareFinal(
      userScore >
        compScore
        ? 1
        : 0,

      compScore >
        userScore
        ? 1
        : 0
    );
  };


  // ===============================
  // SENSORS
  // ===============================

  const compareSensors = (
    user = "",
  comp = ""
  ) => {
    const userCount =
      Array.isArray(
        user
      )
        ? user.length
        : user
            .toString()
            .split(",")
            .length;

    const compCount =
      Array.isArray(
        comp
      )
        ? comp.length
        : comp
            .toString()
            .split(",")
            .length;

    return compareFinal(
      userCount >
        compCount
        ? 1
        : 0,

      compCount >
        userCount
        ? 1
        : 0
    );
  };


  // ===============================
  // COMPONENTS / EXTRAS
  // ===============================

  const compareComponents = (
    user = "",
  comp = ""
  ) => {
    const userCount =
      Array.isArray(
        user
      )
        ? user.length
        : user
            .toString()
            .split(",")
            .length;

    const compCount =
      Array.isArray(
        comp
      )
        ? comp.length
        : comp
            .toString()
            .split(",")
            .length;

    return compareFinal(
      userCount >
        compCount
        ? 1
        : 0,

      compCount >
        userCount
        ? 1
        : 0
    );
  };


  // ===============================
  // MASTER ROUTER
  // ===============================

  const compareValues = (
    key,
    userValue,
    competitorValue
  ) => {
    switch (key) {
      case "processor":
        return compareProcessor(
          userValue,
          competitorValue
        );

      case "ram":
        return compareRAM(
          userValue,
          competitorValue
        );

      case "storage":
        return compareStorage(
          userValue,
          competitorValue
        );

      case "display":
        return compareDisplay(
          userValue,
          competitorValue
        );

      case "battery":
        return compareBattery(
          userValue,
          competitorValue
        );

      case "camera":
        return compareCamera(
          userValue,
          competitorValue
        );

      case "connectivity":
        return compareConnectivity(
          userValue,
          competitorValue
        );

      case "audio":
        return compareAudio(
          userValue,
          competitorValue
        );

      case "thermal":
        return compareThermal(
          userValue,
          competitorValue
        );

      case "phoneBuild":
        return compareBuild(
          userValue,
          competitorValue
        );

      case "haptics":
        return compareHaptics(
          userValue,
          competitorValue
        );

      case "sensors":
        return compareSensors(
          userValue,
          competitorValue
        );

      case "components":
        return compareComponents(
          userValue,
          competitorValue
        );

      default:
        return {
          userClass:
            "text-white",
          compClass:
            "text-white",
        };
    }
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

      {phones &&
 phones.length > 0 ? (

  phones.map((phone, index) => (
        <div
          key={index}
          className="mb-8 border border-gray-700 rounded-xl p-5"
        >
          <h3 className="text-lg font-bold text-yellow-400 mb-4">
            {phone.brand} {phone.model} — ₹
            {phone.price}
          </h3>

          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 font-semibold border-b border-gray-700 pb-2">
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
                className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 py-2 border-b border-gray-800 text-sm"
              >
                <div className="text-gray-400">
                  {label}
                </div>

                <div
                  className={
                    comparison.userClass
                  }
                >
                  {Array.isArray(
  userSpecs[key]
)
  ? formatListValue(
      userSpecs[key]
    )
  : userSpecs[key]}
                </div>

                <div className={`${comparison.compClass} break-words`}>
                  {Array.isArray(
  phone[key]
)
  ? formatListValue(
      phone[key]
    )
  : phone[key] ||
    "Not Available"}
                </div>
              </div>
            );
          })}
        </div>
            ))

) : (

  <div className="text-gray-400 text-sm">
    No competitor phones found
  </div>

)}
    </div>
  );
};

export default MarketCompetitorCard;
