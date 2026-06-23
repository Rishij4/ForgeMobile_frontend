// AudioSelector.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AudioSelector = ({ config, setConfig }) => {
  const [speakerOptions, setSpeakerOptions] = useState([]);
  const [dolbyOptions, setDolbyOptions] = useState([]);
  const [hiResOptions, setHiResOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [speakersRes, dolbyRes, hiResRes] = await Promise.all([
          axios.get("http://localhost:5000/api/audio/speakers"),
          axios.get("http://localhost:5000/api/audio/dolby"),
          axios.get("http://localhost:5000/api/audio/hires")
        ]);
        setSpeakerOptions(speakersRes.data);
        setDolbyOptions(dolbyRes.data);
        setHiResOptions(hiResRes.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const updateAudioConfig = (speakers, dolbyAtmos, hiResAudio) => {
    const selectedSpeaker = speakerOptions.find(item => item.name === speakers);
    const selectedDolby = dolbyOptions.find(item => item.name === dolbyAtmos);
    const selectedHiRes = hiResOptions.find(item => item.name === hiResAudio);

    const totalPrice = (selectedSpeaker?.price || 0) + (selectedDolby?.price || 0) + (selectedHiRes?.price || 0);
    const totalScore = (selectedSpeaker?.score || 0) + (selectedDolby?.score || 0) + (selectedHiRes?.score || 0);

    setConfig(prev => ({
      ...prev,
      audio: {
        speakers, dolbyAtmos, hiResAudio,
        price: totalPrice, audioScore: totalScore,
        isValid: !!(speakers && dolbyAtmos && hiResAudio)
      }
    }));
  };

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Audio System</h3>
      </div>
      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">
        Configure speaker setup and premium audio capabilities.
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* SPEAKER SETUP */}
        <div className="w-full sm:flex-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Speaker Setup</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={config.audio?.speakers || ""}
            onChange={(e) => updateAudioConfig(e.target.value, config.audio?.dolbyAtmos || "", config.audio?.hiResAudio || "")}
          >
            <option value="" className="bg-[#000000] text-white">Select Speakers</option>
            {speakerOptions.map(s => <option key={s._id} value={s.name} className="bg-[#000000] text-white py-2">{s.name}</option>)}
          </select>
        </div>

        {/* DOLBY */}
        <div className="w-full sm:flex-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dolby Atmos</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={config.audio?.dolbyAtmos || ""}
            onChange={(e) => updateAudioConfig(config.audio?.speakers || "", e.target.value, config.audio?.hiResAudio || "")}
          >
            <option value="" className="bg-[#000000] text-white">Select Dolby</option>
            {dolbyOptions.map(d => <option key={d._id} value={d.name} className="bg-[#000000] text-white py-2">{d.name}</option>)}
          </select>
        </div>

        {/* HI-RES */}
        <div className="w-full sm:flex-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hi-Res Audio</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={config.audio?.hiResAudio || ""}
            onChange={(e) => updateAudioConfig(config.audio?.speakers || "", config.audio?.dolbyAtmos || "", e.target.value)}
          >
            <option value="" className="bg-[#000000] text-white">Select Hi-Res</option>
            {hiResOptions.map(h => <option key={h._id} value={h.name} className="bg-[#000000] text-white py-2">{h.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AudioSelector;