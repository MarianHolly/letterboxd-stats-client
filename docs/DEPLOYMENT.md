# Deployment Guide

> **Complete deployment documentation** for the Letterboxd Stats application. This guide covers production deployment on Vercel, alternative platforms, CI/CD pipelines, and monitoring.

**Last Updated:** January 2026

---

## Table of Contents

1. [Production Deployment (Vercel)](#production-deployment-vercel)
2. [Vercel Configuration](#vercel-configuration)
3. [Alternative Deployment Targets](#alternative-deployment-targets)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Deployment Checklist](#deployment-checklist)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Production Deployment (Vercel)

The application is optimized for deployment on **Vercel** (recommended platform).

### Prerequisites

- Vercel account (free tier works)
- GitHub repository connected to Vercel
- Node.js 18+ installed locally

---

### Automatic Deployments

Vercel automatically deploys when you push to specific branches:

| Branch | Deployment Type | URL |
|--------|----------------|-----|
| `main` | **Production** | `letterboxd-stats.vercel.app` |
| `dev` | **Staging** | `letterboxd-stats-dev.vercel.app` |
| Pull Requests | **Preview** | `letterboxd-stats-pr-123.vercel.app` |

**Workflow:**

1. **Push to `main`** → Automatic production deployment
2. **Push to `dev`** → Automatic staging deployment
3. **Open Pull Request** → Automatic preview deployment

---

### Manual Deployment

#### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Option 2: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" on any deployment
5. Select "Production" or "Preview"

---

### Initial Setup (First Time)

#### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### 2. Configure Environment Variables

Currently, the application **does not require** environment variables (100% client-side).

**For future phases (when backend is added):**

Navigate to Project Settings → Environment Variables:

```bash
# Example future variables:
DATABASE_URL=postgresql://...
TMDB_API_KEY=...
NEXTAUTH_SECRET=...
```

#### 3. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain:
   - Example: `letterboxd-stats.com`
3. Follow DNS configuration instructions
4. Vercel handles SSL certificate automatically

---

### Deployment Settings

#### Build & Development Settings

**File:** Project Settings → Build & Development Settings

```yaml
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

#### Node.js Version

**File:** Project Settings → General → Node.js Version

```
Node.js Version: 18.x (or 20.x)
```

---

## Vercel Configuration

### next.config.ts

**File:** `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for Docker (optional)
  output: 'standalone',

  // Image optimization
  images: {
    domains: ['a.ltrbxd.com'],  // Letterboxd CDN for future posters
  },

  // Environment variables (client-side only)
  env: {
    NEXT_PUBLIC_APP_NAME: 'Letterboxd Stats',
  },

  // Turbopack for faster builds
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
```

---

### vercel.json (Optional)

**File:** `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",

  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],

  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

---

### Performance Settings

Vercel automatically applies:

- **Edge Network:** Global CDN with 100+ locations
- **Compression:** Automatic Gzip/Brotli compression
- **Caching:** Static assets cached at edge
- **Image Optimization:** Automatic WebP conversion

---

## Alternative Deployment Targets

### Option 1: Netlify

#### Setup

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Functions directory:** (leave empty)

#### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

---

### Option 2: Self-Hosted (Docker)

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Deploy

```bash
# Build image
docker build -t letterboxd-stats .

# Run container
docker run -p 3000:3000 letterboxd-stats

# Or use docker-compose
docker-compose up -d
```

---

### Option 3: AWS Amplify

#### amplify.yml

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## CI/CD Pipeline

### GitHub Actions

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - dev
  pull_request:
    branches:
      - main
      - dev

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel (Preview)
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel (Production)
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Required Secrets

Add these to GitHub repository secrets (Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN` - Vercel access token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

**How to get these:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Get tokens (saved in .vercel/project.json)
cat .vercel/project.json
```

---

## Deployment Checklist

Before deploying to production:

### Code Quality
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)

### Performance
- [ ] Lighthouse scores 95+ (all metrics)
- [ ] Bundle size <200KB gzipped
- [ ] Core Web Vitals meet targets:
  - [ ] LCP <2.5s
  - [ ] FID <100ms
  - [ ] CLS <0.1

### Functionality
- [ ] CSV upload works (all 6 file types)
- [ ] Demo mode works
- [ ] All 27 charts render correctly
- [ ] Dark/light mode works
- [ ] localStorage persistence works
- [ ] Mobile responsive

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on images

### Security
- [ ] No console errors/warnings
- [ ] No exposed secrets/API keys
- [ ] Security headers configured
- [ ] HTTPS only

### Documentation
- [ ] README.md updated
- [ ] CHANGELOG.md updated (if applicable)
- [ ] Documentation reflects changes

---

## Monitoring & Maintenance

### Vercel Analytics

**Enable Vercel Analytics:**

1. Go to Project Settings → Analytics
2. Enable Analytics
3. Install package:

```bash
npm install @vercel/analytics
```

4. Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Metrics Tracked:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices
- Core Web Vitals

---

### Error Tracking (Optional - Future)

For production error monitoring, consider:

**Sentry:**

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

---

### Performance Monitoring

**Vercel Web Analytics:**
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Geographic performance data

**Lighthouse CI:**
- Automated Lighthouse audits on every deployment
- Performance regression detection

---

### Uptime Monitoring

Consider using:
- **Vercel Status** (built-in)
- **UptimeRobot** (free tier: 50 monitors)
- **Pingdom**
- **Better Uptime**

---

## Troubleshooting

### Issue: Build Fails on Vercel

**Error:** `Module not found: Can't resolve '@/...'`

**Solution:**
Check `tsconfig.json` has correct path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### Issue: Charts Don't Render

**Error:** `Hydration failed` or blank charts

**Solution:**
Ensure chart components use `"use client"` directive:

```typescript
"use client"

export function MyChart() { /* ... */ }
```

---

### Issue: Slow Build Times

**Problem:** Build takes >5 minutes

**Solutions:**
1. Enable caching in `next.config.ts`
2. Use Turbopack (already enabled)
3. Check for large dependencies in `node_modules`
4. Reduce number of imports

---

### Issue: 404 on Custom Routes

**Problem:** Direct navigation to `/analytics` returns 404

**Solution:**
Ensure `vercel.json` has correct rewrites:

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/:path*"
    }
  ]
}
```

---

### Issue: localStorage Not Working

**Problem:** Data lost on page reload in production

**Solution:**
Check Next.js hydration. Use `useEffect` for localStorage:

```typescript
useEffect(() => {
  const stored = localStorage.getItem('key');
  if (stored) {
    setData(JSON.parse(stored));
  }
}, []);
```

---

## Deployment Workflow Summary

### Daily Development

```bash
# Feature branch
git checkout -b feature/my-feature
git commit -m "feat: add feature"
git push origin feature/my-feature

# Open PR → Automatic preview deployment
# Review → Merge to dev → Automatic staging deployment
```

### Production Release

```bash
# After testing on dev
git checkout main
git merge dev
git push origin main

# → Automatic production deployment to letterboxd-stats.vercel.app
```

### Rollback

If production deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "Promote to Production"

Or via CLI:

```bash
vercel rollback
```

---

## Related Documentation

- **[TESTING.md](./TESTING.md)** - Testing before deployment
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance optimization
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development workflow

---

*Last Updated: January 2026*
*Maintained by: Maria Holly*
