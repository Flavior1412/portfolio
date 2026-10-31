# Skill: Automated Testing

## Purpose

Audit, plan, and improve the automated test suite for a module, feature, or the entire codebase.

## When to Use

- Evaluating test coverage for an existing feature
- Adding tests after-the-fact to untested code
- Setting up the test framework from scratch
- Preparing for a production release

## Workflow

### Step 1 — Audit Coverage

```bash
npm test -- --run --coverage
```

Review the coverage report and identify:
- Files with < 70% branch coverage (flag for attention)
- Critical paths (auth, payments, data writes) with < 90% coverage
- Files with zero tests

### Step 2 — Prioritize

Rank untested code by risk:
1. **Critical** — auth, payments, data mutations
2. **High** — core business logic, external integrations
3. **Medium** — UI components, utility functions
4. **Low** — configuration, type-only files

### Step 3 — Write Tests

For each target, write tests in this order:

**Unit tests** — test a single function or component in isolation:
```typescript
describe('<ModuleName>', () => {
  it('<behavior description>', () => {
    // Arrange
    const input = ...;
    // Act
    const result = functionUnderTest(input);
    // Assert
    expect(result).toEqual(expected);
  });
});
```

**Integration tests** — test a slice of the system with real dependencies:
```typescript
describe('POST /api/<resource>', () => {
  it('creates a resource and returns 201', async () => {
    const response = await request(app)
      .post('/api/<resource>')
      .send(validPayload);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

**E2E tests** — test a user journey in a real browser (Playwright):
```typescript
test('<user journey>', async ({ page }) => {
  await page.goto('/');
  await page.click('text=<action>');
  await expect(page.locator('<selector>')).toBeVisible();
});
```

### Step 4 — Test Quality Checklist

For each test file, verify:
- [ ] Tests are deterministic (no random data without seeding)
- [ ] No real HTTP calls or database connections in unit tests
- [ ] Each test has a single, clear assertion focus
- [ ] Test names describe behavior, not implementation
- [ ] Error paths and edge cases are covered
- [ ] Mocks are cleaned up after each test (`afterEach`)

### Step 5 — Validate

```bash
npm test -- --run --coverage
```

Coverage targets:
- Statements: ≥ 80%
- Branches: ≥ 75%
- Functions: ≥ 80%
- Lines: ≥ 80%

Critical paths (auth, payments, mutations): ≥ 90% on all metrics.

## Test Naming Convention

```
<describe>: <component or module name>
<it>: <verb> <expected outcome> [when <condition>]

Examples:
it('returns 404 when user is not found')
it('throws ValidationError when email is missing')
it('renders loading spinner while fetching')
```

## Behavior Rules

- Never delete a test — if it's wrong, fix the test or the code
- Do not skip tests with `.skip` without a comment explaining when they will be fixed
- Flaky tests must be fixed or explicitly quarantined — they erode trust in CI
- Coverage thresholds are a floor, not a ceiling
