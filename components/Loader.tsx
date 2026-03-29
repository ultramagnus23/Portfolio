"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 0);
    const t2 = setTimeout(() => setPhase(2), 400);
    const t3 = setTimeout(() => setPhase(3), 900);
    const t4 = setTimeout(() => setProgress(100), 950);
    const t5 = setTimeout(() => setPhase(4), 1800);
    const t6 = setTimeout(() => onComplete(), 2200);

    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center"
      animate={phase === 4 ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Center content */}
      <div className="relative flex items-center justify-center">
        {/* Extending lines */}
        <AnimatePresence>
          {phase >= 2 && (
            <>
              <motion.div
                className="absolute h-px bg-signal"
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ right: "calc(50% + 0px)" }}
              />
              <motion.div
                className="absolute h-px bg-signal"
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ left: "calc(50% + 0px)" }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Green dot */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              className="w-2 h-2 rounded-full bg-signal relative z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* CT text */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="absolute font-display font-bold text-white text-2xl tracking-widest flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                C
              </motion.span>
              <motion.span
                className="text-signal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                ·
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                T
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            className="absolute bottom-8 left-8 right-8 h-px bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-signal"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
