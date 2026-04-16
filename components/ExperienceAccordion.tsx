"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experience } from "@/data/experience";

export default function ExperienceAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-0 border-t border-white/10">
      {experience.map((item, i) => (
        <div key={i} className="border-b border-white/10">
          <button
            className="w-full flex items-center justify-between py-5 px-0 text-left group"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="flex items-baseline gap-4">
              <span className="font-display font-bold text-white group-hover:text-signal transition-colors">
                {item.role}
              </span>
              <span className="text-[#555] text-sm font-body">@ {item.org}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#555] text-sm font-mono hidden md:block">{item.period}</span>
              <motion.span
                className="text-signal text-lg"
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.span>
            </div>
          </button>

          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pb-6 flex gap-8">
                  <p className="text-[#888] font-body text-sm leading-relaxed max-w-2xl">
                    {item.detail}
                  </p>
                  <div className="shrink-0 text-xs font-mono text-[#555] md:hidden">
                    {item.period}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
