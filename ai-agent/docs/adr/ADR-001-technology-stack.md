# ADR-001: Initial Technology Stack

**Status:** Superseded by ADR-002 (technology stack confirmed)\
**Date:** 2026-10-27\
**Deciders:** Solution Architect Agent (update with human deciders when confirmed)

## Context

This is a greenfield portfolio project. We need to choose a technology stack that is modern, well-supported, and appropriate for a full-stack portfolio application. The stack should minimize accidental complexity while enabling professional-quality output.

## Decision Drivers

- Developer familiarity and ecosystem maturity
- TypeScript-first for type safety
- Strong testing story
- Deployable to common platforms (Vercel, Railway, Fly.io, etc.)
- Low operational overhead for a portfolio project

## Considered Options

1. **Next.js + PostgreSQL** — full-stack React framework with API routes
2. **Vite + Express + PostgreSQL** — separate frontend and backend
3. **Remix + SQLite** — full-stack with file-based DB for simplicity

## Decision Outcome

**Chosen:** To be confirmed by the project owner.

**Recommendation:** Option 1 (Next.js + PostgreSQL) for a portfolio project — familiar to most React developers, excellent deployment story on Vercel, API routes eliminate the need for a separate backend service initially.

**Update this ADR** when the stack is confirmed at project initialization.

## Consequences

**Positive:**
- Single repository, single deployment
- TypeScript throughout
- Strong community and documentation

**Negative / Trade-offs:**
- Next.js App Router has a steeper learning curve than Pages Router
- PostgreSQL requires a hosted database (Neon, Supabase, or Railway recommended for portfolio use)

## References

- https://nextjs.org/docs
- https://neon.tech (serverless PostgreSQL)
