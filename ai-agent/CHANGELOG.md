# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).\
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed — local-only repository files, 2026-10-30

- At the user's request, stopped tracking `.github/`, `.vscode/`, the static
  robots/sitemap files, environment template, ESLint config, Node version file
  and npm lockfile. Kept local copies and added explicit Git ignore rules.
- Updated setup and handoff notes for `npm install` and the configuration/SEO
  files that collaborators now need to create locally.


### Changed — reproducible handoff and cleanup, 2026-10-30

- Added a root agent entry point and recorded the verified Node/npm environment.
- Corrected the current handoff and README to describe the still hero and email
  contact; marked older architecture and requirements as historical.
- Retained workflow skills, agent roles, project history, optional Kiro reminders
  and shared editor settings for the next phase.
- Removed two unused hero images, an unused rotation helper, obsolete GLB
  performance data, an irrelevant secret inventory and stale Claude permissions.
- Documented the existing missing Open Graph image without changing page behavior.


### Changed — root frontend layout, 2026-10-30

- Moved the frontend source, assets, tests, dependencies and configuration from
  `app/` to the repository root and removed `app/`.
- Updated root paths in CI, editor settings, agent instructions and documentation.
- Limited Git ignore rules to generated output, local environment files and
  machine-specific files so tests and `ai-agent/` remain versionable.

### Changed — duplicate entry cleanup, 2026-10-30

- Removed the four redundant root links to agent files and folders. Agent
  configuration now lives only under `ai-agent/`.

### Changed — repository organization, 2026-10-30

- Moved the complete frontend package into `app/`, including `src/app` routes,
  components, shared modules, public assets, tests, dependencies and configuration.
- Centralized Claude/Kiro tooling and project history under `ai-agent/`.
- Added `ai-agent/AGENTS.md` as the continuation note and retained root agent
  discovery through compatibility symlinks.
- Updated aliases, Tailwind scanning, coverage, browser-test imports, CI and
  editor settings for the new package location.

### Changed — unused code cleanup, 2026-10-30

- Removed legacy 3D assets, old sprite sheets, unused fonts, an extra hero frame,
  empty source folders and obsolete timeline fields.
- Removed the unused contact form and API; Send Message now opens email directly.
- Removed Framer Motion, Resend, Zod and the redundant direct Playwright package;
  kept Playwright Test and the active GSAP/Lenis animation stack.
- Updated contact tests and configuration; enabled TypeScript unused-code checks.

### Changed — character presentation, 2026-10-28

- Replaced disconnected primitive anatomy with one optimized, MIT-licensed rigged
  human with textured face, clothing, hair, hands and normal maps.
- Added natural skeletal idle, facial blinking and continuous scroll growth.
- Added a soft three-point studio, local environment reflections/contact shadows,
  adaptive detail, bounded zoom and smooth orbit/reset controls.
- Kept the current scene/component organization and responsive/motion fallbacks.

### Fixed — Phase 4 review, 2026-10-27

- Retained the current source structure while completing procedural child/adult
  humans and synchronizing their growth to the document timeline.
- Replaced nested scrolling with eight readable milestones; conditionally mount
  desktop WebGL, provide static fallback and respect reduced motion.
- Corrected CV facts/skills, removed invented dates and social links, self-hosted
  fonts and supplied the missing Open Graph artwork.
- Fixed mobile navigation, theme-storage failures, text/button contrast and scroll
  resize/short-section handling.
- Hardened the contact boundary and correctly handle provider errors; ignore local
  secrets and cover API failures with direct route tests.
- Updated and pinned vulnerable dependencies with user approval; kept the existing
  App Router/component organization. Documented local verification/deployment limits.

### Added

- Initial Claude Code AI-assisted SDLC framework
- Specialized subagents: business-analyst, solution-architect, developer, qa-engineer, security-reviewer, devops-engineer
- Reusable skills: feature-planning, feature-implementation, bug-fixing, automated-testing, code-review, release-prep
- Path-specific rules for coding standards, architecture, testing, and security
- Documentation structure: requirements, ADRs, API contracts, ops runbooks, releases

---

_Releases will be listed here in reverse chronological order._
