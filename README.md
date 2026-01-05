# Letterboxd Stats - Interactive Film Analytics

Transform your Letterboxd viewing history into beautiful, interactive analytics. Discover patterns, trends, and insights from your cinema journey with 18+ charts and visualizations.

**Live Demo:** [letterboxd-stats.vercel.app](https://letterboxd-stats.vercel.app)

## What It Does

Upload your Letterboxd CSV export. Instantly see:
- **When** you watched movies (timelines, trends, patterns, heatmaps)
- **What** you rated (distribution, favorites, ratings over time, rating trends)
- **Which decades** dominate your taste (classic vs contemporary, decade breakdown)
- **Your viewing habits** (rewatches, most active periods, marathon weekends)
- **Directors & Genres** (filmmaker frequency, genre preferences)
- **Monthly patterns** (best months to watch, seasonal trends)

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

[**Live Demo →**](https://letterboxd-stats.vercel.app)

Or run locally:

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Getting Started

### Prerequisites
- Node.js 18+ or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/MarianHolly/letterboxd-stats-client.git
cd letterboxd-stats-client

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### How to Use

1. **Get Your Data**
   - Log into Letterboxd
   - Go to Settings → Data Import & Export
   - Download your CSV files (watched, ratings, diary, etc.)

2. **Upload**
   - Click "Analytics" button or "Start Exploring"
   - Drag & drop your CSV files or click to select
   - Click "Continue to Dashboard"

3. **Explore**
   - View 18+ interactive charts
   - Filter and analyze your viewing patterns
   - Share insights (data stays in your browser)

4. **Try Demo**
   - Click "Try Sample Data" without uploading anything
   - Choose from pre-loaded film collections (1,656 or 1,999 films)

## Privacy & Security

- **100% Client-Side Processing** — Everything runs in your browser
- **Zero Data Collection** — No servers, databases, or tracking
- **Security Headers** — CSP, XSS protection, clickjacking prevention
- **HTTPS Only** — Encrypted data transmission
- **Open Source** — Full code transparency, inspect anytime
- **GDPR Compliant** — No cookies, no personal data storage

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom theme system
- **UI Components:** shadcn/ui + Radix UI
- **Charts:** Recharts (React-based D3 visualization)
- **Animations:** Framer Motion
- **State Management:** Zustand (lightweight state management)
- **Data Parsing:** PapaParse (CSV parsing)
- **Icons:** Lucide React

### Development & Deployment
- **Bundler:** Turbopack (Next-gen build tool)
- **Deployment:** Vercel (Edge network)
- **Testing:** Jest + Playwright
- **Type Checking:** TypeScript
- **Code Quality:** ESLint

## Available Scripts

```bash
# Development
npm run dev           # Start dev server (http://localhost:3000)

# Production
npm run build         # Build for production
npm start            # Start production server

# Testing
npm test             # Run Jest tests
npm test:watch      # Run tests in watch mode
npm test:coverage   # Generate coverage report

# Linting
npm run lint        # Run ESLint

# Utilities
npm run generate:canon-lists  # Generate canonical film lists
```

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

## Performance

- **Build Time:** ~13s (Turbopack)
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices)
- **Bundle Size:** ~150KB (gzipped)
- **Time to Interactive:** <2s on 3G

## Future Roadmap

### Phase 2: Data Enrichment
- TMDB API integration for movie metadata
- Genre, director, country, and cast information
- Advanced filtering by enriched data

### Phase 3: AI & Recommendations
- OpenAI GPT-4 powered insights
- Personalized movie recommendations
- Natural language analysis of taste

### Phase 4: Social Features
- User authentication (NextAuth.js)
- Shared watch lists and recommendations
- Collaborative features with friends

## Contributing

Contributions are welcome! Please feel free to:

1. **Report Bugs** - Open an issue on GitHub
2. **Suggest Features** - GitHub discussions or issues
3. **Submit PRs** - Fork, develop, and submit pull requests

## License

MIT License — See LICENSE file for details

## Questions or Issues?

- 🐛 **Found a bug?** [Open an issue](https://github.com/MarianHolly/letterboxd-stats-client/issues)
- 💡 **Have an idea?** [Start a discussion](https://github.com/MarianHolly/letterboxd-stats-client/discussions)
- 📧 **Want to contribute?** Check out our [Contact page](/contact)

---

Made with ❤️ for film enthusiasts and data lovers.

**Built with React, TypeScript, and a passion for movies.**
