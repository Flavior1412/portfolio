# Rule: Security Rules

**Applies to:** All source files, configurations, and infrastructure code

## Non-Negotiable Rules

These rules are blocking — code that violates them must not be merged:

1. **No secrets in source code** — ever, including test files and comments
2. **No raw SQL string interpolation** — use parameterized queries or an ORM
3. **No `eval()` or `new Function()`** — ever
4. **No `dangerouslySetInnerHTML`** without explicit sanitization (DOMPurify)
5. **Every API endpoint must check authorization** — not just authentication
6. **All inputs validated at the API boundary** — before they touch business logic

## Authentication & Authorization

- Use established libraries (e.g., Auth.js / Passport.js / Clerk) — do not roll your own auth
- JWTs: short expiry (≤ 15 min access token), refresh token rotation
- Sessions: HttpOnly, Secure, SameSite=Strict cookies
- Passwords: bcrypt with work factor ≥ 12 (or argon2id)
- Rate-limit auth endpoints (login, register, password reset)
- Invalidate tokens/sessions on logout

## Input Validation

Every API endpoint must validate with a schema (zod preferred):

```typescript
// ✅ Correct
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});
const body = schema.parse(req.body); // throws on invalid

// ❌ Wrong — no validation
const { email, name } = req.body;
```

## Output Encoding

- React JSX auto-escapes — do not bypass with `dangerouslySetInnerHTML`
- For server-rendered HTML: use a template engine that auto-escapes
- For API responses: `Content-Type: application/json` always set explicitly

## HTTP Security Headers

Ensure these headers are set in production:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: (project-specific; start with strict and loosen)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: (restrict camera, microphone, geolocation)
```

## Dependency Security

- `npm audit` must pass at `--audit-level=high` in CI
- Pin exact versions: `"package": "1.2.3"` not `"^1.2.3"` for production deps
- Review `npm audit` report before adding any new package
- No packages from unknown publishers with < 100 weekly downloads

## Environment & Secrets

- `.env` is gitignored — verify before every commit
- `.env.example` contains all required variable names with placeholder values
- If a future feature introduces secrets, document its actual rotation procedure in `ai-agent/docs/ops/`; the current portfolio needs no credentials.
- Never log request bodies that may contain passwords or tokens

## CSRF Protection

- All state-changing requests require either:
  - CSRF token (traditional forms), OR
  - SameSite=Strict cookie + custom request header check (SPA)

## Security Review Trigger

The following changes always require a security review pass (Security Reviewer agent):
- New authentication or authorization code
- New file upload functionality
- New external API integration
- New environment variable that holds a secret
- Changes to Content Security Policy
- New admin or privileged endpoint
