# Project Story

> **From film enthusiast to full-stack developer** — How a love of cinema sparked a journey into data visualization, performance engineering, and modern web development.

---

## The Beginning: A Love of Cinema

I've always been passionate about film. Not just watching movies, but truly experiencing them—understanding the craft, appreciating the cinematography, analyzing the narrative structures. Cinema is a language that transcends words, and I wanted to understand my relationship with it.

That's when I discovered **Letterboxd**, a social network for film lovers. It became my digital film diary, a place to:
- Track every movie I watched
- Rate and review films
- Discover new directors and genres
- Connect with other cinephiles
- Build curated lists and share recommendations

Over time, my Letterboxd account became a **treasure trove of viewing data**—thousands of logged films, ratings spanning years, notes on rewatches, favorite directors, evolving tastes.

But I wanted more.

---

## The Problem: Limited Analytics

Letterboxd offers basic statistics, even for Premium subscribers:
- Total films watched
- Average rating
- Top-rated films
- Most-watched year

These are useful, but **superficial**. I had deeper questions:

- **How have my tastes evolved over time?** Am I watching more contemporary films now than before?
- **What patterns exist in my rewatching behavior?** Do I rewatch classics or recent favorites?
- **Which decades define my taste?** Am I drawn to 90s cinema, golden-age Hollywood, or modern releases?
- **How do my ratings correlate with my likes?** Do I like films I rate lower?
- **What's my viewing velocity?** Am I watching more or fewer films year-over-year?

The data existed in my CSV exports, but there was **no way to visualize it meaningfully**.

I thought: *"What if I could build this myself?"*

---

## The Opportunity: Building Something Real

Most portfolio projects are **todo apps, weather dashboards, or CRUD applications**. They're fine for learning, but they don't solve real problems or demonstrate production-level thinking.

I wanted to build something that:

