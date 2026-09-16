import Link from "next/link";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { about, credibility, experience } from "@/content/experience";
import { ProjectCard } from "@/components/ProjectCard";
import { FlowDiagram } from "@/components/FlowDiagram";

/* The path this work tends to follow, and the organising idea of the site.
   Legible with no animation; the dot is decoration on top. */
const pipeline = [
  { name: "Sensor", detail: "measure" },
  { name: "Firmware", detail: "batch" },
  { name: "Cloud", detail: "ingest" },
  { name: "Application", detail: "decide" },
];

const section = "mx-auto max-w-[1200px] px-5 sm:px-8";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url || undefined,
  sameAs: [site.github, site.linkedin],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Washington",
  },
  worksFor: experience
    .filter((r) => r.end === null)
    .map((r) => ({ "@type": "Organization", name: r.org })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className={`${section} pt-14 pb-16 sm:pt-20 sm:pb-20`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="text-[34px] leading-[1.12] sm:text-[44px] lg:text-[50px]">
              {site.headline}
            </h1>
            <p className="measure mt-5 text-[17px] text-text-2 sm:text-[18px]">
              {site.supporting}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#work"
                className="inline-flex min-h-11 items-center rounded-sm bg-text px-5 text-[15px] font-medium text-bg transition-opacity duration-200 hover:opacity-90"
              >
                View work
              </Link>
              <Link
                href="/resume"
                className="inline-flex min-h-11 items-center rounded-sm border border-border px-5 text-[15px] font-medium transition-colors duration-200 hover:border-teal"
              >
                Résumé
              </Link>
              <a
                href={site.github}
                className="inline-flex min-h-11 items-center rounded-sm border border-border px-5 text-[15px] font-medium transition-colors duration-200 hover:border-teal"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border border-border bg-surface p-5">
              <FlowDiagram
                steps={pipeline}
                title="How this work usually flows"
                animate
                className="h-auto w-full"
              />
              <p className="mt-3 text-center font-mono text-[12px] text-text-2">
                sensor to screen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Credibility ──────────────────────────────────────────────── */}
      <section
        aria-label="Selected results"
        className="border-y border-border bg-surface/50"
      >
        <div className={`${section} py-10`}>
          <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {credibility.map((c) => (
              <li key={c.label}>
                <p className="font-mono text-[26px] font-semibold tracking-tight text-teal-text">
                  {c.figure}
                </p>
                <p className="mt-1 text-[14px] text-text-2">{c.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Work ─────────────────────────────────────────────────────── */}
      <section id="work" className={`${section} scroll-mt-20 py-16 sm:py-20`}>
        <h2 className="text-[26px] sm:text-[30px]">Selected work</h2>
        <p className="measure mt-3 text-[16px] text-text-2">
          Each visual is an architecture diagram of the system described, not a
          product screenshot.
        </p>
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <section
        id="experience"
        className="scroll-mt-20 border-t border-border bg-surface/50"
      >
        <div className={`${section} py-16 sm:py-20`}>
          <h2 className="text-[26px] sm:text-[30px]">Experience</h2>
          <ol className="mt-9 space-y-10">
            {experience.map((r) => (
              <li
                key={`${r.org}-${r.title}`}
                className="grid gap-x-10 gap-y-3 md:grid-cols-12"
              >
                <div className="md:col-span-4">
                  <h3 className="text-[18px]">{r.org}</h3>
                  <p className="text-[15px] text-text-2">{r.title}</p>
                  <p className="mt-1 font-mono text-[12px] text-text-2">
                    {r.start} &ndash; {r.end ?? "Present"}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <p className="measure text-[16px]">{r.summary}</p>
                  {r.points.length > 0 && (
                    <ul className="measure mt-3 space-y-2 text-[15px] text-text-2">
                      {r.points.map((p) => (
                        <li key={p} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1 shrink-0 rounded-full bg-teal"
                          />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className={`${section} scroll-mt-20 py-16 sm:py-20`}>
        <h2 className="text-[26px] sm:text-[30px]">About</h2>
        <div className="measure mt-6 space-y-4 text-[17px]">
          {about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="scroll-mt-20 border-t border-border bg-surface/50"
      >
        <div className={`${section} py-16 sm:py-20`}>
          <h2 className="text-[26px] sm:text-[30px]">Contact</h2>
          <p className="measure mt-4 text-[17px] text-text-2">
            {site.availability}
          </p>
          <ul className="mt-7 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:max-w-3xl">
            <ContactRow
              label="Email"
              href={`mailto:${site.email}`}
              value={site.email}
            />
            <ContactRow
              label="LinkedIn"
              href={site.linkedin}
              value="nikhil-george01"
            />
            <ContactRow label="GitHub" href={site.github} value="ngeorge15" />
            <ContactRow
              label="Résumé"
              href="/resume"
              value="View résumé"
              internal
            />
          </ul>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  label,
  href,
  value,
  internal,
}: {
  label: string;
  href: string;
  value: string;
  internal?: boolean;
}) {
  const cls =
    "link-underline inline-flex min-h-11 items-center text-[16px] transition-colors duration-200 hover:text-teal-text";
  return (
    <li className="flex flex-col">
      <span className="font-mono text-[12px] text-text-2">{label}</span>
      {internal ? (
        <Link href={href} className={cls}>
          {value}
        </Link>
      ) : (
        <a href={href} className={cls}>
          {value}
        </a>
      )}
    </li>
  );
}
