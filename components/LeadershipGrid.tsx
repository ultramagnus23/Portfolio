"use client";

import { motion } from "framer-motion";
import { leadership } from "@/data/leadership";

export default function LeadershipGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-white/10">
      {leadership.map((item, i) => (
        <motion.div
          key={i}
          className="border-b border-r border-white/10 p-8 hover:bg-white/[0.02] transition-colors"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display font-bold text-white text-lg">{item.title}</h3>
              <span className="text-xs font-mono text-signal shrink-0">{item.period}</span>
            </div>
            <p className="text-[#555] text-xs font-mono">{item.org}</p>
            <p className="text-[#888] font-body text-sm leading-relaxed">{item.story}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
