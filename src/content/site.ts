/* Single source of truth for identity, links and navigation.
   Every external URL here is either supplied directly or was confirmed
   against the authenticated GitHub account. Nothing is inferred. */

export const site = {
  name: "Nikhil George",
  monogram: "NG",
  role: "Software Engineer",

  headline:
    "I build software that connects physical systems, cloud infrastructure, and real-world users.",
  supporting:
    "Computer Science at the University of Washington. Software Engineer Intern at Societies Insurance and Founding Software Engineer at Gnome.",

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
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/resume", label: "Résumé" },
  { href: "/#contact", label: "Contact" },
] as const;
