/* Single source of truth for identity, links and navigation.
   Every external URL here is either supplied directly or was confirmed
   against the authenticated GitHub account. Nothing is inferred. */

export const site = {
  name: "Nikhil George",
  monogram: "NG",
  role: "Software Engineer",

  heroEyebrow: "UW Computer Science · Seattle, WA",
  headline: "I build software from embedded devices to cloud applications.",
  heroDescription:
    "Computer Science student at the University of Washington, graduating in June 2027, and Founding Software Engineer at Gnome. I build embedded, cloud, and full-stack systems—from ESP32 firmware and AWS infrastructure to user-facing applications.",
  supporting:
    "I’m a UW computer science student and founding software engineer at Gnome. My work spans firmware, backend infrastructure, data pipelines, and user-facing products.",

  availability:
    "I'm currently looking for software-engineering opportunities for 2027.",

  email: "ngeorge1@uw.edu",
  linkedin: "https://www.linkedin.com/in/nikhil-george01",
  github: "https://github.com/ngeorge15",

  /* Set once a domain exists. Canonical URLs and absolute OG image URLs
     stay relative until then rather than pointing somewhere wrong. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",

  resume: {
    href: "/Nikhil_George_Resume.pdf",
    /* The newest PDF on disk is dated May 2026 and predates the Societies
       Insurance role, so it is deliberately not wired up yet. */
    available: false,
  },
} as const;

export const nav = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#gnome", label: "Gnome" },
  { href: "/#skills", label: "Skills" },
  { href: "/#about", label: "About" },
  { href: "/resume", label: "Résumé" },
] as const;
