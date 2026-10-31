# Skill: Feature Planning

## Purpose

Transform an idea or request into a fully approved, implementation-ready feature package: requirements document, architecture decision, and a task breakdown.

## When to Use

- User describes a new feature, story, or capability
- Before any implementation begins
- When scope or design is unclear

## Workflow

### Step 1 — Clarify (Business Analyst)

Ask the user these questions if not already answered:
1. Who is the primary user persona?
2. What problem does this solve?
3. What does success look like? (measurable outcome)
4. Any hard constraints (deadline, budget, tech stack restrictions)?
5. What is explicitly out of scope?

### Step 2 — Write Requirements (Business Analyst)

Create `ai-agent/docs/requirements/<feature-slug>.md` using the FRD template.

- Write at least 3 user stories with Gherkin acceptance criteria
- List edge cases and error conditions
- Estimate complexity (S/M/L/XL)
- Present to user for approval before proceeding

### Step 3 — Architecture Design (Solution Architect)

Review the approved FRD and produce:

1. ADR (`ai-agent/docs/adr/ADR-<NNN>-<slug>.md`) for any non-trivial decisions
2. Component diagram (Mermaid) if new services/components are needed
3. Data model changes (TypeScript interfaces or ERD)
4. API contract sketch (`ai-agent/docs/api/<feature>.md`) for new endpoints

### Step 4 — Task Breakdown (Developer)

Decompose the feature into concrete engineering tasks:

```markdown
## Tasks: <feature-name>

- [ ] T1: <task> (estimate: Xh)
- [ ] T2: <task> (estimate: Xh)
- [ ] T3: Write unit tests for <component> (estimate: Xh)
- [ ] T4: Write integration tests for <endpoint> (estimate: Xh)
- [ ] T5: Update API docs (estimate: 1h)
- [ ] T6: Security review checklist (estimate: 1h)
```

### Step 5 — User Approval

Present the complete package to the user:
- Link to the FRD
- Summary of the architecture decisions
- Task list with estimates
- Any open risks or questions

**Do not proceed to implementation until the user approves.**

## Outputs

| File | Description |
|---|---|
| `ai-agent/docs/requirements/<slug>.md` | Feature Requirements Document |
| `ai-agent/docs/adr/ADR-<NNN>-<slug>.md` | Architecture Decision Record(s) |
| `ai-agent/docs/api/<slug>.md` | API contract (if applicable) |
| Task list in conversation | Engineering breakdown |

## Success Criteria

- FRD has at least 3 user stories with testable ACs
- All open questions are answered or explicitly flagged
- ADR exists for any technology choice
- User has approved before implementation starts
