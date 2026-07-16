"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SceneFrame from "./SceneFrame";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Only the two verified measurements from data/research.ts findings — the
// "reference" frame is a visual baseline, not a claimed measurement, so it
// carries no fabricated number.
const STEPS = [
  { label: "reference", ssim: null as number | null, tone: "clean" as const },
  { label: "2-bit phase", ssim: 0.93, tone: "clean" as const },
  { label: "1-bit phase", ssim: 0.003, tone: "cliff" as const },
];

const GRID = 10;

function hash(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export default function HoloForgeScene({ accent }: { accent: string }) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(reduced ? STEPS.length - 1 : 0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setStep(i);
      if (i >= STEPS.length - 1) clearInterval(id);
    }, 1100);
    return () => clearInterval(id);
  }, [started, reduced]);

  const current = STEPS[step];
  const noiseAmt = current.ssim === null ? 0 : 1 - current.ssim;

  return (
    <SceneFrame title="holoforge — phase-bit sweep" accent={accent}>
      <motion.div
        className="flex flex-col md:flex-row items-center gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        onViewportEnter={() => setStarted(true)}
        transition={{ duration: 0.4 }}
      >
        <div
          className="grid shrink-0"
          style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, width: 140, height: 140, gap: 1 }}
        >
          {Array.from({ length: GRID * GRID }).map((_, i) => {
            const cx = i % GRID;
            const cy = Math.floor(i / GRID);
            const d = Math.hypot(cx - GRID / 2 + 0.5, cy - GRID / 2 + 0.5) / (GRID / 2);
            const base = Math.max(0, 1 - d);
            const cellHash = hash(i);
            const opacity = cellHash < noiseAmt * 0.9 ? cellHash : base;
            return (
              <span
                key={i}
                style={{ background: accent, opacity: Math.max(0.03, Math.min(1, opacity)) }}
              />
            );
          })}
        </div>

        <div className="flex-1 space-y-3 font-mono text-xs w-full">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3" style={{ opacity: step >= i ? 1 : 0.25 }}>
              <span className="w-20 text-[#888] shrink-0">{s.label}</span>
              <div className="flex-1 h-1 bg-white/10 overflow-hidden max-w-[110px]">
                <motion.div
                  className="h-full"
                  style={{ background: s.tone === "cliff" ? "#FF4D4D" : accent }}
                  initial={{ width: 0 }}
                  animate={step >= i ? { width: `${(s.ssim ?? 1) * 100}%` } : { width: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span
                className="w-12 text-right shrink-0"
                style={{ color: s.tone === "cliff" ? "#FF4D4D" : accent }}
              >
                {s.ssim === null ? "—" : s.ssim.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
      <p className="font-mono text-[10px] text-[#555] mt-6">
        SSIM vs. phase-quantisation depth — the 1-bit cliff is a measured result, not a rendering artefact
      </p>
    </SceneFrame>
  );
}
