"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) firstLink.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-8 place-items-center rounded-sm border border-border-strong font-mono text-[11px] text-accent">{site.monogram}</span>
          <span className="hidden text-[15px] font-medium tracking-tight sm:inline">{site.name}</span>
        </Link>
        <div className="flex items-center">
          <nav aria-label="Primary" className="hidden items-center lg:flex">
            <ul className="flex items-center">
              {nav.map((item) => <li key={item.href}><Link href={item.href} className="flex min-h-11 items-center px-2.5 text-[13px] text-text-muted transition-colors hover:text-accent">{item.label}</Link></li>)}
            </ul>
            <a href={site.github} className="ml-2 flex min-h-11 items-center px-2.5 text-[13px] text-text-muted transition-colors hover:text-accent">GitHub</a>
          </nav>
          <ThemeToggle />
          <button ref={menuButton} type="button" className="grid size-11 place-items-center rounded-sm text-text-muted lg:hidden" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
            <span aria-hidden="true" className="field-note">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" aria-label="Mobile primary" className="border-t border-border bg-surface px-5 py-3 lg:hidden"><ul className="mx-auto max-w-[1180px]">{nav.map((item, index) => <li key={item.href}><Link ref={index === 0 ? firstLink : undefined} href={item.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center text-[15px] text-text-muted hover:text-accent">{item.label}</Link></li>)}<li><a href={site.github} onClick={() => setOpen(false)} className="flex min-h-11 items-center text-[15px] text-text-muted hover:text-accent">GitHub</a></li></ul></nav>}
    </header>
  );
}
