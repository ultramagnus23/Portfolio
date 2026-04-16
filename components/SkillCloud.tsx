"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/data/skills";

type Skill = { name: string; level: string; usedIn: string[] };

const allSkills: Skill[] = [
  ...skills.languages,
  ...skills.frameworks,
  ...skills.databases,
  ...skills.concepts,
  ...skills.tools,
];

const sizeMap: Record<string, string> = {
  strong: "text-lg",
  learning: "text-base",
  medium: "text-base",
  done: "text-sm",
};

const opacityMap: Record<string, string> = {
  strong: "text-white",
  learning: "text-white/70",
  medium: "text-white/60",
  done: "text-white/40",
};

export default function SkillCloud() {
  const [tooltip, setTooltip] = useState<Skill | null>(null);

  return (
    <div className="flex flex-wrap gap-3 relative">
      {allSkills.map((skill, i) => (
        <motion.div
          key={skill.name}
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          onMouseEnter={() => setTooltip(skill)}
          onMouseLeave={() => setTooltip(null)}
        >
          <span
            className={`font-body font-medium px-3 py-1.5 border border-white/10 bg-white/5 cursor-default hover:border-signal/50 hover:text-signal transition-colors ${sizeMap[skill.level] || "text-base"} ${opacityMap[skill.level] || "text-white/60"}`}
          >
            {skill.name}
          </span>

          <AnimatePresence>
            {tooltip?.name === skill.name && skill.usedIn.length > 0 && (
              <motion.div
                className="absolute bottom-full left-0 mb-2 z-10 bg-[#111] border border-white/10 p-2 text-xs font-mono text-[#888] whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                used in: {skill.usedIn.join(", ")}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
