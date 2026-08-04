import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function SlideSheet({ isOpen, onClose, title, children }) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000] z-[60] cursor-pointer"
          />

          {/* Sheet Container */}
          <div className="fixed inset-0 pointer-events-none z-[60] flex items-end md:items-center md:justify-center p-0 md:p-4 mb-0">
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="pointer-events-auto w-full md:max-w-lg bg-[#131316] rounded-t-2xl md:rounded-2xl border-t md:border border-[rgba(255,255,255,0.08)] max-h-[92vh] md:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl mb-0"
            >
              {/* Drag indicator (mobile) */}
              <div className="w-full flex justify-center py-2.5 md:hidden">
                <div className="w-12 h-1 bg-gray-700 rounded-full opacity-60" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
                <h3 className="font-semibold text-lg text-white tracking-tight">{title}</h3>
                <button
                  id="close-sheet-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-[#1C1C1F] text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 text-gray-200">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SlideSheet;
