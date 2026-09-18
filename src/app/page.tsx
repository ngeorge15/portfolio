import Link from "next/link";
import { site } from "@/content/site";
import { getProject, projects } from "@/content/projects";
import { about, education, experience, skills } from "@/content/experience";
import { getCaseStudy } from "@/content/case-studies";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectVisual } from "@/components/project-visuals";

const section = "mx-auto max-w-[1180px] px-5 sm:px-8";
const featuredSlugs = ["smart-ring", "ai-calorie-counter"] as const;
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url || undefined,
  sameAs: [site.github, site.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Washington" },
  worksFor: experience.filter((r) => r.end === null).map((r) => ({ "@type": "Organization", name: r.org })),
};

export default function Home() {
  const gnome = getProject("gnome");
  const featured = featuredSlugs.map((slug) => getProject(slug)).filter((project) => project !== undefined);
  const otherProjects = projects.filter((project) => project.slug === "prediction-market-bot");
  const gnomeStudy = getCaseStudy("gnome");
  if (!gnome || !gnomeStudy) return null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <section className={`${section} hero-glow relative min-h-[calc(100svh-65px)] overflow-hidden py-20 sm:py-28 lg:flex lg:items-center lg:py-32`}>
        <div className="pointer-events-none absolute -right-20 top-12 size-[420px] rounded-full bg-accent opacity-10 blur-3xl" aria-hidden="true" />
        <div className="relative grid w-full max-w-[1100px] gap-12 lg:grid-cols-[1fr_330px] lg:items-center">
        <div>
          <p className="hero-rise field-note text-accent">Hi, I’m</p>
          <h1 className="hero-rise-delay mt-3 text-[52px] sm:text-[76px] lg:text-[92px]">{site.name}</h1>
          <p className="hero-rise-delay mt-3 text-[21px] text-text-muted sm:text-[28px]">{site.role}</p>
          <p className="hero-rise-delay-2 measure mt-7 text-[17px] leading-[1.75] text-text-muted sm:text-[19px]">{site.heroDescription}</p>
          <div className="hero-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="#projects" className="inline-flex min-h-11 items-center rounded-sm bg-accent px-5 text-[15px] font-medium text-background hover:opacity-85">View my work</Link>
            <Link href="/resume" className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-5 text-[15px] hover:border-accent">Résumé</Link>
            <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-5 text-[15px] hover:border-accent">Email me</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-[14px] text-text-muted">
            <a className="link-underline hover:text-accent" href={site.github}>GitHub ↗</a>
            <a className="link-underline hover:text-accent" href={site.linkedin}>LinkedIn ↗</a>
            <span className="font-mono text-[11px] text-text-subtle">{site.availability}</span>
          </div>
        </div>
        <HeroPanel project={gnome} />
        </div>
      </section>

      <section id="experience" className="border-t border-border bg-background-secondary">
        <div className={`${section} py-16 sm:py-20`}>
          <SectionIntro number="01" eyebrow="Experience" title="Where I’ve worked" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
            <div className="border-l border-border pl-5"><p className="font-mono text-[12px] text-accent">Current and recent</p><p className="mt-3 text-[14px] leading-7 text-text-muted">Software, research, and product work across the stack.</p></div>
            <ol className="relative divide-y divide-border border-y border-border pl-7 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-border">
              {experience.map((role) => <li key={`${role.org}-${role.title}`} className="relative py-7 first:pt-6 last:pb-6"><span className="absolute -left-[27px] top-8 size-3 rounded-full border-2 border-accent bg-background-secondary" /><div className="flex flex-wrap items-baseline justify-between gap-2"><div><h3 className="text-[21px]">{role.title}</h3><p className="mt-1 text-[15px] text-accent">{role.org}</p></div><p className="font-mono text-[11px] text-text-subtle">{role.start} — {role.end ?? "Present"}</p></div><p className="measure mt-4 text-[15px] text-text-muted">{role.summary}</p><ul className="measure mt-3 space-y-2 text-[14px] text-text-muted">{role.points.slice(0, 3).map((point) => <li key={point} className="flex gap-3"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />{point}</li>)}</ul></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section id="projects" className={`${section} scroll-mt-20 py-16 sm:py-20`}>
        <SectionIntro number="02" eyebrow="Projects" title="Things I’ve built" />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">{featured.map((project, index) => <ProjectCard key={project.slug} project={project} compact={index === 1} reverse={index === 1} />)}</div>
        {otherProjects.length > 0 && <div className="mt-12"><p className="font-mono text-[12px] text-text-subtle">Other work</p><div className="mt-4 max-w-[760px]">{otherProjects.map((project) => <ProjectCard key={project.slug} project={project} compact />)}</div></div>}
      </section>

      <section id="gnome" className="scroll-mt-20 border-y border-border bg-background-secondary">
        <div className={`${section} py-16 sm:py-24`}>
          <SectionIntro number="03" eyebrow="Gnome" title="Connected plant care across hardware, cloud, and software" />
          <div className="surface-glow mt-10 overflow-hidden rounded-card border border-border-strong p-5 shadow-[var(--shadow)] sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
              <div><p className="font-mono text-[12px] text-accent">{gnome.proof}</p><h3 className="mt-4 text-[29px]">{gnome.title}</h3><p className="measure mt-3 text-[16px] text-text-muted">{gnome.value}</p><dl className="mt-7 grid gap-4 sm:grid-cols-3">{gnome.stats?.map((stat) => <div key={stat.label}><dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-subtle">{stat.label}</dt><dd className="mt-1 text-[18px] font-medium text-accent">{stat.value}</dd></div>)}</dl><div className="mt-8"><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-subtle">My role</p><p className="mt-2 text-[15px] text-text-muted">{gnome.role}</p></div></div>
              <ProjectVisual type="gnome" />
            </div>
            <div className="mt-10 border-t border-border pt-8"><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-subtle">Architecture</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{gnomeStudy.architecture.steps.map((step, index) => <div key={step.name} className="border-l-2 border-accent pl-4"><span className="font-mono text-[10px] text-text-subtle">0{index + 1}</span><h4 className="mt-2 text-[16px]">{step.name}</h4><p className="mt-1 text-[13px] text-text-muted">{step.detail}</p></div>)}</div></div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6"><ul className="flex flex-wrap gap-3 font-mono text-[11px] text-text-subtle">{gnome.tech.map((tech) => <li key={tech}>{tech}</li>)}</ul><Link href="/work/gnome" className="link-underline ml-auto text-[14px] text-accent">View Gnome case study →</Link></div>
          </div>
        </div>
      </section>

      <section id="skills" className={`${section} scroll-mt-20 py-16 sm:py-20`}><SectionIntro number="04" eyebrow="Skills" title="Tech stack" /><div className="mt-9 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2">{Object.entries(skills).map(([group, values]) => <div key={group} className="bg-surface p-5 sm:p-6"><h3 className="text-[16px]">{group}</h3><p className="mt-3 text-[14px] leading-7 text-text-muted">{values.join(" · ")}</p></div>)}</div></section>

      <section id="education" className={`${section} scroll-mt-20 border-t border-border bg-background-secondary py-16 sm:py-20`}><SectionIntro number="05" eyebrow="Education" title="University of Washington" /><div className="mt-8 grid gap-4 sm:grid-cols-3"><div><p className="text-[17px]">{education.degree}</p><p className="mt-1 text-[14px] text-text-muted">{education.dates}</p></div><p className="text-[14px] text-text-muted">{education.location}</p><p className="text-[14px] text-text-muted">{education.coursework.join(" · ")}</p></div></section>

      <section id="about" className={`${section} scroll-mt-20 py-16 sm:py-20`}><SectionIntro number="06" eyebrow="About" title="Beyond the code" /><div className="measure mt-7 space-y-3 text-[17px] text-text-muted">{about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>

      <section id="contact" className="border-t border-border"><div className={`${section} py-16 sm:py-20`}><p className="font-mono text-[12px] text-accent">Let’s connect</p><h2 className="mt-3 text-[35px] sm:text-[48px]">Let’s talk about software.</h2><p className="mt-4 text-[16px] text-text-muted">{site.availability}</p><div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[15px]"><a className="link-underline text-accent" href={`mailto:${site.email}`}>Email</a><a className="link-underline text-accent" href={site.linkedin}>LinkedIn</a><a className="link-underline text-accent" href={site.github}>GitHub</a><Link className="link-underline text-accent" href="/resume">Résumé</Link></div></div></section>
    </>
  );
}

function SectionIntro({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) { return <div><p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">{number}. {eyebrow}</p><h2 className="mt-3 text-[34px] sm:text-[46px]">{title}</h2><div className="edge-line mt-6" /></div>; }

function HeroPanel({ project }: { project: NonNullable<ReturnType<typeof getProject>> }) {
  const rows = [
    ["Embedded", project.tech[0]],
    ["Cloud", "AWS Lambda"],
    ["Data", "MySQL"],
    ["Product", "React + TypeScript"],
  ];
  return <div className="surface-glow rounded-card border border-border-strong p-5 shadow-[var(--shadow)] lg:mt-10"><div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-subtle">Current focus</span><span className="size-2 rounded-full bg-accent shadow-[0_0_14px_var(--accent)]" /></div><p className="mt-5 text-[20px] font-medium">Gnome</p><p className="mt-1 text-[13px] text-text-muted">Connected plant care</p><dl className="mt-6 divide-y divide-border border-y border-border">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-3"><dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-subtle">{label}</dt><dd className="text-right text-[13px] text-text-muted">{value}</dd></div>)}</dl><p className="mt-5 font-mono text-[10px] text-accent">1st place · $20K</p></div>;
}
