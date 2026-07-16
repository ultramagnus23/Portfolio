"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SceneFrame from "./SceneFrame";
import TypeLine from "./TypeLine";

// Illustrative demo data — the case study is explicit that chancing today is
// a stats-derived simulation, not a real outcome. These numbers dramatize
// the mechanism (retrieval → diversification), not a claimed result.
const RESULTS = [
  { name: "MIT", tag: "Reach", match: 91 },
  { name: "UMich Ann Arbor", tag: "Target", match: 78 },
  { name: "Arizona State", tag: "Safety", match: 95 },
];

export default function CollegeOSScene({ accent }: { accent: string }) {
  const [typed, setTyped] = useState(false);

  return (
    <SceneFrame title="collegeos.app — search" accent={accent}>
      <div className="font-mono text-sm text-white/80 mb-6 flex items-center gap-2">
        <span style={{ color: accent }}>❯</span>
        <TypeLine text="cs, reach schools, need aid, us" onDone={() => setTyped(true)} />
      </div>

      <div className="space-y-3">
        {RESULTS.map((r, i) => (
          <motion.div
            key={r.name}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -8 }}
            animate={typed ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666] w-14 shrink-0">
              {r.tag}
            </span>
            <span className="font-body text-sm text-white/90 w-36 shrink-0 truncate">{r.name}</span>
            <div className="flex-1 h-1 bg-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: accent }}
                initial={{ width: 0 }}
                animate={typed ? { width: `${r.match}%` } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-xs w-10 text-right shrink-0" style={{ color: accent }}>
              {r.match}%
            </span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="font-mono text-[10px] text-[#555] mt-6"
        initial={{ opacity: 0 }}
        animate={typed ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        hybrid retrieval (pgvector + lexical) → reach / target / safety diversification
      </motion.p>
    </SceneFrame>
  );
}
