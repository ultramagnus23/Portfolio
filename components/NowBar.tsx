"use client";

import { motion } from "framer-motion";
import { nowMarquee } from "@/data/now";

export default function NowBar() {
  const text = nowMarquee.join(" · ");

  return (
    <div className="w-full border-t border-b border-white/10 py-3 overflow-hidden relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0 pl-6 pr-4 border-r border-white/10">
          <motion.div
            className="w-2 h-2 rounded-full bg-signal"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-xs font-body font-medium tracking-widest text-signal uppercase">
            Currently
          </span>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden flex-1">
          <motion.div
            className="flex gap-8 whitespace-nowrap text-sm font-body text-[#888]"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            {[...Array(4)].map((_, i) => (
              <span key={i}>{text}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
