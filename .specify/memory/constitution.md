# Letterboxd Stats - Specification Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
Every feature begins with tests. Tests are written first, approved by user, then fail, then implemented. Red-Green-Refactor cycle strictly enforced. Unit tests cover data transformations; integration tests cover user workflows. No code ships without passing tests.

### II. Browser-First, Client-Side Data
All user data stays in the browser. No server calls, no external APIs in production code. Data is parsed, transformed, and manipulated entirely in-browser via localStorage for persistence. Users own their data completely. Privacy is built-in, not bolted-on.

### III. Modular, Testable Components
Every component is independently testable. Clear input/output contracts. Dependencies are injected. Components export both presentational and test-ready patterns. Data transformation logic is separated from rendering logic. Each module has a single, clear responsibility.

### IV. CSV as the Data Foundation
Charts are designed to work with CSV-only data from Letterboxd exports (diary, ratings, watched, films, watchlist). All primary analytics chains start with CSV sources. TMDB enrichment is treated as optional enhancement via mock data patterns, never as a requirement for core functionality.

### V. Responsive, Modern, Dark-First Design
All components render correctly on mobile, tablet, and desktop. Dark mode is the default design direction; light mode is the complement. Design is minimalistic and smooth. Clarity prioritizes readable information density. No bloat, no unnecessary decoration.

### VI. Thoughtful Animation & Micro-Interactions
Animations enhance user experience, not distract from it. Use animations to:
- Provide feedback on user actions (hover, click states)
- Guide attention to important elements
- Smooth transitions between states
- Create delightful micro-interactions on hero/landing pages
Avoid unnecessary animations on data-heavy pages (dashboards, charts). Keep animations subtle and purposeful, not gratuitous.

### VII. Quality Standards (Mandatory Gates)
- Unit and integration tests required for all data transformation and chart logic
- All charts must work with real CSV user data before shipping
- Responsive testing on three breakpoints: mobile (375px), tablet (768px), desktop (1920px)
- Loading, error, and empty states required for every data-dependent component
- Zero console errors before production deployment

## Chart Design & Enrichment Strategy

### CSV-First Charts (Core MVP)
Charts are designed and built using CSV-only data:
- Release year distribution
- Rating distribution
- Viewing timeline
- Decade breakdown
- Rewatch analysis
- Calendar heatmap

### Mock-Based Enrichment Layer
After CSV charts are complete, add secondary chart implementations using mock TMDB-enriched data:
- Genre distribution (mock data)
- Director rankings (mock data)
- Actor collaboration (mock data)
- Country/language breakdown (mock data)

Mock enrichment charts validate the UI/UX pattern and are test fixtures. They demonstrate what future enrichment would look like without requiring backend infrastructure.

## Development Workflow

### Testing Gates
1. Write tests for proposed feature (RED)
2. User approves test shape and expectations
3. Implement code to pass tests (GREEN)
4. Refactor for clarity and performance (REFACTOR)
5. Merge only after tests pass and responsive validation complete

### Deployment Gates
- No unhandled errors in console (all caught and displayed to user)
- All charts validated with real user CSV data
- Responsive testing completed on mobile, tablet, desktop
- Loading/error/empty states tested
- Accessibility baseline met (keyboard nav, ARIA labels)

## Data Architecture

### CSV Parsing & Merging
- PapaParse for robust CSV parsing
- Normalize all CSV formats into unified Movie[] schema
- Merge strategy: diary.csv > ratings.csv > watched.csv (priority order)
- Letterboxd URI is canonical identifier

### State Management & Persistence
- Zustand for lightweight, testable state
- localStorage for transparent persistence
- Clear, pure data transformation functions
- No side effects in data computation layers

## UI & UX Principles

### Clarity First
- Charts prioritize readable information over decoration
- Tooltips explain what's being measured
- Legend and axis labels are self-explanatory
- Empty states guide users toward next actions

### Smoothness & Minimalism
- Animations support clarity, not distraction
- Transitions feel responsive without feeling sluggish
- Color palette reduced to essential highlight + neutral scales
- Whitespace used intentionally

### Dark Mode Default
- All designs start in dark mode
- Light mode as verified inverse
- Contrast ratios meet WCAG AA standard
- No jarring color shifts between themes

## Governance

This constitution supersedes all ad-hoc decisions. All PRs must verify compliance with:
- Test coverage for new logic (unit + integration)
- Responsive design validation
- CSV data source compatibility
- Error state handling

Amendments require documented rationale, user approval, and migration plan.

**Version**: 1.0 | **Ratified**: 2025-11-20 | **Last Amended**: 2025-11-20
