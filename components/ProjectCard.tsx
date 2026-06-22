"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/data/projects";

const statusColors: Record<string, string> = {
  live: "#00FF94",
  "in-progress": "#7F77DD",
  done: "#888888",
  planned: "#BA7517",
};

/**
 * Interactive project card: hover reveals the stack + an accent glow; click
 * expands inline to the full technical breakdown without leaving the page.
 */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const accent = project.accent;
  const statusColor = statusColors[project.status] || "#888";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative border border-white/10 bg-white/[0.015] overflow-hidden"
      style={{ borderColor: open ? `${accent}55` : undefined }}
      data-cursor="hover"
    >
      {/* accent wash that blooms on hover/open */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(600px circle at 50% -20%, ${accent}14, transparent 70%)`, opacity: open ? 1 : undefined }}
      />
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: accent, transform: open ? "scaleX(1)" : undefined }}
      />

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-full text-left p-7 md:p-9"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs px-2 py-0.5 border" style={{ color: statusColor, borderColor: `${statusColor}66` }}>
                {project.status}
              </span>
              <span className="font-mono text-xs text-[#555]">{project.year}</span>
            </div>
            <h3
              className="font-display font-bold text-3xl md:text-4xl text-white transition-colors duration-300"
              style={{ color: open ? accent : undefined }}
            >
              {project.title}
            </h3>
            <p className="font-body italic text-[#888] text-sm mt-2 max-w-md">{project.tagline}</p>
          </div>

          {/* expand indicator */}
          <motion.span
            className="font-mono text-2xl shrink-0 leading-none mt-1"
            style={{ color: accent }}
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
          >
            +
          </motion.span>
        </div>

        <p className="text-white/70 font-body text-sm leading-relaxed mt-5 max-w-2xl">{project.description}</p>

        {/* metrics row — always visible, the proof */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display font-bold text-base" style={{ color: accent }}>{m.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#555]">{m.label}</div>
            </div>
          ))}
        </div>

        {/* stack — revealed on hover, persists when open */}
        <div
          className="flex flex-wrap gap-2 mt-6 opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: open ? 1 : undefined }}
        >
          {project.stack.map((tech) => (
            <span key={tech} className="font-mono text-[11px] px-2 py-0.5 border border-white/10 text-[#888]">
              {tech}
            </span>
          ))}
        </div>
      </button>

      {/* expandable technical detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-7 md:px-9 pb-9 pt-2 grid md:grid-cols-2 gap-x-12 gap-y-8 border-t border-white/5">
              <Detail label="The problem">{project.problem}</Detail>
              <Detail label="The approach">{project.approach}</Detail>
              <div className="md:col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: accent }}>
                  What&apos;s built
                </p>
                <ul className="space-y-2">
                  {project.built.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[#aaa] font-body text-sm leading-relaxed">
                      <span className="shrink-0" style={{ color: accent }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              {project.whatDidntWork && (
                <div className="md:col-span-2">
                  <Detail label="What didn't work">{project.whatDidntWork}</Detail>
                </div>
              )}

              <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                {project.hasCaseStudy && (
                  <Link href={`/projects/${project.slug}`} className="font-body text-sm hover:text-white transition-colors" style={{ color: accent }}>
                    full case study →
                  </Link>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-[#888] hover:text-white transition-colors">
                    GitHub ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-[#888] hover:text-white transition-colors">
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-[#666] mb-2">{label}</p>
      <p className="text-[#aaa] font-body text-sm leading-relaxed">{children}</p>
    </div>
  );
}
