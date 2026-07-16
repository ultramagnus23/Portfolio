"use client";

import { motion } from "framer-motion";
import { research } from "@/data/research";
import HoloForgeScene from "@/components/scenes/HoloForgeScene";

const HOLOFORGE_ACCENT = "#5BC8FF";

function barColor(v: number) {
  // green when perception survives, amber mid, red at the cliff
  if (v >= 0.6) return "#00FF94";
  if (v >= 0.2) return "#BA7517";
  return "#FF4D4D";
}

export default function ResearchSection() {
  return (
    <section id="research" className="relative py-28 px-6 md:px-16 border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a] pointer-events-none" />

      <div className="relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-signal mb-4">Research</p>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight max-w-3xl">
            {research.title}
          </h2>
        </motion.div>

        {/* the question, in plain language */}
        <motion.p
          className="text-white/85 font-body text-xl md:text-2xl leading-relaxed mt-10 max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {research.question}
        </motion.p>

        <motion.p
          className="text-[#888] font-body leading-relaxed mt-6 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {research.premise}
        </motion.p>

        <motion.div
          className="max-w-2xl mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <HoloForgeScene accent={HOLOFORGE_ACCENT} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mt-16">
          {/* methods */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#666] mb-5">Methods</p>
            <div className="space-y-5">
              {research.methods.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="border-l-2 pl-4"
                  style={{ borderColor: m.state === "built" ? "#00FF94" : "#444" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-body text-white">{m.name}</span>
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
                      style={
                        m.state === "built"
                          ? { color: "#00FF94", background: "#00FF9415" }
                          : { color: "#888", background: "#ffffff0a", border: "1px dashed #ffffff22" }
                      }
                    >
                      {m.state === "built" ? "built" : "planned"}
                    </span>
                  </div>
                  <p className="text-[#777] font-body text-sm mt-1 leading-relaxed">{m.detail}</p>
                </motion.div>
              ))}
            </div>

            <p className="font-mono text-[11px] text-[#555] mt-8">
              λ {research.params.wavelength} · pitch {research.params.pixelPitch} · z {research.params.distance}
            </p>
          </div>

          {/* findings — real metrics as bars */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#666] mb-5">
              Where perception survives degradation <span className="text-[#444]">(SSIM)</span>
            </p>
            <div className="space-y-4">
              {research.findings.map((f, i) => (
                <motion.div
                  key={f.axis + f.setting}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="font-body text-sm text-white/90">
                      {f.axis} <span className="text-[#666]">· {f.setting}</span>
                    </span>
                    <span className="font-mono text-xs" style={{ color: barColor(f.ssim) }}>
                      {f.ssim.toFixed(3)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: barColor(f.ssim) }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(f.ssim * 100, 1.5)}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[#666] font-body text-xs mt-1.5">{f.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* status + link */}
        <motion.div
          className="mt-16 border border-white/10 bg-white/[0.02] p-6 md:p-8 max-w-3xl"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-signal">{research.statusLabel}</span>
          </div>
          <p className="text-[#aaa] font-body leading-relaxed">{research.status}</p>
          <a
            href={research.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 font-mono text-sm text-signal hover:text-white transition-colors"
          >
            HoloForge on GitHub ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
