# Agent handoff

Updated: 2026-10-31 (Asia/Ho_Chi_Minh).

Read the user's request and inspect `git status` before editing. Preserve existing
user changes and current behavior unless asked otherwise. This file describes the
current baseline; older ADRs, requirements and workflow templates are historical,
not instructions to restore retired features.

## Project baseline

- Next.js single-page portfolio: Hero, Principles, About, Timeline, Work, Skills,
  Contact and footer. Navigation links to About, Timeline, Work, Skills and Contact.
- Hero uses one local still image with GSAP scroll captions. Timeline uses a
  measured SVG route and local eight-frame walking sprite. Reduced motion disables
  smooth scrolling, hero pinning and gait animation. Keep section IDs, animation
  refs and `[data-journey-card]` stable; navigation and route measurement depend on them.
- URL section hashes restore after page load, fonts and hero pin measurements,
  with a 90px navigation offset. Back/Forward and direct links restore the target;
  without a valid section hash the page starts at the top. Restoration happens once
  per navigation so subsequent manual scrolling stays free.
- Career data is based on the supplied 2026-10-15 CV. Current timeline contains
  education and six projects. Preserve source data and IDs; do not invent facts,
  dates or social URLs. ODMS uses July 2017 from its project page. Contact is direct
  email/phone; there is no backend.
- No production domain is configured. `SITE_URL` is optional; keep `.env*` private.
  Metadata references `/og-image.png`, which is not present. SEO files are local-only.
- Keep the current monochrome design, local fonts and runtime artwork. Do not
  restore retired Three.js/GLB assets, old sprite sequences, Framer Motion, Resend
  or Zod based on historical notes.

## Architecture and conventions

- Source lives in `src/app`, `src/features` and `src/shared`; tests live in `tests`.
  Do not move the frontend into `app/` or `ai-agent/`.
- `timeline`, `work`, `skills` and headless `profile` own `domain`, `application`
  and `infrastructure`; presentation lives in `presentation` as needed. UI-only
  features (`hero`, `about`, `principles`, `contact`) need presentation only.
- Domain contracts and application queries must not depend on React, Next, JSON,
  browser APIs or concrete adapters. Infrastructure implements contracts. App
  composition in `src/app/_composition/portfolio.tsx` wires adapters to queries;
  `src/app/page.tsx` passes results to sections through public `server.tsx` and
  `index.tsx` APIs.
- Use relative imports inside a feature and `@/shared/*` for reusable code. Shared
  must not import features; features must not import each other's internals.
- Application source under `src` is `.tsx` only; JSON and CSS retain native
  extensions. `allowJs` is disabled. Use PascalCase for components/types,
  `useCamelCase` for hooks, kebab-case module filenames otherwise, and camelCase
  for functions and values. See `docs/architecture.md` for details.
- Site copy is in `src/shared/data/content.json`; profile, timeline, project and
  skill records are in their owning feature's `infrastructure/data/`. Keep copy
  out of components and retain named placeholders. JSON is imported at build time.
- Reusable surfaces/lists are in `src/shared/components/ui`; component CSS belongs
  in adjacent CSS Modules. Keep decorative work wipes `aria-hidden`.

## Local workflow

Use Node.js 20.19+ and npm from the repository root. A fresh clone runs `npm install`
then `npm run dev`; local `.nvmrc` and lockfile are intentionally untracked. No
credentials are needed. Useful checks:

```sh
npm run typecheck
npm run lint
npm run test:architecture
npm test -- --run
npm run build
npm run e2e
```

`npm run test:architecture` checks dependency boundaries and TSX-only source.
Fresh clones need a local `.eslintrc.json` for lint and local
`public/robots.txt`/`public/sitemap.xml` for their browser endpoint checks; see
the root README. Do not re-add ignored local config, lockfile, environment or SEO
files to version control unless explicitly requested.

## Reference notes

- `docs/architecture.md`: dependency rules and naming.
- `docs/reference-ui.md`: current UI and interaction behavior.
- `docs/journey-animation.md`: timeline sprite and route details.
- `docs/adr/`, `docs/requirements/`, `CHANGELOG.md`, and `.claude/` templates:
  historical context; current source and this handoff take precedence.
