# Rule: Testing Rules

**Applies to:** All test files (`*.test.ts`, `*.test.tsx`, `tests/`)

## Test Organization

```
Unit tests:        tests/unit/*.{test,spec}.{ts,tsx}
Integration tests: tests/integration/
E2E tests:         tests/e2e/
Test fixtures:     tests/fixtures/
Test utilities:    tests/utils/
```

## Mandatory Coverage Gates

These are enforced in CI and must not be lowered without an ADR:

```json
{
  "statements": 80,
  "branches": 75,
  "functions": 80,
  "lines": 80
}
```

Critical modules (`auth/`, `payments/`, `api/`): 90% on all metrics.

## Test File Rules

1. One test file per source file for unit tests
2. Import the module under test first, then test utilities, then mocks
3. Group related tests in `describe` blocks matching the function/component name
4. Use `beforeEach` for setup, `afterEach` for teardown — never `beforeAll` for state that tests mutate
5. Reset mocks after every test: `vi.clearAllMocks()` in `afterEach`

## What to Test

✅ Test:
- Public API of modules (exported functions, component props/events)
- All branches in business logic
- Error paths and edge cases
- Behavior described in acceptance criteria

❌ Do not test:
- Private implementation details
- Third-party library internals
- TypeScript types (trust the compiler)
- Trivial getters/setters with no logic

## Mocking Rules

- Mock at the module boundary, not inside functions
- Use factory functions for mock data, not hardcoded literals spread across files
- Integration tests: use real DB in a transaction (roll back after)
- E2E tests: seed the DB with known fixtures before each test suite

## Forbidden in Tests

- `Math.random()` without a seeded PRNG
- `Date.now()` without mocking — use `vi.setSystemTime()`
- `setTimeout` without `vi.useFakeTimers()`
- Real HTTP calls (use MSW or `nock` to intercept)
- `console.log` left in committed test files
- `.only` and `.skip` in committed test files (CI will fail)

## Test Naming

```typescript
// Module: describe block matches the thing under test
describe('UserService', () => {
  describe('getUserById', () => {
    it('returns the user when found')
    it('throws NotFoundError when user does not exist')
    it('throws UnauthorizedError when caller lacks permission')
  })
})
```
