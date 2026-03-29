import { projects } from "@/data/projects";
import ProjectRow from "@/components/ProjectRow";

export default function ProjectsPage() {
  return (
    <main className="pt-24 px-6 md:px-16 min-h-screen">
      <h1 className="font-display font-bold text-6xl text-white mb-4 mt-8">All work.</h1>
      <p className="text-[#888] font-body mb-16">Every project. Complete record.</p>
      {projects.map((project, i) => (
        <ProjectRow key={project.id} project={project} index={i} />
      ))}
    </main>
  );
}
