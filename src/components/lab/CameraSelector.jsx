// CameraSelector.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CameraSelector = ({
  config,
  setConfig
}) => {

  const [cameraTypes, setCameraTypes] = useState([]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/api/cameras"
          );

        setCameraTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCameras();
  }, []);

  const handleCameraCountChange = (e) => {
    const count = Number(e.target.value);

    const existingSlots =
      config.camera?.slots || [
        {
          type: "Primary Sensor",
          mp: "",
          ois: ""
        }
      ];

    const updatedSlots = [...existingSlots];

    while (updatedSlots.length < count) {
      updatedSlots.push({
        type:
          updatedSlots.length === 0
            ? "Primary Sensor"
            : "",
        mp: "",
        ois: ""
      });
    }

    updatedSlots.length = count;

    if (updatedSlots[0]) {
      updatedSlots[0].type =
        "Primary Sensor";
    }

    updateCameraPricing(
      updatedSlots,
      count
    );
  };

  const updateCameraPricing = (
    updatedSlots,
    count = config.camera?.count || 1
  ) => {

    let totalPrice = 0;

    updatedSlots.forEach(
      slot => {
        const selectedCamera =
          cameraTypes.find(
            camera =>
              camera.cameraType === slot.type &&
              String(camera.mp) === String(slot.mp) &&
              camera.ois === slot.ois
          );

        totalPrice +=
          selectedCamera?.price || 0;
      }
    );

    let isComplete = true;

    updatedSlots.forEach(slot => {
      if (!slot.type || !slot.mp || !slot.ois) {
        isComplete = false;
      }
    });

    setConfig(prev => ({
      ...prev,
      camera: {
        count: count,
        slots: updatedSlots,
        price: totalPrice,
        isValid: isComplete
      }
    }));
  };

  const updateSlot = (
    index,
    field,
    value
  ) => {

    const updatedSlots =
      [
        ...(config.camera?.slots || [])
      ];

    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value
    };

    if (field === "type") {
      updatedSlots[index].mp = "";
      updatedSlots[index].ois = "";
    }

    if (field === "mp") {
      updatedSlots[index].ois = "";
    }

    updatedSlots[0].type =
      "Primary Sensor";

    updateCameraPricing(updatedSlots);
  };

  const selectedTypes =
    (config.camera?.slots || []).map(slot => slot.type);

  const uniqueCameraTypes = [
    ...new Set(cameraTypes.map(camera => camera.cameraType))
  ];

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Camera System
        </h3>
      </div>

      {/* MAIN CAMERA COUNT CONTROLLER */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Select Quantity
        </label>
        <select
          value={config.camera?.count || 1}
          onChange={handleCameraCountChange}
          className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
        >
          <option value={1} className="bg-[#000000] text-white">1 Camera</option>
          <option value={2} className="bg-[#000000] text-white">2 Cameras</option>
          <option value={3} className="bg-[#000000] text-white">3 Cameras</option>
          <option value={4} className="bg-[#000000] text-white">4 Cameras</option>
          <option value={5} className="bg-[#000000] text-white">5 Cameras</option>
        </select>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">
        Configure up to 5 camera modules for your device.
      </div>

      {/* ITERATING ACTIVE MODULE HARDWARE CLUSTERS */}
      <div className="space-y-4">
        {Array.from({
          length: config.camera?.count || 1
        }).map((_, index) => {

          const slot = config.camera?.slots?.[index] || {};
          const currentType = index === 0 ? "Primary Sensor" : slot.type;

          const mpOptions = [
            ...new Set(
              cameraTypes
                .filter(camera => camera.cameraType === currentType)
                .map(camera => camera.mp)
            )
          ];

          const oisOptions = [
            ...new Set(
              cameraTypes
                .filter(camera => 
                  camera.cameraType === currentType &&
                  String(camera.mp) === String(slot.mp)
                )
                .map(camera => camera.ois)
            )
          ];

          return (
            <div
              key={index}
              className="bg-black/30 border border-gray-800 p-4 sm:p-5 rounded-xl relative overflow-hidden"
            >
              <div className="text-sm font-bold text-gray-200 mb-4 tracking-tight">
                Camera Slot {index + 1}
                {index === 0 && <span className="text-indigo-400 font-medium text-xs ml-1">(Main)</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                
                {/* CAMERA TYPE */}
                <div className="w-full">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Camera Type
                  </label>
                  <select
                    value={index === 0 ? "Primary Sensor" : slot.type || ""}
                    disabled={index === 0}
                    onChange={(e) => updateSlot(index, "type", e.target.value)}
                    className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none transition-all cursor-pointer font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {index === 0 ? (
                      <option value="Primary Sensor" className="bg-[#000000] text-white">Primary Sensor</option>
                    ) : (
                      <>
                        <option value="" className="bg-[#000000] text-white">Select Type</option>
                        {uniqueCameraTypes
                          .filter(type => 
                            type !== "Primary Sensor" &&
                            (!selectedTypes.includes(type) || slot.type === type)
                          )
                          .map(type => (
                            <option key={type} value={type} className="bg-[#000000] text-white py-2">
                              {type}
                            </option>
                          ))
                        }
                      </>
                    )}
                  </select>
                </div>

                {/* MP */}
                <div className="w-full">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    MP
                  </label>
                  <select
                    value={slot.mp || ""}
                    disabled={!currentType}
                    onChange={(e) => updateSlot(index, "mp", e.target.value)}
                    className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#000000] text-white">Select MP</option>
                    {mpOptions.map(mp => (
                      <option key={mp} value={mp} className="bg-[#000000] text-white py-2">
                        {mp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* OIS */}
                <div className="w-full">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    OIS
                  </label>
                  <select
                    value={slot.ois || ""}
                    disabled={!slot.mp}
                    onChange={(e) => updateSlot(index, "ois", e.target.value)}
                    className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#000000] text-white">Select OIS</option>
                    {oisOptions.map(ois => (
                      <option key={ois} value={ois} className="bg-[#000000] text-white py-2">
                        {ois}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CameraSelector;