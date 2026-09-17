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
const anchors = [["overview", "Overview"], ["problem", "Problem"], ["constraints", "Constraints"], ["architecture", "Architecture"], ["decisions", "Decisions"], ["implementation", "Implementation"], ["validation", "Validation"], ["results", "Results"], ["limitations", "Limitations"]];

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = getProject(slug); const study = project ? getCaseStudy(slug) : undefined; if (!project || !study) notFound();
  const index = projects.findIndex((p) => p.slug === slug); const previous = projects[index - 1]; const next = projects[index + 1];
  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, abstract: project.value, author: { "@type": "Person", name: site.name }, ...(project.repo ? { codeRepository: project.repo } : {}), keywords: project.tech.join(", ") };
  return <article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header id="overview" className={`${wrap} scroll-mt-24 py-12 sm:py-16`}><Link href="/#work" className="link-underline text-[14px] text-text-muted">← Selected systems</Link><div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-20"><div><p className="field-note text-accent-secondary">Case study / {project.visual}</p><h1 className="mt-3 text-[42px] sm:text-[60px]">{project.title}</h1><p className={`${prose} mt-5 text-text-muted`}>{project.value}</p></div><dl className="grid gap-4 border-l-2 border-accent pl-5 text-[15px]"><Meta label="Role" value={study.role} /><Meta label="Team" value={study.team} /><Meta label="Stack" value={project.tech.join(" · ")} /><Meta label="Evidence" value={project.proof} /></dl></div><div className="mt-10 max-w-[760px]"><ProjectVisual type={project.visual} /></div></header>
    <div className="border-y border-border bg-surface/60"><div className={`${wrap} flex gap-5 overflow-x-auto py-3 text-[13px] text-text-muted lg:sticky lg:top-[65px] lg:z-20 lg:bg-surface/95`}>{anchors.map(([id, label]) => <a key={id} href={`#${id}`} className="shrink-0 hover:text-accent">{label}</a>)}</div></div>
    <Section id="problem" title="Problem"><p className={prose}>{study.problem}</p></Section>
    <Section id="constraints" title="Constraints" tint><ul className="measure space-y-3 text-[16px]">{study.constraints.map((c) => <Bullet key={c}>{c}</Bullet>)}</ul></Section>
    <Section id="architecture" title="Architecture"><p className={`${prose} text-text-muted`}>{study.architecture.summary}</p><ol className="mt-8 grid gap-0 border-y border-border sm:grid-cols-2">{study.architecture.steps.map((s, i) => <li key={s.name} className="border-b border-border p-5 last:border-b-0 sm:nth-[odd]:border-r sm:nth-[-n+2]:border-b"><span className="field-note text-text-muted">Stage 0{i + 1}</span><h3 className="mt-2 text-[20px]">{s.name}</h3><p className="mt-2 text-[15px] text-text-muted">{s.detail}</p></li>)}</ol></Section>
    <Section id="decisions" title="Engineering decisions" tint><div className="grid gap-10 lg:grid-cols-2">{study.decisions.map((d) => <section key={d.title}><p className="field-note text-accent-secondary">Decision</p><h3 className="mt-2 text-[21px]">{d.title}</h3><p className="mt-3 text-[15px] text-text-muted">{d.problem}</p><p className="mt-4 border-l-2 border-accent pl-4 text-[15px]"><strong>Chose:</strong> {d.chose}</p><p className="mt-3 text-[14px] text-text-muted"><strong>Tradeoff:</strong> {d.cost}</p></section>)}</div></Section>
    <Section id="implementation" title="Implementation"><div className="measure space-y-9">{study.implementation.map((n) => <section key={n.title}><h3 className="text-[21px]">{n.title}</h3><p className={`${prose} mt-2 text-text-muted`}>{n.body}</p></section>)}</div></Section>
    <Section id="validation" title="Testing and validation" tint><p className={`${prose} text-text-muted`}>{study.validation.summary}</p><dl className="mt-8 divide-y divide-border border-y border-border">{study.validation.metrics.map((m) => <div key={m.label} className="grid gap-2 py-4 sm:grid-cols-[1fr_1fr]"><dt>{m.label}</dt><dd>{m.value ? <span className="font-mono text-[15px] text-accent">{m.value}</span> : <span className="inline-block border border-dashed border-text-muted px-2 py-0.5 text-[13px] text-text-muted">Not yet measured</span>}{m.note && <p className="mt-1 text-[14px] text-text-muted">{m.note}</p>}</dd></div>)}</dl></Section>
    <Section id="results" title="Results"><ul className="measure space-y-3 text-[16px]">{study.results.map((r) => <Bullet key={r} accent>{r}</Bullet>)}</ul></Section>
    <Section id="limitations" title="Known limitations" tint><div className="measure border-l-2 border-blossom pl-5"><ul className="space-y-3 text-[16px] text-text-muted">{study.limitations.map((l) => <Bullet key={l}>{l}</Bullet>)}</ul></div></Section>
    <section className={`${wrap} border-t border-border py-12`}><ul className="flex justify-between gap-5 text-[15px]">{previous ? <li><span className="field-note block text-text-muted">Previous</span><Link className="link-underline text-accent" href={`/work/${previous.slug}`}>← {previous.title}</Link></li> : <li />}{next ? <li className="text-right"><span className="field-note block text-text-muted">Next</span><Link className="link-underline text-accent" href={`/work/${next.slug}`}>{next.title} →</Link></li> : <li />}</ul></section>
  </article>;
}

function Meta({ label, value }: { label: string; value: string }) { return <div><dt className="field-note text-text-muted">{label}</dt><dd className="mt-1">{value}</dd></div>; }
function Section({ id, title, children, tint }: { id: string; title: string; children: React.ReactNode; tint?: boolean }) { return <section id={id} className={`scroll-mt-24 border-t border-border ${tint ? "bg-surface/60" : ""}`}><div className={`${wrap} py-12 sm:py-16`}><h2 className="text-[34px] sm:text-[40px]">{title}</h2><div className="mt-6">{children}</div></div></section>; }
function Bullet({ children, accent }: { children: React.ReactNode; accent?: boolean }) { return <li className="flex gap-3"><span aria-hidden="true" className={`mt-3 size-1.5 shrink-0 rounded-full ${accent ? "bg-accent" : "bg-text-muted/60"}`} />{children}</li>; }
