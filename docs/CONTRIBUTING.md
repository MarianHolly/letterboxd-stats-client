# Contributing to Letterboxd Stats

> **Thank you for considering contributing!** This guide will help you get started with contributing to the Letterboxd Stats project.

Whether you're fixing a bug, adding a feature, improving documentation, or just exploring the codebase, this guide has everything you need.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Requirements](#testing-requirements)
5. [Documentation Requirements](#documentation-requirements)
6. [Pull Request Process](#pull-request-process)
7. [Code of Conduct](#code-of-conduct)
8. [Getting Help](#getting-help)

---

## Getting Started

### Prerequisites

Make sure you have these installed:

- **Node.js** 18+ (check with `node --version`)
- **npm** or **yarn** (check with `npm --version`)
- **Git** (check with `git --version`)

### Local Development Setup

```bash
# 1. Fork the repository on GitHub
# Click "Fork" button at https://github.com/MarianHolly/letterboxd-stats-client

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/letterboxd-stats-client.git
cd letterboxd-stats-client

# 3. Add upstream remote (original repository)
git remote add upstream https://github.com/MarianHolly/letterboxd-stats-client.git

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev

# 6. Open in browser
# Navigate to http://localhost:3000
```

**Verify Setup:**
- ✅ Development server runs without errors
- ✅ Application loads at `http://localhost:3000`
- ✅ Hot reload works (make a change and see it update)

---

## Development Workflow

### Branching Strategy

We use a **Git Flow** inspired branching model:

```
main        - Production-ready code (protected)
dev         - Development branch (merge target for PRs)
feature/*   - New features
fix/*       - Bug fixes
docs/*      - Documentation updates
refactor/*  - Code refactoring
test/*      - Test additions/improvements
```

### Creating a Feature

#### 1. Sync with upstream

```bash
# Fetch latest changes from upstream
git fetch upstream

# Switch to dev branch
git checkout dev

# Merge upstream changes
git merge upstream/dev

# Push to your fork
git push origin dev
```

#### 2. Create a feature branch

```bash
# Create and switch to new branch
git checkout -b feature/amazing-feature

# Or for bug fixes:
git checkout -b fix/bug-description

# Or for documentation:
git checkout -b docs/update-readme
```

#### 3. Make changes

Edit files, add features, fix bugs, etc.

```bash
# Check what changed
git status

# Review changes
git diff
```

#### 4. Commit changes

Follow **Conventional Commits** format:

```bash
# Add files to staging
git add .

# Commit with descriptive message
git commit -m "feat: add annual summary chart"
git commit -m "fix: resolve CSV parsing error for special characters"
git commit -m "docs: update CHARTS_CATALOG with new chart"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring (no feature/bug change)
- `test:` - Test additions or changes
- `chore:` - Build process, dependencies, tooling

#### 5. Push to your fork

```bash
# Push feature branch to your fork
git push origin feature/amazing-feature
```

#### 6. Open a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. **Base repository:** `MarianHolly/letterboxd-stats-client`
4. **Base branch:** `dev` (not `main`!)
5. **Head repository:** Your fork
6. **Compare branch:** Your feature branch
7. Fill out PR template (see below)
8. Click "Create pull request"

---

## Code Standards

### TypeScript

We use **strict TypeScript** with no `any` types in production code.

#### Do's ✅

```typescript
// ✅ GOOD: Proper types
interface Movie {
  id: string;
  title: string;
  year: number;
}

function sortMovies(movies: Movie[]): Movie[] {
  return movies.sort((a, b) => b.year - a.year);
}

// ✅ GOOD: Type inference
const count = movies.length;  // TypeScript infers number

// ✅ GOOD: Interfaces over types for objects
interface ChartProps {
  data: Movie[];
  loading?: boolean;
}
```

#### Don'ts ❌

```typescript
// ❌ BAD: Using any
function processData(data: any) { /* ... */ }

// ❌ BAD: Implicit any
function processData(data) { /* ... */ }

// ❌ BAD: Type assertions without reason
const movie = data as Movie;  // Why? Add comment explaining
```

---

### ESLint

All code must pass ESLint checks:

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

**Key Rules:**
- No unused variables
- No console.log in production code
- Prefer `const` over `let`
- Use arrow functions for callbacks
- No implicit `any` types

---

### Code Formatting

We use **Prettier** (via ESLint config):

**Settings:**
- **Indent:** 2 spaces
- **Line width:** 100 characters
- **Quotes:** Single quotes for JS/TS, double for JSX attributes
- **Semicolons:** Yes
- **Trailing commas:** ES5 style

**Example:**

```typescript
// ✅ GOOD
const movies = [
  { id: '1', title: 'Movie A', year: 2020 },
  { id: '2', title: 'Movie B', year: 2021 },
];

// ❌ BAD: Inconsistent spacing, long line
const movies = [{id:'1',title:'A very long movie title that exceeds 100 characters and should be broken up',year:2020}];
```

---

### File Naming Conventions

| File Type | Convention | Example |
|-----------|-----------|---------|
| **Components** | PascalCase | `RatingDistributionBar.tsx` |
| **Utilities** | kebab-case | `csv-parser.ts` |
| **Hooks** | kebab-case with `use-` | `use-analytics-store.ts` |
| **Types** | kebab-case | `types.ts` |
| **Tests** | Same as file + `.test.ts` | `csv-parser.test.ts` |

---

### Component Structure

Follow this pattern for React components:

```typescript
"use client"  // If client component

import * as React from "react"
import { /* imports */ } from "recharts"
import { /* UI components */ } from "@/components/ui"

// Props interface
interface MyChartProps {
  data: Array<{
    category: string;
    value: number;
  }>;
}

// Chart config
const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// Component
export function MyChart({ data }: MyChartProps) {
  // Early return for empty state
  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Memoized computations
  const processedData = React.useMemo(() => {
    return data.map(/* ... */);
  }, [data]);

  // Render
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* Chart components */}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
```

---

## Testing Requirements

### Required for All PRs

- [ ] **Unit tests** for new business logic
- [ ] **Integration tests** for new hooks/components
- [ ] **E2E tests** for new user-facing features
- [ ] **All tests pass**: `npm test`
- [ ] **Coverage ≥80%** for new code

---

### Running Tests

```bash
# Unit tests
npm test                 # Run all unit tests
npm test:watch           # Watch mode for TDD
npm test:coverage        # Generate coverage report

# E2E tests
npm run test:e2e         # Run end-to-end tests
npm run test:e2e:ui      # Run with Playwright UI
```

---

### Writing Tests

See **[TESTING.md](./TESTING.md)** for detailed testing guide.

**Quick Example:**

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './my-function';

describe('myFunction', () => {
  it('should do something', () => {
    // Arrange
    const input = [1, 2, 3];

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe(6);
  });
});
```

---

## Documentation Requirements

### When to Update Docs

Update documentation when you:

- ✅ **Add a new chart** → Update `CHARTS_CATALOG.md`
- ✅ **Change data structures** → Update `DATA_GUIDE.md`
- ✅ **Add/change APIs** → Update relevant docs
- ✅ **Improve performance** → Update `PERFORMANCE.md`
- ✅ **Add tests** → Update `TESTING.md`

---

### Documentation Standards

- **Clear, concise language** - Avoid jargon where possible
- **Include code examples** - Show, don't just tell
- **Add screenshots** for visual features
- **Update table of contents** if adding new sections

**Example:**

```markdown
## My New Feature

### Purpose
Explain what it does and why it's useful.

### Usage
\`\`\`typescript
import { MyFeature } from './my-feature';

// Example usage
const result = MyFeature({ option: 'value' });
\`\`\`

### Configuration
- **option1** - Description of option 1
- **option2** - Description of option 2
```

---

## Pull Request Process

### Before Submitting

Checklist:

- [ ] Code follows project style
- [ ] Tests pass locally: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Linter passes: `npm run lint`
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Tested on Chrome, Firefox, Safari (if UI changes)
- [ ] Tested on mobile (if UI changes)

---

### PR Template

When you open a PR, provide:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Closes #123 (if applicable)

## How Has This Been Tested?
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manually tested on:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Mobile

## Screenshots (if applicable)
Before:
[Screenshot]

After:
[Screenshot]

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

---

### Review Process

1. **Automated Checks** (GitHub Actions)
   - Linting
   - Tests
   - Build verification
   - Lighthouse CI

2. **Code Review** (Maintainer)
   - Code quality
   - Test coverage
   - Documentation
   - Design patterns

3. **Feedback & Iteration**
   - Address review comments
   - Push new commits to same branch
   - Re-request review

4. **Approval & Merge**
   - Once approved, maintainer merges to `dev`
   - Branch is automatically deleted
   - Periodic releases merge `dev` → `main`

---

### Addressing Review Feedback

```bash
# Make changes based on feedback
# Edit files...

# Commit changes
git add .
git commit -m "refactor: address review comments"

# Push to same branch
git push origin feature/amazing-feature

# PR automatically updates
```

**Don't:**
- Force push (`git push --force`) after review starts
- Squash commits during review (makes tracking changes hard)
- Open a new PR for the same feature

**Do:**
- Add new commits addressing feedback
- Respond to review comments
- Ask questions if feedback is unclear

---

## Code of Conduct

### Our Standards

We are committed to providing a welcoming and inclusive environment:

✅ **Be Respectful**
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community

✅ **Be Inclusive**
- Welcome newcomers warmly
- Use inclusive language
- Be patient with those learning

✅ **Be Collaborative**
- Offer help to others
- Share knowledge freely
- Give credit where credit is due

❌ **Unacceptable Behavior**
- Harassment, discrimination, or personal attacks
- Trolling, insulting comments, or inflammatory language
- Public or private harassment
- Publishing others' private information

---

### Reporting Issues

If you experience or witness unacceptable behavior:

1. **Contact:** [Your email or GitHub username]
2. **Include:** Description of incident, date, involved parties
3. **Confidentiality:** Reports are handled confidentially

---

## Getting Help

### Questions?

- **GitHub Discussions:** [Start a discussion](https://github.com/MarianHolly/letterboxd-stats-client/discussions)
- **GitHub Issues:** [Open an issue](https://github.com/MarianHolly/letterboxd-stats-client/issues) (for bugs/features)
- **Documentation:** Check `docs/` folder for guides

---

### Common Questions

#### Q: How do I add a new chart?

A: See **[CHARTS_CATALOG.md](./CHARTS_CATALOG.md)** → "Adding New Charts" section.

#### Q: How do I test my changes?

A: See **[TESTING.md](./TESTING.md)** for comprehensive testing guide.

#### Q: Where should I add my feature?

A: Check **[ARCHITECTURE.md](./ARCHITECTURE.md)** to understand project structure.

#### Q: My PR is failing CI checks. What do I do?

A: Click on the failed check to see details. Common issues:
- Linting errors: Run `npm run lint -- --fix`
- Test failures: Run `npm test` locally
- Build errors: Run `npm run build` locally

---

## Recognition

Contributors are recognized in:

- **GitHub Contributors** page
- **CHANGELOG.md** (for significant contributions)
- **README.md** (for major features)

---

## Project Resources

### Documentation

- **[README.md](../README.md)** - Project overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[CHARTS_CATALOG.md](./CHARTS_CATALOG.md)** - All 27 charts reference
- **[DATA_GUIDE.md](./DATA_GUIDE.md)** - Data structures and CSV processing
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance optimization
- **[TESTING.md](./TESTING.md)** - Testing strategy
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide

### Links

- **Live App:** [letterboxd-stats.vercel.app](https://letterboxd-stats-zeta.vercel.app/)
- **GitHub Repo:** [github.com/MarianHolly/letterboxd-stats-client](https://github.com/MarianHolly/letterboxd-stats-client)
- **Issues:** [github.com/MarianHolly/letterboxd-stats-client/issues](https://github.com/MarianHolly/letterboxd-stats-client/issues)
- **Discussions:** [github.com/MarianHolly/letterboxd-stats-client/discussions](https://github.com/MarianHolly/letterboxd-stats-client/discussions)

---

## Thank You! 🎉

Your contributions make this project better for everyone. Whether it's a bug report, feature suggestion, documentation improvement, or code contribution—**every contribution matters**.

**Happy coding!**

---

*Last Updated: January 2026*
*Maintained by: Maria Holly*
