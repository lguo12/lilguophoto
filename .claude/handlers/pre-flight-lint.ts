// Deterministic pre-step handler: pre-flight-lint
// Trigger: before any commit-producing tool call touching *.ts/*.tsx
// Action: run `pnpm lint` (eslint); on failure, inject a [HARNESS] message blocking the commit
// TODO: wire into the agent loop per references/deterministic-handlers.md once the Next.js
// project is scaffolded (eslint config must exist first — `pnpm create next-app` generates it).
