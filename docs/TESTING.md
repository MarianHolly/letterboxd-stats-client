# Testing Strategy

> **Comprehensive testing approach** for the Letterboxd Stats application. This document explains the testing philosophy, test pyramid, and how to write effective tests for this project.

**Last Updated:** January 2026

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Pyramid](#test-pyramid)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Running Tests](#running-tests)
7. [Writing New Tests](#writing-new-tests)
8. [Continuous Integration](#continuous-integration)
9. [Test Coverage Goals](#test-coverage-goals)

---

## Testing Philosophy

### Why We Test

Testing serves multiple critical purposes:

1. **Catch Bugs Early** - Identify issues during development, not production
2. **Enable Confident Refactoring** - Change code knowing tests will catch regressions
3. **Document Expected Behavior** - Tests serve as living documentation
4. **Improve Code Quality** - Testable code is usually well-designed code
5. **Reduce Debugging Time** - Failures pinpoint exact problem areas

### What We Test

We focus testing efforts on:

✅ **Business Logic** - Data processing, calculations, transformations
✅ **Critical User Paths** - Upload CSV, view analytics, filter data
✅ **Edge Cases** - Empty data, invalid inputs, boundary conditions
✅ **Integration Points** - CSV parser, data merger, state management
✅ **Accessibility** - Keyboard navigation, screen reader support

### What We Don't Test

We avoid testing:

❌ **Third-Party Libraries** - Recharts, Zustand (assume they're tested)
❌ **Implementation Details** - Internal state, private functions
❌ **Styling** - Visual appearance (use manual QA instead)
❌ **Trivial Code** - Simple getters, basic utilities

---

## Test Pyramid

The application follows the **test pyramid strategy**: many unit tests, some integration tests, few E2E tests.

```
        /\
       /  \
      / E2E \      10% - Slow, expensive, broad coverage
     /------\
    /        \
   / Integration \   20% - Medium speed, test component interactions
  /--------------\
 /                \
/   Unit Tests     \  70% - Fast, isolated, test business logic
--------------------
```

### Test Distribution

| Test Type | Percentage | Example Count | Purpose |
|-----------|-----------|---------------|---------|
| **Unit** | 70% | ~100 tests | Business logic, pure functions |
| **Integration** | 20% | ~30 tests | Component interactions, hooks |
| **E2E** | 10% | ~10 tests | Critical user workflows |

---

## Unit Testing

### What to Unit Test

Focus on **pure functions** and **business logic**:
- CSV parsing
- Data merging
- Analytics calculations
- Data transformations
- Utility functions

### Testing Framework: Vitest

**Why Vitest?**
- ✅ Fast (Vite-powered)
- ✅ Jest-compatible API
- ✅ Native TypeScript support
- ✅ Built-in coverage reporting
- ✅ Watch mode for TDD

---

### Example 1: CSV Parser Tests

**File:** `__tests__/unit/csv-parser.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { parseLetterboxdCSV } from '@/lib/csv-parser';

describe('CSV Parser', () => {
  it('should parse valid watched.csv', async () => {
    const csvContent = `Date,Name,Year,Letterboxd URI
2024-11-15,The Shawshank Redemption,1994,https://boxd.it/2aT2`;

    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    const result = await parseLetterboxdCSV(file);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toMatchObject({
      title: 'The Shawshank Redemption',
      year: 1994,
      id: 'https://boxd.it/2aT2'
    });
  });

  it('should handle missing required columns', async () => {
    const csvContent = `Date,Name
2024-11-15,Inception`;  // Missing Year and URI

    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    const result = await parseLetterboxdCSV(file);

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Missing required columns: Year, Letterboxd URI');
  });

  it('should handle empty CSV files', async () => {
    const csvContent = ``;

    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    const result = await parseLetterboxdCSV(file);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(0);
  });

  it('should parse ratings correctly', async () => {
    const csvContent = `Date,Name,Year,Letterboxd URI,Rating
2024-11-15,Inception,2010,https://boxd.it/1234,4.5`;

    const file = new File([csvContent], 'diary.csv', { type: 'text/csv' });
    const result = await parseLetterboxdCSV(file);

    expect(result.data[0].rating).toBe(4.5);
  });

  it('should handle invalid ratings', async () => {
    const csvContent = `Date,Name,Year,Letterboxd URI,Rating
2024-11-15,Bad Movie,2020,https://boxd.it/5678,10.0`;  // Invalid: >5.0

    const file = new File([csvContent], 'ratings.csv', { type: 'text/csv' });
    const result = await parseLetterboxdCSV(file);

    expect(result.errors).toContain('Invalid rating value in row 1: 10.0 (must be 0.5-5.0)');
  });
});
```

---

### Example 2: Analytics Engine Tests

**File:** `__tests__/unit/analytics-engine.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { computeAnalytics } from '@/lib/analytics-engine';
import { Movie } from '@/lib/types';

describe('Analytics Engine', () => {
  const mockMovies: Movie[] = [
    { id: '1', title: 'Movie 1', year: 2020, rating: 4.5, decade: 2020, era: 'contemporary' },
    { id: '2', title: 'Movie 2', year: 2021, rating: 3.5, decade: 2020, era: 'contemporary' },
    { id: '3', title: 'Movie 3', year: 2022, rating: 5.0, decade: 2020, era: 'contemporary' },
  ];

  it('should calculate total movies watched', () => {
    const analytics = computeAnalytics(mockMovies);
    expect(analytics.totalMoviesWatched).toBe(3);
  });

  it('should calculate average rating', () => {
    const analytics = computeAnalytics(mockMovies);
    // (4.5 + 3.5 + 5.0) / 3 = 4.33...
    expect(analytics.averageRating).toBeCloseTo(4.33, 2);
  });

  it('should calculate rating distribution', () => {
    const analytics = computeAnalytics(mockMovies);
    expect(analytics.ratingDistribution).toMatchObject({
      '4.5': 1,
      '3.5': 1,
      '5.0': 1
    });
  });

  it('should handle movies without ratings', () => {
    const moviesWithoutRatings = [
      { id: '1', title: 'Movie 1', year: 2020, decade: 2020, era: 'contemporary' }
    ];
    const analytics = computeAnalytics(moviesWithoutRatings);
    expect(analytics.moviesRated).toBe(0);
    expect(analytics.averageRating).toBe(0);
  });

  it('should calculate rewatch statistics', () => {
    const moviesWithRewatches = [
      { ...mockMovies[0], rewatch: true, rewatchCount: 2 },
      { ...mockMovies[1], rewatch: false },
      { ...mockMovies[2], rewatch: true, rewatchCount: 1 },
    ];
    const analytics = computeAnalytics(moviesWithRewatches);
    expect(analytics.moviesRewatched).toBe(2);
    expect(analytics.totalRewatches).toBe(3);
  });
});
```

---

### Example 3: Data Merger Tests

**File:** `__tests__/unit/data-merger.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { mergeMovieSources } from '@/lib/data-merger';

describe('Data Merger', () => {
  it('should merge watched and diary data', () => {
    const watched = [{
      id: 'https://boxd.it/1234',
      title: 'Inception',
      year: 2010,
      decade: 2010,
      era: 'contemporary'
    }];

    const diary = [{
      id: 'https://boxd.it/1234',
      title: 'Inception',
      year: 2010,
      rating: 4.5,
      tags: ['sci-fi'],
      decade: 2010,
      era: 'contemporary'
    }];

    const result = mergeMovieSources(watched, diary);

    expect(result.watched).toHaveLength(1);
    expect(result.watched[0]).toMatchObject({
      id: 'https://boxd.it/1234',
      rating: 4.5,
      tags: ['sci-fi']
    });
  });

  it('should prioritize ratings.csv over diary.csv', () => {
    const watched = [{
      id: 'https://boxd.it/1234',
      title: 'Movie',
      year: 2020,
      rating: 4.0,
      decade: 2020,
      era: 'contemporary'
    }];

    const diary = [{
      id: 'https://boxd.it/1234',
      title: 'Movie',
      year: 2020,
      rating: 4.5,
      decade: 2020,
      era: 'contemporary'
    }];

    const ratings = [{
      id: 'https://boxd.it/1234',
      title: 'Movie',
      year: 2020,
      rating: 5.0,
      decade: 2020,
      era: 'contemporary'
    }];

    const result = mergeMovieSources(watched, diary, ratings);

    expect(result.watched[0].rating).toBe(5.0);  // ratings.csv wins
  });

  it('should deduplicate movies by URI', () => {
    const watched = [
      { id: 'https://boxd.it/1234', title: 'Movie A', year: 2020, decade: 2020, era: 'contemporary' },
      { id: 'https://boxd.it/1234', title: 'Movie A', year: 2020, decade: 2020, era: 'contemporary' }  // Duplicate
    ];

    const result = mergeMovieSources(watched);

    expect(result.watched).toHaveLength(1);
  });
});
```

---

### Example 4: Utility Function Tests

**File:** `__tests__/unit/utils.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { groupBy, mean, median } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('groupBy', () => {
    it('should group items by key function', () => {
      const items = [
        { name: 'Movie A', decade: 2020 },
        { name: 'Movie B', decade: 2020 },
        { name: 'Movie C', decade: 2010 }
      ];

      const grouped = groupBy(items, item => item.decade);

      expect(grouped[2020]).toHaveLength(2);
      expect(grouped[2010]).toHaveLength(1);
    });
  });

  describe('mean', () => {
    it('should calculate average', () => {
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should handle empty array', () => {
      expect(mean([])).toBe(0);
    });
  });

  describe('median', () => {
    it('should calculate median for odd-length array', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should calculate median for even-length array', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });
  });
});
```

---

## Integration Testing

### What to Integration Test

Test how **components interact** with each other:
- Hooks with store
- Components with hooks
- Multiple components together
- Data flow through app

### Example: Zustand Store Integration

**File:** `__tests__/integration/analytics-store.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalyticsStore } from '@/hooks/use-analytics-store';

