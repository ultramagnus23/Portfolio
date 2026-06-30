"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills, type Skill } from "@/data/skills";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  languages:  "Languages",
  frameworks: "Frameworks",
  databases:  "Databases",
  mlAndData:  "ML & Data",
  concepts:   "Concepts",
  creative:   "Creative & Tools",
};

const LEVEL_COLOR: Record<string, string> = {
  strong:   "#00FF94",
  learning: "#5E8CDB",
  medium:   "#BA7517",
  done:     "#444",
};

const LEVEL_LABEL: Record<string, string> = {
  strong:   "strong",
  learning: "learning",
  medium:   "practising",
  done:     "retired",
};

const LEVEL_WIDTH: Record<string, string> = {
  strong:   "100%",
  learning: "60%",
  medium:   "40%",
  done:     "20%",
};

const CASE_STUDY_TITLE: Record<string, string> = {
  "collegeos":      "CollegeOS",
  "meza":           "Meza",
  "foodsafe-india": "FoodSafe India",
  "holoforge":      "HoloForge",
  "orenth":         "Orenth",
  "klein-b":        "Klein B",
};

const LS_KEY = "skill_endorsements";

function getEndorsements(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
}

export default function SkillCloud() {
  const [active, setActive] = useState<Skill | null>(null);
  const [endorsements, setEndorsements] = useState<Record<string, number>>({});
  const [userEndorsed, setUserEndorsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const e = getEndorsements();
    setEndorsements(e);
    const ue: Record<string, boolean> = {};
    Object.keys(e).forEach((k) => { ue[k] = true; });
    setUserEndorsed(ue);
  }, []);

  function handleEndorse(skill: Skill) {
    if (userEndorsed[skill.name]) return;
    const e = getEndorsements();
    e[skill.name] = (e[skill.name] || 0) + 1;
    localStorage.setItem(LS_KEY, JSON.stringify(e));
    setEndorsements({ ...e });
    setUserEndorsed((prev) => ({ ...prev, [skill.name]: true }));
  }

  return (
    <div className="space-y-10">
      {(Object.entries(skills) as [string, Skill[]][]).map(([category, items]) => (
        <div key={category}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#444] mb-3">
            {CATEGORY_LABELS[category] ?? category}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => {
              const isActive = active?.name === skill.name;
              const count = endorsements[skill.name] || 0;
              return (
                <button
                  key={skill.name}
                  onClick={() => setActive(isActive ? null : skill)}
                  className={[
                    "font-body font-medium text-sm px-3 py-1.5 border transition-all duration-150",
                    isActive
                      ? "bg-white/[0.08] border-white/20 text-white"
                      : "bg-white/[0.03] border-white/[0.08] text-[#888] hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  {skill.name}
                  {count > 0 && (
                    <span
                      className="ml-1.5 text-[10px] font-mono"
                      style={{ color: LEVEL_COLOR[skill.level] }}
                    >
                      +{count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="border border-white/[0.08] bg-white/[0.02] p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-1">{active.name}</h3>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: LEVEL_COLOR[active.level] }}
                >
                  {LEVEL_LABEL[active.level]}
                </span>
              </div>
              <button
                onClick={() => setActive(null)}
                className="font-mono text-[#444] hover:text-white transition-colors text-sm mt-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Level bar */}
            <div className="h-px bg-white/[0.06] w-full mb-5 relative overflow-hidden">
              <div
                className="h-full absolute left-0 top-0 transition-all duration-500"
                style={{ width: LEVEL_WIDTH[active.level], backgroundColor: LEVEL_COLOR[active.level] }}
              />
            </div>

            {/* Description */}
            <p className="text-[#888] font-body text-sm leading-relaxed mb-5">{active.what}</p>

            {/* Project links */}
            {active.usedInSlugs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
                  Used in
                </span>
                {active.usedInSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    className="font-mono text-[11px] px-2 py-0.5 border border-white/[0.08] text-[#666] hover:text-signal hover:border-signal/40 transition-colors"
                  >
                    {CASE_STUDY_TITLE[slug] ?? slug} ↗
                  </Link>
                ))}
              </div>
            )}

            {/* Endorse */}
            <button
              onClick={() => handleEndorse(active)}
              disabled={!!userEndorsed[active.name]}
              className={[
                "font-mono text-[11px] px-3 py-1.5 border transition-all duration-150",
                userEndorsed[active.name]
                  ? "border-signal/20 text-signal/50 cursor-default"
                  : "border-white/[0.08] text-[#555] hover:border-white/20 hover:text-white cursor-pointer",
              ].join(" ")}
            >
              {userEndorsed[active.name]
                ? `endorsed · ${endorsements[active.name]} total`
                : "endorse this skill"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
