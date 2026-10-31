# ADR-000: Record Architecture Decisions

**Status:** Accepted\
**Date:** 2026-10-27\
**Deciders:** Project Team

## Context

We need a way to record important architectural decisions made throughout the project lifetime, including the context and consequences of those decisions.

## Decision

We will use Architecture Decision Records (ADRs) as described by Michael Nygard. All ADRs are stored in `docs/adr/` and named `ADR-<NNN>-<slug>.md`.

## Consequences

**Positive:**
- New team members can understand why decisions were made
- Avoids re-debating settled decisions
- Creates a historical record of the project's evolution

**Negative:**
- Requires discipline to write ADRs consistently
- ADRs can become stale if not maintained

## Process

- ADRs are numbered sequentially starting at 001
- Status transitions: Proposed → Accepted | Deprecated | Superseded
- Superseded ADRs are updated with `Superseded by ADR-<NNN>` in the status field — never deleted
- The Solution Architect agent is responsible for writing ADRs during feature planning
