---
description: Run the full check suite for a phase (lint, typecheck, tests) — usage: /test-phase [PHASE]
argument-hint: "[PHASE]"
---

Run in order, reporting pass/fail for each:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

If `$ARGUMENTS` is set, note it as the phase identifier in the summary.
