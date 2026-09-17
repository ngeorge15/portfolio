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
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <Link href="/" className="flex min-h-11 flex-col justify-center leading-tight" onClick={() => setOpen(false)}>
          <span className="font-medium tracking-tight">{site.name}</span>
          <span className="hidden font-mono text-[10px] text-text-muted sm:block">Seattle · UW Computer Science</span>
        </Link>
        <div className="flex items-center">
          <nav aria-label="Primary" className="hidden items-center md:flex">
            <ul className="flex items-center">
              {nav.map((n) => <li key={n.href}><Link href={n.href} className="flex min-h-11 items-center px-3 text-[14px] text-text-muted transition-colors hover:text-accent">{n.label}</Link></li>)}
            </ul>
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-sm text-text-muted md:hidden"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            ref={menuButton}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" className="field-note">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" aria-label="Mobile primary" className="border-t border-border bg-surface px-5 py-3 md:hidden">
          <ul className="mx-auto max-w-[1200px]">
            {nav.map((n, index) => <li key={n.href}><Link ref={index === 0 ? firstLink : undefined} href={n.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center text-[16px] text-text-muted hover:text-accent">{n.label}</Link></li>)}
          </ul>
        </nav>
      )}
    </header>
  );
}
