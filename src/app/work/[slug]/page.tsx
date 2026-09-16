import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { getCaseStudy } from "@/content/case-studies";
import { FlowDiagram } from "@/components/FlowDiagram";
import { site } from "@/content/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.value,
    openGraph: { title: project.title, description: project.value },
    ...(site.url ? { alternates: { canonical: `/work/${slug}` } } : {}),
  };
}

const wrap = "mx-auto max-w-[1200px] px-5 sm:px-8";
const prose = "measure text-[17px]";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const study = project ? getCaseStudy(slug) : undefined;
  if (!project || !study) notFound();

  return (
    <article>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className={`${wrap} pt-10 pb-12 sm:pt-14`}>
        <nav aria-label="Breadcrumb" className="mb-6 text-[14px]">
          <Link href="/#work" className="link-underline text-text-2">
            Work
          </Link>
        </nav>

        <h1 className="text-[32px] sm:text-[40px]">{project.title}</h1>
        <p className={`${prose} mt-5 text-text-2`}>{study.overview}</p>

        <dl className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:max-w-3xl">
          <div>
            <dt className="font-mono text-[12px] text-text-2">Role</dt>
            <dd className="mt-1 text-[15px]">{study.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[12px] text-text-2">Team</dt>
            <dd className="mt-1 text-[15px]">{study.team}</dd>
          </div>
        </dl>

        {(project.repo || project.demo) && (
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            {project.repo && (
              <a href={project.repo} className="link-underline text-teal-text">
                View source on GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} className="link-underline text-teal-text">
                Live demo
              </a>
            )}
          </p>
        )}
      </header>

      {/* ── Problem ──────────────────────────────────────────────────── */}
      <Section title="Problem">
        <p className={prose}>{study.problem}</p>
      </Section>

      {/* ── Constraints ──────────────────────────────────────────────── */}
      <Section title="Constraints" tinted>
        <ul className="measure space-y-3 text-[16px]">
          {study.constraints.map((c) => (
            <Bullet key={c}>{c}</Bullet>
          ))}
        </ul>
      </Section>

      {/* ── Architecture ─────────────────────────────────────────────── */}
      <Section title="Architecture">
        <p className={`${prose} text-text-2`}>{study.architecture.summary}</p>
        <div className="mt-8 rounded-card border border-border bg-surface p-5">
          <FlowDiagram
            steps={study.architecture.steps.map((s) => ({ name: s.name }))}
            title={`${project.title} architecture`}
            className="h-auto w-full"
          />
        </div>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2">
          {study.architecture.steps.map((s, i) => (
            <li
              key={s.name}
              className="rounded-card border border-border bg-surface p-5"
            >
              <p className="font-mono text-[12px] text-text-2">Stage {i + 1}</p>
              <h3 className="mt-1 text-[17px]">{s.name}</h3>
              <p className="mt-2 text-[15px] text-text-2">{s.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Decisions and tradeoffs ──────────────────────────────────── */}
      <Section title="Engineering decisions" tinted>
        <p className={`${prose} text-text-2`}>
          Every decision below carries what it cost. A choice with no downside
          is usually one that has not been examined closely enough.
        </p>
        <div className="mt-8 space-y-6">
          {study.decisions.map((d) => (
            <section
              key={d.title}
              className="rounded-card border border-border bg-surface p-5 sm:p-6"
            >
              <h3 className="text-[18px]">{d.title}</h3>
              <p className="measure mt-3 text-[15px] text-text-2">
                {d.problem}
              </p>

              <p className="mt-4 font-mono text-[12px] text-text-2">
                Options considered
              </p>
              <ul className="measure mt-2 space-y-1.5 text-[15px]">
                {d.options.map((o) => (
                  <Bullet key={o}>{o}</Bullet>
                ))}
              </ul>

              <p className="mt-4 font-mono text-[12px] text-teal-text">Chose</p>
              <p className="measure mt-2 text-[15px]">{d.chose}</p>

              <p className="mt-4 font-mono text-[12px] text-text-2">Tradeoff</p>
              <p className="measure mt-2 text-[15px] text-text-2">{d.cost}</p>
            </section>
          ))}
        </div>
      </Section>

      {/* ── Implementation ───────────────────────────────────────────── */}
      <Section title="Implementation">
        <div className="mt-2 space-y-8">
          {study.implementation.map((n) => (
            <div key={n.title}>
              <h3 className="text-[18px]">{n.title}</h3>
              <p className={`${prose} mt-2 text-text-2`}>{n.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Validation ───────────────────────────────────────────────── */}
      <Section title="Testing and validation" tinted>
        <p className={`${prose} text-text-2`}>{study.validation.summary}</p>
        <dl className="mt-8 divide-y divide-border border-y border-border">
          {study.validation.metrics.map((m) => (
            <div
              key={m.label}
              className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-12"
            >
              <dt className="sm:col-span-5">
                <span className="text-[16px]">{m.label}</span>
              </dt>
              <dd className="sm:col-span-7">
                {m.value ? (
                  <span className="font-mono text-[16px] font-semibold text-teal-text tabular-nums">
                    {m.value}
                  </span>
                ) : (
                  /* Unmeasured renders as a visibly open slot rather than
                     being hidden or estimated. Not colour alone: the words
                     say so too. */
                  <span className="inline-block rounded-sm border border-dashed border-text-2/60 px-2 py-0.5 text-[13px] text-text-2">
                    Not yet measured
                  </span>
                )}
                {m.note && (
                  <p className="measure mt-1.5 text-[14px] text-text-2">
                    {m.note}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <Section title="Results">
        <ul className="measure space-y-3 text-[16px]">
          {study.results.map((r) => (
            <Bullet key={r} accent>
              {r}
            </Bullet>
          ))}
        </ul>
      </Section>

      {/* ── Limitations ──────────────────────────────────────────────── */}
      <Section title="Known limitations" tinted>
        <ul className="measure space-y-3 text-[16px] text-text-2">
          {study.limitations.map((l) => (
            <Bullet key={l}>{l}</Bullet>
          ))}
        </ul>
      </Section>

      {/* ── Technologies ─────────────────────────────────────────────── */}
      <Section title="Technologies">
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-sm border border-border bg-surface px-3 py-1 font-mono text-[13px] text-text-2"
            >
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[15px]">
          <Link href="/#work" className="link-underline text-teal-text">
            Back to all work
          </Link>
        </p>
      </Section>
    </article>
  );
}

function Section({
  title,
  children,
  tinted,
}: {
  title: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section
      className={
        tinted
          ? "border-t border-border bg-surface/50"
          : "border-t border-border"
      }
    >
      <div className={`${wrap} py-12 sm:py-16`}>
        <h2 className="text-[24px] sm:text-[27px]">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function Bullet({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className={`mt-2.5 size-1.5 shrink-0 rounded-full ${
          accent ? "bg-teal" : "bg-text-2/50"
        }`}
      />
      <span>{children}</span>
    </li>
  );
}
