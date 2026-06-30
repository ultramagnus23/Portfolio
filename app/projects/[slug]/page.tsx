import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = projects.indexOf(project);
  // Next project that has a case study (skip ones that don't)
  let nextProject = projects[(currentIndex + 1) % projects.length];
  let tries = 0;
  while (!nextProject.hasCaseStudy && tries < projects.length) {
    const nextIndex = (projects.indexOf(nextProject) + 1) % projects.length;
    nextProject = projects[nextIndex];
    tries++;
  }
  if (!nextProject.hasCaseStudy) nextProject = project; // fallback: same project

  return (
    <main className="min-h-screen bg-base">
      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-16 border-b border-white/[0.06] bg-base/90 backdrop-blur-sm">
        <Link
          href="/projects"
          className="text-[#555] font-mono text-sm hover:text-signal transition-colors"
        >
          ← projects
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider"
            style={{ color: project.accent, borderColor: `${project.accent}44` }}
          >
            {project.status}
          </span>
          <span className="text-[#444] font-mono text-xs">{project.year}</span>
        </div>
      </div>

      <div className="pt-32 pb-24 px-6 md:px-16 max-w-4xl mx-auto">
        {/* Giant number watermark */}
        <div className="relative">
          <span className="absolute -left-4 -top-8 font-display font-bold text-[200px] text-white/[0.04] leading-none select-none pointer-events-none">
            {project.id}
          </span>
        </div>

        {/* Title block */}
        <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-4 relative z-10">
          {project.title}
        </h1>
        <p className="text-[#666] font-body text-xl italic mb-8">{project.tagline}</p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] text-[#777]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links row */}
        {(project.github || project.liveUrl) && (
          <div className="flex gap-6 mb-10">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-signal hover:text-white transition-colors"
              >
                GitHub ↗
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-[#888] hover:text-white transition-colors"
              >
                Live ↗
              </a>
            )}
          </div>
        )}

        {/* Metrics bar */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/[0.08] mb-16">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="bg-white/[0.02] px-5 py-4 first:rounded-tl-none last:rounded-br-none"
              >
                <p
                  className="font-display font-bold text-lg leading-tight mb-1"
                  style={{ color: project.accent }}
                >
                  {m.value}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#555]">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Narrative sections */}
        <div className="border-t border-white/[0.08] pt-12 space-y-16">
          {project.problem && (
            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">The problem.</h2>
              <p className="text-[#888] font-body leading-relaxed">{project.problem}</p>
            </section>
          )}

          {project.approach && (
            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">The approach.</h2>
              <p className="text-[#888] font-body leading-relaxed">{project.approach}</p>
            </section>
          )}

          {project.built && project.built.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">What&apos;s built.</h2>
              <ul className="space-y-3">
                {project.built.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[#888] font-body">
                    <span className="shrink-0 mt-0.5" style={{ color: project.accent }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.technicalDecisions && project.technicalDecisions.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">Technical decisions.</h2>
              <ul className="space-y-3">
                {project.technicalDecisions.map((d, i) => (
                  <li key={i} className="flex gap-3 text-[#888] font-body">
                    <span className="shrink-0" style={{ color: `${project.accent}88` }}>—</span>
                    {d}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.whatDidntWork && (
            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">What didn&apos;t work.</h2>
              <p className="text-[#888] font-body leading-relaxed">{project.whatDidntWork}</p>
            </section>
          )}

          {project.outcome && (
            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">The outcome.</h2>
              <p className="text-[#888] font-body leading-relaxed">{project.outcome}</p>
            </section>
          )}

          {project.whatIdDoDifferently && (
            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">What I&apos;d do differently.</h2>
              <p className="text-[#888] font-body leading-relaxed">{project.whatIdDoDifferently}</p>
            </section>
          )}
        </div>

        {/* Next project */}
        {nextProject.slug !== project.slug && (
          <div className="border-t border-white/[0.08] pt-12 mt-16">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#444] mb-3">Next case study</p>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="font-display font-bold text-2xl text-[#555] hover:text-white transition-colors"
            >
              {nextProject.title} →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
