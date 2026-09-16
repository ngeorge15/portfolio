import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé for ${site.name}, ${site.role}.`,
  ...(site.url ? { alternates: { canonical: "/resume" } } : {}),
};

/* Built from the same content the rest of the site uses, so it cannot drift
   out of date the way a checked-in PDF does. A download is offered only
   once a current file exists; the newest one on disk predates the Societies
   Insurance role, so linking it would publish something already wrong. */
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-[840px] px-5 py-12 sm:px-8 sm:py-16">
      <header>
        <h1 className="text-[32px] sm:text-[38px]">{site.name}</h1>
        <p className="mt-2 text-[17px] text-text-2">{site.role}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
          <li>
            <a href={`mailto:${site.email}`} className="link-underline">
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.github} className="link-underline">
              github.com/ngeorge15
            </a>
          </li>
          <li>
            <a href={site.linkedin} className="link-underline">
              linkedin.com/in/nikhil-george01
            </a>
          </li>
        </ul>

        {site.resume.available ? (
          <p className="mt-6">
            <a
              href={site.resume.href}
              className="inline-flex min-h-11 items-center rounded-sm border border-border px-5 text-[15px] font-medium transition-colors duration-200 hover:border-teal"
            >
              Download PDF
            </a>
          </p>
        ) : (
          <p className="mt-6 rounded-sm border border-dashed border-border px-4 py-3 text-[14px] text-text-2">
            A downloadable PDF is not linked yet. This page is generated from
            the same content as the rest of the site, so it always reflects
            current roles.
          </p>
        )}
      </header>

      <section className="mt-12">
        <h2 className="border-b border-border pb-2 text-[20px]">Experience</h2>
        <ol className="mt-6 space-y-8">
          {experience.map((r) => (
            <li key={`${r.org}-${r.title}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-[17px]">
                  {r.title}, {r.org}
                </h3>
                <p className="font-mono text-[12px] text-text-2">
                  {r.start} &ndash; {r.end ?? "Present"}
                </p>
              </div>
              <p className="mt-1.5 text-[15px] text-text-2">{r.summary}</p>
              {r.points.length > 0 && (
                <ul className="mt-2.5 space-y-1.5 text-[15px]">
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
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="border-b border-border pb-2 text-[20px]">Education</h2>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="text-[17px]">
            University of Washington, Computer Science
          </h3>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="border-b border-border pb-2 text-[20px]">Projects</h2>
        <ul className="mt-6 space-y-6">
          {projects.map((p) => (
            <li key={p.slug}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[17px]">{p.title}</h3>
                <Link
                  href={`/work/${p.slug}`}
                  className="link-underline text-[14px] text-teal-text"
                >
                  Case study
                </Link>
              </div>
              <p className="mt-1.5 text-[15px] text-text-2">{p.value}</p>
              <p className="mt-1.5 text-[15px]">{p.proof}</p>
              <p className="mt-1.5 font-mono text-[12px] text-text-2">
                {p.tech.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
