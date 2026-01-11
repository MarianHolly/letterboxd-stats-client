# Future Vision

> **From client-side analytics to intelligent film discovery platform** — A roadmap for evolving Letterboxd Stats into a full-stack, AI-powered application.

---

## Overview

This project began as a **client-side data visualization tool**, but it's designed to evolve into a **comprehensive film discovery and analytics platform**. This document outlines the technical roadmap across 4 phases, demonstrating progression from frontend to full-stack to AI engineering.

**Current Status:** ✅ **Phase 1 Complete** (Client-Side Analytics)

**Timeline:** Phases 2-4 planned for 2026

---

## Evolution Strategy

### Why Evolve This Project?

1. **Demonstrate Full-Stack Skills**
   - Phase 1 shows frontend depth (React, TypeScript, state management, performance)
   - Phases 2-4 add backend (FastAPI, PostgreSQL), DevOps (Docker), and AI (OpenAI API)

2. **Solve Real Limitations**
   - Current: Users must manually upload CSVs for each session
   - Future: Persistent accounts, automatic syncing, richer metadata

3. **Show Product Thinking**
   - Not just adding features—designing a cohesive platform
   - Each phase builds on the last with clear user value

4. **Portfolio Differentiation**
   - Most candidates show either frontend OR backend skills
   - This project shows **end-to-end thinking**: client → server → database → AI → deployment

---

## Phase 1: Client-Side Analytics ✅ **COMPLETE**

