// Glossary.jsx
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const glossaryData = [
  {
    key: "processor",
    title: "Processor (SoC)",
    content:
      "The System on Chip is the brain of the smartphone. It controls CPU performance, GPU rendering, AI processing, modem communication and power efficiency. Examples: Snapdragon, Dimensity, Tensor."
  },
  {
    key: "ram",
    title: "RAM",
    content:
      "RAM stores temporary data for active applications. More RAM improves multitasking. Common types include LPDDR4X, LPDDR5 and LPDDR5X."
  },
  {
    key: "storage",
    title: "Storage",
    content:
      "Storage permanently stores applications, photos and files. Faster storage improves app opening speed. Types include UFS 2.2, UFS 3.1 and UFS 4.1."
  },
  {
    key: "battery",
    title: "Battery",
    content:
      "Battery powers the device. Capacity is measured in mAh. Battery chemistry and charging wattage determine charging speed and battery longevity."
  },
  {
    key: "display",
    title: "Display",
    content:
      "Display technology controls visual quality. AMOLED and LTPO AMOLED provide better colors and power efficiency. Refresh rate affects smoothness."
  },
  {
    key: "camera",
    title: "Camera System",
    content:
      "Camera hardware includes main sensor, ultra wide lens, telephoto lens and image processing system. Sensor size affects image quality."
  },
  {
    key: "connectivity",
    title: "Connectivity",
    content:
      "Connectivity modules allow communication with external networks. Includes 5G modem, WiFi 6/7, Bluetooth, NFC and GPS."
  },
  {
    key: "audio",
    title: "Audio System",
    content:
      "Audio hardware controls speaker quality and microphone input. Includes stereo speakers, Dolby Atmos and high resolution audio support."
  },
  {
    key: "haptics",
    title: "Haptics",
    content:
      "Haptics provide physical vibration feedback. Premium phones use X-axis linear motors for more accurate vibration response."
  },
  {
    key: "sensors",
    title: "Sensors",
    content:
      "Sensors detect movement and environment. Includes accelerometer, gyroscope, proximity sensor, compass, ambient light sensor and barometer."
  }
];

// Contextual hardware asset map matching the design system
const componentImages = {
  processor: "/soc-chip.png", // Silicon die / microchip
  ram: "/ram-chip.png",       // Mobile circuitry memory structure
  storage: "/rom-chip.png",   // Flash storage chip component
  battery: "/battery.png",   // Lithium polymer internal layout
  display: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",   // High refresh AMOLED mobile panel
  camera: "/camera.png",    // Camera multi-lens module matrix
  connectivity: "/connectivity.png",// Wireless transceiver elements
  audio: "/audio.png",     // Micro acoustic speaker chamber
  haptics: "/haptics.png",   // Precision tactile chassis structure
  sensors: "/sensors.png",   // Micro-electromechanical array units
};

const Glossary = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-indigo-500/30">
      <Navbar />

      <section className="py-16 sm:py-20 px-4 sm:px-10 max-w-6xl mx-auto">
        
        {/* PAGE HEADER */}
        <div className="mb-12 sm:mb-16 relative">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-white">
            GLOSSARY
          </h1>
          <p className="text-gray-400 text-base sm:text-xl font-medium">
            Explore and understand every smartphone component before creating your perfect device.
          </p>
        </div>

        {/* ACCORDION CONTAINER GRID */}
        <div className="space-y-4">
          {glossaryData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-black/40 backdrop-blur-md border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                  isOpen 
                    ? "border-indigo-600/50 shadow-indigo-500/5" 
                    : "border-gray-800/80 hover:border-gray-750"
                }`}
              >
                {/* TRIGGER HEADER ROW */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full text-left p-5 sm:p-6 text-base sm:text-xl font-bold flex justify-between items-center transition-colors outline-none ${
                    isOpen ? "bg-black/40 text-indigo-400" : "bg-black/20 text-gray-100 hover:bg-black/40"
                  }`}
                >
                  <span className="tracking-tight">{item.title}</span>

                  {/* Animated Indicator Plus/Minus Symbol Wrapper */}
                  <span className="font-mono text-lg sm:text-2xl text-gray-500 select-none w-6 h-6 flex items-center justify-center shrink-0">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>

                {/* ANIMATED ACCORDION SLIDE BODY CONTAINER */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="p-5 sm:p-6 bg-black/60 border-t border-gray-900 font-medium">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                          
                          {/* DYNAMIC COMPONENT SPECIFICATION TEXT */}
                          <div className="md:col-span-2 text-gray-400 text-sm sm:text-base leading-relaxed sm:leading-8">
                            {item.content}
                          </div>

                          {/* HARDWARE ILLUSTRATION CONTAINER FRAME */}
                          <div className="w-full h-44 sm:h-48 rounded-xl border border-gray-800 bg-black overflow-hidden relative group shadow-inner">
                            <img
                              src={componentImages[item.key]}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 filter brightness-90 contrast-105 select-none"
                            />
                            {/* Inner border mask for technical aesthetic */}
                            <div className="absolute inset-0 border border-black/40 rounded-xl pointer-events-none" />
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
};

export default Glossary;