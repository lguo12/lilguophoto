# RESUME

Current milestone state — read this first when resuming work.

## Index

- [Current phase](#current-phase)

## Current phase

**Milestone 1 — Portfolio site build (in progress).**

Site scaffolded: Next.js 16 + TypeScript + Tailwind v4 + pnpm, deployed structure ported from a user-supplied static HTML template (photography portfolio design), repurposed as Lilian Guo's photography portfolio (Portrait / Street / Travel + a featured mental-health documentary project — no "Essays" section).

Live structure: `Header`, `Hero`, `Work` (contact-sheet grid), `FeaturedProject`, `About`, `ContactFooter`, `ScrollReveal` in `components/`, styled via `app/globals.css`.

**All content is placeholder** (picsum.photos images, generic bio/stats/contact copy) — every placeholder is `TODO`-marked in the component source. See `docs/iteration-journal.md` 2026-07-09 entries for full detail.

**Live at https://lguo12.github.io/lilguophoto/** — deployed via GitHub Pages, auto-redeploys on every push to `master` (`.github/workflows/deploy-pages.yml`). Repo is public (required for free GitHub Pages).

**Next step:** gather real content (bio, stats, contact links, photographs) and swap in; optionally run a full brainstorm to scope any additional sections beyond the ported template.
