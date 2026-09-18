import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { getCaseStudy } from "@/content/case-studies";
import { ProjectVisual } from "@/components/project-visuals";
import { site } from "@/content/site";

export function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = getProject(slug); if (!project) return {};
  return { title: project.title, description: project.value, openGraph: { title: project.title, description: project.value }, ...(site.url ? { alternates: { canonical: `/work/${slug}` } } : {}) };
}

const wrap = "mx-auto max-w-[1200px] px-5 sm:px-8";
const prose = "measure text-[17px] leading-[1.75]";

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = getProject(slug); const study = project ? getCaseStudy(slug) : undefined; if (!project || !study) notFound();
  const index = projects.findIndex((p) => p.slug === slug); const previous = projects[index - 1]; const next = projects[index + 1];
  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, abstract: project.value, author: { "@type": "Person", name: site.name }, ...(project.repo ? { codeRepository: project.repo } : {}), keywords: project.tech.join(", ") };
  return <article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header className={`${wrap} py-10 sm:py-14`}><Link href="/#projects" className="link-underline text-[14px] text-text-muted">← Featured projects</Link><div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-16"><div><p className="field-note text-accent">Project case study</p><h1 className="mt-3 text-[38px] sm:text-[54px]">{project.title}</h1><p className={`${prose} mt-4 text-text-muted`}>{project.value}</p></div><dl className="grid gap-3 border-l-2 border-accent pl-5 text-[15px]"><Meta label="Owned" value={study.role} /><Meta label="Team" value={study.team} /><Meta label="Stack" value={project.tech.join(" · ")} /><Meta label="Proof" value={project.proof} /></dl></div><div className="mt-8 max-w-[760px]"><ProjectVisual type={project.visual} /></div></header>
    <Section title="Overview"><p className={prose}>{study.overview}</p></Section>
    <Section title="What I owned"><div className="grid gap-8 sm:grid-cols-2"><div><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">Role</p><p className="mt-2 text-[16px]">{study.role}</p></div><div><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">Team</p><p className="mt-2 text-[16px]">{study.team}</p></div></div></Section>
    <Section title="Engineering challenges and decisions" tint><div className="grid gap-9 lg:grid-cols-2"><div><h3 className="text-[21px]">Constraints</h3><ul className="mt-4 space-y-3 text-[15px] text-text-muted">{study.constraints.map((c) => <Bullet key={c}>{c}</Bullet>)}</ul></div><div className="space-y-8">{study.decisions.map((d) => <section key={d.title}><h3 className="text-[20px]">{d.title}</h3><p className="mt-2 text-[15px] text-text-muted">{d.problem}</p><p className="mt-3 border-l-2 border-accent pl-4 text-[15px]"><strong>Chose:</strong> {d.chose}</p><p className="mt-2 text-[14px] text-text-muted"><strong>Tradeoff:</strong> {d.cost}</p></section>)}</div></div></Section>
    <Section title="Implementation and architecture"><p className={`${prose} text-text-muted`}>{study.architecture.summary}</p><ol className="mt-7 grid gap-0 border-y border-border sm:grid-cols-2">{study.architecture.steps.map((s, i) => <li key={s.name} className="border-b border-border p-5 sm:[&:nth-child(odd)]:border-r"><span className="field-note text-text-muted">Stage 0{i + 1}</span><h3 className="mt-2 text-[20px]">{s.name}</h3><p className="mt-2 text-[15px] text-text-muted">{s.detail}</p></li>)}</ol><div className="measure mt-10 space-y-8">{study.implementation.map((n) => <section key={n.title}><h3 className="text-[20px]">{n.title}</h3><p className={`${prose} mt-2 text-text-muted`}>{n.body}</p></section>)}</div></Section>
    <Section title="Results, validation, and limitations" tint><ul className="measure space-y-3 text-[16px]">{study.results.map((r) => <Bullet key={r} accent>{r}</Bullet>)}</ul><div className="mt-10 border-t border-border pt-8"><h3 className="text-[21px]">Validation</h3><p className={`${prose} mt-3 text-text-muted`}>{study.validation.summary}</p><dl className="mt-6 divide-y divide-border border-y border-border">{study.validation.metrics.map((m) => <div key={m.label} className="grid gap-2 py-4 sm:grid-cols-[1fr_1fr]"><dt>{m.label}</dt><dd>{m.value ? <span className="font-mono text-[15px] text-accent">{m.value}</span> : <span className="inline-block border border-dashed border-text-muted px-2 py-0.5 text-[13px] text-text-muted">Not yet measured</span>}{m.note && <p className="mt-1 text-[14px] text-text-muted">{m.note}</p>}</dd></div>)}</dl></div><div className="mt-10 border-t border-border pt-8"><h3 className="text-[21px]">Limitations</h3><ul className="measure mt-4 space-y-3 text-[16px] text-text-muted">{study.limitations.map((l) => <Bullet key={l}>{l}</Bullet>)}</ul></div></Section>
    <section className={`${wrap} border-t border-border py-10`}><ul className="flex justify-between gap-5 text-[15px]">{previous ? <li><span className="field-note block text-text-muted">Previous</span><Link className="link-underline text-accent" href={`/work/${previous.slug}`}>← {previous.title}</Link></li> : <li />}{next ? <li className="text-right"><span className="field-note block text-text-muted">Next</span><Link className="link-underline text-accent" href={`/work/${next.slug}`}>{next.title} →</Link></li> : <li />}</ul></section>
  </article>;
}

function Meta({ label, value }: { label: string; value: string }) { return <div><dt className="field-note text-text-muted">{label}</dt><dd className="mt-1">{value}</dd></div>; }
function Section({ title, children, tint }: { title: string; children: React.ReactNode; tint?: boolean }) { return <section className={`border-t border-border ${tint ? "bg-surface" : ""}`}><div className={`${wrap} py-10 sm:py-14`}><h2 className="text-[30px] sm:text-[38px]">{title}</h2><div className="mt-5">{children}</div></div></section>; }
function Bullet({ children, accent }: { children: React.ReactNode; accent?: boolean }) { return <li className="flex gap-3"><span aria-hidden="true" className={`mt-3 size-1.5 shrink-0 rounded-full ${accent ? "bg-accent" : "bg-text-muted/60"}`} />{children}</li>; }
