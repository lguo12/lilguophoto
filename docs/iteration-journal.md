# Iteration Journal

Dated journal of work done, one entry per completed task.

## Index

- [2026-07-09 — Scaffold portfolio site from Elena Marsh template](#2026-07-09--scaffold-portfolio-site-from-elena-marsh-template)

## 2026-07-09 — Scaffold portfolio site from Elena Marsh template

**Task:** Adopt a user-supplied static HTML template (`index_1.html`, a photography portfolio for a fictional photographer "Elena Marsh") as the visual design for Lilian Guo's real portfolio site, repurposed for Portrait/Street/Travel photography plus a featured documentary project (no "Essays" section, per user direction).

**Summary:** Scaffolded a Next.js 16 (App Router, TypeScript, Tailwind v4, pnpm) project into the repo root. Ported the template's custom CSS design system (paper/ink/rust/olive palette, Fraunces/Newsreader/IBM Plex Mono via `next/font/google`, contact-sheet grid, essay-style spread, sticky header, dashed-line motifs) into `app/globals.css` largely verbatim, swapping hardcoded `<link>` Google Fonts for Next.js font loading. Split the single HTML file into components: `Header`, `Hero`, `Work` (contact-sheet grid, categories limited to Portrait/Street/Travel), `FeaturedProject` (replaces the template's "Essay" section — now "Projects" in nav, content about an ongoing mental-health documentary project), `About`, `ContactFooter`, and a client-only `ScrollReveal` component porting the original `IntersectionObserver` reveal script.

**Changes:**
- `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` — scaffolded by `create-next-app`, package renamed `tmp-scaffold` → `portfolio-website`, added `typecheck` script.
- `app/layout.tsx`, `app/globals.css`, `app/page.tsx` — rewritten.
- `components/{Header,Hero,Work,FeaturedProject,About,ContactFooter,ScrollReveal}.tsx` — new.
- Removed default `create-next-app` placeholder SVGs from `public/`.

**Plan deviations:**
- `/init-harness` stack detection (from the earlier bootstrap session) had nothing to detect since the repo was empty; the Next.js/TS/Tailwind/pnpm stack decision was confirmed directly with the user instead of via automated detection.
- Full brainstorm/research-gate ceremony was skipped: the user supplied a concrete, fully-specified visual template and identity/content answers via direct Q&A, so there was no open design question left to research. Compressed straight to implementation per the cadence-compression allowance for well-specified work.
- `pnpm` was not preinstalled; installed globally via `npm install -g pnpm` (corepack's own pnpm activation hit a Windows permissions error writing to `C:\Program Files\nodejs\pnpx`).
- `create-next-app` refused to scaffold directly into `Portfolio_Website` (capital letters violate npm package-name rules), so it was scaffolded into a temp subdirectory and the generated files were moved up, discarding the scaffold's own `CLAUDE.md`/`AGENTS.md`/`README.md` in favor of the ones already committed.
- All photography content (hero, 9 contact-sheet frames, featured-project image, about portrait) uses `picsum.photos` placeholders per the user's explicit choice to launch with placeholders and swap in real images later — every placeholder is marked with a `TODO` comment in the component source.
- Bio copy, stats numbers, email address, and social links are all placeholder text pending real content from the user — also `TODO`-marked.

**Testing / verification:**
- `pnpm lint` — 0 errors, 4 expected `@next/next/no-img-element` warnings (plain `<img>` used deliberately to match the template; revisit with `next/image` once real photos replace the picsum placeholders).
- `pnpm typecheck` (`tsc --noEmit`) — clean.
- `pnpm build` — succeeds, static prerender of `/`.
- `pnpm dev` smoke test — server started, `GET /` returned 200, response HTML confirmed to contain "Lilian", "Guo", "Portrait", "Featured Project", "Mental Health Project".
- Not yet done: full dual-track smoke (Track A manual checklist / Track B Playwright) and cross-viewport responsive check — this is a same-day scaffold slice, not a full milestone close.

**Next steps:**
- Gather real content: bio copy, real stats, actual social/contact links, real photographs (hero, 9 work frames, featured-project image, about portrait) to replace all `TODO`-marked placeholders.
- Decide on deploy target (Vercel) and wire it up.
- Consider swapping `<img>` for `next/image` once real (locally-hosted or remote-configured) images are in place.
- Run the full brainstorm for Milestone 1 scope/ROADMAP if further structural sections are wanted beyond this template's shape.
