import Link from "next/link";
import type { Project } from "@/content/projects";
import { caseStudies } from "@/content/case-studies";
import { FlowDiagram } from "./FlowDiagram";

export function ProjectCard({ project }: { project: Project }) {
  const study = caseStudies[project.slug];
  const steps = study.architecture.steps.map((s) => ({ name: s.name }));

  return (
    <article className="card-lift flex flex-col overflow-hidden rounded-card border border-border bg-surface">
      {/* Architecture visual, generated from this project's own documented
          pipeline. It carries information the card text does not, so it is
          labelled rather than treated as decorative. */}
      <div className="border-b border-border bg-bg/60 p-4">
        <FlowDiagram
          steps={steps}
          title={`${project.title} architecture`}
          className="h-auto w-full"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-[19px]">
            <Link
              href={`/work/${project.slug}`}
              className="transition-colors duration-200 hover:text-teal-text"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-[15px] text-text-2">{project.value}</p>
        </div>

        <dl className="space-y-1.5 text-[14px]">
          <div className="flex gap-2">
            <dt className="shrink-0 text-text-2">Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>

        {/* The proof point is the one checkable claim on the card. */}
        <p className="flex items-start gap-2 rounded-sm border border-border bg-bg/60 px-3 py-2 text-[14px]">
          <CheckIcon />
          <span>{project.proof}</span>
        </p>

        <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] text-text-2">
          {project.tech.slice(0, 4).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-[15px]">
          <Link
            href={`/work/${project.slug}`}
            className="link-underline font-medium text-teal-text"
          >
            Case study
          </Link>
          {project.repo && (
            <a href={project.repo} className="link-underline text-text-2">
              GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} className="link-underline text-text-2">
              Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 shrink-0 text-teal-text"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
