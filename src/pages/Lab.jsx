// Lab.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast, { Toaster } from "react-hot-toast";

import ProcessorSelector from "../components/lab/ProcessorSelector";
import RAMSelector from "../components/lab/RAMSelector";
import StorageSelector from "../components/lab/StorageSelector";
import BatterySelector from "../components/lab/BatterySelector";
import DisplaySelector from "../components/lab/DisplaySelector";
import CameraSelector from "../components/lab/CameraSelector";
import ConnectivitySelector from "../components/lab/ConnectivitySelector";
import AudioSelector from "../components/lab/AudioSelector";
import SensorSelector from "../components/lab/SensorSelector";
import ComponentSelector from "../components/lab/ComponentSelector";
import HapticsSelector from "../components/lab/HapticsSelector";
import ThermalSelector from "../components/lab/ThermalSelector";
import PhoneBuildSelector from "../components/lab/PhoneBuildSelector";

import CompatibilityCard from "../components/diagnostics/CompatibilityCard";
import PerformanceChart from "../components/charts/PerformanceChart";
import BatteryChart from "../components/charts/BatteryChart";
import ThermalChart from "../components/charts/ThermalChart";
import BuildSummaryCard from "../components/lab/BuildSummaryCard";
import AIRecommendationCard from "../components/lab/AIRecommendationCard";
import Modal from "../components/common/Modal";
import Navbar from "../components/layout/Navbar";

import useCompatibility from "../hooks/useCompatibility";
import { saveBuild, updateBuild } from "../services/buildService";
import { analyzeBuild } from "../services/aiService";
import { getPreset } from "../services/presetService";
import PhonePreview from "../components/preview/PhonePreview";
import { calculateDependencies } from "../utils/dependencyEngine";

