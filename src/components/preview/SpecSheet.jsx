// SpecSheet.jsx

const SpecSheet = ({ config }) => {
  const selected = [
    config.processor,
    config.ram,
    config.storage,
    config.display?.isValid,
    config.battery?.isValid,
    config.camera?.isValid,
    config.connectivity?.isValid,
    config.audio?.isValid,
    config.thermal,
    config.phoneBuild,
    config.haptics,
    config.sensors?.length > 0,
    config.components?.length > 0,
  ];

  const completed = selected.filter(Boolean).length;
  const percentage = (completed / 13) * 100;

  const specs = [
  {
    label: "Processor",
    value: config.processor?.name,
  },
  {
    label: "RAM",
    value: config.ram
      ? `${config.ram.size}GB ${config.ram.type}`
      : null,
  },
  {
    label: "Storage",
    value: config.storage
      ? `${config.storage.capacity}GB`
      : null,
  },
  {
    label: "Battery",
    value: config.battery?.capacity
      ? `${config.battery.capacity} mAh`
      : null,
  },
  {
    label: "Camera",
    value: config.camera?.count
      ? `${config.camera.count} Cameras`
      : null,
  },
  {
    label: "Display",
    value: config.display?.panelType,
  },

  // NEW ↓↓↓

  {
    label: "Network",
    value: config.connectivity?.network?.type || null,
  },

  {
    label: "Audio",
    value: config.audio?.speakers || null,
  },

  {
  label: "Thermal",
  value: config.thermal?.name || null,
},

  {
  label: "Build",
  value:
    config.phoneBuild?.material ||
    config.phoneBuild?.name ||
    config.phoneBuild?.type ||
    null,
},

  {
  label: "Haptics",
  value: config.haptics?.name || null,
},

  {
    label: "Sensors",
    value:
      config.sensors?.length > 0
        ? `${config.sensors.length} Sensors`
        : null,
  },

  {
    label: "Extras",
    value:
      config.components?.length > 0
        ? `${config.components.length} Modules`
        : null,
  },
];

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <h3 className="text-white font-semibold">
          Assembly Status
        </h3>

        <span className="text-xs text-indigo-400 font-medium">
          {completed}/13
        </span>

      </div>

      {/* PROGRESS BAR */}

      <div className="w-full bg-gray-900 h-3 rounded-full mb-2 overflow-hidden">

        <div
          style={{ width: `${percentage}%` }}
          className="bg-gradient-to-r
                     from-indigo-600
                     to-cyan-400
                     h-3 rounded-full
                     transition-all duration-700"
        />

      </div>

      <p className="text-[11px] text-gray-500 mb-5 tracking-wide">
        COMPONENT ASSEMBLY PROGRESS → {Math.round(percentage)}%
      </p>

      {/* SPEC GRID */}

      <div className="grid grid-cols-2 gap-3">

        {specs.map((spec, index) => (
          <div
            key={index}
            className={`
              p-3 rounded-xl border transition-all duration-300
              ${
                spec.value
                  ? "bg-black border-indigo-500/20"
                  : "bg-black border-gray-800"
              }
            `}
          >

            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              {spec.label}
            </p>

            <p
              className={`
                text-xs font-medium truncate
                ${
                  spec.value
                    ? "text-white"
                    : "text-gray-600"
                }
              `}
            >
              {spec.value || "Pending"}
            </p>

          </div>
        ))}

      </div>

      {/* SYSTEM STATUS */}

      <div className="mt-5 p-3 rounded-xl bg-black border border-gray-800">

        <div className="flex justify-between items-center">

          <span className="text-xs text-gray-500">
            System State
          </span>

          <span
            className={`
              text-xs font-medium
              ${
                completed === 13
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            `}
          >
            {completed === 13
              ? "Assembly Complete"
              : "Building..."}
          </span>

        </div>

      </div>

    </div>
  );
};

export default SpecSheet;