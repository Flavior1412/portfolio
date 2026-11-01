# Agent handoff

Updated: 2026-10-31 (Asia/Ho_Chi_Minh).

Before editing, inspect `git status` and preserve existing user changes. Current
user requests take precedence over historical notes.

## Project

- Next.js single-page portfolio with Hero, Principles, About, Timeline, Work,
  Skills, Contact and footer sections.
- Keep the monochrome visual style, local fonts and runtime artwork.
- Preserve section IDs, animation refs and `[data-journey-card]`; navigation,
  hash restoration and timeline measurement depend on them.
- Career data comes from the supplied CV. Do not invent dates, facts or social URLs.
- Contact action copy and URLs live in `src/shared/data/content.json`:
  Zalo, LinkedIn and Resume. The resume file is
  `public/resume/Khuong CV_281026.pdf`.
- There is no backend. The production URL is `https://khuongnh-portfolio.vercel.app`;
  `src/app/robots.txt` and `src/app/sitemap.xml` reference it. Keep `.env*` private.

## Architecture

- Source: `src/app`, `src/features`, `src/shared`; tests: `tests`.
- Do not move the frontend into `app/` or `ai-agent/`.
- `profile`, `timeline`, `work` and `skills` use domain/application/infrastructure
  layers. UI-only features keep presentation code only.
- Domain/application code must not depend on React, Next, JSON, browser APIs or
  concrete adapters. Use relative feature imports and `@/shared/*` for shared code.
- Application source is `.tsx`; data is JSON and styles are CSS/CSS Modules.
- Keep copy in `src/shared/data/content.json` and feature data in each feature's
  `infrastructure/data/` directory.

## Checks

Use Node.js 20.19+ and npm from the repository root:

```sh
npm run typecheck
npm run lint
npm run test:architecture
npm test -- --run
npm run build
npm run e2e
```

See `docs/architecture.md`, `docs/reference-ui.md` and `docs/journey-animation.md`
for detailed conventions.
