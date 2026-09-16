import Link from "next/link";
import { nav, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-sm border border-border font-mono text-[11px] text-teal-text"
          >
            {site.monogram}
          </span>
          <span className="hidden sm:inline">{site.name}</span>
          <span className="sr-only sm:hidden">{site.name}</span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-0.5 sm:gap-1"
        >
          <ul className="hidden items-center gap-0.5 md:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex min-h-11 items-center rounded-sm px-3 text-[15px] text-text-2 transition-colors duration-200 hover:text-teal-text"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
