import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectVisual } from "./project-visuals";

export function ProjectCard({ project, compact = false, reverse = false }: { project: Project; compact?: boolean; reverse?: boolean }) {
  return <article className={`card-lift overflow-hidden rounded-card border border-border bg-surface ${compact ? "flex flex-col" : "grid lg:grid-cols-[1.1fr_0.9fr]"} ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
    <ProjectVisual type={project.visual} compact={compact} />
    <div className={`flex flex-col gap-4 p-5 sm:p-7 ${compact ? "flex-1" : "justify-center"}`}>
      <div><p className="field-note text-accent-secondary">{compact ? "Supporting system" : "Featured system"}</p><h3 className="mt-2 text-[25px] sm:text-[29px]"><Link href={`/work/${project.slug}`} className="hover:text-accent">{project.title}</Link></h3><p className="measure mt-2 text-[15px] text-text-muted">{project.value}</p></div>
      <dl className="text-[14px]"><dt className="field-note text-text-muted">Role</dt><dd>{project.role}</dd></dl>
      <p className="border-l-2 border-accent px-3 text-[14px]">{project.proof}</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-text-muted">{project.tech.slice(0, 5).map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2 text-[15px]"><Link href={`/work/${project.slug}`} className="link-underline font-medium text-accent">Read case study</Link>{project.repo && <a href={project.repo} className="link-underline text-text-muted">GitHub</a>}</div>
    </div>
  </article>;
}
