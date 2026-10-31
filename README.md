# Khuong Nguyen Huu — career portfolio

A single-page Next.js and TypeScript portfolio featuring a scroll-driven hero,
career timeline, selected projects, skills and direct contact links. Profile and
career content is based on the supplied CV (2026-10-15); see
[UI notes](ai-agent/docs/reference-ui.md) for presentation details.

## Run locally

Requires Node.js 20.19+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then
`npm run start`. No API credentials are required.

## Content

- Site copy and contact links: `src/shared/data/content.json`
- Profile and employment: `src/features/profile/infrastructure/data/profile.json`
- Timeline, projects and skills: each feature's `infrastructure/data/*.json`
- Resume: `public/resume/Khuong CV_281026.pdf`

Contact actions are Zalo, LinkedIn and Resume. There is no contact backend.

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

See [architecture notes](ai-agent/docs/architecture.md) and
[UI notes](ai-agent/docs/reference-ui.md) for more detail.
