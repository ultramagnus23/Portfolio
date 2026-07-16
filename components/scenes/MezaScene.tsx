"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SceneFrame from "./SceneFrame";
import TypeLine from "./TypeLine";

// Illustrative demo state — dramatizes Meza's real mechanism (anonymous
// occupancy + environmental conditions → an A/B experiment on the experience),
// not a claimed live result. Meza stores no PII: counts and conditions only.
const TABLES = [
  { seats: 4, occ: 4 },
  { seats: 2, occ: 2 },
  { seats: 6, occ: 3 },
  { seats: 4, occ: 0 },
  { seats: 2, occ: 2 },
  { seats: 4, occ: 4 },
  { seats: 6, occ: 5 },
  { seats: 2, occ: 0 },
  { seats: 4, occ: 3 },
  { seats: 2, occ: 2 },
];

const ENV = [
  { label: "temp", value: "22°C" },
  { label: "music", value: "68 dB" },
  { label: "lighting", value: "warm" },
  { label: "weather", value: "rain" },
];

export default function MezaScene({ accent }: { accent: string }) {
  const [live, setLive] = useState(false);

  return (
    <SceneFrame title="meza — experience console" accent={accent}>
      <motion.div
        className="grid md:grid-cols-[auto_1fr] gap-8 items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        onViewportEnter={() => setLive(true)}
        transition={{ duration: 0.4 }}
      >
        {/* Anonymous occupancy — a floor of tables filling by seat */}
        <div>
          <div className="grid grid-cols-5 gap-2 w-fit">
            {TABLES.map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.seats }).map((_, s) => (
                    <motion.span
                      key={s}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: accent }}
                      initial={{ opacity: 0.12 }}
                      animate={live ? { opacity: s < t.occ ? 0.95 : 0.12 } : {}}
                      transition={{ delay: 0.2 + i * 0.06 + s * 0.03, duration: 0.3 }}
                    />
                  ))}
                </div>
                <span className="w-4 h-3 border-b border-x border-white/15" />
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-[#555] mt-3">anonymous occupancy — no faces, no IDs</p>
        </div>

        {/* Environmental conditions */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {ENV.map((e, i) => (
            <motion.div
              key={e.label}
              className="flex items-baseline justify-between border-b border-white/8 pb-1"
              initial={{ opacity: 0 }}
              animate={live ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#666]">
                {e.label}
              </span>
              <span className="font-mono text-sm" style={{ color: accent }}>
                {e.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="font-mono text-sm text-white/80 mt-8 flex items-center gap-2">
        <span style={{ color: accent }}>A/B</span>
        {live && <TypeLine text="warm lighting vs. cool → +8% avg spend over 14 days" startDelay={1100} />}
      </div>
    </SceneFrame>
  );
}
