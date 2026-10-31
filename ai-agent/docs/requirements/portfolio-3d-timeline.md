# Plan: Portfolio 3D Timeline — Khuong Nguyen Huu

> Historical design, partly superseded as of 2026-10-30. Read
> [the current handoff](../../AGENTS.md) before implementing changes. The current
> site uses a still hero, a 2D sprite journey and email links; retired Three.js,
> frame-sequence and contact-API requirements below are preserved as history.

**Status:** Existing implementation under Phase 4 review\
**Date:** 2026-10-27\
**Complexity:** XL

---

## Requirement Summary

Build a personal portfolio website for Khuong Nguyen Huu (Senior Front-end Engineer, 8+ years) using **Next.js 14 (App Router) + TypeScript + Three.js + Tailwind CSS**, deployed to Vercel. The centrepiece is an interactive 3D scene powered by Three.js in which a human character visually grows from a child into an adult as the user scrolls through a vertical timeline. Each scroll position maps to a career/life milestone extracted from Khuong's CV. The rest of the site provides standard portfolio sections (hero, skills, contact). The site must be fully responsive and meet WCAG 2.1 AA accessibility standards.

---

## Assumptions

- A1. The 3D human character will be implemented with a **glTF/GLB model** (low-poly, CC0 licensed) sourced from a public library (e.g., Mixamo or Sketchfab free tier); custom character modelling is out of scope.
- A2. "Grows from child to adult" means a **morph-target / blend-shape animation** on the glTF model, or a scale + pose interpolation between two distinct models (child rig ↔ adult rig), whichever the chosen asset supports. Deferred — defaulting to **two-model cross-fade (child → adult) interpolated by scroll progress**.
- A3. Scroll-driven animation uses the browser **Scroll API + `useScroll` hook** (custom or via a thin utility) rather than a heavy animation library. Deferred — defaulting to **`@react-three/fiber` + `@react-three/drei` + `leva`** for the Three.js scene, and **Framer Motion** for 2D UI transitions.
- A4. The timeline renders **8 milestones** derived from the CV (student → 6 jobs + current role).
- A5. The site is a **single-page application** with anchor-based navigation (no additional routes beyond `/`). Deferred — defaulting to SPA.
- A6. No CMS or database is required; all content is hardcoded in TypeScript data files.
- A7. Internationalisation is out of scope; English only.
- A8. Dark-mode support is **included** (Tailwind `dark:` variants). Deferred — defaulting to dark-mode-first with a toggle.
- A9. Deployment target is **Vercel** using the default Next.js preset; no custom server or edge functions required.
- A10. Analytics and SEO metadata (Open Graph, JSON-LD) are **in scope** as lightweight additions.
- A11. Contact form sends email via **Resend API** (free tier); no backend DB required.
- A12. Testing framework: **Vitest + React Testing Library** for unit/component tests; **Playwright** for E2E smoke tests.

---

## Open Questions

- None — all deferred (see Assumptions A1–A12 above).

---

## Affected Areas

- `/app` — Next.js App Router pages and layouts
- `/components` — React component tree (UI + 3D canvas)
- `/lib` — data files, timeline data, utility hooks
- `/public` — static assets (3D models, textures, fonts, OG image)
- `/styles` — global CSS / Tailwind config
- `tailwind.config.ts` — theme extension
- `next.config.ts` — Three.js / WebGL-related config (transpilePackages)
- `vercel.json` — deployment config
- `docs/` — ADR and API docs (contact form endpoint)
- CI — GitHub Actions workflow for lint + test + typecheck

---

## Task List

