# Skill: Bug Fixing

## Purpose

Diagnose, reproduce, fix, and verify a defect. Leave the codebase in a better state than you found it.

## Workflow

### Step 1 — Reproduce (QA Engineer)

Before touching any code:
1. Understand the bug report: what is expected vs actual?
2. Identify the environment and conditions where it occurs
3. Write a failing test that reproduces the bug
   - This test must fail **before** the fix and pass **after**
4. If you cannot reproduce it, ask the reporter for more information

### Step 2 — Diagnose (Developer)

With the failing test in hand:
1. Trace the execution path from input to the wrong output
2. Identify the root cause (not just the symptom)
3. Check for related issues in adjacent code
4. Document your diagnosis in a comment or the bug report

### Step 3 — Fix (Developer)

Apply the minimal correct fix:
- Fix the root cause, not the symptom
- Do not refactor unrelated code in the same commit
- If the fix requires a design change, create an ADR first

### Step 4 — Verify (QA Engineer)

```bash
# The reproduction test must now pass, and no regressions introduced
npm test -- --run

# Type safety preserved
npm run typecheck

# Linting clean
npm run lint
```

### Step 5 — Root Cause Analysis (RCA) for High-Severity Bugs

For CRITICAL or HIGH severity bugs, write a short RCA:

```markdown
## RCA: <bug title>

**Date:** <YYYY-MM-DD>\
**Severity:** Critical | High

### Timeline
- <time>: <event>

### Root Cause
<What was the underlying cause?>

### Why It Wasn't Caught Earlier
<What gap in tests / review allowed this through?>

### Fix Applied
<Summary of the change>

### Prevention
- [ ] <action to prevent recurrence>
```

Save to `ai-agent/docs/ops/rca-<date>-<slug>.md`.

### Step 6 — Update Changelog

Add an entry to `ai-agent/CHANGELOG.md` under `[Unreleased] > Fixed`.

## Behavior Rules

- A fix without a reproduction test is not complete
- Never fix bugs by suppressing error messages or silently catching exceptions
- If the fix is a workaround, file a follow-up task for the proper fix
- Update the relevant FRD or ADR if the bug reveals a requirements gap
