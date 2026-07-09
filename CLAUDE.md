# Project: Portfolio Website

## What this is

Lilian Guo's photography portfolio website — portrait, street, and travel work, plus a featured mental-health documentary project. Design/structure ported from a user-supplied static HTML template.

## Stack

- Language(s): TypeScript
- Framework(s): Next.js (App Router)
- Styling: Tailwind CSS
- Package manager: pnpm
- DB / ORM: none
- Queue / background: none
- Auth: none
- Test runner: Vitest (unit) + Playwright (e2e) — install when first test is written
- Deploy target: Vercel

## Commands (one-liners)

```bash
pnpm install      # install deps
pnpm dev          # start dev server
pnpm test         # run unit tests
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm build        # production build
```

## Architecture rules

- Route/page composition lives in `app/`; keep route files thin — delegate to `components/`.
- Shared, reusable UI lives in `components/`.
- Non-UI logic (formatting, data shaping, constants) lives in `lib/`.
- Static assets (images, resume PDF, favicon) live in `public/`.

## Don't do

- No hardcoded secrets — use `.env.local` (gitignored) + Vercel env vars for anything added later (e.g. a contact-form API key).
- No `--no-verify` on commits. Fix the hook complaint.
- No unoptimized images committed to `public/` — use `next/image` and reasonably sized source files.

## Folder map (used by /ship BE/FE builder split)

```yaml
folder-map: single-layer
```

## Skill policy keys

```yaml
domain-docs: ./CONTEXT.md
html-policy: ask
smoke-mode: guided
comprehension: off
close-gate: per-task
archetype: auto
retention: { distill: on }
```

## Pointers to deeper docs

- `CONTEXT.md` — domain glossary
- `docs/RESUME.md` — current milestone state
- `docs/ROADMAP.md` — whole-plan map (goal + milestone table + status)
- `docs/iteration-journal.md` — dated journal of work done
