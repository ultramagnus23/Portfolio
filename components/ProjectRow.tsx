"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  status: string;
  year: number;
  accent: string;
  github?: string;
  liveUrl?: string;
  hasCaseStudy: boolean;
}

export default function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const statusColors: Record<string, string> = {
    live: "#00FF94",
    "in-progress": "#7F77DD",
    done: "#888888",
    planned: "#BA7517",
  };

  return (
    <motion.div
      className="relative border-b border-white/5 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* Background project number */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 font-display font-bold text-[120px] text-white/[0.03] select-none leading-none pointer-events-none">
        {project.id}
      </div>

      <div className="relative py-12 px-8 md:px-16 flex flex-col md:flex-row md:items-center gap-8 group-hover:bg-white/[0.02] transition-colors">
        {/* Left: info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono px-2 py-0.5 border"
              style={{
                color: statusColors[project.status] || "#888",
                borderColor: statusColors[project.status] || "#888",
              }}
            >
              {project.status}
            </span>
            <span className="text-xs text-[#555] font-mono">{project.year}</span>
          </div>

          <h3 className="font-display font-bold text-3xl md:text-4xl text-white group-hover:text-signal transition-colors">
            {project.title}
          </h3>
          <p className="text-[#888] text-sm font-body italic">{project.tagline}</p>
          <p className="text-white/70 font-body text-sm leading-relaxed max-w-xl">
            {project.description}
          </p>

          {/* Stack pills */}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-[#888]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-2">
            {project.hasCaseStudy && (
              <Link
                href={`/projects/${project.slug}`}
                className="text-sm font-body text-signal hover:text-white transition-colors flex items-center gap-1"
              >
                case study →
              </Link>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-body text-[#888] hover:text-white transition-colors"
              >
                GitHub ↗
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-body text-[#888] hover:text-white transition-colors"
              >
                Live ↗
              </a>
            )}
          </div>
        </div>

        {/* Right: decorative visual placeholder */}
        <div className="hidden md:flex w-48 h-48 items-center justify-center border border-white/5 shrink-0">
          <div className="text-white/10 font-display text-6xl font-bold">{project.id}</div>
        </div>
      </div>
    </motion.div>
  );
}
