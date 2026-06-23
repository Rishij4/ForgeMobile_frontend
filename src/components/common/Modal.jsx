// Modal.jsx
import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
  
  // Prevent background scrolling while modal tracking is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-indigo-500/30">
        
        {/* BACKDROP BLUR OVERLAY MASK Layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        />

        {/* CORE CONTAINER SCALED INTERACTION CORE PANEL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-black/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar z-10"
        >
          
          {/* Top Decorative Graphic Technical Identity Bar Accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-60" />

          {/* DYNAMIC TOP ROW NAVIGATION ANCHOR ACTION STRIP */}
          <div className="w-full flex justify-end mb-2 shrink-0">
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-black border border-gray-800 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-200 outline-none transform active:scale-95"
              title="Close Panel Matrix"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* MODAL MOUNT INNER CHILDFRAME COMPONENT SLOTS */}
          <div className="flex-1 w-full text-white">
            {children}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;