**Status:** Live at [letterboxd-stats.vercel.app](https://letterboxd-stats-zeta.vercel.app/)

### What Was Built

- ✅ **CSV Upload & Processing** - 5 file types, conflict resolution, validation
- ✅ **18+ Interactive Charts** - Timeline, distribution, decades, ratios, progress
- ✅ **Real-Time Filtering** - Sub-100ms updates across all charts
- ✅ **Privacy-First Architecture** - 100% client-side, no backend
- ✅ **localStorage Persistence** - Resume sessions without re-upload
- ✅ **Dark/Light Mode** - Smooth theme switching
- ✅ **Production Deployment** - Vercel Edge Network, 95+ Lighthouse scores

### Technical Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript (strict mode) |
| **State Management** | Zustand + localStorage persistence |
| **Data Visualization** | Recharts |
| **UI Components** | Radix UI + shadcn/ui + Tailwind CSS v4 |
| **Animations** | Motion.js |
| **CSV Parsing** | PapaParse |
| **Testing** | Vitest (unit) + Playwright (E2E) |
| **Deployment** | Vercel (Edge Network) |

### Key Achievements

- 📊 **Performance:** Sub-100ms chart updates with 1000+ records
- 🎨 **UX:** Responsive, accessible, smooth animations
- 🔒 **Privacy:** Zero tracking, no backend, no data collection
- 📦 **Bundle Size:** ~150KB gzipped (all features included)
- ⚡ **Lighthouse:** 95+ scores across all metrics

---

## Phase 2: Backend API + Data Enrichment 🚧 **IN PLANNING**

**Goal:** Add a backend API to enrich Letterboxd data with TMDB metadata, enabling deeper analytics and persistent storage.

### User Value

**Current Limitations:**
- ❌ Letterboxd CSVs lack detailed metadata (genres, cast, directors, countries)
- ❌ Users must re-upload CSVs each session
- ❌ No historical tracking of viewing evolution over months/years
- ❌ Limited cross-film analytics (e.g., "directors you love but haven't watched in 2 years")

**New Capabilities:**
- ✅ **Persistent Accounts** - One-time upload, automatic sync
- ✅ **Rich Metadata** - Genres, directors, cast, countries, runtime, TMDB ratings
- ✅ **Advanced Filtering** - "Show me all sci-fi films from Japan rated 4+ stars"
- ✅ **Trend Analysis** - "Your taste shifted from action to drama in 2022"
- ✅ **Director/Actor Deep Dives** - "You've watched 15 Scorsese films, 8 with De Niro"

### Technical Architecture

#### **Backend Stack**

| Component | Technology | Why? |
|-----------|------------|------|
| **API Framework** | FastAPI | Async by default, auto-docs, type hints, fast |
| **Database** | PostgreSQL 16 | Robust, full-text search, JSON support, mature |
| **ORM** | SQLAlchemy 2.0 | Type-safe, async support, migrations |
| **Authentication** | JWT + httpOnly cookies | Secure, stateless, refresh token rotation |
| **Caching** | Redis | API rate limiting, session storage, computed results |
| **Task Queue** | Celery + Redis | Background TMDB enrichment, async processing |
| **Containerization** | Docker + Docker Compose | Local dev parity, easy deployment |
| **Deployment** | Railway / Render / DigitalOcean | Managed PostgreSQL, Redis, auto-scaling |

#### **Data Enrichment Pipeline**

```
User Uploads CSV → Backend API
    ↓
Parse & Validate (PapaParse server-side)
    ↓
Check PostgreSQL for Existing Films
    ↓
Query TMDB API for Missing Metadata
    |   ↓ Rate Limiting (40 req/10sec)
    |   ↓ Cache Results (Redis, 30 days)
    |   ↓ Retry Logic (exponential backoff)
    ↓
Merge TMDB Data with Letterboxd Data
    ↓
Store in PostgreSQL
    |   ↓ User table (accounts, settings)
    |   ↓ Film table (TMDB metadata)
    |   ↓ Viewing table (user watches, ratings, dates)
    |   ↓ Director/Actor/Genre tables (normalized)
    ↓
Return Enriched Dataset to Frontend
    ↓
Frontend Renders Enhanced Charts
```

#### **Database Schema Design**

```sql
-- Core Tables

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    letterboxd_username VARCHAR(255),
    settings JSONB DEFAULT '{}'::JSONB
);

CREATE TABLE films (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    letterboxd_uri VARCHAR(255) UNIQUE NOT NULL,
    tmdb_id INTEGER UNIQUE,
    title VARCHAR(500) NOT NULL,
    original_title VARCHAR(500),
    release_year INTEGER NOT NULL,
    runtime_minutes INTEGER,
    overview TEXT,
    tmdb_rating NUMERIC(3,1),
    tmdb_vote_count INTEGER,
    poster_path VARCHAR(255),
    backdrop_path VARCHAR(255),
    imdb_id VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE viewings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    watched_date DATE NOT NULL,
    rating NUMERIC(2,1) CHECK (rating >= 0.5 AND rating <= 5.0),
    liked BOOLEAN DEFAULT FALSE,
    rewatch BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, film_id, watched_date)
);

CREATE TABLE directors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tmdb_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_path VARCHAR(255)
);

CREATE TABLE film_directors (
    film_id UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    director_id UUID NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, director_id)
);

CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tmdb_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE film_genres (
    film_id UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, genre_id)
);

CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iso_3166_1 CHAR(2) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE film_countries (
    film_id UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, country_id)
);

-- Indexes for Performance
CREATE INDEX idx_viewings_user_id ON viewings(user_id);
CREATE INDEX idx_viewings_film_id ON viewings(film_id);
CREATE INDEX idx_viewings_watched_date ON viewings(watched_date);
CREATE INDEX idx_films_tmdb_id ON films(tmdb_id);
CREATE INDEX idx_films_title_gin ON films USING gin(to_tsvector('english', title));
```

#### **API Endpoints**

```python
# Authentication
POST   /api/auth/register              # Create account
POST   /api/auth/login                 # Login (returns JWT)
POST   /api/auth/logout                # Logout (invalidate token)
POST   /api/auth/refresh               # Refresh access token
GET    /api/auth/me                    # Get current user

# Data Upload & Sync
POST   /api/upload/csv                 # Upload Letterboxd CSVs
GET    /api/sync/status                # Check enrichment progress
POST   /api/sync/trigger               # Manually trigger re-sync

# Analytics
GET    /api/analytics/overview         # Summary stats
GET    /api/analytics/timeline         # Viewing over time
GET    /api/analytics/ratings          # Rating distributions
GET    /api/analytics/genres           # Genre breakdown
GET    /api/analytics/directors        # Director statistics
GET    /api/analytics/countries        # Country distributions
GET    /api/analytics/decades          # Decade preferences

# Films
GET    /api/films?search=query         # Search films
GET    /api/films/:id                  # Film details + TMDB metadata
GET    /api/films/:id/viewings         # User's viewing history for film

# Recommendations (Phase 3 preview)
GET    /api/recommendations/similar    # Similar films based on viewing history
GET    /api/recommendations/directors  # Directors to explore
```

#### **TMDB Integration**

**API Rate Limits:** 40 requests / 10 seconds

**Caching Strategy:**
- Cache TMDB responses in Redis (30-day TTL)
- Store enriched films in PostgreSQL permanently
- Only query TMDB for unknown films

**Error Handling:**
- Retry with exponential backoff (1s, 2s, 4s, 8s)
- Fall back to Letterboxd-only data if TMDB fails
- Log failures for manual review

**Data Quality:**
- Validate TMDB data (check required fields)
- Handle missing posters/overviews gracefully
- Normalize genres (TMDB IDs → consistent names)

#### **Deployment Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel Edge Network                 │
│  ┌───────────────────────────────────────────────┐     │
│  │  Next.js Frontend (Static Assets)             │     │
│  │  • Home, About, Guide, Contact                │     │
│  │  • Analytics Dashboard (client-side)          │     │
│  └─────────────────┬───────────────────────────────┘   │
│                     │ API Calls (HTTPS)                 │
└─────────────────────┼───────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│              Railway / Render (Backend Hosting)          │
│  ┌────────────────────────────────────────────────┐     │
│  │  FastAPI Backend (Docker Container)            │     │
│  │  • REST API (JWT auth)                         │     │
│  │  • TMDB Integration                            │     │
│  │  • Background Tasks (Celery)                   │     │
│  └─────┬───────────────────┬──────────────────────┘     │
│        │                   │                            │
│        ▼                   ▼                            │
│  ┌─────────────┐     ┌──────────────┐                  │
│  │ PostgreSQL  │     │    Redis     │                  │
│  │ (Managed)   │     │  (Caching +  │                  │
│  │             │     │   Sessions)  │                  │
│  └─────────────┘     └──────────────┘                  │
└──────────────────────────────────────────────────────────┘
```

### Implementation Plan

**Week 1-2: Backend Setup**
- ✅ FastAPI project structure
- ✅ PostgreSQL schema + migrations (Alembic)
- ✅ Docker Compose for local development
- ✅ Basic CRUD endpoints (users, films, viewings)

**Week 3-4: Authentication**
- ✅ JWT authentication flow
- ✅ Password hashing (bcrypt)
- ✅ Refresh token rotation
- ✅ httpOnly cookies for tokens

**Week 5-6: TMDB Integration**
- ✅ TMDB API client (rate limiting, caching)
- ✅ Background enrichment worker (Celery)
- ✅ Film metadata storage
- ✅ Error handling and retries

**Week 7-8: Analytics API**
- ✅ Port existing frontend analytics to backend
- ✅ New analytics (genres, directors, countries)
- ✅ Query optimization (indexed queries, aggregations)

**Week 9-10: Frontend Integration**
- ✅ Update frontend to call backend API
- ✅ Authentication UI (login, register, logout)
- ✅ New charts for enriched data
- ✅ Migration path (CSV upload still works, but optional)

**Week 11-12: Testing & Deployment**
- ✅ Unit tests (pytest)
- ✅ Integration tests (test DB)
- ✅ E2E tests (Playwright with backend)
- ✅ Deploy to Railway/Render
- ✅ CI/CD pipeline (GitHub Actions)

---

## Phase 3: AI-Powered Insights & Recommendations 🔮 **PLANNED**

**Goal:** Integrate AI to provide natural language insights, personalized recommendations, and intelligent discovery.

### User Value

**New Capabilities:**
- ✅ **Natural Language Queries** - "Show me underrated sci-fi from the 2010s"
- ✅ **AI-Generated Insights** - "Your taste has shifted toward character-driven dramas since 2020"
- ✅ **Personalized Recommendations** - Based on viewing patterns, not just ratings
- ✅ **Taste Profiling** - "You appreciate slow cinema with strong visual storytelling"
- ✅ **Discovery Prompts** - "You love Wes Anderson but haven't explored Jim Jarmusch"

### Technical Approach

#### **AI Integration Stack**

| Component | Technology | Why? |
|-----------|------------|------|
| **LLM Provider** | OpenAI GPT-4 API | Industry-leading reasoning, function calling |
| **Embeddings** | OpenAI text-embedding-3-small | Film similarity, semantic search |
| **Vector DB** | pgvector (PostgreSQL extension) | No separate DB needed, SQL joins work |
| **Prompt Engineering** | LangChain / custom | Structured outputs, context management |
| **Caching** | Redis | Cache AI responses (expensive API calls) |

#### **Use Cases**

**1. Natural Language Insights**

Example Prompt:
```
You are a film critic analyzing a user's viewing history.

Data:
- Total films watched: 1,234
- Average rating: 3.8/5
- Top-rated decade: 1990s
- Most-watched genre: Drama
- Recent trend: 60% of films in last 3 months are from 2020+

Generate 3 concise insights about this user's taste evolution.
```

Expected Output:
```
1. You're a 90s cinema enthusiast at heart, but increasingly exploring contemporary releases.
2. Your ratings lean generous (3.8 avg), suggesting you watch films you expect to enjoy.
3. Drama dominates your viewing, but you rarely dip below 3 stars—selective taste.
```

**2. Film Recommendations**

Strategy:
- **Content-Based Filtering:** Vector embeddings of film metadata (genres, directors, plot)
- **Collaborative Filtering:** Users with similar viewing patterns (future with multi-user data)
- **Hybrid:** Combine both approaches weighted by context

Example:
```sql
-- Find similar films using pgvector
SELECT f.title, f.release_year,
       1 - (f.embedding <=> query_embedding) AS similarity
FROM films f
WHERE f.id NOT IN (SELECT film_id FROM viewings WHERE user_id = :user_id)
ORDER BY f.embedding <=> query_embedding
LIMIT 10;
```

**3. Taste Profiling**

Analyze viewing history to generate a "taste profile":
- **Pacing Preference:** "You prefer deliberate pacing over fast-paced action"
- **Visual Style:** "Strong affinity for auteur cinematography (Malick, Tarkovsky)"
- **Themes:** "Drawn to existential themes and moral ambiguity"

**4. Discovery Engine**

Proactive suggestions:
- "You've watched 10 Fincher films but missed *Zodiac*—highly rated by similar users"
- "You love French New Wave but haven't explored Italian Neorealism"
- "Directors you'd likely enjoy: Kelly Reichardt, Lucrecia Martel"

#### **Implementation Plan**

**Week 1-2: Vector Embeddings**
- ✅ Generate embeddings for all films (TMDB metadata → OpenAI API)
- ✅ Store embeddings in PostgreSQL (pgvector extension)
- ✅ Similarity search queries

**Week 3-4: Insight Generation**
- ✅ Design prompts for viewing history analysis
- ✅ Integrate OpenAI GPT-4 API
- ✅ Cache AI responses (expensive to regenerate)
- ✅ Display insights on dashboard

**Week 5-6: Recommendation Engine**
- ✅ Implement content-based filtering (vector similarity)
- ✅ Hybrid ranking (similarity + ratings + recency)
- ✅ A/B test recommendation quality

**Week 7-8: Natural Language Queries**
- ✅ Parse user queries ("underrated sci-fi from 2010s")
- ✅ Convert to SQL filters (genre=sci-fi, year=2010-2019, rating<7.0)
- ✅ Return results with AI-generated summaries

**Week 9-10: Taste Profiling**
- ✅ Analyze patterns (genres, directors, eras, pacing, themes)
- ✅ Generate narrative profile
- ✅ Update as user watches more films

---

## Phase 4: Social & Collaborative Features 🌐 **FUTURE**

**Goal:** Enable users to share collections, compare tastes, and discover films through their network.

### User Value

**New Capabilities:**
- ✅ **Shared Collections** - "My 2025 Favorites" publicly shareable
- ✅ **Taste Comparisons** - "You and Alex both love Tarkovsky, but Alex rates comedies higher"
- ✅ **Group Watchlists** - Friends collaborate on shared lists
- ✅ **Social Recommendations** - "3 friends loved *The Substance*, you'd probably enjoy it"
- ✅ **Activity Feeds** - See what friends are watching

### Technical Approach

#### **Social Features Stack**

| Component | Technology | Why? |
|-----------|------------|------|
| **Authentication** | NextAuth.js | Social login (Google, GitHub), OAuth 2.0 |
| **Real-Time Updates** | WebSockets (FastAPI) | Live activity feeds, notifications |
| **Notifications** | Firebase Cloud Messaging | Push notifications (mobile/web) |
| **Image Storage** | Cloudinary / S3 | User avatars, collection covers |

#### **Database Extensions**

```sql
-- Friendships
CREATE TABLE friendships (
    user_id UUID REFERENCES users(id),
    friend_id UUID REFERENCES users(id),
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id)
);

