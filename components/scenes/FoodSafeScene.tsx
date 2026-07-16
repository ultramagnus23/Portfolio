"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SceneFrame from "./SceneFrame";

// Deterministic pseudo-random per cell so the grid is stable across renders
// without needing client-only Math.random() at render time.
function hash(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

const DISTRICTS = Array.from({ length: 24 }, (_, i) => hash(i * 7 + 3));

function riskColor(r: number, accent: string) {
  if (r < 0.4) return "#00FF94";
  if (r < 0.7) return accent;
  return "#FF4D4D";
}

export default function FoodSafeScene({ accent }: { accent: string }) {
  const [inView, setInView] = useState(false);

  return (
    <SceneFrame title="foodsafe — pipeline" accent={accent}>
      <motion.div
        className="grid md:grid-cols-[auto_1fr_auto] gap-8 items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        onViewportEnter={() => setInView(true)}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-2">
          {["FSSAI.pdf", "USFDA.pdf", "AGMARK.pdf"].map((f, i) => (
            <motion.div
              key={f}
              className="relative w-24 h-14 border border-white/15 overflow-hidden font-mono text-[8px] text-[#666] flex items-center justify-center"
              initial={{ opacity: 0.3 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.25, duration: 0.3 }}
            >
              {f}
              <motion.div
                className="absolute inset-x-0 h-px"
                style={{ background: accent }}
                initial={{ top: "0%" }}
                animate={inView ? { top: "100%" } : {}}
                transition={{ delay: i * 0.25, duration: 0.8, ease: "linear" }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5 hidden md:block"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        />

        <div className="grid grid-cols-6 gap-1 w-40">
          {DISTRICTS.map((risk, i) => (
            <motion.span
              key={i}
              className="w-full aspect-square"
              style={{ background: riskColor(risk, accent) }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.15 + risk * 0.55 } : {}}
              transition={{ delay: 1 + i * 0.02, duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      <motion.p
        className="font-mono text-[10px] text-[#555] mt-6"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        confidence ≥ 0.75 trust gate — district-risk model (Random Forest)
      </motion.p>
    </SceneFrame>
  );
}