| # | Task | Layer | Depends On | Estimate |
|---|---|---|---|---|
| T1 | Initialise Next.js 14 project with TypeScript, Tailwind CSS, ESLint, Prettier | Infra | — | S |
| T2 | Configure Tailwind theme (colours, typography, dark mode, custom fonts) | Styles | T1 | S |
| T3 | Install and configure Three.js ecosystem (`@react-three/fiber`, `@react-three/drei`, `three`) | Infra | T1 | S |
| T4 | Install Framer Motion and configure animation defaults | Infra | T1 | S |
| T5 | Define TypeScript interfaces: `Milestone`, `Skill`, `Project`, `ContactPayload` | Types | T1 | S |
| T6 | Author timeline data file (`lib/data/timeline.ts`) with all 8 CV milestones | Data | T5 | S |
| T7 | Author skills data file (`lib/data/skills.ts`) with categorised skill list | Data | T5 | S |
| T8 | Set up Vitest + React Testing Library; add `npm run test` script | Infra | T1 | S |
| T9 | Set up Playwright E2E skeleton; add `npm run e2e` script | Infra | T1 | S |
| T10 | Create root layout (`app/layout.tsx`): metadata, fonts, dark-mode class, global providers | UI | T2, T4 | S |
| T11 | Build `<ThemeToggle>` component with system-preference detection | UI | T10 | S |
| T12 | Build `<Navbar>` component: logo, anchor links, theme toggle, mobile hamburger | UI | T11 | S |
| T13 | Source / select child and adult glTF/GLB character models; place in `public/models/` | Assets | — | M |
| T14 | Build `<CharacterScene>` Three.js canvas: load both models, set up camera, lighting, environment | 3D | T3, T13 | L |
| T15 | Implement scroll-progress hook (`useScrollProgress`) that maps page scroll % to `[0, 1]` | Hooks | T1 | S |
| T16 | Implement cross-fade animation logic in `<CharacterScene>`: interpolate opacity/scale between child and adult model driven by `scrollProgress` | 3D | T14, T15 | L |
| T17 | Implement idle animation loop on the active character (floating / breathing) | 3D | T16 | M |
| T18 | Build `<TimelineSection>` wrapper: full-height scroll container that drives the 3D scene | UI | T6, T16 | M |
| T19 | Build `<MilestoneCard>` component: date range, role, company, description, icon | UI | T6 | S |
| T20 | Animate `<MilestoneCard>` entrance with Framer Motion (fade + slide) on scroll into viewport | UI | T19, T4 | S |
| T21 | Connect `<TimelineSection>` scroll position to `<CharacterScene>` via React context or prop drilling | UI/3D | T18, T16 | M |
| T22 | Build `<HeroSection>`: name, title, tagline, CTA buttons, animated background particles | UI | T10 | M |
| T23 | Build `<SkillsSection>`: categorised skill chips with animated reveal | UI | T7, T4 | S |
| T24 | Build `<ContactSection>`: form (name, email, message) with client-side validation | UI | T10 | S |
| T25 | Implement contact form API route (`app/api/contact/route.ts`) using Resend SDK | API | T5, T24 | S |
| T26 | Add `.env.example` and document `RESEND_API_KEY` environment variable | Config | T25 | S |
| T27 | Build `<Footer>` component: social links (GitHub, LinkedIn, email) | UI | T10 | S |
| T28 | Assemble main page (`app/page.tsx`): compose all sections in order | UI | T22, T18, T23, T24, T27 | S |
| T29 | Implement responsive breakpoints across all sections (mobile / tablet / desktop) | UI | T28 | M |
| T30 | Implement WCAG 2.1 AA accessibility: focus management, ARIA labels, reduced-motion support for 3D scene | A11y | T28 | M |
| T31 | Add SEO metadata: `<head>` tags, Open Graph image, JSON-LD structured data, `sitemap.xml`, `robots.txt` | SEO | T28 | S |
| T32 | Optimise performance: lazy-load 3D canvas with `dynamic` import + Suspense fallback, image optimisation, font preload | Perf | T28 | M |
| T33 | Write unit tests for data utilities, `useScrollProgress`, `<MilestoneCard>`, `<ContactSection>` validation | Tests | T8, T20, T24 | M |
| T34 | Write Playwright E2E smoke tests: page load, timeline scroll interaction, contact form submission | Tests | T9, T28 | M |
| T35 | Configure GitHub Actions CI: install → lint → typecheck → unit test → build | CI | T8 | S |
| T36 | Configure `vercel.json` and verify Vercel deployment (preview + production) | Deploy | T35 | S |
| T37 | Update `docs/requirements/README.md` index and write `docs/adr/ADR-002-3d-timeline-architecture.md` | Docs | T28 | S |

---

## Acceptance Criteria

### Project Setup
- [ ] AC-01: `npm run dev` starts the development server without errors on Node.js 20+.
- [ ] AC-02: `npm run build && npm run start` produces a working production build with no TypeScript errors.
- [ ] AC-03: `npm run lint` reports zero errors.
- [ ] AC-04: `npm run typecheck` (`tsc --noEmit`) reports zero errors.

