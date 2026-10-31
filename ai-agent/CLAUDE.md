# Portfolio — Claude handoff

Read [AGENTS.md](AGENTS.md) first. It is the current behavior and continuation
reference; the root [README](../README.md) contains setup instructions.

The Next.js frontend runs from the repository root. `src/`, `public/`, `tests/`
and root configuration belong to the app; `ai-agent/` contains project memory
and optional agent tooling. A client starting at the root should explicitly load
this folder. No external reference checkout, RTK installation or model gateway
is required to build or run the portfolio.

Reusable workflows are in `.claude/skills/`; specialized roles are in
`.claude/agents/`. They are templates for relevant future work. Apply the active
user request and current handoff before historical requirements or generic
backend examples. Do not restore retired 3D rendering, contact forms or APIs.

Preserve existing user changes. Keep secrets out of Git. Run checks appropriate
to the change and record their results in the handoff. Commit, push, release and
deploy only within the scope the user authorizes.