1. **Solves a real problem** (my own, and other Letterboxd users')
2. **Handles complex data processing** (thousands of records, multiple CSV sources, conflict resolution)
3. **Demonstrates frontend engineering skills** (performance, state management, data visualization)
4. **Respects user privacy** (100% client-side, no tracking, no server storage)
5. **Looks production-ready** (polished UI, accessibility, dark mode, responsive design)

And most importantly: something that would **evolve into a full-stack platform**, showcasing backend, AI, and database skills in future phases.

---

## The Journey: Phase 1 - Client-Side Analytics

### **Starting Point**

I began with a simple question:
> *"Can I parse a Letterboxd CSV and display a bar chart in the browser?"*

**First prototype:**
- Basic CSV upload
- Single chart: Rating distribution
- No error handling
- Hardcoded sample data
- No state persistence

**Learnings:**
- **PapaParse** handles CSV parsing better than manual regex
- **Recharts** integrates cleanly with React
- **Type safety** prevents bugs early (TypeScript wins)

### **Scaling Complexity**

As I added more features, complexity exploded:

**Challenge 1: Multiple CSV Sources**
Letterboxd exports 5 different CSV files:
- `watched.csv` - Base watched movies
- `diary.csv` - Detailed entries with dates, rewatches, tags
- `ratings.csv` - Most current ratings
- `films.csv` - Liked movies
- `watchlist.csv` - Movies to watch

**Problem:** Each file has overlapping data but different priorities. How do I merge them without losing information?

**Solution:** Build a **conflict resolution engine** (`lib/data-merger.ts`):
- Use `ratings.csv` as highest priority for ratings
- Use `diary.csv` for accurate watch dates
- Deduplicate by Letterboxd URI
- Preserve all enrichment (tags, likes, rewatches)

**Challenge 2: State Management**
As I added 18+ charts, state became chaotic:
- CSV data in one component
- Analytics computed multiple times
- No persistence (reload = lose data)
- Props drilling everywhere

**Solution:** Adopt **Zustand** for centralized state:
- Single source of truth
- Computed analytics cached
- localStorage persistence built-in
- Selective subscriptions (components only re-render when their slice changes)

**Challenge 3: Performance**
Processing 1,000+ films with real-time filtering across 18 charts:
- Initial implementation: **~500ms lag** on filter changes
- Unacceptable user experience

**Solution:** Multiple optimizations:
- **Memoization** (`useMemo`) for expensive transformations
- **Code splitting** (charts lazy-loaded)
- **Selective Zustand subscriptions** (components subscribe to slices, not entire store)
- **Pure functions** for analytics (no side effects, easy to optimize)
- **Result:** Sub-100ms updates, even with 2,000+ films

**Challenge 4: Data Visualization**
Not all charts are created equal. Some are intuitive; others mislead.

**The Tech Meeting Trenčín Lesson:**
At a tech meetup in Trenčín, Slovakia, I attended a talk on **data visualization pitfalls**. The speaker showed how a single outlier can skew a chart, making patterns invisible.

Example:
- **Misleading chart:** Y-axis auto-scales to include one extreme value (e.g., 500 views), compressing all other data points (10-50 views) into visual noise.
- **Better approach:** Remove outliers, or show dual axes, or use log scale.

**Impact on this project:**
I applied these principles:
- **Meaningful Y-axis ranges** (not always starting at 0)
- **Percentage vs absolute counts** (which tells a better story?)
- **Context in tooltips** (not just numbers—percentages, comparisons, insights)
- **Accessible color palettes** (colorblind-friendly, sufficient contrast)

### **The Result: Production-Ready Frontend**

After months of iteration, I had:
- ✅ **18+ interactive charts** answering deep questions about viewing patterns
- ✅ **Privacy-first architecture** (no backend, no tracking)
- ✅ **Sub-100ms performance** (even with large datasets)
- ✅ **95+ Lighthouse scores** (performance, accessibility, SEO, best practices)
- ✅ **Dark/light mode** with smooth theme switching
- ✅ **Fully responsive** (works on phone, tablet, desktop)
- ✅ **localStorage persistence** (resume where you left off)
- ✅ **Demo mode** (try with sample data, no upload needed)
- ✅ **Deployed on Vercel** with continuous deployment from GitHub

**Live demo:** [letterboxd-stats.vercel.app](https://letterboxd-stats-zeta.vercel.app/)

---

## Key Milestones

### **1. First Working Prototype** (Week 1-2)
- ✅ CSV upload working
- ✅ Single chart rendering
- ✅ Basic error handling
- 📊 **Learnings:** PapaParse, Recharts basics, file handling in React

### **2. Multi-Chart Dashboard** (Week 3-5)
- ✅ 10+ charts implemented
- ✅ Basic filtering (by year, rating)
- ✅ Responsive layout
- 📊 **Learnings:** Component composition, state management challenges, performance bottlenecks

### **3. State Management Overhaul** (Week 6)
- ✅ Migrated to Zustand
- ✅ localStorage persistence
- ✅ Optimized re-renders
- 📊 **Learnings:** Zustand patterns, performance profiling, selective subscriptions

### **4. Data Merging Engine** (Week 7-8)
- ✅ Handle 5 CSV types
- ✅ Conflict resolution
- ✅ Deduplication logic
- 📊 **Learnings:** Complex data transformations, edge case handling, validation

### **5. Performance Optimization** (Week 9)
- ✅ Memoization strategy
- ✅ Code splitting
- ✅ Bundle optimization
- 📊 **Learnings:** React DevTools Profiler, bundle analysis, lazy loading

### **6. UI/UX Polish** (Week 10-12)
- ✅ Dark mode implementation
- ✅ Animations (Motion.js)
- ✅ Accessibility improvements (ARIA, keyboard nav)
- ✅ Empty states, loading skeletons
- 📊 **Learnings:** Motion.js, Radix UI, shadcn/ui, Tailwind CSS

### **7. Production Deployment** (Week 13)
- ✅ Vercel deployment
- ✅ Custom domain setup
- ✅ Analytics (privacy-friendly)
- ✅ SEO optimization
- 📊 **Learnings:** Vercel Edge Network, deployment workflows, production monitoring

### **8. Testing & Documentation** (Week 14-15)
- ✅ Unit tests (Vitest)
- ✅ E2E tests (Playwright)
- ✅ Technical documentation
- ✅ User guide
- 📊 **Learnings:** Testing strategies, documentation as code, technical writing

---

## What I Learned

### **Technical Skills**

1. **Frontend Architecture**
   - Server vs client components (Next.js 16 App Router)
   - State management at scale (Zustand)
   - Performance optimization (memoization, code splitting, lazy loading)
   - Data visualization (Recharts, chart design principles)

2. **Data Engineering**
   - CSV parsing at scale (PapaParse)
   - Data merging and conflict resolution
   - Aggregation and statistical computations
   - Validation and error handling

3. **TypeScript Mastery**
   - Complex type definitions
   - Type inference and generics
   - Strict mode benefits
   - Type-driven development

4. **Production Engineering**
   - Deployment workflows (Vercel, GitHub Actions)
   - Performance monitoring (Lighthouse, Web Vitals)
   - Error tracking and logging
   - Security headers and CSP

### **Non-Technical Skills**

1. **Product Thinking**
   - Identifying real user needs (not just features)
   - Prioritizing features (MVP vs nice-to-have)
   - Balancing simplicity vs power
   - Privacy-first design decisions

2. **UX Design**
   - Data visualization principles
   - Accessibility standards (WCAG 2.1)
   - Responsive design patterns
   - Dark mode implementation

3. **Problem Solving**
   - Breaking complex problems into steps
   - Iterative development (ship early, iterate)
   - Performance debugging (profiling, bottleneck identification)
   - Technical decision-making (trade-offs, alternatives)

4. **Communication**
   - Technical writing (README, docs)
   - Code documentation (TSDoc comments)
   - Commit messages (conventional commits)
   - Community engagement (GitHub issues, discussions)

---

## The Impact

### **Personal Growth**

This project transformed how I approach software engineering:
- **Before:** "I need to learn React." → Build todo apps, follow tutorials
- **After:** "I have a problem to solve." → Research, architect, build, deploy, iterate

**Key shift:** From **consumer of tutorials** to **builder of solutions**.

### **Community Response**

Since deploying:
- 🌟 **X GitHub stars** (and growing)
- 👥 **X users** have tried the app
- 💬 **Feedback from Letterboxd community** (Reddit, Discord)
- 🎯 **Portfolio piece** for job applications

### **Future Opportunities**

This frontend project is **Phase 1 of a larger vision**:
- **Phase 2:** Backend API with TMDB enrichment (FastAPI, PostgreSQL, Docker)
- **Phase 3:** AI-powered insights (OpenAI API, vector embeddings)
- **Phase 4:** Social features (user accounts, shared collections, recommendations)

**Goal:** Demonstrate full-stack capability—from client-side data viz to backend architecture to AI integration.

---

## Why This Project Matters (For My Career)

### **It's Not a Tutorial Project**

Most bootcamp/tutorial projects:
- ✅ Follow step-by-step instructions
- ✅ Solve solved problems (todo app, weather app)
- ✅ Don't handle edge cases
- ✅ Aren't deployed or maintained

**This project:**
- ❌ No tutorial to follow—I architected it from scratch
- ❌ Solves a real problem (my own, and others')
- ❌ Handles production-level complexity (large datasets, error handling, performance)
- ❌ Deployed and actively maintained

### **It Demonstrates Real Skills**

Recruiters and hiring managers value:
- ✅ **Problem-solving:** Identified a need, designed a solution
- ✅ **Technical depth:** Performance optimization, state management, data processing
- ✅ **Production thinking:** Testing, deployment, monitoring, accessibility
- ✅ **Storytelling:** This document shows I can communicate technical decisions

### **It Shows Growth Mindset**

This isn't a finished product—it's **Phase 1 of an evolving platform**:
- Shows I think beyond frontend
- Demonstrates product vision
- Signals I'm building for the long term

---

## Reflections

### **What I'd Do Differently**

1. **Start with TypeScript from Day 1**
   - Migrating from JavaScript → TypeScript mid-project was painful
   - Type safety saves time in the long run

2. **Write Tests Earlier**
   - I wrote tests after building features
   - Writing tests first (TDD) would've caught bugs earlier

3. **Document Architecture Decisions**
   - I should've kept an ADR (Architecture Decision Record)
   - Would've saved time when revisiting old code

### **What Surprised Me**

1. **Performance is Felt, Not Measured**
   - Users don't see "95 Lighthouse score"—they feel snappy interactions
   - Sub-100ms updates feel instant; 200ms feels laggy

2. **Privacy is a Feature**
   - Users genuinely appreciate 100% client-side processing
   - No backend = no data breach risk = trust

3. **Open Source Engagement**
   - People actually use the app! And give feedback!
   - Community contributions are deeply rewarding

---

## What's Next?

This project isn't done—it's **evolving**.

**Immediate Next Steps (Phase 2):**
- Build FastAPI backend for TMDB metadata enrichment
- Design PostgreSQL schema for enriched data
- Create Docker Compose setup for local development
- Implement API rate limiting and caching

**Long-term Vision (Phase 3-4):**
- Integrate OpenAI GPT-4 for natural language insights
- Build recommendation engine based on viewing patterns
- Add social features (user accounts, shared collections)

**Career Next Steps:**
- Use this project to land a **frontend or full-stack developer role**
- Contribute to open-source projects in the data viz space
- Write technical articles about the learnings
- Engage with the Letterboxd and film communities

---

## The Takeaway

**This project taught me that the best way to learn is to build something you care about.**

I didn't set out to master React, TypeScript, or Zustand. I set out to **understand my film-watching patterns**—and learned those technologies along the way.

That's the difference between **learning to code** and **coding to learn**.

And that's why I'm confident this project will help me land my next role: it shows I don't just know how to code—**I know how to build**.

---

## Connect

Want to discuss this project, film recommendations, or potential opportunities?

- 🌐 **Live App:** [letterboxd-stats.vercel.app](https://letterboxd-stats-zeta.vercel.app/)
- 💻 **GitHub:** [github.com/MarianHolly/letterboxd-stats-client](https://github.com/MarianHolly/letterboxd-stats-client)
- 📧 **Contact:** [/contact](/contact)

---

*"Cinema is a matter of what's in the frame and what's out." — Martin Scorsese*

*This project is about discovering what's in the frame of my cinematic journey—one chart at a time.*

---

*Last Updated: January 2026*
