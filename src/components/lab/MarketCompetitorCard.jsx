// MarketCompetitorCard.jsx
import React from "react";

const MarketCompetitorCard = ({ phones, userConfig, isModalView = false }) => {

  const formatListValue = (value) => {
    if (!value) return "Not Available";
    if (Array.isArray(value)) {
      return value.length === 0 ? "None" : value.map((item) => typeof item === "object" ? item.name : item).join(", ");
    }
    return String(value);
  };

  const getNumber = (val) => {
    if (!val) return 0;
    const match = val.toString().match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const compareFinal = (userWins, compWins) => {
    if (userWins > 0 && compWins === 0) return { userClass: "text-emerald-400 font-semibold", compClass: "text-white" };
    if (compWins > 0 && userWins === 0) return { userClass: "text-white", compClass: "text-emerald-400 font-semibold" };
    if (userWins > 0 && compWins > 0) return { userClass: "text-emerald-400 font-semibold", compClass: "text-emerald-400 font-semibold" };
    return { userClass: "text-white", compClass: "text-white" };
  };

  // Specs Parsing
  const cameraText = userConfig.camera?.isValid
    ? userConfig.camera.slots.map((s) => `${s.mp}MP ${s.type}${s.ois ? " (OIS)" : ""}`).join(" + ")
    : "Not Selected";

  const userSpecs = {
    processor: userConfig.processor?.name || "Not Selected",
    ram: userConfig.ram?.size && userConfig.ram?.type ? `${userConfig.ram.size}GB ${userConfig.ram.type}` : "Not Selected",
    storage: userConfig.storage?.capacity && userConfig.storage?.type 
      ? `${userConfig.storage.capacity === 1024 ? "1TB" : userConfig.storage.capacity === 2048 ? "2TB" : `${userConfig.storage.capacity}GB`} ${userConfig.storage.type}` 
      : "Not Selected",
    display: userConfig.display?.isValid ? `${userConfig.display.panelType} | ${userConfig.display.refreshRate}Hz | ${userConfig.display.resolution} | ${userConfig.display.size}"` : "Not Selected",
    battery: userConfig.battery?.isValid ? `${userConfig.battery.capacity}mAh | ${userConfig.battery.chargingSpeed}W | ${userConfig.battery.type}` : "Not Selected",
    camera: cameraText,
    connectivity: userConfig.connectivity?.network?.type && userConfig.connectivity?.wifi?.type && userConfig.connectivity?.bluetooth?.type
      ? `${userConfig.connectivity.network.type} | ${userConfig.connectivity.wifi.type} | ${userConfig.connectivity.bluetooth.type}`
      : "Not Selected",
    audio: userConfig.audio ? [userConfig.audio.speakers || null, userConfig.audio.dolbyAtmos || null, userConfig.audio.hiResAudio || null].filter(Boolean).join(" | ") : "Not Selected",
    thermal: userConfig.thermal?.name || "Not Selected",
    phoneBuild: userConfig.phoneBuild?.material || "Not Selected",
    haptics: userConfig.haptics?.name || "Not Selected",
    sensors: userConfig.sensors?.length > 0 ? userConfig.sensors.map((s) => s.name) : [],
    components: userConfig.components?.length > 0 ? userConfig.components.map((c) => c.name) : [],
  };

  // Sub-Comparators
  const compareProcessor = (user = "", comp = "") => {
    let [userWins, compWins] = [0, 0];
    const chipMap = {
      "snapdragon 8 elite": 100, "snapdragon 8 gen 4": 98, "snapdragon 8 gen 3": 96,
      "apple a18 pro": 97, "apple a17 pro": 94, "dimensity 9400": 95, "dimensity 9300": 93,
      "tensor g5": 90, "tensor g4": 87, "exynos 2500": 92, "exynos 2400": 89
    };
    
    const findChip = (txt) => {
      const lower = txt.toLowerCase();
      for (const key in chipMap) { if (lower.includes(key)) return chipMap[key]; }
      return 50;
    };

    if (findChip(user) > findChip(comp)) userWins++;
    if (findChip(comp) > findChip(user)) compWins++;

    const [userNM, compNM] = [user.match(/(\d+)nm/i), comp.match(/(\d+)nm/i)];
    if (userNM && compNM) {
      if (parseInt(userNM[1]) < parseInt(compNM[1])) userWins++;
      if (parseInt(compNM[1]) < parseInt(userNM[1])) compWins++;
    }
    return compareFinal(userWins, compWins);
  };

  const compareRAM = (user = "", comp = "") => {
    let [userWins, compWins] = [0, 0];
    const ramMap = { lpddr3: 1, lpddr4: 2, lpddr4x: 3, lpddr5: 4, lpddr5x: 5 };
    
    if (getNumber(user) > getNumber(comp)) userWins++;
    if (getNumber(comp) > getNumber(user)) compWins++;

    const userType = Object.keys(ramMap).find((k) => user.toLowerCase().includes(k)) || "";
    const compType = Object.keys(ramMap).find((k) => comp.toLowerCase().includes(k)) || "";
    
    if (ramMap[userType] > ramMap[compType]) userWins++;
    if (ramMap[compType] > ramMap[userType]) compWins++;
    return compareFinal(userWins, compWins);
  };

  const compareStorage = (user = "", comp = "") => {
    let [userWins, compWins] = [0, 0];
    const storageMap = { emmc: 1, "ufs 2.2": 2, "ufs 3.1": 3, "ufs 4.0": 4, nvme: 5 };
    
    if (getNumber(user) > getNumber(comp)) userWins++;
    if (getNumber(comp) > getNumber(user)) compWins++;

    const userType = Object.keys(storageMap).find((k) => user.toLowerCase().includes(k)) || "";
    const compType = Object.keys(storageMap).find((k) => comp.toLowerCase().includes(k)) || "";
    
    if (storageMap[userType] > storageMap[compType]) userWins++;
    if (storageMap[compType] > storageMap[userType]) compWins++;
    return compareFinal(userWins, compWins);
  };

  const compareDisplay = (user = "", comp = "") => {
    let [userWins, compWins] = [0, 0];
    const panelMap = { lcd: 1, oled: 2, amoled: 3, "ltpo amoled": 4, "super retina xdr": 5 };
    const resolutionMap = { hd: 1, "fhd+": 2, "1.5k": 3, "qhd+": 4, "4k": 5 };

    const [userHz, compHz] = [user.match(/(\d+)hz/i), comp.match(/(\d+)hz/i)];
    if (userHz && compHz) {
      if (+userHz[1] > +compHz[1]) userWins++;
      if (+compHz[1] > +userHz[1]) compWins++;
    }

    const userPanel = Object.keys(panelMap).find((k) => user.toLowerCase().includes(k)) || "";
    const compPanel = Object.keys(panelMap).find((k) => comp.toLowerCase().includes(k)) || "";
    if (panelMap[userPanel] > panelMap[compPanel]) userWins++;
    if (panelMap[compPanel] > panelMap[userPanel]) compWins++;

    const userRes = Object.keys(resolutionMap).find((k) => user.toLowerCase().includes(k)) || "";
    const compRes = Object.keys(resolutionMap).find((k) => comp.toLowerCase().includes(k)) || "";
    if (resolutionMap[userRes] > resolutionMap[compRes]) userWins++;
    if (resolutionMap[compRes] > resolutionMap[userRes]) compWins++;
    return compareFinal(userWins, compWins);
  };

  const compareBattery = (user = "", comp = "") => {
    let [userWins, compWins] = [0, 0];
    const batteryMap = { "li-ion": 1, "li-po": 2, "silicon carbon": 3 };

    if (getNumber(user) > getNumber(comp)) userWins++;
    if (getNumber(comp) > getNumber(user)) compWins++;

    const [userW, compW] = [user.match(/(\d+)w/i), comp.match(/(\d+)w/i)];
    if (userW && compW) {
      if (+userW[1] > +compW[1]) userWins++;
      if (+compW[1] > +userW[1]) compWins++;
    }

    const userType = Object.keys(batteryMap).find((k) => user.toLowerCase().includes(k)) || "";
    const compType = Object.keys(batteryMap).find((k) => comp.toLowerCase().includes(k)) || "";
    if (batteryMap[userType] > batteryMap[compType]) userWins++;
    if (batteryMap[compType] > batteryMap[userType]) compWins++;
    return compareFinal(userWins, compWins);
  };

  const compareCamera = (user = "", comp = "") => {
    let [userWins, compWins] = [[...user.matchAll(/(\d+)mp/gi)], [...comp.matchAll(/(\d+)mp/gi)], 0, 0];
    const userMax = Math.max(...userWins.map((m) => +m[1]), 0);
    const compMax = Math.max(...compWins.map((m) => +m[1]), 0);

    let [uW, cW] = [0, 0];
    if (userMax > compMax) uW++;
    if (compMax > userMax) cW++;
    if (userWins.length > compWins.length) uW++;
    if (compWins.length > userWins.length) cW++;

    if ((user.match(/ois/gi) || []).length > (comp.match(/ois/gi) || []).length) uW++;
    if ((comp.match(/ois/gi) || []).length > (user.match(/ois/gi) || []).length) cW++;
    return compareFinal(uW, cW);
  };

  const compareConnectivity = (user = "", comp = "") => {
    let [userWins, compWins] = [0, 0];
    const wifiScore = (t) => t.toLowerCase().includes("wifi 7") ? 4 : t.toLowerCase().includes("wifi 6e") ? 3 : t.toLowerCase().includes("wifi 6") ? 2 : t.toLowerCase().includes("wifi 5") ? 1 : 0;
    const networkScore = (t) => t.toLowerCase().includes("6g") ? 3 : t.toLowerCase().includes("5g") ? 2 : t.toLowerCase().includes("4g") ? 1 : 0;
    const bluetoothScore = (t) => { const m = t.match(/bluetooth\s*([0-9.]+)/i); return m ? parseFloat(m[1]) : 0; };

    if (networkScore(user) > networkScore(comp)) userWins++;
    if (networkScore(comp) > networkScore(user)) compWins++;
    if (wifiScore(user) > wifiScore(comp)) userWins++;
    if (wifiScore(comp) > wifiScore(user)) compWins++;
    if (bluetoothScore(user) > bluetoothScore(comp)) userWins++;
    if (bluetoothScore(comp) > bluetoothScore(user)) compWins++;
    return compareFinal(userWins, compWins);
  };

  const compareScoreBased = (user = "", comp = "", keywords) => {
    const calc = (t) => { let s = 0; keywords.forEach((k) => { if (t.toLowerCase().includes(k)) s++; }); return s; };
    return compareFinal(calc(user) > calc(comp) ? 1 : 0, calc(comp) > calc(user) ? 1 : 0);
  };

  const compareLengthBased = (user = "", comp = "") => {
    const len = (val) => Array.isArray(val) ? val.length : val.toString().split(",").length;
    return compareFinal(len(user) > len(comp) ? 1 : 0, len(comp) > len(user) ? 1 : 0);
  };

  const compareValues = (key, userValue, competitorValue) => {
    switch (key) {
      case "processor": return compareProcessor(userValue, competitorValue);
      case "ram": return compareRAM(userValue, competitorValue);
      case "storage": return compareStorage(userValue, competitorValue);
      case "display": return compareDisplay(userValue, competitorValue);
      case "battery": return compareBattery(userValue, competitorValue);
      case "camera": return compareCamera(userValue, competitorValue);
      case "connectivity": return compareConnectivity(userValue, competitorValue);
      case "audio": return compareScoreBased(userValue, competitorValue, ["stereo", "dolby", "spatial", "hi-res", "headphone"]);
      case "thermal": return compareScoreBased(userValue, competitorValue, ["liquid", "vapor chamber", "copper", "graphite"]);
      case "phoneBuild": return compareScoreBased(userValue, competitorValue, ["ceramic", "titanium", "aluminum", "glass", "plastic"]);
      case "haptics": return compareScoreBased(userValue, competitorValue, ["taptic", "x-axis", "linear", "z-axis"]);
      case "sensors":
      case "components": return compareLengthBased(userValue, competitorValue);
      default: return { userClass: "text-white", compClass: "text-white" };
    }
  };

  const rows = [
    ["Processor", "processor"], ["RAM", "ram"], ["Storage", "storage"], ["Display", "display"],
    ["Battery", "battery"], ["Camera", "camera"], ["Connectivity", "connectivity"], ["Audio", "audio"],
    ["Thermal", "thermal"], ["Build", "phoneBuild"], ["Haptics", "haptics"], ["Sensors", "sensors"], ["Extras", "components"]
  ];

  return (
    <div className="mt-6 bg-[#111827] border border-indigo-500/20 rounded-2xl p-4 sm:p-6 text-white w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-6">Competitor Comparison</h2>
      {phones && phones.length > 0 ? (
        phones.map((phone, idx) => (
          <div key={idx} className="mb-6 border border-gray-700 rounded-xl p-4 sm:p-5 bg-black/10">
            <h3 className="text-base sm:text-lg font-bold text-yellow-400 mb-4">{phone.brand} {phone.model} — ₹{phone.price}</h3>
            
            {/* Table Header: Only visible on Medium screens and up */}
            <div className="hidden md:grid grid-cols-3 gap-4 mb-3 font-semibold border-b border-gray-700 pb-2 text-sm">
              <div className="text-gray-400">Component</div>
              <div className="text-indigo-400">Your Build</div>
              <div className="text-yellow-400">Competitor</div>
            </div>

            {/* Spec Comparison Grid Matrix */}
            <div className="space-y-4 md:space-y-0">
              {rows.map(([label, key]) => {
                const comparison = compareValues(key, userSpecs[key], phone[key]);
                return (
                  <div key={key} className="md:grid md:grid-cols-3 gap-3 md:gap-4 py-3 md:py-2 border-b border-gray-800/60 text-sm flex flex-col">
                    
                    {/* Item label acts as a separator title on mobile devices */}
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-500/80 md:text-sm md:normal-case md:tracking-normal md:text-gray-400 md:font-normal">
                      {label}
                    </div>

                    {/* Content Columns Wrapper Forced Side-By-Side on mobile */}
                    <div className="grid grid-cols-2 gap-4 col-span-2 min-w-0 md:contents">
                      <div className={`${comparison.userClass} break-all md:break-words text-xs sm:text-sm min-w-0`}>
                        <span className="block md:hidden text-[10px] uppercase text-gray-500 font-mono mb-0.5">Your Build</span>
                        {Array.isArray(userSpecs[key]) ? formatListValue(userSpecs[key]) : userSpecs[key]}
                      </div>
                      <div className={`${comparison.compClass} break-all md:break-words text-xs sm:text-sm min-w-0`}>
                        <span className="block md:hidden text-[10px] uppercase text-gray-500 font-mono mb-0.5">Competitor</span>
                        {Array.isArray(phone[key]) ? formatListValue(phone[key]) : phone[key] || "Not Available"}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-400 text-sm">No competitor phones found</div>
      )}
    </div>
  );
};

export default MarketCompetitorCard;
        
