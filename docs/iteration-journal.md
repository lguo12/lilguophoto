# Iteration Journal

Dated journal of work done, one entry per completed task.

## Index

- [2026-07-09 — Scaffold portfolio site from Elena Marsh template](#2026-07-09--scaffold-portfolio-site-from-elena-marsh-template)
- [2026-07-09 — Add click-to-enlarge lightbox](#2026-07-09--add-click-to-enlarge-lightbox)
- [2026-07-09 — Re-anchor lightbox controls to the viewport](#2026-07-09--re-anchor-lightbox-controls-to-the-viewport)
- [2026-07-09 — Remove contact-sheet dashed border and grid black lines](#2026-07-09--remove-contact-sheet-dashed-border-and-grid-black-lines)
- [2026-07-09 — Switch deploy target from Vercel to GitHub Pages](#2026-07-09--switch-deploy-target-from-vercel-to-github-pages)
- [2026-07-09 — Fix failing deploy workflow (pnpm ignored-builds conflict)](#2026-07-09--fix-failing-deploy-workflow-pnpm-ignored-builds-conflict)
- [2026-07-09 — Fix Node/pnpm version mismatch in the deploy workflow](#2026-07-09--fix-nodepnpm-version-mismatch-in-the-deploy-workflow)

## 2026-07-09 — Fix failing deploy workflow (pnpm ignored-builds conflict)

**Task:** After the user made the repo public and set Pages source to "GitHub Actions" per the prior task's instructions, the site returned GitHub's generic 404 ("File not found").

**Root cause (found via the public GitHub Actions REST API, no auth needed for a public repo's run list):** the "Deploy to GitHub Pages" workflow's `pnpm install --frozen-lockfile` step failed. `pnpm-workspace.yaml` had both an `allowBuilds: {sharp: true, unrs-resolver: true}` block (written by `pnpm approve-builds --all`, run earlier this session to unblock a local `[ERR_PNPM_IGNORED_BUILDS]` error) **and** the original `ignoredBuiltDependencies: [sharp, unrs-resolver]` list from the `create-next-app` scaffold — the two configs contradict each other. Locally this didn't reproduce because the approval had already been granted in a prior step of the same environment; a genuinely fresh install (CI, or a locally wiped `node_modules`) hit the ignored-builds safety gate and exited non-zero, so every step after `pnpm install` in the workflow was skipped, `out/` was never produced, and `actions/deploy-pages` had nothing to publish — hence the 404 (not our app's 404, GitHub's own "no site here" page).

**Also fixed while here:** the workflow pinned `pnpm/action-setup@v4` to `version: 9`, but the lockfile was generated locally with pnpm `11.10.0` — a real version-drift risk (older pnpm might not even understand newer config keys like `allowBuilds`). Removed the hardcoded CI version and instead pinned `"packageManager": "pnpm@11.10.0"` in `package.json` (the standard Corepack field), which `pnpm/action-setup@v4` auto-detects when no explicit `version:` is given — CI and local now always match by construction instead of by two numbers happening to agree.

**Changes:**
- `pnpm-workspace.yaml` — removed the redundant/contradictory `ignoredBuiltDependencies` list, keeping only `allowBuilds`.
- `package.json` — added `"packageManager": "pnpm@11.10.0"`.
- `.github/workflows/deploy-pages.yml` — dropped the hardcoded `version: 9` from `pnpm/action-setup@v4`.

**Plan deviations:** none in scope, but a process note: `pnpm approve-builds` should be treated as a config-writing command, not a one-off local fix — its output belongs in the commit that also updates any conflicting existing config, not left to drift.

**Testing / verification:**
- Simulated CI's fresh-environment install locally: deleted `node_modules` entirely, ran `pnpm install --frozen-lockfile` — succeeded with no ignored-builds error (previously this exact reproduction would have failed the same way CI did).
- `pnpm lint` / `pnpm typecheck` / `pnpm build` — all clean after the clean reinstall.
- Confirmed via `GET /repos/lguo12/lilguophoto/actions/runs` and `/jobs` (public, unauthenticated) exactly which step failed, rather than guessing — job logs themselves needed repo-admin auth we don't have, so root-caused from job-level pass/fail plus local reproduction instead.

**Correction, same day:** the fix above shipped without checking the actual failure-log text (job logs need repo-admin auth we didn't have at the time; only pass/fail per step was visible). After pushing, the workflow failed again on a *different* error, which prompted fetching `GET /repos/{owner}/{repo}/commits/{sha}/check-runs` → `annotations_url` — this endpoint returns failure-annotation text without needing log-download auth, and revealed the real story: the original failure's annotation was `ERROR packages field missing or empty` (a pnpm-v9-specific workspace-validation strictness, unrelated to the ignored-builds contradiction diagnosed above), and it's the *pnpm version bump* (removing the hardcoded `version: 9`, landed in the same commit as the ignored-builds cleanup) that most likely actually fixed it — not the ignored-builds fix itself, which remains good config hygiene but wasn't proven to be the blocker. See the next entry for the follow-up failure this version bump introduced.

## 2026-07-09 — Fix Node/pnpm version mismatch in the deploy workflow

**Task:** direct continuation of the previous entry — after pushing the pnpm-version-and-ignored-builds fix, the workflow's `pnpm install --frozen-lockfile` step failed *again*, still returning GitHub's 404.

**Root cause (found this time via actual annotation text, not step-name guessing):** `GET /repos/lguo12/lilguophoto/commits/{sha}/check-runs` → each check run's `annotations_url` returned the real failure message without needing log-download auth: `pnpm@11.10.0 requires at least Node.js v22.13; current is v20.20.2`, crashing with `ERR_UNKNOWN_BUILTIN_MODULE: node:sqlite` (a Node 22+ builtin pnpm 11 depends on). The workflow's `actions/setup-node@v4` step was still pinned to `node-version: 20`, left over from the original scaffold, and never revisited when the pnpm version was bumped to match the lockfile.

**Fix:** `node-version: 20` → `node-version: 22` in `.github/workflows/deploy-pages.yml`.

**Changes:**
- `.github/workflows/deploy-pages.yml` — `node-version: 20` → `22`.
- `docs/iteration-journal.md` — corrected the previous entry's root-cause claim once the annotation text was available.

**Plan deviations / process note:** should have fetched `check-runs` annotations *before* shipping the first fix, not after — guessing root cause from step pass/fail names alone (no auth for full logs) produced a plausible-but-wrong diagnosis the first time. Annotations are readable on any public repo without auth and should be the first stop for CI failures on this project going forward, not job-name inference.

**Testing / verification:** local versions already satisfy this (`node --version` → v24.18.0, well above the v22.13 floor), so nothing to reproduce locally beyond confirming the version numbers.

**Outcome — confirmed, not assumed:** workflow run completed with `conclusion: success`. Independently verified the site itself (not just the workflow badge): `curl -s -o /dev/null -w "%{http_code}" https://lguo12.github.io/lilguophoto/` → `200`, and the fetched HTML contains "Lilian", "Guo", "Portrait", "Mental Health Project" — the real page, not a cached 404. Site is live at **https://lguo12.github.io/lilguophoto/**.

**Next steps:** none blocking for deploy. Still pending from earlier entries — real content/images to replace all `TODO`-marked placeholders.

## 2026-07-09 — Switch deploy target from Vercel to GitHub Pages

**Task:** User set up a GitHub repo (`lguo12/lilguophoto`, connected as `origin` in a prior task) and asked to deploy via GitHub Pages instead of the originally-proposed Vercel.

**Summary:** Since the site has no server-side rendering, API routes, or dynamic segments, converted it to a static export (`output: "export"` in `next.config.ts`) and added a GitHub Actions workflow that builds and publishes to GitHub Pages on every push to `master`.

**Changes:**
- `next.config.ts` — added `output: "export"`, `basePath: "/lilguophoto"` (required because the repo isn't a `<username>.github.io` root repo, so GitHub Pages serves it at `https://lguo12.github.io/lilguophoto/`), and `images.unoptimized: true` (moot today since the site already uses plain `<img>`, not `next/image`, but `next/image` can't run its optimizer without a server regardless).
- `.github/workflows/deploy-pages.yml` — new: checkout → pnpm install → lint → typecheck → build → `actions/upload-pages-artifact` → `actions/deploy-pages`, triggered on push to `master` (+ manual `workflow_dispatch`).
- `CLAUDE.md` — deploy target updated from Vercel to GitHub Pages; "Don't do" section updated to reflect the static-export constraint (no API routes/Server Actions/dynamic rendering; a real contact-form backend would need a third-party service since there's no server runtime).

**Plan deviations:** deploy target changed from the originally-recommended Vercel (chosen at project bootstrap) to GitHub Pages, per explicit user request. No functional loss for this site since it was already 100% static content.

**Testing / verification:**
- `pnpm lint` / `pnpm typecheck` — clean.
- `pnpm build` with `output: "export"` — succeeds, produces `out/` with `index.html`, `404.html`, `_next/static/...`.
- Verified `basePath` actually applied: grepped the exported `index.html` and confirmed asset URLs are prefixed `/lilguophoto/_next/static/...`, matching where GitHub Pages will actually serve them from.
- Not yet verified: the live GitHub Actions run itself (requires the one-time manual repo setting below) and the real deployed URL.

**Next steps (user action required — cannot be done from the CLI without repo-admin API access):**
1. In the GitHub repo → Settings → Pages → Source, select **"GitHub Actions"** (one-time toggle).
2. Push this commit (or re-run the workflow) to trigger the first deploy.
3. Site will be live at `https://lguo12.github.io/lilguophoto/`.
4. Still pending from earlier entries: real content/images.

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