describe('Analytics Store Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useAnalyticsStore.getState().clearData();
  });

  it('should upload and process CSV files', async () => {
    const { result } = renderHook(() => useAnalyticsStore());

    const csvContent = `Date,Name,Year,Letterboxd URI
2024-11-15,Inception,2010,https://boxd.it/1234`;
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });

    await act(async () => {
      await result.current.uploadFiles([file]);
    });

    expect(result.current.dataset?.watched).toHaveLength(1);
    expect(result.current.analytics?.totalMoviesWatched).toBe(1);
  });

  it('should persist data to localStorage', async () => {
    const { result } = renderHook(() => useAnalyticsStore());

    const csvContent = `Date,Name,Year,Letterboxd URI
2024-11-15,Movie,2020,https://boxd.it/5678`;
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });

    await act(async () => {
      await result.current.uploadFiles([file]);
    });

    // Check localStorage
    const stored = localStorage.getItem('letterboxd-stats-storage');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.dataset.watched).toHaveLength(1);
  });
});
```

---

## End-to-End Testing

### Testing Framework: Playwright

**Why Playwright?**
- ✅ Cross-browser support (Chrome, Firefox, Safari)
- ✅ Fast and reliable
- ✅ Built-in waiting mechanisms
- ✅ Screenshots and video recording
- ✅ Network interception

---

### Critical User Workflows

#### Test 1: Upload CSV and View Analytics

**File:** `__tests__/e2e/upload-csv.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('CSV Upload Flow', () => {
  test('should upload watched.csv and display analytics', async ({ page }) => {
    await page.goto('/');

    // Upload CSV
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./fixtures/watched.csv');

    // Wait for processing
    await expect(page.locator('text=Processing...')).toBeHidden({ timeout: 5000 });

    // Navigate to analytics
    await page.click('text=View Analytics');

    // Verify charts are displayed
    await expect(page.locator('text=Watching Timeline')).toBeVisible();
    await expect(page.locator('text=Rating Distribution')).toBeVisible();
    await expect(page.locator('text=Movies by Era')).toBeVisible();

    // Verify statistics
    const totalMovies = page.locator('[data-testid="total-movies"]');
    await expect(totalMovies).toContainText(/\d+/);  // Contains a number
  });

  test('should handle invalid CSV gracefully', async ({ page }) => {
    await page.goto('/');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./fixtures/invalid.csv');

    // Expect error message
    await expect(page.locator('text=Invalid CSV format')).toBeVisible();
  });
});
```

---

#### Test 2: Demo Mode

**File:** `__tests__/e2e/demo-mode.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Demo Mode', () => {
  test('should load sample data and display charts', async ({ page }) => {
    await page.goto('/');

    // Click "Try Sample Data" button
    await page.click('text=Try Sample Data');

    // Wait for data to load
    await expect(page.locator('text=Sample data loaded')).toBeVisible();

    // Navigate to analytics
    await page.click('text=View Analytics');

    // Verify charts render with sample data
    await expect(page.locator('[data-chart="timeline"]')).toBeVisible();
    await expect(page.locator('[data-chart="rating-distribution"]')).toBeVisible();

    // Verify non-zero statistics
    const totalMovies = await page.locator('[data-testid="total-movies"]').innerText();
    expect(parseInt(totalMovies)).toBeGreaterThan(0);
  });
});
```

---

#### Test 3: Theme Switching

**File:** `__tests__/e2e/theme-switch.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/analytics');

    // Get initial theme
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');

    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]');

    // Wait for theme change
    await page.waitForTimeout(300);  // Animation duration

    // Verify theme changed
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);

    // Verify charts update colors
    const chart = page.locator('[data-chart="timeline"]');
    await expect(chart).toBeVisible();
  });
});
```

---

#### Test 4: Accessibility

**File:** `__tests__/e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility', () => {
  test('should pass axe accessibility checks', async ({ page }) => {
    await page.goto('/analytics');
    await injectAxe(page);

    // Check for accessibility violations
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    });
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/analytics');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();

    // Navigate sidebar with keyboard
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Verify navigation worked
    await expect(page).toHaveURL(/analytics/);
  });
});
```

---

## Running Tests

### NPM Scripts

```bash
# Unit Tests
npm test                 # Run all unit tests
npm test:watch           # Watch mode for TDD
npm test:ui              # Interactive test UI (Vitest UI)
npm test:coverage        # Generate coverage report

