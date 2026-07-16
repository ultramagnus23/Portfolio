"use client";

import type { ComponentType } from "react";
import { motion, useMotionValue } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { useSceneStore } from "@/lib/scrollStore";
import ScrambleText from "@/components/ScrambleText";
import Magnetic from "@/components/Magnetic";
import MetricValue from "@/components/MetricValue";
import CollegeOSStation from "@/components/scenes3d/CollegeOSStation";
import MezaStation from "@/components/scenes3d/MezaStation";
import FoodSafeStation from "@/components/scenes3d/FoodSafeStation";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  "in-progress": "In progress",
  done: "Done",
  planned: "Planned",
};

// Flagship projects get a full pinned 3D cinematic sequence (own scroll
// real estate, own Canvas, camera + scroll-driven object animation) instead
// of the generic checklist treatment — everything else keeps the lighter
// list-style scene inline below.
const FLAGSHIP_SCENES: Record<string, ComponentType<{ accent: string }>> = {
  collegeos: CollegeOSStation,
  meza: MezaStation,
  "foodsafe-india": FoodSafeStation,
};

/**
 * A project as a scene, not a card: no border, no box — just typography,
 * proof (metrics, shipped features) and a subtle cursor-tilt, with the
 * particle backdrop tinting to the project's accent while it's in view.
 */
export default function ProjectStation({ project, index }: { project: Project; index: number }) {
  const accent = project.accent;
  const FlagshipScene = FLAGSHIP_SCENES[project.slug];
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 3);
    rotateX.set(py * -3);
  };
  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <>
      {FlagshipScene && (
        <div className="relative -mx-6 md:-mx-16 border-b border-white/5">
          <FlagshipScene accent={accent} />
        </div>
      )}
      <ProjectStationBody
        project={project}
        index={index}
        accent={accent}
        rotateX={rotateX}
        rotateY={rotateY}
        handleMove={handleMove}
        handleLeave={handleLeave}
      />
    </>
  );
}

function ProjectStationBody({
  project,
  index,
  accent,
  rotateX,
  rotateY,
  handleMove,
  handleLeave,
}: {
  project: Project;
  index: number;
  accent: string;
  rotateX: ReturnType<typeof useMotionValue<number>>;
  rotateY: ReturnType<typeof useMotionValue<number>>;
  handleMove: (e: React.MouseEvent<HTMLElement>) => void;
  handleLeave: () => void;
}) {
  return (
    <motion.article
      className="relative py-20 md:py-28 border-b border-white/5 last:border-b-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      onViewportEnter={() => useSceneStore.getState().setActiveAccent(accent)}
      transition={{ duration: 0.6, delay: Math.min(index, 3) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      data-cursor="hover"
    >
      <span
        className="absolute -left-2 md:left-0 top-4 font-display font-bold text-[20vw] md:text-[9vw] leading-none text-white/[0.025] select-none pointer-events-none"
        aria-hidden="true"
      >
        {project.id}
      </span>

      <div className="relative max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
          <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
            {STATUS_LABEL[project.status] ?? project.status}
          </span>
          <span className="font-mono text-xs text-[#555]">{project.year}</span>
        </div>

        <h3 className="font-display font-bold text-4xl md:text-6xl text-white mb-4">
          <ScrambleText as="span" text={project.title} trigger="view" className="block" />
        </h3>

        <p className="font-body italic text-[#999] text-lg mb-6 max-w-xl">{project.tagline}</p>
        <p className="text-white/70 font-body leading-relaxed max-w-2xl mb-10">{project.description}</p>

        <div className="flex flex-wrap gap-x-10 gap-y-5 mb-10">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display font-bold text-2xl" style={{ color: accent }}>
                <MetricValue value={m.value} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#555] mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <ul className="space-y-2 mb-10 max-w-xl">
          {project.built.slice(0, 3).map((b, i) => (
            <motion.li
              key={b}
              className="flex gap-3 text-[#999] font-body text-sm leading-relaxed"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <span className="shrink-0" style={{ color: accent }}>
                ✓
              </span>
              {b}
            </motion.li>
          ))}
        </ul>

        <p className="font-mono text-[11px] text-[#666] mb-10">{project.stack.join(" · ")}</p>

        <div className="flex flex-wrap items-center gap-6">
          {project.hasCaseStudy && (
            <Magnetic>
              <Link
                href={`/projects/${project.slug}`}
                data-cursor-text="open"
                className="font-mono text-sm hover:text-white transition-colors"
                style={{ color: accent }}
              >
                Case study →
              </Link>
            </Magnetic>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-[#777] hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-[#777] hover:text-white transition-colors"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
