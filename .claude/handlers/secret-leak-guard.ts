// Deterministic pre-step handler: secret-leak-guard
// Trigger: before any commit-producing tool call
// Action: scan staged diff for high-entropy strings / known secret patterns (API keys, tokens);
// block the commit and inject a [HARNESS] message if found
// TODO: wire into the agent loop per references/deterministic-handlers.md