# E2E Tests
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Run E2E tests with Playwright UI
npm run test:e2e:debug   # Debug mode for E2E tests

# All Tests
npm run test:all         # Run unit + E2E tests
```

---

### Watch Mode (TDD)

For Test-Driven Development:

```bash
npm test:watch
```

**Workflow:**
1. Write failing test
2. Write code to pass test
3. Refactor
4. Repeat

**Example Output:**
```
 RERUN  analytics-engine.test.ts x1

 ✓ __tests__/unit/analytics-engine.test.ts (5)
   ✓ Analytics Engine (5)
     ✓ should calculate total movies watched
     ✓ should calculate average rating
     ✓ should calculate rating distribution
     ✓ should handle movies without ratings
     ✓ should calculate rewatch statistics

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  10:23:45
   Duration  124ms
```

---

## Writing New Tests

### Guidelines

1. **Follow AAA Pattern** (Arrange, Act, Assert)
   ```typescript
   it('should do something', () => {
     // Arrange: Set up test data
     const input = [1, 2, 3];

     // Act: Execute the code
     const result = sum(input);

     // Assert: Verify the result
     expect(result).toBe(6);
   });
   ```

2. **Test Behavior, Not Implementation**
   ```typescript
   // ❌ BAD: Testing implementation
   it('should call Array.sort', () => {
     const spy = vi.spyOn(Array.prototype, 'sort');
     sortMovies(movies);
     expect(spy).toHaveBeenCalled();
   });

   // ✅ GOOD: Testing behavior
   it('should sort movies by rating descending', () => {
     const sorted = sortMovies(movies);
     expect(sorted[0].rating).toBeGreaterThan(sorted[1].rating);
   });
   ```

3. **Use Descriptive Test Names**
   ```typescript
   // ❌ BAD: Vague
   it('works', () => { /* ... */ });

   // ✅ GOOD: Descriptive
   it('should return empty array when no movies have ratings', () => { /* ... */ });
   ```

4. **Test Edge Cases**
   - Empty arrays
   - Null/undefined values
   - Boundary conditions (0, negative, max values)
   - Invalid inputs

5. **Keep Tests Isolated**
   - No shared mutable state
   - Use `beforeEach` to reset state
   - Each test should pass independently

---

## Continuous Integration

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

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

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### PR Requirements

Before merging a PR:
- ✅ All tests must pass
- ✅ Code coverage ≥80%
- ✅ No failing E2E tests
- ✅ Lighthouse scores maintained (95+)

---

## Test Coverage Goals

### Coverage Targets

| Code Category | Target | Current |
|---------------|--------|---------|
| **Business Logic** (lib/) | 90%+ | ~85% |
| **Hooks** | 80%+ | ~75% |
| **Components** | 70%+ | ~65% |
| **Overall** | 80%+ | ~75% |

### Viewing Coverage Report

```bash
npm test:coverage
```

**Output:**
```
 % Coverage report from v8
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   78.45 |    72.33 |   81.22 |   78.89 |
 lib/                    |   85.67 |    79.44 |   88.33 |   86.11 |
  analytics-engine.ts    |   92.34 |    85.71 |   95.00 |   93.22 |
  csv-parser.ts          |   88.92 |    82.14 |   90.00 |   89.45 |
  data-merger.ts         |   81.23 |    75.00 |   85.00 |   82.11 |
 hooks/                  |   76.54 |    68.92 |   79.41 |   77.23 |
  use-analytics-store.ts |   80.11 |    72.50 |   83.33 |   81.00 |
 components/             |   65.32 |    58.76 |   68.94 |   66.11 |
  charts/                |   62.89 |    55.43 |   65.12 |   63.45 |
-------------------------|---------|----------|---------|---------|
```

---

## Related Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance testing and optimization
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute (includes testing requirements)

---

*Last Updated: January 2026*
*Maintained by: Maria Holly*
