# Skill: Release Preparation

## Purpose

Prepare a safe, documented, reversible release from a green `main` branch to production.

## When to Use

- Preparing a new version for deployment
- Before tagging a release
- After completing a release milestone

## Workflow

### Step 1 — Pre-release Checklist (DevOps Engineer)

Verify all gates are green:

```bash
# All tests pass
npm test -- --run

# No type errors
npm run typecheck

# No lint errors
npm run lint

# No HIGH/CRITICAL vulnerabilities
npm audit --audit-level=high

# Build succeeds
npm run build
```

If any step fails, **stop** — do not proceed until fixed.

### Step 2 — Determine Version (DevOps Engineer)

Using Semantic Versioning based on commits since last release:

- Contains any `feat:` commit → **MINOR** bump
- Contains any `fix:` commit (only) → **PATCH** bump\
- Contains any `feat!:` or `BREAKING CHANGE:` → **MAJOR** bump

```bash
# Check commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

### Step 3 — Update CHANGELOG

Add a new version section to `ai-agent/CHANGELOG.md`:

```markdown
## [<version>] — <YYYY-MM-DD>

### Added
- <feature description> (#PR)

### Changed
- <change description> (#PR)

### Fixed
- <bug description> (#PR)

### Security
- <security fix> (#PR)
```

### Step 4 — Bump Version

```bash
npm version <major|minor|patch> --no-git-tag-version
```

Commit the change:
```bash
git add package.json package-lock.json ai-agent/CHANGELOG.md
git commit -m "chore: release v<version>"
```

### Step 5 — Create Release Document

Create `ai-agent/docs/releases/RELEASE-<version>.md` using the release checklist template from the DevOps agent.

Fill in:
- Deployment checklist
- Rollback plan
- Smoke test steps
- Stakeholder notification list

### Step 6 — Security Sign-off

Ask the Security Reviewer agent to confirm:
- `npm audit` is clean
- No security findings from the release diff

### Step 7 — Tag and Push

```bash
git tag -a v<version> -m "Release v<version>"
git push origin main --tags
```

### Step 8 — Post-Deploy Verification

After deployment, perform a smoke test:
- [ ] Application loads without errors
- [ ] Critical user journeys work (login, core feature)
- [ ] Health endpoint returns 200
- [ ] No error spike in monitoring

### Step 9 — Announce

Notify stakeholders with:
- Version number
- Key changes (link to CHANGELOG)
- Any known limitations or follow-up issues

## Rollback Procedure

If the release fails smoke tests:

1. Revert to previous version tag: `git revert --no-commit HEAD`
2. OR redeploy the previous Docker image tag
3. Document the failed release in `ai-agent/docs/releases/RELEASE-<version>-rollback.md`
4. Create a post-mortem issue

## Behavior Rules

- Never skip the pre-release checklist
- Never deploy to production without a documented rollback plan
- Never tag a release on a branch other than `main`
- Production deployments require explicit human approval — state this clearly and wait
