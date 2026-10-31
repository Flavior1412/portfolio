# Rule: Architecture Rules

**Applies to:** All architectural decisions, new modules, and infrastructure changes

## Layered Architecture

The codebase follows a strict layered architecture. Dependencies only flow inward:

```
┌─────────────────────────────────┐
│  API / UI Layer (routes, pages) │ ← depends on →
├─────────────────────────────────┤
│  Service Layer (business logic) │ ← depends on →
├─────────────────────────────────┤
│  Repository Layer (data access) │ ← depends on →
├─────────────────────────────────┤
│  Domain Layer (types, entities) │
└─────────────────────────────────┘
```

- API routes must not contain business logic — delegate to services
- Services must not contain raw SQL — delegate to repositories
- Domain types must not import from any other layer
- UI components must not call repositories directly

## Decision Rules

1. **New dependency?** → Check if an existing dep solves it first. If not, add an ADR.
2. **New service / microservice?** → Requires ADR. Default is monolith-first.
3. **Database schema change?** → Requires a migration file. No ORM auto-migrate in production.
4. **External API integration?** → Abstract behind an interface; mock in tests.
5. **Shared state?** → Prefer server state (React Query / SWR) over client state management libraries.
6. **Caching?** → Document the invalidation strategy before implementing.

## ADR Required For

- Choosing a new library or framework
- Changing the database schema significantly
- Introducing a new service or background job
- Changing the authentication mechanism
- Any decision that affects more than one layer

## Non-Functional Requirements Defaults

| Concern | Target |
|---|---|
| API response time (p95) | < 200ms |
| Page load (LCP) | < 2.5s |
| Availability | 99.9% |
| Error rate | < 0.1% |
| Test coverage (critical paths) | ≥ 90% |

## Prohibited Patterns

- **God objects** — classes with > 5 responsibilities
- **Magic numbers** — use named constants
- **Callback hell** — use async/await
- **Direct DOM manipulation** in React components
- **Shared mutable global state** — use dependency injection
- **Hardcoded URLs** — use environment variables
