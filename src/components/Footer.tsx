import { site } from "@/content/site";

export function Footer() {
  return <footer className="border-t border-border"><div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-7 text-[13px] text-text-muted sm:px-8"><p>{site.name} · Seattle, WA</p><p className="font-mono text-[11px]">© {new Date().getFullYear()}</p></div></footer>;
}