const Lab = () => {
  const navigate = useNavigate();
  const isGuest = sessionStorage.getItem("guestMode") === "true";
  
  const [analysis, setAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showStartBuildModal, setShowStartBuildModal] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [originalBuildName, setOriginalBuildName] = useState("");
  const [aiError, setAiError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBuildId, setEditingBuildId] = useState(null);
  const [buildSaved, setBuildSaved] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [canExportPDF, setCanExportPDF] = useState(false);
  const [componentsModified, setComponentsModified] = useState(false);
  const [buildNameModified, setBuildNameModified] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showLabResetModal, setShowLabResetModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showLeaveLabModal, setShowLeaveLabModal] = useState(false);

  const reportRef = useRef(null);
  const isInitialEditLoad = useRef(false);
  const presetLoaded = useRef(false);
  const [scanStage, setScanStage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [exportingPDF, setExportingPDF] = useState(false);

  const [config, setConfig] = useState({
    processor: null, ram: null, storage: null, battery: null, display: null, camera: null,
    connectivity: null, audio: null, thermal: null, phoneBuild: null, haptics: null, sensors: [], components: []
  });
  const liveMetrics = calculateDependencies(config);

  const hasSelectedComponents = !!(
    config.processor || config.ram || config.storage || config.battery?.capacity || config.display?.panelType ||
    config.camera?.count || config.connectivity?.network?.type || config.audio?.speakers || config.thermal?.name ||
    config.phoneBuild?.material || config.haptics?.name || config.sensors?.length || config.components?.length
  );

  useEffect(() => {
    if (!hasSelectedComponents) {
      sessionStorage.removeItem("labInProgress");
      sessionStorage.removeItem("editingBuild");
      sessionStorage.removeItem("loadedSession");
    }
  }, [hasSelectedComponents]);

  const totalPrice = 
    (config.processor?.price || 0) + (config.ram?.price || 0) + (config.storage?.price || 0) + (config.display?.price || 0) +
    (config.battery?.price || 0) + (config.camera?.price || 0) + (config.audio?.price || 0) + (config.thermal?.price || 0) +
    (config.phoneBuild?.price || 0) + (config.haptics?.price || 0) + (config.connectivity?.network?.price || 0) +
    (config.connectivity?.wifi?.price || 0) + (config.connectivity?.bluetooth?.price || 0) +
    (config.sensors?.reduce((s, c) => s + (c.price || 0), 0) || 0) +
    (config.components?.reduce((s, c) => s + (c.price || 0), 0) || 0);

  const priceDifference = analysis?.marketPrice ? analysis.marketPrice - totalPrice : null;

  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];

    if (navEntry?.type === "reload") {
      sessionStorage.removeItem("labInProgress");
      sessionStorage.removeItem("editingBuild");
      sessionStorage.removeItem("loadedSession");
    }

    const loadedBuild = JSON.parse(sessionStorage.getItem("loadedBuild"));
    const editBuild = JSON.parse(sessionStorage.getItem("editBuild"));

    if (loadedBuild?.selectedComponents) {
      sessionStorage.setItem("loadedSession", "true");
      setConfig(loadedBuild.selectedComponents);
      setBuildName(""); setOriginalBuildName(""); setAnalysis(null); setTestCompleted(false);
      setCanExportPDF(false); setIsEditing(false); setEditingBuildId(null); setComponentsModified(false);
      setBuildNameModified(false); sessionStorage.removeItem("loadedBuild");
      return;
    }

    if (editBuild?.selectedComponents) {
      sessionStorage.setItem("editingBuild", "true");
      isInitialEditLoad.current = true;
      setConfig({ ...editBuild.selectedComponents, thermal: editBuild.selectedComponents.thermal || null, phoneBuild: editBuild.selectedComponents.phoneBuild || null });
      setBuildName(editBuild.buildName); setOriginalBuildName(editBuild.buildName);
      setIsEditing(true); setEditingBuildId(editBuild._id); setComponentsModified(false); setBuildNameModified(false);
      setTimeout(() => { isInitialEditLoad.current = false; }, 2000);

      setAnalysis({
        compatible: editBuild.compatibilityResult?.status === "Compatible",
        overallScore: editBuild.compatibilityResult?.score,
        performanceScore: editBuild.compatibilityResult?.performanceScore,
        thermalScore: editBuild.compatibilityResult?.thermalScore,
        buildQuality: editBuild.compatibilityResult?.buildQuality,
        batteryEfficiency: editBuild.compatibilityResult?.batteryEfficiency,
        issues: editBuild.compatibilityResult?.issues || [],
        strengths: editBuild.aiRecommendation?.strengths || [],
        weaknesses: editBuild.aiRecommendation?.weaknesses || [],
        summary: editBuild.aiRecommendation?.summary || "",
        upgrades: editBuild.aiRecommendation?.upgradeSuggestions || editBuild.compatibilityResult?.suggestions || [],
        marketPrice: editBuild.marketPrice,
      });
      setTestCompleted(true); setCanExportPDF(true); sessionStorage.removeItem("editBuild");
    }
  }, []);

  useEffect(() => {
    if (presetLoaded.current) return;
    presetLoaded.current = true;
    const loadPreset = async () => {
      const savedPreset = sessionStorage.getItem("selectedPreset");
      if (!savedPreset) return;
      const { tier, category } = JSON.parse(savedPreset);
      try {
        const preset = await getPreset(tier, category);
        setConfig(prev => ({ ...prev, ...preset }));
        sessionStorage.removeItem("selectedPreset");
        toast.success("Preset Applied");
      } catch (error) {
        console.log(error); toast.error("Preset loading failed");
      }
    };
    loadPreset();
  }, []);

  const { result, checkConfig, resetCompatibility } = useCompatibility();

  const handleCheck = async () => {
    if (
      !hasSelectedComponents || !config.processor || !config.ram || !config.storage || !config.display?.isValid ||
      !config.battery?.isValid || !config.camera?.isValid || !config.connectivity?.isValid || !config.audio?.isValid ||
      !config.thermal || !config.phoneBuild || !config.haptics || !config.sensors?.length
    ) {
      toast.error("Please select all components");
      return;
    }

    if (!navigator.onLine) {
      toast.error("Check your internet connection");
      return;
    }

    setScanStage("Scanning Components...");
    setTimeout(() => { setScanStage("Checking Compatibility..."); }, 1200);
    setTimeout(() => { setScanStage("Running Thermal Simulation..."); }, 2400);
    setTimeout(() => { setScanStage("Estimating Battery Life..."); }, 3600);
    setTimeout(() => { setScanStage("Generating AI Report..."); }, 4800);

    try {
      await checkConfig({
        processor: config.processor?._id,
        ram: config.ram?._id,
        storage: config.storage?._id,
        battery: config.battery?._id,
        display: config.display?._id,
        thermal: config.thermal?._id,
        phoneBuild: config.phoneBuild?._id
      });
    } catch (error) {
      setScanStage("");
      toast.error("Compatibility test failed");
      return;
    }

    if (config.processor && config.ram && config.storage && config.battery) {
      await runAIAnalysis();
    }

    setScanStage("Analysis Complete");
    setTimeout(() => { setScanStage(""); }, 1000);
    setTestCompleted(true);
  };

  const resetLab = () => {
    setBuildSaved(false); setBuildName(""); setOriginalBuildName(""); setAnalysis(null); setTestCompleted(false); setIsEditing(false); setEditingBuildId(null); setComponentsModified(false); setBuildNameModified(false);
    sessionStorage.removeItem("loadedBuild"); sessionStorage.removeItem("editBuild"); sessionStorage.removeItem("labInProgress"); sessionStorage.removeItem("editingBuild"); resetCompatibility();
    setConfig({ processor: null, ram: null, storage: null, battery: null, display: null, camera: null, connectivity: null, audio: null, thermal: null, phoneBuild: null, haptics: null, sensors: [], components: [] });
    setResetKey(prev => prev + 1);
    sessionStorage.removeItem("loadedSession");
  };

  const saveBuildDirectly = async () => {
    try {
      const hasTestData = testCompleted && analysis && analysis.overallScore > 0;
      const buildData = {
        buildName: buildName.trim() || "Untitled Build", totalPrice, marketPrice: analysis?.marketPrice || null, priceDifference: priceDifference, marketPriceDate: analysis?.marketPrice ? new Date() : null,
        performanceScore: hasTestData ? result?.performanceScore || 0 : null, tested: hasTestData,
        compatibilityResult: hasTestData ? { score: analysis?.overallScore || 0, status: analysis?.compatible ? "Compatible" : "Not Compatible", performanceScore: analysis?.performanceScore || 0, thermalScore: analysis?.thermalScore || 0, buildQuality: analysis.buildQuality || 0, batteryEfficiency: analysis?.batteryEfficiency || 0, issues: analysis?.issues || [], suggestions: analysis?.upgrades || [] } : null,
        aiRecommendation: hasTestData ? { strengths: analysis?.strengths || [], weaknesses: analysis?.weaknesses || [], upgradeSuggestions: analysis?.upgrades || [], summary: analysis?.summary || "" } : null,
        selectedComponents: config
      };

      if (isEditing) {
        await updateBuild(editingBuildId, buildData);
        setOriginalBuildName(buildName);
        toast.success("Build Updated Successfully");
      } else {
        await saveBuild(buildData);
        toast.success("Build Saved Successfully");
      }
      setBuildSaved(true); setComponentsModified(false); setBuildNameModified(false); sessionStorage.removeItem("labInProgress"); sessionStorage.removeItem("editingBuild");
    } catch (error) {
      console.log(error); toast.error("Failed to save build");
    }
  };

  const handleSaveBuild = async () => {
    if (isGuest) return toast.error("Guest mode cannot save builds. Register to continue.");
    if (!(config.processor && config.ram && config.storage && config.display && config.battery && config.camera && config.connectivity && config.audio && config.thermal && config.phoneBuild && config.haptics)) {
      return toast.error(isEditing ? "Please select all components before updating" : "Please select all components before saving");
    }
    if ((isEditing && componentsModified && !testCompleted) || (!isEditing && !result)) {
      setShowSaveModal(true); return;
    }
    await saveBuildDirectly();
  };

  const runAIAnalysis = async () => {
    setAiError(false);
    setAiLoading(true);
    setCanExportPDF(false);
    setAiProgress([]); 

    const loadingToast = toast.loading("Analyzing build...");

    const stages = [
      "Collecting component specs",
      "Validating hardware compatibility",
      "Running processor workload simulation",
      "Calculating thermal behavior matrix",
      "Estimating battery efficiency curves",
      "Analyzing camera + display synergy",
      "Calculating build integrity score",
      "Generating AI recommendation report"
    ];

    setAiProgress([stages[0]]);
    let currentStage = 1;

    const progressInterval = setInterval(() => {
      if (currentStage >= stages.length) {
        clearInterval(progressInterval);
        return;
      }
      const nextStage = stages[currentStage];
      if (nextStage !== undefined) {
        setAiProgress(prev => [...prev, nextStage]);
      }
      currentStage++;
    }, 1800);

    try {
      const res = await analyzeBuild({
        processor: config.processor?.name,
        ram: `${config.ram?.size}GB ${config.ram?.type}`,
        storage: `${config.storage?.capacity}GB ${config.storage?.type}`,
        display: `${config.display?.panelType}, ${config.display?.refreshRate}Hz, ${config.display?.resolution}, ${config.display?.size}`,
        battery: `${config.battery?.capacity}mAh, ${config.battery?.chargingSpeed}W, ${config.battery?.type}`,
        camera: config.camera?.slots?.map((slot) => `${slot.mp}MP ${slot.type} (${slot.ois} OIS)`).join(" + "),
        cameraCount: config.camera?.count,
        connectivity: `${config.connectivity?.network?.type}, ${config.connectivity?.wifi?.type}, ${config.connectivity?.bluetooth?.type}`,
        audio: `${config.audio?.speakers}, ${config.audio?.dolbyAtmos}, ${config.audio?.hiResAudio}`,
        thermal: config.thermal?.name,
        phoneBuild: config.phoneBuild?.material,
        haptics: config.haptics?.name,
        sensors: config.sensors,
        components: config.components
      });

      setAnalysis(res);
      setCanExportPDF(true);
      toast.success("Analysis completed successfully");
    } catch (err) {
      setAiError(true);
      console.error("AI Analysis Error:", err);
      const errorsMap = {
        429: "AI limit exceeded. Try again later.",
        500: "AI service temporarily busy",
        503: "AI service unavailable"
      };
      toast.error(
        !navigator.onLine ? "No internet connection" : err.response?.status ? errorsMap[err.response.status] || "AI analysis failed" : err.code === "ECONNABORTED" ? "AI request timed out" : "AI analysis failed"
      );
      setAiError(true);
    } finally { // <-- Fixed typo here from mdFinal to finally
      clearInterval(progressInterval);
      toast.dismiss(loadingToast);
      setTimeout(() => {
        setAiLoading(false);
        setAiProgress([]);
      }, 1000);
    }
  };

 /* ADVANCED MULTI-PAGE DYNAMIC OVERFLOW PDF EXPORT ENGINE */
  const exportPDF = async () => {
    if (!canExportPDF || !analysis) {
      toast.error("Run Compatibility Test before exporting");
      return;
    }

    setExportingPDF(true);
    const toastId = toast.loading("Forging high-fidelity PDF document framework...");

    // Create a sandbox element isolated safely offscreen
    const printSandbox = document.createElement("div");
    printSandbox.style.position = "absolute";
    printSandbox.style.left = "-9999px";
    printSandbox.style.top = "-9999px";
    printSandbox.style.width = "794px"; 
    printSandbox.style.background = "#090d16";
    printSandbox.style.color = "#ffffff";
    printSandbox.style.fontFamily = "system-ui, -apple-system, sans-serif";
    document.body.appendChild(printSandbox);

    // Global layout structural builder string helper
    const buildWrapperHTML = (contentHtml) => `
      <div class="pdf-page" style="width: 794px; height: 1123px; padding: 50px; box-sizing: border-box; background: #090d16; position: relative; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; margin-bottom: 0;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(to right, #6366f1, #a855f7, #06b6d4);"></div>
        <div style="width: 100%; flex-grow: 1; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(99, 102, 241, 0.15); padding-bottom: 15px; margin-bottom: 30px; flex-shrink: 0;">
            <div>
              <span style="font-size: 18px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">FORGE<span style="color: #6366f1;">MOBILE</span></span>
              <div style="font-size: 10px; color: #9ca3af; margin-top: 2px; letter-spacing: 0.5px;">AI-Powered Smartphone Diagnostics</div>
            </div>
            <div style="text-align: right; font-size: 10px; color: #6366f1; font-family: monospace; font-weight: bold; letter-spacing: 1px;">CERTIFIED HARDWARE BLUEPRINT</div>
          </div>
          <div style="width: 100%; flex-grow: 1;">
            ${contentHtml}
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; font-size: 10px; color: #4b5563; flex-shrink: 0;">
          <div>Generated: ${new Date().toLocaleDateString("en-GB")}</div>
          <div style="font-weight: bold; color: #6366f1; font-family: monospace;">SYSTEM BLUEPRINT PROFILE // ID: ${Math.random().toString(16).substr(2, 8).toUpperCase()}</div>
        </div>
      </div>
    `;

    // --- PAGE 1 GENERATION ---
    const page1Content = `
      <div style="margin-top: 20px;">
        <div style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: #818cf8; letter-spacing: 2px; font-family: monospace;">ADVANCED DIAGNOSTIC REPORT</div>
        <h1 style="font-size: 38px; font-weight: 900; color: #ffffff; margin: 10px 0 5px 0; tracking: -0.5px;">Build: ${buildName || "Rishi"}</h1>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${analysis.compatible ? "#34d399" : "#fbbf24"};">
          <span style="font-size: 10px;">●</span> ${analysis.compatible ? "Compatible Verification Passed" : "System Warnings Detected"}
        </div>
      </div>

      <div style="display: flex; gap: 20px; margin-top: 40px;">
        <div style="flex: 1; background: rgba(17, 24, 39, 0.6); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 16px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold; letter-spacing: 0.5px;">Total Build Cost</div>
          <div style="font-size: 26px; font-weight: 800; color: #34d399; margin-top: 5px;">₹ ${totalPrice.toLocaleString()}</div>
        </div>
        <div style="flex: 1; background: rgba(17, 24, 39, 0.6); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 16px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold; letter-spacing: 0.5px;">Estimated Market Value</div>
          <div style="font-size: 26px; font-weight: 800; color: #ffffff; margin-top: 5px;">₹ ${(analysis.marketPrice || totalPrice * 1.2).toLocaleString()}</div>
        </div>
      </div>

      <div style="margin-top: 45px;">
        <h3 style="font-size: 12px; font-weight: 800; color: #818cf8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px; font-family: monospace;">CORE PERFORMANCE RATINGS</h3>
        
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <div style="background: rgba(99, 102, 241, 0.04); border: 1px solid rgba(99, 102, 241, 0.15); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 500;">Overall Integrity</span>
            <span style="font-size: 18px; font-weight: 800; color: #ffffff;">${analysis.overallScore || 95}%</span>
          </div>
          <div style="background: rgba(6, 182, 212, 0.04); border: 1px solid rgba(6, 182, 212, 0.15); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 500;">Processor Performance</span>
            <span style="font-size: 18px; font-weight: 800; color: #22d3ee;">${analysis.performanceScore || 99}%</span>
          </div>
          <div style="background: rgba(52, 211, 153, 0.04); border: 1px solid rgba(52, 211, 153, 0.15); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 500;">Battery Optimization</span>
            <span style="font-size: 18px; font-weight: 800; color: #34d399;">${analysis.batteryEfficiency || 99}%</span>
          </div>
          <div style="background: rgba(249, 115, 22, 0.04); border: 1px solid rgba(249, 115, 22, 0.15); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 500;">Thermal Control</span>
            <span style="font-size: 18px; font-weight: 800; color: #fb923c;">${analysis.thermalScore || 88}%</span>
          </div>
          
          
          <div style="background: rgba(168, 85, 247, 0.04); border: 1px solid rgba(168, 85, 247, 0.15); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; grid-column: span 2;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 500;">Build Quality Integrity</span>
            <span style="font-size: 18px; font-weight: 800; color: #c084fc;">${analysis.buildQuality || 90}%</span>
          </div>
        </div>
      </div>
    `;

    // --- PAGE 2 GENERATION ---
    const formatValue = (val, fall) => val?.name || val?.material || val?.speakers || fall || "Not Selected";
    
    const cameraSpecs = config.camera?.slots
      ?.map((slot) => `${slot.mp}MP ${slot.type}${slot.ois === "Yes" || slot.ois === true ? " (OIS)" : ""}`)
      .join(" + ") || `${config.camera?.count || 0} Cameras Selected`;

    const sensorsSpecs = config.sensors && config.sensors.length > 0
      ? config.sensors.map(s => s.name).join(", ")
      : "None Selected";

    const expansionSpecs = config.components && config.components.length > 0
      ? config.components.map(c => c.name).join(", ")
      : "None Selected";

    const specsRows = [
      { name: "Processor", val: formatValue(config.processor) },
      { name: "RAM Architecture", val: config.ram ? `${config.ram.size}GB ${config.ram.type}` : "Not Selected" },
      { name: "Storage Module", val: config.storage ? `${config.storage.capacity}GB ${config.storage.type}` : "Not Selected" },
      { name: "Battery Cell Tank", val: config.battery ? `${config.battery.capacity}mAh (${config.battery.chargingSpeed}W)` : "Not Selected" },
      { name: "Display Panel", val: config.display ? `${config.display.panelType} ${config.display.refreshRate}Hz` : "Not Selected" },
      { name: "Camera Suite", val: cameraSpecs }, 
      { name: "Thermal Subsystem", val: formatValue(config.thermal) },
      { name: "Chassis Material", val: formatValue(config.phoneBuild) },
      { name: "Haptic Actuator", val: formatValue(config.haptics) },
      { name: "Connectivity Suite", val: `${config.connectivity?.network?.type || "5G"} | ${config.connectivity?.wifi?.type || "WiFi"} | ${config.connectivity?.bluetooth?.type || "BT"}` },
      { name: "Audio System", val: formatValue(config.audio) },
      { name: "Sensors Matrix", val: sensorsSpecs }, 
      { name: "Expansion Nodes", val: expansionSpecs } 
    ].map(r => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.03); gap: 20px;">
        <span style="font-size: 13px; color: #9ca3af; font-weight: 400; flex-shrink: 0;">${r.name}</span>
        <span style="font-size: 13px; color: #ffffff; font-weight: 600; text-align: right; max-width: 480px; word-break: break-word;">${r.val}</span>
      </div>
    `).join("");

    const page2Content = `
      <div>
        <h3 style="font-size: 12px; font-weight: 800; color: #818cf8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 25px; font-family: monospace;">HARDWARE SPECIFICATION MANIFEST</h3>
        <div style="background: rgba(17, 24, 39, 0.4); border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; padding: 10px 25px;">
          ${specsRows}
        </div>
      </div>
    `;

    // --- PAGE 3 & 4 DIAGNOSTICS GENERATION ---
    const renderListItems = (items) => {
      if (!items || items.length === 0) return `<div style="color:#6b7280; font-size:13px; padding-left:15px;">No metric traces evaluated.</div>`;
      return items.map(i => `<li style="margin-bottom: 8px; line-height: 1.4; color:#d1d5db; font-size:13px;">${i}</li>`).join("");
    };

    let sandboxPagesHTML = buildWrapperHTML(page1Content) + buildWrapperHTML(page2Content);

    const aiDataSegment1 = `
      <h3 style="font-size: 12px; font-weight: 800; color: #818cf8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 25px; font-family: monospace;">AI DIAGNOSTIC METRIC ANALYSIS</h3>
      
      <div style="margin-bottom: 25px;">
        <h4 style="color:#34d399; font-size:13px; font-weight:bold; margin-bottom:10px; letter-spacing:0.5px;">▲ SYSTEM STRENGTHS</h4>
        <ul style="padding-left: 15px; margin: 0;">${renderListItems(analysis.strengths)}</ul>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color:#f87171; font-size:13px; font-weight:bold; margin-bottom:10px; letter-spacing:0.5px;">▼ ARCHITECTURAL WEAKNESSES</h4>
        <ul style="padding-left: 15px; margin: 0;">${renderListItems(analysis.weaknesses)}</ul>
      </div>
    `;

    const aiDataSegment2 = `
      <h3 style="font-size: 12px; font-weight: 800; color: #818cf8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 25px; font-family: monospace;">SYSTEM PERFORMANCE EVALUATION CONTINUED</h3>

      <div style="margin-bottom: 30px;">
        <h4 style="color:#fbbf24; font-size:13px; font-weight:bold; margin-bottom:10px; letter-spacing:0.5px;">❖ OPTIMIZATION SUGGESTIONS</h4>
        <ul style="padding-left: 15px; margin: 0;">${renderListItems(analysis.upgrades || analysis.suggestions)}</ul>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 25px;">
        <h4 style="color:#818cf8; font-size:11px; font-weight:bold; letter-spacing:1px; margin-bottom:12px; font-family:monospace; text-transform:uppercase;">EXECUTIVE EVALUATOR SUMMARY</h4>
        <p style="color:#9ca3af; font-size:13px; line-height:1.55; margin:0; text-align:justify;">${analysis.summary || "Blueprint verification profile compiled without execution errors."}</p>
      </div>
    `;

    sandboxPagesHTML += buildWrapperHTML(aiDataSegment1) + buildWrapperHTML(aiDataSegment2);
    printSandbox.innerHTML = sandboxPagesHTML;

    const pages = printSandbox.children;
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      
      const pageCanvas = await html2canvas(pages[i], {
        scale: 2.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#090d16",
        logging: false
      });

      const cleanImage = pageCanvas.toDataURL("image/png");
      pdf.addImage(cleanImage, "PNG", 0, 0, 210, 297);
    }

    pdf.save(`${buildName.trim().replace(/\s+/g, "-") || "ForgeMobile"}-Premium-Report.pdf`);
    
    document.body.removeChild(printSandbox);
    toast.dismiss(toastId);
    toast.success("Premium Report Exported Successfully");
    setExportingPDF(false);
  };
  const updateConfig = (updater) => {
    setBuildSaved(false);
    if (isInitialEditLoad.current) return;
    setConfig(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        setAnalysis(null);
        setTestCompleted(false);
        setCanExportPDF(false);

        const hasComponents = Object.values(next).some(
          (value) => value && (Array.isArray(value) ? value.length > 0 : true)
        );

        if (hasComponents) {
          sessionStorage.setItem("labInProgress", "true");
        } else {
          sessionStorage.removeItem("labInProgress");
        }

        if (isEditing) setComponentsModified(true);
      }
      return next;
    });
  };

  const hasChanges = componentsModified || buildNameModified;
  const isRunTestDisabled = aiLoading || (isEditing && !componentsModified) || (isEditing && componentsModified && testCompleted) || (!isEditing && testCompleted);
  const isUpdateDisabled = aiLoading || buildSaved || (isEditing && !hasChanges);

  const buildSteps = [
    { label: "CPU", completed: !!config.processor },
    { label: "RAM", completed: !!config.ram },
    { label: "Storage", completed: !!config.storage },
    { label: "Display", completed: !!config.display?.isValid },
    { label: "Battery", completed: !!config.battery?.isValid },
    { label: "Camera", completed: !!config.camera?.isValid },
    { label: "Network", completed: !!config.connectivity?.isValid },
    { label: "Audio", completed: !!config.audio?.isValid },
    { label: "Thermal", completed: !!config.thermal },
    { label: "Build", completed: !!config.phoneBuild },
    { label: "Haptics", completed: !!config.haptics },
    { label: "Sensors", completed: config.sensors.length > 0 },
    { label: "Extras", completed: config.components.length > 0 }
  ];

  const selectedCount = buildSteps.filter((step) => step.completed).length;
  const completionPercent = Math.round((selectedCount / buildSteps.length) * 100);
  
  const handlePreviewClick = () => {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) {
      setPreviewDevice("mobile");
    } else {
      setPreviewDevice("desktop");
    }
    setShowPreviewNotice(true);
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <Toaster position="top-center" toastOptions={{ style: { background: "#111827", color: "#ffffff", border: "1px solid rgba(99, 102, 241, 0.3)" } }} />
      <Navbar
        hasActiveBuild={hasSelectedComponents}
        onStartBuild={() => (hasSelectedComponents || analysis ? setShowStartBuildModal(true) : window.scrollTo({ top: 0, behavior: "smooth" }))}
        onResetLab={() => setShowLabResetModal(true)}
        onNavigateAway={(path) => {
          setPendingNavigation(path);
          setShowLeaveLabModal(true);
        }}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-[1700px] mx-auto">
          <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">FORGEMOBILE<span className="text-indigo-500"> COMPATIBILITY LAB</span></h1>
              {isGuest && <div className="mt-3 inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-sm text-indigo-400 font-medium">Guest Mode Active • Saving Disabled</div>}
              <p className="text-gray-400 mt-3 text-base sm:text-lg max-w-2xl">Configure every smartphone component and let AI analyze performance, compatibility and market pricing.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (showPreview) {
                    setShowPreview(false);
                  } else {
                    handlePreviewClick();
                  }
                }}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-white transition-all"
              >
                <span className="hidden sm:inline">{showPreview ? "Hide Live Preview" : "View Live Preview"}</span>
                <span className="sm:hidden">{showPreview ? "Hide Preview" : "📱 Preview"}</span>
              </motion.button>

              <motion.button
                whileHover={canExportPDF && !exportingPDF ? { scale: 1.02 } : {}}
                whileTap={canExportPDF && !exportingPDF ? { scale: 0.98 } : {}}
                onClick={exportPDF}
                disabled={!canExportPDF || exportingPDF}
                className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg ${!canExportPDF || exportingPDF ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10"}`}
              >
                {exportingPDF ? "Forging Report PDF..." : "Export PDF Report"}
              </motion.button>
            </div>
          </div>

          {/* ASSEMBLY PROGRESS BAR */}
          <div className="mb-8 lg:sticky lg:top-20 lg:z-50">
            <div className="w-full lg:bg-black/95 lg:backdrop-blur-md py-2 lg:border-b lg:border-indigo-500/10 lg:shadow-2xl">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl px-3 sm:px-5 py-3 sm:py-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:flex xl:flex-nowrap xl:justify-between items-center gap-2 w-full">
                  {buildSteps.map((step, index, arr) => (
                    <React.Fragment key={step.label}>
                      <div className={`px-2 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-center whitespace-nowrap transition-all duration-500 w-full xl:w-auto xl:flex-1 ${step.completed ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10" : "bg-gray-800 text-gray-500"}`}>
                        {step.completed ? "✓ " : ""}
                        {step.label}
                      </div>
                      {index !== arr.length - 1 && (
                        <div className={`hidden xl:block flex-shrink-0 w-2 h-[2px] transition-all duration-500 ${step.completed ? "bg-green-500" : "bg-gray-700"}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-3 sm:mt-4">
                  <p className="text-center text-[10px] sm:text-xs text-gray-400 mb-2">Assembly Progress • {completionPercent}%</p>
                  <div className="w-full bg-gray-800 rounded-full h-[3px] sm:h-[4px]">
                    <div className={`h-[3px] sm:h-[4px] rounded-full transition-all duration-700 ease-out ${completionPercent === 100 ? "bg-green-500" : "bg-indigo-500"}`} style={{ width: `${completionPercent}%` }} />
                  </div>
                  {completionPercent === 100 && <p className="text-center text-green-400 text-[10px] sm:text-xs mt-2">Build Ready ✓</p>}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN WORKSPACE */}
          <motion.div className={`flex flex-col xl:flex-row gap-6 w-full items-start relative ${showPreview ? "justify-between" : "justify-center"}`}>
            <motion.div layout className={`transition-all duration-500 ease-in-out w-full ${showPreview ? "xl:w-[40%]" : "xl:w-[72%] xl:mx-auto"}`}>
              <div className="bg-gray-900 border border-gray-800 p-5 sm:p-8 rounded-3xl shadow-2xl space-y-4 relative w-full h-auto">
                <div className="space-y-2">
                  {[
                    { id: "processor", Comp: ProcessorSelector },
                    { id: "ram", Comp: RAMSelector },
                    { id: "storage", Comp: StorageSelector },
                    { id: "display", Comp: DisplaySelector },
                    { id: "battery", Comp: BatterySelector },
                    { id: "camera", Comp: CameraSelector },
                    { id: "connectivity", Comp: ConnectivitySelector },
                    { id: "audio", Comp: AudioSelector },
                    { id: "thermal", Comp: ThermalSelector },
                    { id: "phonebuild", Comp: PhoneBuildSelector },
                    { id: "haptics", Comp: HapticsSelector },
                    { id: "sensor", Comp: SensorSelector },
                    { id: "component", Comp: ComponentSelector }
                  ].map(({ id, Comp }, index, arr) => (
                    <div key={id} className="relative w-full">
                      <Comp key={`${id}-${resetKey}`} config={config} setConfig={updateConfig} />
                      {index !== arr.length - 1 && (
                        <div className="flex justify-center py-2">
                          <div className="w-[2px] h-6 bg-gradient-to-b from-indigo-500/70 to-transparent" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-5 pt-4 border-t border-gray-800/60">
                  <div className="bg-gray-950 border border-indigo-500/20 rounded-2xl p-4">
                    <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Build Name</label>
                    <input
                      type="text"
                      value={buildName}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setBuildName(newName);
                        if (isEditing) {
                          setBuildNameModified(newName.trim() !== originalBuildName.trim());
                        } else {
                          setBuildNameModified(newName.trim().length > 0);
                        }
                      }}
                      placeholder="Name your build..."
                      className="w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-600"
                    />
                  </div>

                  <div className="bg-gray-950 border border-green-500/20 rounded-2xl p-5 shadow-lg">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total Build Price</p>
                    <p className="text-3xl font-bold text-green-400">₹ {totalPrice.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheck}
                      disabled={isRunTestDisabled}
                      className={`py-3.5 rounded-2xl font-semibold transition-all ${isRunTestDisabled ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"}`}
                    >
                      Run Test
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveBuild}
                      disabled={isUpdateDisabled}
                      className={`py-3.5 rounded-2xl font-semibold transition-all ${isUpdateDisabled ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"}`}
                    >
                      Save Build
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - PHONE LIVE PREVIEW */}
            <AnimatePresence mode="popLayout">
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, x: 40, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="w-full xl:w-[59%] xl:max-w-[59%] order-first xl:order-none xl:sticky xl:top-[210px] h-fit z-10" 
                >
                  <div className="w-full backdrop-blur-md rounded-3xl overflow-hidden">
                    <PhonePreview
                      config={config}
                      analysis={analysis}
                      isTesting={aiLoading}
                      scanStage={scanStage}
                      liveMetrics={liveMetrics}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* DIAGNOSTIC OUTPUT SECTIONS */}
          <div ref={reportRef} className={`mt-8 space-y-8 transition-all duration-500 ${showPreview ? "w-full" : "xl:w-[72%] xl:mx-auto"}`}>
            <AnimatePresence mode="wait">
              {(hasSelectedComponents || aiLoading || analysis) && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  {analysis && (
                    <div className="bg-gray-900 border border-indigo-500/20 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">ForgeMobile AI Analysis Report</h2>
                        <p className="text-gray-400 mt-1 text-xs sm:text-sm">System specifications compiled on {new Date().toLocaleDateString("en-GB")}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400 font-mono text-xs w-fit">REPORT // LIVE</span>
                    </div>
                  )}
                  <BuildSummaryCard buildName={buildName} totalPrice={totalPrice} {...config} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {aiLoading && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-gray-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-lg shadow-indigo-500/20" />
                  <div className="flex justify-center mb-6"><div className="w-14 h-14 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" /></div>
                  <h2 className="text-2xl font-bold text-white mb-2">AI Analysis in Progress</h2>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
                    {aiProgress.length > 0 ? aiProgress[aiProgress.length - 1] : "Initializing AI engine..."}
                  </p>
                  <div className="space-y-3.5 max-w-md mx-auto text-left text-sm font-medium text-gray-300">
                    {aiProgress.filter(Boolean).map((step, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-3" >
                        <span className="text-base font-bold text-green-400">✓</span>
                        <span className="text-green-400">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {aiError && !aiLoading && (
              <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-red-400 flex items-center gap-2"><span>⚠</span> AI Recommendations Temporarily Unavailable</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">The remote matrix evaluator returned a busy payload code. Local storage configurations and system PDF blueprints remain available for access.</p>
              </div>
            )}

            {!aiLoading && (analysis || result) && <div className="animate-fadeIn"><CompatibilityCard result={analysis || result} /></div>}

            {!aiLoading && analysis && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <PerformanceChart score={analysis.performanceScore} />
                  <BatteryChart score={analysis.batteryEfficiency} />
                  <ThermalChart score={analysis.thermalScore} />
                </div>
                <div className="animate-fadeIn"><AIRecommendationCard analysis={analysis} /></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SYSTEM MODALS */}
      <AnimatePresence>
        {showSaveModal && (
          <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className="bg-[#0b0f19]/90 backdrop-blur-xl p-4 rounded-2xl relative overflow-hidden border border-indigo-500/20 shadow-2xl text-center sm:text-left">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
              <h2 className="text-xl font-black mb-3 text-white tracking-tight pt-2">{isEditing && componentsModified ? "Configuration Changed" : "Compatibility Test Flag"}</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium px-2 sm:px-0">{isEditing && componentsModified ? "Components were modified after the last compatibility test execution cycle. Would you like to rerun the validation layer before saving changes?" : "No active diagnostic trace was found for this configuration profile. Would you like to run verification now?"}</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
                <motion.button whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }} whileTap={{ scale: 0.99 }} type="button" onClick={() => { setShowSaveModal(false); saveBuildDirectly(); }} className="w-full sm:w-auto bg-gray-900/50 hover:bg-gray-900 border border-gray-800 text-gray-300 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all uppercase">Save Without Testing</motion.button>
                <motion.button whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(79,70,229,0.25)" }} whileTap={{ scale: 0.99 }} type="button" onClick={() => { setShowSaveModal(false); handleCheck(); }} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-indigo-600/10 uppercase">Run Diagnostic Verification</motion.button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStartBuildModal && (
          <Modal isOpen={showStartBuildModal} onClose={() => setShowStartBuildModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className="bg-[#0b0f19]/90 backdrop-blur-xl p-4 rounded-2xl relative overflow-hidden border border-red-500/20 shadow-2xl text-center sm:text-left">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
              <h2 className="text-xl font-black mb-3 text-white tracking-tight pt-2">Initialize New Assembly Canvas</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium px-2 sm:px-0">An active hardware tracing matrix is loaded in current memory blocks. Proceeding will overwrite component frames, AI analytics data arrays, and uncommitted diagnostic outputs.</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
                <motion.button whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(220,38,38,0.25)" }} whileTap={{ scale: 0.99 }} type="button" onClick={() => { setShowStartBuildModal(false); resetLab(); }} className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-red-600/10 uppercase">Wipe Canvas & Start</motion.button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLabResetModal && (
          <Modal isOpen={showLabResetModal} onClose={() => setShowLabResetModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0b0f19]/90 backdrop-blur-xl p-5 rounded-2xl border border-red-500/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-3">Start New Lab Session</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">You are currently working on a smartphone build. Starting a new lab session will discard all unsaved changes and reset your current configuration.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowLabResetModal(false)} className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300">Cancel</button>
                <button onClick={() => { setShowLabResetModal(false); resetLab(); }} className="px-5 py-2 rounded-xl bg-red-600 text-white">Start New Build</button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaveLabModal && (
          <Modal isOpen={showLeaveLabModal} onClose={() => setShowLeaveLabModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0b0f19]/90 backdrop-blur-xl p-5 rounded-2xl border border-yellow-500/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-3">Leave Current Build</h2>
              <p className="text-sm text-gray-400 mb-6">You are currently working on a smartphone build. Leaving this page may discard unsaved changes.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowLeaveLabModal(false)} className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300">Stay Here</button>
                <button
                  onClick={() => {
                    setShowLeaveLabModal(false);
                    navigate(pendingNavigation);
                    sessionStorage.removeItem("labInProgress");
                    sessionStorage.removeItem("editingBuild");
                    sessionStorage.removeItem("loadedSession");
                  }}
                  className="px-5 py-2 rounded-xl bg-yellow-600 text-white"
                >
                  Leave Page
                </button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreviewNotice && (
          <Modal isOpen={showPreviewNotice} onClose={() => setShowPreviewNotice(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0b0f19]/90 backdrop-blur-xl p-5 rounded-2xl border border-indigo-500/20 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h2 className="text-xl font-bold text-white mb-3">Live Preview Under Development</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {previewDevice === "mobile" ? (
                    <>
                      ForgeMobile Live Preview is currently under active development.
                      <br /><br />
                      Mobile devices are not fully supported yet.
                      If you still want to preview it open ForgeMobile in Desktop.
                    </>
                  ) : (
                    <>
                      ForgeMobile Live Preview is currently under active development.
                      <br /><br />
                      The interactive X-Ray hardware simulation and real-time build
                      visualization is still being optimized.
                      <br /><br />
                      If you still want to preview it click OPEN PREVIEW.
                    </>
                  )}
                </p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setShowPreviewNotice(false)} className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300">Cancel</button>
                  {previewDevice === "desktop" ? (
                    <button
                      onClick={() => {
                        setShowPreviewNotice(false);
                        setShowPreview(!showPreview);
                      }}
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white"
                    >
                      Open Preview
                    </button>
                  ) : (
                    <button disabled className="px-5 py-2 rounded-xl bg-gray-700 text-gray-500 cursor-not-allowed">Desktop Only</button>
                  )}
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lab;
