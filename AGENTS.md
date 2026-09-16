## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4. Statically generated;
there is no server runtime in normal operation.

## Development

```
npm run dev      # dev server
npm run build    # production build (also type-checks)
npx eslint .     # lint
npx tsc --noEmit # type-check only
```

## Content

All copy lives in `src/content/` as typed TypeScript, not MDX:

- `site.ts` — identity, links, availability. Single source of truth.
- `projects.ts` — featured work and card data.
- `case-studies.ts` — long-form case studies keyed by project slug.
- `experience.ts` — roles, credibility figures, about copy.

Pages render from these; do not hardcode copy in components.

## Rules that are load-bearing

- **Links only when real.** `repo` is set only for PUBLIC GitHub repos;
  `demo` is null everywhere because no project has a deployment. Do not
  invent URLs.
- **A metric with no `value` is unmeasured** and renders as an open slot.
  Never substitute an estimate.
- **Gnome chronology:** the Harriet Stephenson win came first; the 100+
  customer interviews happened later, during Redhawk Venture Lab. They are
  separate events and neither caused the other.
- **Societies Insurance is ongoing.** Present-tense verbs, no claim that a
  platform shipped, nothing describing proprietary systems or client data.
- **No live profitability** is claimed for the trading bot; it has never run
  live.
- **The smart ring is not calibrated** — decodes are verified, sensor
  accuracy is not.

## Theme

`[data-theme]` is set on `<html>` by an inline script before paint. Tailwind's
`dark:` variant keys off it. Brand teal/blue fail AA as text on the light
background, so `--teal-text` / `--blue-text` exist for anything that renders
as text.

## Domain

Set `NEXT_PUBLIC_SITE_URL` to enable canonical URLs, absolute OG image URLs,
and a populated sitemap. Until then the sitemap is deliberately empty rather
than emitting invalid relative URLs.
