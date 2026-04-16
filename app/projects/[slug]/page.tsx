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
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main className="pt-32 pb-24 px-6 md:px-16 max-w-4xl">
      <Link
        href="/projects"
        className="text-[#555] font-mono text-sm hover:text-signal transition-colors mb-8 inline-block"
      >
        ← Back
      </Link>

      {/* Large faded number */}
      <div className="relative">
        <span className="absolute -left-4 -top-8 font-display font-bold text-[200px] text-white/[0.05] leading-none select-none pointer-events-none">
          {project.id}
        </span>
      </div>

      <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-4 relative z-10">
        {project.title}
      </h1>
      <p className="text-[#888] font-body text-xl italic mb-8">{project.tagline}</p>

      <div className="flex flex-wrap items-center gap-3 mb-12">
        <span
          className="text-xs font-mono px-2 py-0.5 border"
          style={{ color: project.accent, borderColor: project.accent }}
        >
          {project.status}
        </span>
        <span className="text-xs font-mono text-[#555]">{project.year}</span>
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-xs font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-[#888]"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.github && (
        <div className="flex gap-4 mb-16">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-signal hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      )}

      <div className="border-t border-white/10 pt-12 space-y-16">
        {project.problem && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">The problem.</h2>
            <p className="text-[#888] font-body leading-relaxed">{project.problem}</p>
          </div>
        )}

        {project.approach && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">The approach.</h2>
            <p className="text-[#888] font-body leading-relaxed">{project.approach}</p>
          </div>
        )}

        {project.technicalDecisions && project.technicalDecisions.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">Technical decisions.</h2>
            <ul className="space-y-3">
              {project.technicalDecisions.map((d, i) => (
                <li key={i} className="flex gap-3 text-[#888] font-body">
                  <span className="text-signal shrink-0">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.whatDidntWork && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">What didn&apos;t work.</h2>
            <p className="text-[#888] font-body leading-relaxed">{project.whatDidntWork}</p>
          </div>
        )}

        {project.outcome && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">The outcome.</h2>
            <p className="text-[#888] font-body leading-relaxed">{project.outcome}</p>
          </div>
        )}

        {project.whatIdDoDifferently && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">What I&apos;d do differently.</h2>
            <p className="text-[#888] font-body leading-relaxed">{project.whatIdDoDifferently}</p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-12 mt-16">
        <Link
          href={`/projects/${nextProject.slug}`}
          className="font-display font-bold text-2xl text-[#555] hover:text-white transition-colors"
        >
          {nextProject.title} →
        </Link>
      </div>
    </main>
  );
}
