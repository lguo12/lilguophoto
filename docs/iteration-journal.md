# Iteration Journal

Dated journal of work done, one entry per completed task.

## Index

- [2026-07-09 — Scaffold portfolio site from Elena Marsh template](#2026-07-09--scaffold-portfolio-site-from-elena-marsh-template)
- [2026-07-09 — Add click-to-enlarge lightbox](#2026-07-09--add-click-to-enlarge-lightbox)
- [2026-07-09 — Re-anchor lightbox controls to the viewport](#2026-07-09--re-anchor-lightbox-controls-to-the-viewport)
- [2026-07-09 — Remove contact-sheet dashed border and grid black lines](#2026-07-09--remove-contact-sheet-dashed-border-and-grid-black-lines)

## 2026-07-09 — Remove contact-sheet dashed border and grid black lines

**Task:** User reported the dashed line above the Work grid was still visible after the prior fix, and separately disliked the black border around the grid photos.

**Root cause:** the dashed-border removal from the prior task had landed correctly in `app/globals.css`, but the running `pnpm dev` server (started via Git Bash in an earlier turn) was stale and never picked up that edit or the lightbox-redesign edit before it — its compiled CSS chunk still contained the old `border-top/border-bottom: 2px dashed` rule, confirmed by fetching `/_next/static/chunks/[root-of-the-server]*.css` directly and finding the dashed rule still present even though the source file had it removed. Likely a file-watcher gap between the Git-Bash-spawned Node process and the Windows filesystem.

**Fix:**
- Killed the stale dev-server process (bound to port 3000), deleted `.next/` to drop any stale Turbopack cache, and restarted `pnpm dev` natively via PowerShell instead of Git Bash.
- Verified by re-fetching the compiled CSS chunk directly: 0 matches for "dashed", and `.grid` now shows the intended `gap: 0` rule — confirming the dev server is now actually in sync with source.
- Separately, removed the black lines between grid photos: `.grid` had `gap: 2px; background: var(--ink);`, which showed the dark background through the 2px gaps as thin black borders around every photo. Changed to `gap: 0` and dropped the background declaration.

**Changes:**
- `app/globals.css` — `.grid` gap changed from `2px` (with `background: var(--ink)`) to `0` (no background); `.contactsheet` dashed borders (already removed in the prior task, now actually verified live).

**Plan deviations:** none in scope, but flagging for future sessions: **restart the dev server via PowerShell, not Git Bash**, on this machine — Git-Bash-spawned `next dev` did not reliably pick up file changes.

**Testing / verification:**
- `pnpm lint` / `pnpm typecheck` / `pnpm build` — all clean.
- Compiled dev-server CSS fetched and inspected directly (not just assumed from source) to confirm the fix actually took effect this time.

**Next steps:** confirm with the user that both the dashed line and the black grid borders are gone; still pending — real content/images, deploy target.

## 2026-07-09 — Re-anchor lightbox controls to the viewport

**Task:** User reported the lightbox opening "at the bottom of the page" and asked for a real popup feel instead, referencing screenshots of franklinyeep.com's lightbox (dark dimmed backdrop, photo shown in a white mat/border, close × fixed in the screen's top-right corner).

**Summary:** Moved the close and prev/next buttons out of `.lightbox-content` (whose size varies with each image) and made them direct children of `.lightbox-backdrop`, positioned with `position: fixed` at the viewport's corners/edges (close top-right, nav left/right-center) instead of `position: absolute` relative to the image box. Restyled `.lightbox-content` as a white paper-colored mat around the photo (padding + box-shadow) matching the reference screenshots, and simplified the close control from a bordered "Close ✕" chip to a plain icon button.

**Changes:**
- `components/lightbox/Lightbox.tsx` — close/nav buttons moved to be siblings of `.lightbox-content` rather than children of it; nav `onClick` handlers now stop propagation directly (previously relied on `.lightbox-content`'s stopPropagation wrapper, which no longer wraps them).
- `app/globals.css` — rewrote the `.lightbox-*` rules: viewport-fixed close/nav controls, white-mat `.lightbox-content`, larger backdrop padding.

**Plan deviations:** none — direct follow-up fix to the same small feature, no new ceremony needed.

**Testing / verification:**
- `pnpm lint` / `pnpm typecheck` / `pnpm build` — all clean.
- Dev server hot-reloaded; not independently screenshotted by the assistant (no browser/screenshot tool available this session) — visual confirmation is on the user via the reopened browser tab.

**Next steps:** confirm with the user that the popup now matches the reference behavior; still pending — real content/images, deploy target.

## 2026-07-09 — Add click-to-enlarge lightbox

**Task:** User asked to be able to open each picture and see it bigger.

**Summary:** Added a lightbox: clicking any photo (hero, the 9 work-grid frames, featured-project image, about portrait) opens it enlarged in a full-screen overlay. The work grid shares one gallery so the overlay also supports prev/next (arrow-key or on-screen buttons) between all 9 frames; standalone photos (hero/project/about) open without prev/next. Closes via Escape, clicking the backdrop, or a close button; focus moves to the close button on open and body scroll is locked while open.

**Changes:**
- `components/lightbox/LightboxContext.tsx` — client context/provider holding open-image state (gallery + index) and open/close/next/prev actions.
- `components/lightbox/Lightbox.tsx` — the overlay UI (backdrop, image, caption, close/nav buttons, keyboard handling).
- `components/lightbox/ZoomableImage.tsx` — click-target wrapper (`<button><img/></button>`) used in place of raw `<img>`; existing CSS selectors (`.frame img`, `.hero-frame img`, etc.) still apply since they're descendant selectors.
- `components/{Hero,Work,FeaturedProject,About}.tsx` — swapped `<img>` for `<ZoomableImage>`; `Work.tsx` builds one shared `GALLERY` array (higher-res 1400×1750 picsum crops than the 600×750 grid thumbnails) so the lightbox shows a bigger image than the grid tile.
- `app/page.tsx` — wrapped in `LightboxProvider`, mounted `<Lightbox />` once at the root.
- `app/globals.css` — added `.zoomable-trigger`(`--fill`) button-reset styles and `.lightbox-*` overlay styles matching the existing paper/ink/rust palette and mono UI chrome.

**Plan deviations:** none — small, well-specified feature; skipped brainstorm/spec ceremony per cadence compression (single-layer frontend feature, no new logic risk, no security surface).

**Testing / verification:**
- `pnpm lint` — 0 warnings (the two remaining intentional `<img>` uses, inside `Lightbox.tsx`/`ZoomableImage.tsx`, carry an explicit `eslint-disable-next-line` since they're deliberate, unavoidable while not using `next/image`).
- `pnpm typecheck` — clean.
- `pnpm build` — succeeds.
- Rendered-HTML check confirmed 10 `zoomable-trigger--fill` triggers (9 work frames + hero) and 2 plain `zoomable-trigger` triggers (featured project + about), matching the 12 photos on the page.
- Not yet done: no automated interaction test (click → overlay opens → arrow-key nav → close) — verified structurally + visually in-browser only, no Track A/B smoke artifacts written (small task, not a milestone close).

**Next steps:** none blocking; still pending from the prior entry — real content and images, deploy target.

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