-- Shared Collections
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collection_films (
    collection_id UUID REFERENCES collections(id),
    film_id UUID REFERENCES films(id),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (collection_id, film_id)
);

-- Activity Feed
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    activity_type VARCHAR(50) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Success Metrics

### Phase 1 (Complete)
- ✅ **95+ Lighthouse Score** → Achieved
- ✅ **Sub-100ms Chart Updates** → Achieved
- ✅ **50+ GitHub Stars** → In Progress
- ✅ **100+ Active Users** → In Progress

### Phase 2 (Target)
- 🎯 **1000+ Registered Users**
- 🎯 **99.9% Uptime**
- 🎯 **<200ms API Response Time (p95)**
- 🎯 **95%+ TMDB Enrichment Success Rate**

### Phase 3 (Target)
- 🎯 **AI Insight Accuracy** (user satisfaction survey >80%)
- 🎯 **Recommendation Click-Through Rate >25%**
- 🎯 **10,000+ Film Embeddings Generated**

### Phase 4 (Target)
- 🎯 **5000+ Active Users**
- 🎯 **50%+ User Retention (30-day)**
- 🎯 **1000+ Shared Collections Created**

---

## Why This Roadmap Matters

### **For My Career**

This roadmap demonstrates:

1. **Product Thinking** - Not just coding features, but solving evolving user needs
2. **Technical Breadth** - Frontend → Backend → AI → DevOps
3. **Scalability Awareness** - Designing for growth (caching, queuing, indexing)
4. **Long-Term Vision** - Building a platform, not just an app

### **For Users**

This evolution provides:
- **Phase 1:** Immediate value (privacy-first analytics)
- **Phase 2:** Convenience (persistent accounts, richer data)
- **Phase 3:** Intelligence (AI-powered discovery)
- **Phase 4:** Community (shared experiences, social discovery)

---

## Get Involved

Interested in contributing, collaborating, or following progress?

- 📅 **Roadmap Progress:** [GitHub Projects](https://github.com/MarianHolly/letterboxd-stats-client/projects)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/MarianHolly/letterboxd-stats-client/discussions)
- 🐛 **Feature Requests:** [GitHub Issues](https://github.com/MarianHolly/letterboxd-stats-client/issues)

---

*"The best way to predict the future is to build it."*

---

*Last Updated: January 2026*
