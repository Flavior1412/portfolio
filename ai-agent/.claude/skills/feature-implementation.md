# Skill: Feature Implementation

## Purpose

Implement an approved, planned feature end-to-end: production code, tests, migrations, and documentation updates.

## Prerequisites

- Approved FRD in `ai-agent/docs/requirements/`
- ADR(s) in `ai-agent/docs/adr/` for architecture decisions
- API contract in `ai-agent/docs/api/` (if adding endpoints)
- Task breakdown approved by user

## Workflow

### Step 1 — Orient (Developer)

Before writing any code:
1. Read the FRD and ADR for this feature
2. Read existing code in the directories you will modify
3. Identify shared utilities, types, and patterns to reuse
4. Confirm the task list is still accurate; flag any blockers

### Step 2 — Implement (Developer)

Work through tasks in dependency order:

**Database / Data layer first:**
- Create migration files for schema changes
- Define TypeScript types/interfaces
- Implement repository / data access layer

**Business logic second:**
- Implement service layer
- Apply input validation (zod schemas)
- Handle errors with consistent error objects

**API layer third:**
- Implement route handlers
- Apply auth middleware
- Validate request/response against API contract

**UI layer fourth (if applicable):**
- Build components bottom-up (atoms → molecules → pages)
- Wire up API calls with proper loading/error states
- Ensure keyboard navigation and ARIA labeling

### Step 3 — Test (QA Engineer)

For every new file or changed function:
- Write unit tests (`*.test.ts` next to source)
- Write integration tests for API endpoints
- Verify all acceptance criteria are covered by at least one test

Run and confirm:
```bash
npm test -- --run
npm run typecheck
npm run lint
```

All three must pass with zero errors before moving on.

### Step 4 — Security Check (Security Reviewer)

Walk through the OWASP Top 10 checklist for this feature:
- Are all inputs validated?
- Are queries parameterized?
- Is authorization enforced on every endpoint?
- Are any secrets or PII handled?
- Run `npm audit` and resolve any HIGH/CRITICAL findings

### Step 5 — Documentation

- Update `ai-agent/docs/api/<slug>.md` with final endpoint signatures
- Add JSDoc to all exported functions
- Update `ai-agent/CHANGELOG.md` (Unreleased section)

### Step 6 — PR Preparation

Create a PR description using this template:

```markdown
## Summary
<2–3 sentence description of the change>

## Related
- FRD: `ai-agent/docs/requirements/<slug>.md`
- ADR: `ai-agent/docs/adr/ADR-<NNN>-<slug>.md`

## Changes
- <file>: <what changed and why>

## Testing
- [ ] Unit tests added / updated
- [ ] Integration tests added / updated
- [ ] Manual smoke test performed

## Definition of Done
- [ ] Acceptance criteria met (see FRD)
- [ ] Tests passing
- [ ] Typecheck clean
- [ ] Lint clean
- [ ] Security review passed
- [ ] Docs updated
```

## Behavior Rules

- Never implement beyond the current FRD scope
- Always read existing code before writing new code in that area
- Commit migrations separately from application code
- Do not squash commits that contain migration files
