---
name: phase1-sdlc
description: "Runs the complete autonomous Phase 1 SDLC cycle: Planning → Design → AI Design Approval → Coding → Code Review → Testing → Final Report. No human approval gates. Maximum three fix/review cycles per gate."
---

# Skill: Phase 1 SDLC

## Purpose

Execute the full autonomous software development lifecycle for a single feature or fix, from raw requirement to verified, reviewed implementation. This skill orchestrates five specialized agents in a defined sequence and enforces quality gates at every transition.

## Agents Used

| Agent | Model | Role |
|---|---|---|
| `planner` | opus / high effort | Requirements analysis and task decomposition |
| `designer` | opus / high effort | Technical design and AI design approval gate |
| `developer` | sonnet / medium effort | Implementation and unit tests |
| `code-reviewer` | opus / high effort | Independent code review gate |
| `tester` | sonnet / medium effort | Automated testing and final report |

## Workflow

```
[Input: Requirement]
        │
        ▼
┌─────────────────┐
│   1. PLANNER    │  opus · high effort
│  Analyzes req.  │
│  Produces plan  │
└────────┬────────┘
         │ Plan artifact
         ▼
┌─────────────────┐
│   2. DESIGNER   │  opus · high effort
│  Creates design │
│  Self-reviews   │◄─── AI Design Approval Gate
│  Issues verdict │
└────────┬────────┘
         │ Approved design  (REJECTED → designer revises internally)
         ▼
┌─────────────────┐
│  3. DEVELOPER   │  sonnet · medium effort
│  Implements     │◄─────────────────────────────┐
│  Writes tests   │                              │ Fix (max 3 cycles)
└────────┬────────┘                              │
         │ Code changes                          │
         ▼                                       │
┌─────────────────┐                              │
│ 4. CODE-REVIEWER│  opus · high effort          │
│  Reviews diff   │──── REQUEST CHANGES ─────────┘
│  Issues verdict │
└────────┬────────┘
         │ APPROVE
         ▼
┌─────────────────┐
│   5. TESTER     │  sonnet · medium effort      │
│  Runs tests     │◄─────────────────────────────┐
│  Checks coverage│                              │ Fix (max 3 cycles)
│  Produces report│──── FAIL ────────────────────┘
└────────┬────────┘
         │ PASS
         ▼
┌─────────────────┐
│  FINAL REPORT   │
└─────────────────┘
```

## Step-by-Step Execution

### Step 1 — Planning (Planner Agent)

Delegate to the `planner` agent with the raw requirement. The planner must produce:
- A plan artifact with a numbered task list and dependency order
- Testable acceptance criteria
- Open questions resolved or explicitly deferred

**Gate:** Plan must be complete before proceeding. If open questions are unresolved and not deferred, the planner iterates.

### Step 2 — Design and AI Design Approval (Designer Agent)

Delegate to the `designer` agent with the completed plan. The designer must:
1. Produce a full technical design document
2. Self-review the design against completeness, security, maintainability, testability, and scope
3. Issue an explicit verdict: `APPROVED`, `APPROVED WITH NOTES`, or `REJECTED`

**Gate (AI Design Approval):** A `REJECTED` verdict means the designer revises the design internally and re-runs the self-review. This cycle continues until the designer issues `APPROVED` or `APPROVED WITH NOTES`. The orchestrator validates that the verdict is present and is not `REJECTED` before continuing to Step 3.

### Step 3 — Implementation (Developer Agent)

Delegate to the `developer` agent with the approved design and plan. The developer must:
- Implement all tasks from the plan in dependency order
- Write unit tests alongside production code
- Follow the approved design exactly; flag any necessary deviation before implementing it

**Gate:** All changes must be ready for review before proceeding.

### Step 4 — Code Review (Code Reviewer Agent)

Delegate to the `code-reviewer` agent with the diff, the approved design, and the plan acceptance criteria. The reviewer must:
- Issue `APPROVE` or `REQUEST CHANGES` with a structured report
- Include a security checklist and test adequacy assessment

**Gate (Code Review):**
- `APPROVE` → proceed to Step 5
- `REQUEST CHANGES` → return to developer (Step 3) with the blocking issues list
- **Maximum 3 cycles.** If the third review returns `REQUEST CHANGES`, halt the cycle and report to the user with a summary of the repeated blocking issues.
- Any changes made after a code review approval must go through another review cycle before proceeding.

### Step 5 — Testing (Tester Agent)

Delegate to the `tester` agent with the merged implementation, acceptance criteria, and approved design. The tester must:
- Write and run tests for every acceptance criterion
- Run `npm test -- --run`, `npm run typecheck`, and `npm run lint`
- Produce a final test report with a `PASS` or `FAIL` verdict

**Gate (Test):**
- `PASS` → proceed to Final Report
- `FAIL` → return to developer (Step 3) with the defect report(s)
- **Maximum 3 cycles.** If the third test run returns `FAIL`, halt and report to the user.

### Step 6 — Final Report

Produce a consolidated summary:

```markdown
## Phase 1 SDLC — Final Report

**Feature:** <title>
**Date:** <YYYY-MM-DD>
**Overall Status:** COMPLETE | HALTED

### Cycle Summary
| Stage | Cycles Used | Final Verdict |
|---|---|---|
| Planning | 1 | Complete |
| Design (AI Approval) | <n> | APPROVED |
| Code Review | <n> | APPROVE |
| Testing | <n> | PASS |

### Artifacts Produced
- Plan: `ai-agent/docs/requirements/<slug>.md` (if written)
- Design: `ai-agent/docs/adr/ADR-<NNN>-<slug>.md` (if written)
- API contract: `ai-agent/docs/api/<slug>.md` (if written)
- Test report: <inline above>

### Changes Merged
- <file>: <description>

### Known Limitations / Follow-up Items
- <item or "None">
```

## Constraints

- No deployment, publishing, or release automation is performed
- No human approval gates — the AI design approval gate is automated (designer self-review)
- Maximum 3 fix/review cycles per gate (code review and testing independently)
- The developer may not skip the code review gate, even for single-line changes
- Any post-review changes require a new review cycle

## FCC Model Routing

When this skill is used through Free Claude Code (FCC):
- `model: opus` in agent frontmatter routes to the `MODEL_OPUS` tier in FCC
- `model: sonnet` routes to the `MODEL_SONNET` tier
- The actual underlying model per tier is configured in the FCC Admin UI
- See `ai-agent/docs/ops/fcc-model-routing.md` for environment-specific routing configuration
