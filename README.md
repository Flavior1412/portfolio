# Khuong Nguyen Huu — career portfolio

A single-page Next.js and TypeScript portfolio featuring a scroll-driven hero,
career timeline, selected projects, skills and direct contact links. Profile and
career content is based on the supplied CV (2026-10-15); see
[UI notes](ai-agent/docs/reference-ui.md) for presentation details.

## Run locally

Requires Node.js 20.19+ and npm. From the repository root:

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then
`npm run start`. No API credentials are required.

## Content and configuration

- Site-wide copy and SEO text: `src/shared/data/content.json`.
- Profile, employment and hero captions: `src/features/profile/infrastructure/data/profile.json`.
- Timeline, projects and skills: the corresponding feature's
  `infrastructure/data/*.json` file. Preserve supplied facts and IDs; do not
  invent dates, achievements or social links. JSON order controls displayed order.
- Contact links use the supplied email and phone; Send Message opens the visitor's
  email client. There is no contact backend.

Set optional `SITE_URL` in a private `.env.local` for the production canonical
origin. No production domain is configured. Local-only `.env.example`,
`public/robots.txt` and `public/sitemap.xml` are absent from a fresh clone.
Metadata references `/og-image.png`, which also needs to be supplied before
sharing production preview cards.

## Structure

```text
src/
├── app/                         Routes, layout and page composition
├── features/
│   ├── profile/                 Profile and employment data
│   ├── timeline/                Career milestones and journey UI
│   ├── work/                    Project records and project UI
│   ├── skills/                  Skill catalog and section UI
│   └── hero/, about/, principles/, contact/  UI sections
└── shared/
    ├── components/              Layout, UI and motion components
    ├── hooks/                   Reusable browser hooks
    ├── lib/                     Shared helpers and visuals
    └── data/                    Site-wide copy and SEO text

tests/
├── unit/                        Feature, shared and architecture tests
└── e2e/                         Browser tests
public/                          Fonts and runtime artwork
ai-agent/                        Agent handoff and project notes
```

Data-backed features use this layout where applicable:

```text
<feature>/
├── domain/                      Models and repository contracts
├── application/                 Queries and use cases
├── infrastructure/              Adapters and data/*.json
├── presentation/                Components and CSS Modules
├── index.tsx                    Public UI exports
└── server.tsx                   Public data/query exports
```

UI-only features need only `presentation/`; `profile` is headless and has no
presentation layer. The concrete files in each feature reflect these needs.

Data-backed features (`profile`, `timeline`, `work`, `skills`) follow
Feature-Based + Clean Architecture: domain contracts, application queries,
infrastructure adapters and presentation UI. UI-only features keep presentation
only. `src/app/_composition/portfolio.tsx` wires data to queries; page sections
receive props through public feature APIs. Shared code does not depend on features.
Application source under `src` uses `.tsx`; JSON and CSS keep native extensions.
See [architecture and naming](ai-agent/docs/architecture.md).

## Checks

```sh
npm run typecheck
npm run lint
npm run test:architecture
npm test -- --run
npm run build
npx playwright install chromium
npm run e2e
```

Use `npm run test:coverage` for coverage. Browser checks can target a built server
with `PLAYWRIGHT_PRODUCTION=1 npm run e2e`; set `PLAYWRIGHT_CHANNEL=chrome` to use
an installed Chrome. The optional `/robots.txt` and `/sitemap.xml` checks need the
local-only files listed above. A fresh clone also needs local `.eslintrc.json` to
run lint:

```json
{ "extends": ["next/core-web-vitals", "next/typescript"] }
```

The lockfile, `.nvmrc`, ESLint config, environment templates, SEO files and CI
configuration are intentionally local-only in this checkout. `.gitignore` keeps
dependencies, generated output and local secrets out of version control.
