# Letterboxd Stats

Transform your Letterboxd movie data into beautiful, interactive analytics.

## What It Does

Upload your Letterboxd CSV export. Instantly see:
- **When** you watched movies (timelines, trends, patterns)
- **What** you rated (distribution, favorites, ratings over time)
- **Which decades** dominate your taste (classic vs contemporary)
- **Your viewing habits** (rewatches, most active periods, marathon weekends)

All processing happens in your browser. Your data never leaves your device.

## Key Features

✅ **Upload & Analyze** — Drag-drop CSV files, instant results
✅ **Six Core Charts** — Release year, ratings, timeline, decades, rewatches, calendar heatmap
✅ **Responsive Design** — Works on phone, tablet, desktop
✅ **Dark Mode** — Easy on the eyes, night viewing friendly
✅ **Privacy First** — All data stays in your browser, localStorage only
✅ **No Account Needed** — Upload, analyze, done

## Try It Now

[Live Demo](https://letterboxd-stats.vercel.app) (Coming soon)

Or run locally:

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## How to Use

1. **Export from Letterboxd**
   - Go to [Letterboxd Settings → Data](https://letterboxd.com/settings/data/)
   - Download your CSV files (diary.csv, ratings.csv, etc.)

2. **Upload Here**
   - Drag and drop files or click to select
   - Multiple files supported (we'll merge them automatically)

3. **Explore**
   - Charts render instantly
   - Hover for details, click to interact
   - Dark/light mode toggle in top right

## Architecture

**Client-Side Only**
- Built with React (Next.js)
- Charts via Recharts
- State: Zustand + localStorage
- No backend, no database, no API calls

**What's Included**
- CSV parser (handles all Letterboxd formats)
- Data merger (smart conflict resolution)
- Analytics engine (statistics, aggregations)
- Responsive chart components
- Dark/light theme system

**What's Not**
- User accounts or login
- TMDB enrichment (no genre/director data)
- Cloud storage or sharing
- Export/PDF functionality

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui |
| Charts | Recharts |
| State | Zustand |
| CSV Parser | PapaParse |
| Testing | Playwright, Vitest |

## Development

### Setup
```bash
git clone <repo>
cd letterboxd-stats-client
npm install
npm run dev
```

### Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run test:e2e     # End-to-end tests
npm run test:coverage # Coverage report
npm run lint         # Check code style
```

### Project Structure
```
app/                 # Pages (landing, dashboard, about)
components/          # React components
  ├── layout/        # Navigation, footer, theme
  ├── dashboard/     # Charts and stats
  └── ui/            # shadcn/ui components
lib/                 # Core logic
  ├── csv-parser.ts  # Parse Letterboxd CSVs
  ├── data-merger.ts # Merge multiple files
  ├── analytics-engine.ts  # Statistics
  └── types.ts       # TypeScript types
hooks/               # Custom hooks (state, analytics)
tests/               # Test files
```

## Quality Standards

✅ **Test-Driven Development** — Every feature tested first
✅ **Real Data Validation** — Tested with actual Letterboxd exports
✅ **Responsive Testing** — Mobile (375px), tablet (768px), desktop (1920px)
✅ **Error Handling** — Loading states, error messages, empty states
✅ **Zero Console Errors** — Production ready

## Design Philosophy

**Minimalistic** — Remove everything unnecessary
**Clear** — Readable information density, no clutter
**Smooth** — Fade-in animations, responsive interactions
**Dark-First** — Designed for dark mode, light mode is verified inverse
**Modular** — Each component independent, reusable, testable

## Contributing

This is a portfolio project. Suggestions welcome via GitHub issues.

## License

MIT

---

**Built with React, TypeScript, and a love for movies.**

Questions? Open an issue or check out the [architecture docs](./LETTERBOXD_STATS_CONSTITUTION.md).
