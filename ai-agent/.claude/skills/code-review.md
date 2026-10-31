# Skill: Code Review

## Purpose

Perform a thorough, constructive pre-PR code review covering correctness, quality, security, performance, and documentation.

## When to Use

- Before opening or approving a PR
- During a security or architectural review pass
- When onboarding to a new codebase area

## Review Dimensions

### 1. Correctness
- Does the code do what the FRD requires?
- Are all acceptance criteria covered by tests?
- Are edge cases and error paths handled?
- Is error propagation correct (no swallowed exceptions)?

### 2. Code Quality
- Is the code readable and self-documenting?
- Are functions single-purpose and appropriately sized (< 40 lines as a guide)?
- Is there unnecessary duplication? (DRY, but not over-abstracted)
- Are names meaningful and consistent with project conventions?
- Is complexity justified? (cyclomatic complexity > 10 warrants a note)

### 3. TypeScript / Type Safety
- Strict mode respected?
- No `any` without justification?
- Type assertions (`as X`) used sparingly and correctly?
- Proper null/undefined handling?

### 4. Security (quick pass)
- Inputs validated at boundaries?
- No secrets or PII in code or logs?
- Authorization enforced on new endpoints?
- SQL/command injection vectors closed?
*(Flag for full security review if scope is large.)*

### 5. Tests
- New/changed code has tests?
- Tests cover happy path, error paths, and edge cases?
- Are tests testing behavior, not implementation?
- Will tests catch a future regression in this code?

### 6. Performance
- Are there obvious N+1 query patterns?
- Are expensive operations cached appropriately?
- Are large payloads paginated?

### 7. Documentation
- Exported functions have JSDoc?
- API docs updated for new/changed endpoints?
- ADR written for new architecture decisions?
- CHANGELOG updated?

## Review Comment Conventions

Use these prefixes to signal intent:

- `[blocking]` — must be fixed before merge
- `[suggestion]` — improvement idea, author's call
- `[question]` — clarification needed, not necessarily a problem
- `[nit]` — minor style issue, can be addressed in a follow-up
- `[praise]` — acknowledge good work

## Review Output Format

```markdown
## Code Review: <PR title / branch>

**Date:** <YYYY-MM-DD>\
**Reviewer:** Code Review Agent\
**Verdict:** APPROVE | REQUEST CHANGES | COMMENT

### Summary
<2–3 sentence overall assessment>

### Blocking Issues
- [blocking] `<file>:<line>` — <description and suggested fix>

### Suggestions
- [suggestion] `<file>:<line>` — <description>

### Questions
- [question] `<file>:<line>` — <question>

### Checklist
- [ ] Correctness — all ACs met
- [ ] Tests — coverage adequate
- [ ] TypeScript — strict compliance
- [ ] Security — no new vulnerabilities
- [ ] Performance — no obvious bottlenecks
- [ ] Docs — updated where needed
```

## Behavior Rules

- Every blocking issue must include a suggested fix or a reference to the relevant standard
- Do not nitpick style issues that Prettier/ESLint would catch automatically
- Keep review comments objective and focused on the code, not the author
- If a review surfaces a systemic issue, suggest an ADR or team discussion rather than a one-off fix