### 3D Timeline Scene
- [ ] AC-05: On desktop, the Three.js canvas renders a 3D character within 3 seconds of initial page load (measured by Lighthouse TTI ≤ 4 s on a simulated fast 3G).
- [ ] AC-06: Scrolling from the top to the bottom of the timeline section causes the character to visually transition from child to adult (cross-fade between the two models is observable).
- [ ] AC-07: The character model cross-fade is smooth (no frame drops below 30 fps on a mid-range laptop as measured by Chrome DevTools).
- [ ] AC-08: Exactly 8 milestone cards are rendered in the timeline, matching the CV data in `lib/data/timeline.ts`.
- [ ] AC-09: Each milestone card displays: date range, role title, company name, and a brief description.
- [ ] AC-10: Milestone cards animate into view (fade + slide) as the user scrolls past them.
- [ ] AC-11: When `prefers-reduced-motion: reduce` is active, all scroll-driven 3D animations and card entrance animations are disabled; the character is shown in its adult state statically.

### Responsive Design
- [ ] AC-12: The site renders correctly at 375 px (mobile), 768 px (tablet), and 1440 px (desktop) with no horizontal overflow.
- [ ] AC-13: The navbar collapses to a hamburger menu on viewports ≤ 768 px and the menu opens/closes correctly.
- [ ] AC-14: On viewports ≤ 768 px, the 3D canvas is hidden or replaced by a static illustration fallback to preserve performance.

### Sections & Content
- [ ] AC-15: The Hero section displays Khuong's name, title ("Senior Front-end Engineer"), and at least two CTA links (e.g., "View Timeline", "Contact Me").
- [ ] AC-16: The Skills section lists all skills from `lib/data/skills.ts` grouped by category.
- [ ] AC-17: The Contact form validates that all three fields (name, email, message) are non-empty and that the email field is a valid email address before submission.
- [ ] AC-18: A successful contact form submission returns HTTP 200 and displays a success message to the user.
- [ ] AC-19: A failed contact form submission (e.g., missing `RESEND_API_KEY`) returns an appropriate error message without crashing the page.
- [ ] AC-20: The Footer displays links to GitHub and LinkedIn that open in a new tab.

### Accessibility
- [ ] AC-21: All interactive elements (links, buttons, form inputs) are keyboard-navigable and have visible focus indicators.
- [ ] AC-22: All images and 3D canvas have meaningful `alt` text or `aria-label` attributes.
- [ ] AC-23: Colour contrast ratios meet WCAG 2.1 AA (≥ 4.5:1 for body text, ≥ 3:1 for large text) in both light and dark modes.
- [ ] AC-24: The dark/light theme toggle is accessible: labelled with `aria-label` and indicates current state.

### SEO & Performance
- [ ] AC-25: `<head>` contains a descriptive `<title>`, `<meta name="description">`, and Open Graph tags.
- [ ] AC-26: Lighthouse Performance score ≥ 80 on the production Vercel URL (desktop preset).
- [ ] AC-27: `sitemap.xml` and `robots.txt` are served at the root URL.

### Testing
- [ ] AC-28: `npm test -- --run` executes all unit tests with zero failures; coverage ≥ 70% on `lib/` utilities and form validation logic.
- [ ] AC-29: Playwright E2E suite passes: page loads, timeline section is scrollable, contact form validation fires correctly.

### Deployment
- [ ] AC-30: The site is deployed and publicly accessible on a Vercel production URL.
- [ ] AC-31: GitHub Actions CI pipeline passes on every push to `main` (lint + typecheck + unit test + build).

---

## Out of Scope

- Custom 3D character modelling or rigging (uses existing CC0 glTF assets).
- Backend database or CMS for content management.
- Blog / article section.
- Multilingual / i18n support.
- Authentication or user accounts.
- Advanced analytics beyond a basic page-view integration (e.g., no custom event tracking pipeline).
- Custom domain setup (Vercel default subdomain is acceptable for initial delivery).
- PWA / offline support.
- Automated visual regression testing (Chromatic, Percy, etc.).
- Server-Side Rendering of the Three.js scene (canvas is client-only via dynamic import).


## Phase 4 scope clarification — 2026-10-27

Resume from Code Review using the existing implementation and preserve its folder
and component structure. The accepted correction addendum in ADR-002 supersedes
conflicting early assumptions. Eight visible cards comprise one explicitly
illustrative undated origin plus seven CV-backed education/project milestones.
The human is completed inside the existing procedural component, without external
GLB sourcing. The user approved dependency security updates without restructuring.

AC-20 social profiles are deferred because the CV supplies no verified GitHub or
LinkedIn URLs. The CV email remains available. AC-26/30 (deployed Lighthouse and
public hosting) and hosted AC-31 CI execution are outside this local cycle;
workflow configuration is reviewed and local equivalent checks are run. Performance
budgets/fps and formal WCAG certification require separate measurements and are
not implied by passing functional tests. No deployment is performed by this skill.
