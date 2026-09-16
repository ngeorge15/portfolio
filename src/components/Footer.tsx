import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-8 text-[15px] text-text-2 sm:px-8">
        <p>
          {site.name}, {new Date().getFullYear()}
        </p>
        <ul className="flex flex-wrap items-center gap-x-6">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="link-underline transition-colors duration-200 hover:text-teal-text"
            >
              {site.email}
            </a>
          </li>
          <li>
            <a
              href={site.github}
              className="link-underline transition-colors duration-200 hover:text-teal-text"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={site.linkedin}
              className="link-underline transition-colors duration-200 hover:text-teal-text"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <Link
              href="/resume"
              className="link-underline transition-colors duration-200 hover:text-teal-text"
            >
              Résumé
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
