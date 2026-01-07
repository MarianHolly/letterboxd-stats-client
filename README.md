# Letterboxd Stats - Interactive Film Analytics

A **production-grade, client-side analytics application** that processes large datasets directly in the browser without backend infrastructure. Built with modern React, TypeScript, and advanced data visualization to demonstrate real-world frontend engineering skills.

Transform your Letterboxd viewing history into 18+ interactive, responsive charts and insights—all while maintaining complete privacy and optimal performance.

**[→ Live Demo](https://letterboxd-stats-zeta.vercel.app/)**

## Why This Project?

This isn't a typical CRUD or todo-list portfolio project. It solves real frontend engineering challenges:

- **Large-scale client-side data processing** — Parse, aggregate, and filter 1000+ film records with sub-100ms interactions
- **Complex interactive state** — Build responsive charts that handle real-time filtering across multiple dimensions
- **Privacy-first architecture** — 100% browser-based computation eliminates backend infrastructure needs
- **Production-ready UX** — Dark/light themes, smooth animations, accessibility standards, and 95+ Lighthouse scores

This demonstrates frontend maturity: understanding data structures, performance constraints, and building applications that handle real complexity.

## What It Does

Upload your Letterboxd CSV export. Instantly analyze:
- **When** you watched movies (timelines, heatmaps, trend analysis)
- **What** you rated (rating distributions, favorite films, temporal trends)
- **Decade preferences** (classic vs contemporary content analysis)
- **Viewing habits** (rewatch patterns, peak activity periods, binge behavior)
- **Directors & Genres** (filmmaker frequency, genre preferences, discovery patterns)
- **Monthly & seasonal patterns** (temporal viewing trends)

All processing happens in your browser. Your data never leaves your device.

## Key Features

✅ **18+ Interactive Charts** — Comprehensive analytics dashboard with visualizations
✅ **Upload & Analyze** — Drag-drop CSV files, instant results
✅ **Responsive Design** — Works on phone, tablet, desktop
✅ **Dark/Light Mode** — Beautiful themes, easy on the eyes
✅ **Privacy First** — 100% client-side, all data stays in your browser
✅ **No Account Needed** — Upload, analyze, explore
✅ **Demo Mode** — Try with sample data (1,656-1,999 films)
✅ **Zero Tracking** — No servers, no databases, no API calls

## Try It Now

[**Live Demo →**](https://letterboxd-stats-zeta.vercel.app/)

Or run locally:

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## How to Use

### Try the Live App (No Installation Needed)
1. Visit **[letterboxd-stats.vercel.app](https://letterboxd-stats-zeta.vercel.app/)**
2. Click **"Try Sample Data"** to explore with 1,656+ pre-loaded films
3. Or **upload your CSV file** from Letterboxd (Settings → Data Import & Export)

### Run Locally

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/MarianHolly/letterboxd-stats-client.git
cd letterboxd-stats-client
npm install
npm run dev

# Open http://localhost:3000
```

### Using Your Data

1. **Export from Letterboxd**
   - Log in to Letterboxd
   - Go to Settings → Data Import & Export
   - Download your CSV files

2. **Upload to the App**
   - Drag & drop your CSV file or click to select
   - Instant processing begins (all in your browser)

3. **Explore Your Analytics**
   - View 18+ interactive charts
   - Filter by year, decade, genre, director, rating
   - Export insights and patterns

## Privacy & Security

- **100% Client-Side Processing** — Everything runs in your browser
- **Zero Data Collection** — No servers, databases, or tracking
- **Security Headers** — CSP, XSS protection, clickjacking prevention
- **HTTPS Only** — Encrypted data transmission
- **Open Source** — Full code transparency, inspect anytime
- **GDPR Compliant** — No cookies, no personal data storage

## Tech Stack & Architecture Decisions

### Frontend Framework & Runtime
- **Next.js 16** with App Router — Server/client component separation for optimal performance and code splitting
- **TypeScript** — Type safety across the entire application, catching bugs at compile time
- **React 19** — Latest hooks and features for efficient component composition

### State & Data Management
- **Zustand** — Lightweight, scalable state management for chart filtering and UI state without Context API overhead
- **PapaParse** — Robust CSV parsing handling edge cases, large files, and various formatting
- **Custom data aggregation** — Optimized algorithms for real-time filtering across 1000+ records

### Visualization & UI
- **Recharts** — React-based charting library providing interactive, responsive visualizations with minimal bundle impact
- **Radix UI + shadcn/ui** — Unstyled, accessible component primitives (Dialog, Dropdown, Tooltip, etc.)
- **Tailwind CSS v4** — Utility-first styling with custom theme system for dark/light mode switching
- **Motion (Framer Motion fork)** — Smooth, performant animations and transitions

### Developer Experience
- **Turbopack** — Next-gen bundler delivering sub-15s builds with hot reload
- **Vitest** — Fast unit testing with Jest-compatible syntax
- **Playwright** — E2E testing for user workflows and browser compatibility
- **ESLint** — Code quality standards and consistency

### Deployment
- **Vercel Edge Network** — Automatic deployments, edge optimization, and instant cache invalidation

## Development & Testing

### Getting Started (5 minutes)

```bash
# Clone and setup
git clone https://github.com/MarianHolly/letterboxd-stats-client.git
cd letterboxd-stats-client
npm install

# Start development server with hot reload
npm run dev
# → Open http://localhost:3000
```

### NPM Scripts

```bash
# Development
npm run dev              # Hot reload dev server with Turbopack

# Production Build & Deploy
npm run build            # Production build with optimizations
npm start                # Start production server locally

# Testing Suite
npm test                 # Run unit & integration tests (Vitest)
npm test:watch          # Watch mode for TDD
npm test:ui             # Interactive UI test dashboard
npm test:coverage       # Generate coverage report
npm run test:e2e         # Run end-to-end tests (Playwright)

# Code Quality
npm run lint             # ESLint + fix auto-fixable issues

# Utilities
npm run generate:canon-lists  # Generate canonical film lists
```

### Testing Strategy
- **Unit Tests (Vitest)** — CSV parser, data aggregation algorithms, state management
- **E2E Tests (Playwright)** — User workflows: upload, filter, export
- **Lighthouse Checks** — Performance, accessibility, and best practices automated

## Project Structure

```
letterboxd-stats-client/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with metadata
│   ├── error.tsx                # Error boundary page
│   ├── page.tsx                 # Home page
│   ├── about/                   # About page with tech stack
│   ├── guide/                   # User guide with screenshots
│   ├── roadmap/                 # Product roadmap
│   ├── contact/                 # Contact page
│   ├── analytics/               # Main dashboard
│   └── api/                     # API routes (sample data)
├── components/
│   ├── analytics/               # Chart components
│   ├── layout/                  # Navigation, footer, layouts
│   ├── dialogs/                 # Modal dialogs
│   ├── ui/                      # Base UI components
│   └── charts/                  # Chart visualizations
├── hooks/                       # Custom React hooks
├── lib/
│   ├── sample-data.ts          # Sample dataset definitions
│   ├── csv-parser.ts           # CSV parsing utilities
│   ├── data-merger.ts          # Data processing
│   └── types.ts                # TypeScript types
├── public/                      # Static assets
├── styles/                      # Global styles
└── scripts/                     # Build/utility scripts
```

## Deployment

The application is optimized for deployment on Vercel (recommended):

```bash
# Deploy to Vercel
vercel deploy
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Highlights

### Performance & Optimization
- **Build Time:** ~13s (Turbopack) — Leverages next-gen bundling for rapid iteration
- **Bundle Size:** ~150KB (gzipped) — Tree-shaking unused code, optimized dependencies
- **Time to Interactive:** <2s on 3G — Lazy loading, code splitting, and strategic preloading
- **Lighthouse Scores:** 95+ across Performance, Accessibility, SEO, and Best Practices
- **Real-time Filtering:** Sub-100ms chart updates while aggregating 1000+ records

### Frontend Architecture
- **Server/Client Component Split** — Using Next.js 16 App Router to minimize JavaScript sent to clients
- **Custom CSV Parser** — Handles edge cases, various formats, and validates 1000+ film records
- **State Management at Scale** — Zustand store orchestrating complex, multi-dimensional filtering across charts
- **Responsive Component Design** — Mobile-first approach with Tailwind CSS, testing across 3+ breakpoints
- **Accessibility First** — Radix UI primitives, ARIA labels, keyboard navigation, screen reader support

### User Experience
- **Dark/Light Theme System** — Persistent user preference with smooth transitions via CSS variables
- **Smooth Animations** — Motion.js animations for chart updates, modal transitions, and micro-interactions
- **Error Handling** — Graceful degradation, user-friendly error messages, and recovery paths
- **Demo Mode** — Pre-loaded sample datasets allowing users to explore without uploading data

## Future Roadmap

This project will expand to demonstrate full-stack capabilities:

### Phase 2: Data Enrichment (Planned)
- **Backend:** FastAPI + PostgreSQL for TMDB metadata enrichment
- **Integration:** TMDB API for movie metadata (genres, directors, countries, ratings)
- **Frontend:** Advanced filtering and enrichment visualization
- **Deployment:** Docker containerization for backend services

### Phase 3: AI & Personalization (Planned)
- **ML Integration:** OpenAI GPT-4 API for natural language insights
- **Recommendations:** Personalized movie suggestions based on viewing patterns
- **Analytics:** AI-powered trend analysis and taste profiling

### Phase 4: Social & Collaborative (Planned)
- **Authentication:** NextAuth.js with social login
- **User Accounts:** Persistent user profiles and shared collections
- **Collaboration:** Share watchlists, comparisons, and recommendations with friends

## Contributing

Contributions are welcome! Please feel free to:

1. **Report Bugs** - Open an issue on GitHub
2. **Suggest Features** - GitHub discussions or issues
3. **Submit PRs** - Fork, develop, and submit pull requests

## License

MIT License — See LICENSE file for details

## Get In Touch

- **Found a bug?** [Open an issue](https://github.com/MarianHolly/letterboxd-stats-client/issues)
- **Have feedback or questions?** [Start a discussion](https://github.com/MarianHolly/letterboxd-stats-client/discussions)
- **Want to collaborate or discuss?** [Contact me](/contact)

---

## About This Project

Built to demonstrate **modern frontend engineering practices**: performance optimization, accessibility standards, complex state management, and production-ready code quality. This project shows what's possible with client-side technologies—and how to build applications that don't require backend infrastructure while maintaining excellent UX.

**Created with React, TypeScript, and attention to detail.**
