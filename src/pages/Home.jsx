// Home.jsx
import Navbar from "../components/layout/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { user, guestMode, setGuestMode } = useAuth();

  const handleGuestMode = () => {
  setGuestMode(true);
  sessionStorage.setItem("guestMode", "true");
  toast.success("Welcome to Guest Mode");
  navigate("/");
};

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const hoverCard = {
    scale: 1.02, y: -5, borderColor: "rgba(99, 102, 241, 0.4)",
    boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.15)"
  };

  const steps = [
    { num: "01", title: "Select Components", desc: "Choose processor, RAM, storage, display, battery, camera, connectivity and audio components for your custom smartphone." },
    { num: "02", title: "Compatibility Analysis", desc: "Our engine checks hardware compatibility and ensures selected smartphone components work together efficiently." },
    { num: "03", title: "Performance Testing", desc: "Generate performance scores based on processor power, storage speed, multitasking capability and device stability." },
    { num: "04", title: "AI Smart Recommendations", desc: "AI detects weak component combinations, bottlenecks, overheating risks and recommends better hardware upgrades." },
    { num: "05", title: "Save & Compare Builds", desc: "Save multiple smartphone builds, edit configurations, compare performance scores and analyze cost differences." },
    { num: "06", title: "Export Professional Reports", desc: "Export technical PDF reports containing specifications, compatibility analysis, AI suggestions and market price estimation." }
  ];

  const reasons = [
    { title: "AI Compatibility Engine", desc: "Intelligent analysis checks whether selected hardware components can work together efficiently without causing performance imbalance or instability." },
    { title: "Thermal Analysis", desc: "Simulates heat generation based on processor architecture and workload patterns to predict overheating risks during gaming, multitasking and intensive usage." },
    { title: "Battery Intelligence", desc: "Calculates battery efficiency by analyzing processor power consumption, display refresh rate and charging technology for real-world battery performance." },
    { title: "Market Price Prediction", desc: "Estimates realistic smartphone market pricing based on selected hardware configuration and current component pricing trends." },
    { title: "Performance Benchmarking", desc: "Generates performance scores using processor power, RAM speed, storage performance and multitasking capability to simulate actual smartphone performance." },
    { title: "Professional PDF Reports", desc: "Export complete smartphone build reports containing hardware specifications, AI analysis, compatibility scores and technical recommendations." },
    { title: "Custom Hardware Freedom", desc: "Unlike traditional smartphone brands, users are free to build smartphones based entirely on personal priorities such as performance, battery or camera quality." },
    { title: "Build Comparison System", desc: "Compare multiple smartphone builds side-by-side to identify better configurations based on performance scores, price and efficiency." },
    { title: "Future Smartphone Engineering", desc: "ForgeMobile introduces a new approach where smartphones are engineered around user needs instead of fixed manufacturer limitations." }
  ];

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-black via-gray-950 to-black overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-10 py-16 md:py-20 items-center min-h-[calc(100vh-80px)]">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            BUILD THE PHONE<span className="block text-indigo-500 mt-2">BUILT FOR YOU.</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0">
            ForgeMobile allows users to customize every smartphone component from processor to camera, battery, connectivity, sensors and AI powered compatibility analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 mt-10 justify-center md:justify-start">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/lab" className="block text-center bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20">Start Building</Link>
            </motion.div>
            {!user && !guestMode && (
              <motion.button onClick={handleGuestMode} whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }} whileTap={{ scale: 0.95 }} className="border border-gray-700 bg-transparent px-8 py-4 rounded-xl text-gray-300 font-semibold transition">Try as Guest</motion.button>
            )}
          </div>
{!user && !guestMode && (
  <p className="mt-5 text-sm text-gray-400 max-w-lg leading-relaxed">
    Create an account to unlock all ForgeMobile features, or continue in Guest Mode to explore the platform.
  </p>
)}        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full max-w-md mx-auto" />
          <motion.img src="/phone.png" alt="phone" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="rounded-3xl shadow-2xl shadow-indigo-500/20 w-full max-w-[320px] sm:max-w-[450px] object-contain relative z-10" />
        </motion.div>
      </section>

      {/* ABOUT FORGEMOBILE */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-12 text-center tracking-tight">ABOUT FORGEMOBILE</motion.h2>
          
          <div className="grid grid-cols-1 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} whileHover={hoverCard} className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 sm:p-10 transition-all duration-300 shadow-xl">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg sm:text-justify">
                ForgeMobile is an intelligent smartphone customization platform designed to revolutionize the way users purchase smartphones. Traditional smartphone brands force customers to choose from fixed hardware combinations with limited flexibility. ForgeMobile changes this experience by allowing users to design a smartphone completely from the hardware level itself. Users can customize processor architecture, RAM generation, storage technology, display specifications, battery capacity, camera systems, connectivity modules, audio systems and advanced hardware configurations. Instead of simply selecting a pre-built phone, users become the architects of their own device.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["AI POWERED ENGINE", "OUR VISION"].map((title, i) => (
                <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} whileHover={hoverCard} className="bg-gradient-to-br from-gray-900 to-gray-950/70 border border-gray-800 rounded-2xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-4 tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />{title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {i === 0 
                        ? "ForgeMobile uses an intelligent compatibility engine powered by AI to analyze whether selected smartphone components can work together efficiently in real-world conditions. The system evaluates hardware compatibility, processor performance, RAM balancing, storage speed optimization, thermal behavior under load, battery efficiency, power consumption and overall device stability. This prevents unrealistic hardware combinations and helps users build technically optimized smartphones."
                        : "We believe smartphones should adapt to users instead of forcing users to adapt to manufacturer decisions. Every user has different priorities — some need performance, some need battery life, some need better cameras and others need cost-efficient devices. ForgeMobile introduces complete smartphone customization powered by intelligent hardware analysis and aims to create the future of personalized smartphone engineering."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} whileHover={hoverCard} className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 sm:p-10 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-6 tracking-tight">PLATFORM CAPABILITIES</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-gray-300 text-sm sm:text-base">
                {["Custom Smartphone Hardware Builder", "AI Compatibility Testing Engine", "Performance Benchmark Analysis", "Thermal Management Simulation", "Battery Efficiency Analysis", "AI Smart Hardware Recommendations", "Save and Manage Custom Builds", "Build Comparison System", "Market Price Estimation", "Professional PDF Report Generation"].map((capability, index) => (
                  <motion.div key={index} whileHover={{ x: 4, textShadow: "0 0 8px rgba(129, 140, 248, 0.6)" }} className="flex items-start gap-2.5 transition-all duration-200 cursor-default">
                    <span className="text-indigo-500 font-bold select-none">•</span><span>{capability}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="mt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-6 text-center md:text-left tracking-tight">TECHNOLOGY STACK</h3>
              <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT Authentication", "Gemini AI API", "REST API Architecture", "Cloud Database Storage"].map((tech) => (
                  <motion.div key={tech} variants={fadeInUp} whileHover={{ scale: 1.03, borderColor: "rgba(99, 102, 241, 0.5)", backgroundColor: "rgba(17, 24, 39, 0.8)", boxShadow: "0 4px 20px rgba(99, 102, 241, 0.1)" }} className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 text-center font-medium text-xs sm:text-sm text-gray-300 transition-all duration-300 cursor-default">{tech}</motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-black border-t border-white/5">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">HOW IT WORKS</h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-base sm:text-lg">Design your smartphone from scratch, test hardware compatibility using AI, optimize performance, and generate professional reports.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <motion.div key={step.num} variants={fadeInUp} whileHover={hoverCard} className="bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-800 transition">
              <h3 className="text-2xl font-bold text-indigo-400">{step.num}</h3>
              <h4 className="text-xl mt-4 mb-3 font-semibold">{step.title}</h4>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mt-16">
          <p className="text-indigo-400 text-lg font-medium">Design smarter. Test instantly. Build the future of smartphones.</p>
        </motion.div>
      </section>

      {/* WHY FORGEMOBILE */}
      <section className="py-24 px-4 sm:px-6 lg:px-10 bg-gray-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">WHY FORGEMOBILE</h2>
            <p className="text-gray-400 max-w-4xl mx-auto text-base sm:text-lg">Traditional smartphones force users to compromise by choosing fixed hardware configurations. ForgeMobile changes that model by introducing intelligent smartphone customization, AI-powered analysis and engineering level hardware optimization.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={hoverCard} className="bg-black p-6 sm:p-8 rounded-2xl border border-gray-800 transition">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">{reason.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{reason.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mt-16">
            <p className="text-indigo-400 text-base sm:text-lg font-medium">ForgeMobile is not a smartphone store. It is a smartphone engineering platform.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;