# Quick Start Guide: Test Implementation

**Created**: 2026-01-05
**Target**: Get comprehensive test suite running with 80%+ coverage

---

## Prerequisites

```bash
# All dependencies already installed
npm list vitest @testing-library/react @vitest/coverage-v8
```

✅ Verified installed:
- `vitest`: 1.2.0
- `@testing-library/react`: 16.3.0
- `@vitest/coverage-v8`: 1.2.0
- `@vitest/ui`: 1.2.0

---

## Running Tests

### Development Mode (Watch)
```bash
npm run test:watch
```
Vitest watches for file changes and re-runs affected tests automatically.

### Single Run
```bash
npm run test
```
Runs all tests once and exits. Use in CI/CD pipelines.

### Coverage Report
```bash
npm run test:coverage
```
Generates HTML coverage report in `coverage/` directory.

### UI Dashboard
```bash
npm run test:ui
```
Opens interactive test dashboard at http://localhost:51204 for visual test exploration.

---

## Test File Organization

```
__tests__/
├── unit/                          # Test business logic in isolation
│   ├── csv-parser.test.ts         # ✅ 43 PASSING
│   ├── data-merger.test.ts        # ❌ 11 FAILING
│   ├── profile-merger.test.ts     # ❌ 3 FAILING
│   ├── analytics-engine.test.ts   # ✅ 48 PASSING
│   ├── profile-parser.test.ts     # ✅ 25 PASSING
│   └── analytics-store.test.ts    # ✅ 27 PASSING
│
├── integration/                   # Test data flows across modules
│   ├── csv-to-analytics.test.ts   # ✅ 20 PASSING
│   └── profile-feature.test.tsx   # ❌ 7 FAILING
│
├── e2e/                           # Test critical user journeys (Playwright)
│   ├── upload-csv.spec.ts
│   ├── merge-csvs.spec.ts
│   └── analytics-dashboard.spec.ts
│
├── fixtures/                      # Reusable test data
│   ├── mock-csvs.ts              # Mock CSV string constants
│   └── sample-data/              # Sample data files
│
└── setup.ts                       # Vitest setup (globals, mocks, cleanup)
```

---

## Quick Start: Fix Failing Tests

### Step 1: Run Tests and See Failures
```bash
npm test 2>&1 | grep -A3 "FAILING\|❌"
```

### Step 2: Focus on First Failing Test
```bash
npm run test:watch -- data-merger.test.ts
```
Keep this running while editing the source file.

### Step 3: Read Test Expectation
Example from failing test:
```typescript
test('should handle rewatch aggregation', () => {
  const watched = [{title: "Inception", year: 2010, dateWatched: "2020-01-01"}]
  const diary = [
    {title: "Inception", year: 2010, dateWatched: "2020-01-01"},
    {title: "Inception", year: 2010, dateWatched: "2021-01-15"}
  ]
  const merged = mergeMovieSources(watched, diary)

  expect(merged[0].watchCount).toBe(2)  // This is failing
  expect(merged[0].rewatchDates).toEqual([...]) // This is failing
})
```

### Step 4: Fix Source Code
Edit `lib/data-merger.ts` to make test pass. Look for:
- Rewatch counting logic
- Movie matching (title + year normalization)
- Date aggregation

### Step 5: Verify Fix
Test should pass in watch mode. Then continue to next failing test.

---

## Writing New Tests

### Pattern 1: Unit Test for Pure Function

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/my-module'

describe('myFunction', () => {
  it('should transform input correctly', () => {
    const input = { /* test data */ }
    const result = myFunction(input)

    expect(result).toEqual({ /* expected output */ })
  })

  it('should handle edge case', () => {
    const result = myFunction(null)
    expect(result).toThrow('Invalid input')
  })
})
```

### Pattern 2: Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render with props', () => {
    const { getByText } = render(<MyComponent title="Test" />)

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    render(<MyComponent onClick={mockFn} />)

    fireEvent.click(screen.getByRole('button'))
    expect(mockFn).toHaveBeenCalled()
  })
})
```

### Pattern 3: Hook Test

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAnalyticsStore } from '@/hooks/use-analytics-store'

describe('useAnalyticsStore', () => {
  it('should upload files and update state', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const file = new File([CSV_CONTENT], 'test.csv')

    await act(async () => {
      await result.current.uploadFiles([file])
    })

    expect(result.current.dataset).toBeDefined()
    expect(result.current.analytics).toBeDefined()
  })
})
```

### Pattern 4: Integration Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { parseWatchedCSV } from '@/lib/csv-parser'
import { mergeMovieSources } from '@/lib/data-merger'
import { generateAnalytics } from '@/lib/analytics-engine'

describe('CSV to Analytics Flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should process CSV through entire pipeline', async () => {
    // Parse
    const movies = parseWatchedCSV(MOCK_WATCHED_CSV)

    // Merge
    const merged = mergeMovieSources(movies)

    // Calculate
    const analytics = generateAnalytics(merged)

    expect(analytics.totalMoviesWatched).toBe(10)
    expect(analytics.ratingCoverage).toBe(80)
  })
})
```

---

## Common Testing Patterns

### Mocking localStorage
```typescript
beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

test('should persist to localStorage', () => {
  const store = useAnalyticsStore()
  store.setData({ watched: [...] })

  const stored = localStorage.getItem('analytics-store')
  expect(stored).toBeTruthy()
})
```

### Mocking Functions
```typescript
import { vi } from 'vitest'

const mockFn = vi.fn()
const mockFn2 = vi.fn().mockReturnValue(42)

mockFn('test')
expect(mockFn).toHaveBeenCalledWith('test')
expect(mockFn2()).toBe(42)
```

### Testing Async Code
```typescript
test('should handle async operation', async () => {
  const result = await asyncFunction()

  expect(result).toEqual(expectedValue)
})

test('should handle errors', async () => {
  await expect(asyncFunction()).rejects.toThrow('Error message')
})
```

### Testing Date Operations
```typescript
test('should format dates correctly', () => {
  const date = new Date('2020-01-15')
  const result = formatDate(date)

  expect(result).toBe('Jan 15, 2020')
})
```

---

## Debugging Tips

### Run Single Test File
```bash
npm run test:watch -- data-merger.test.ts
```

### Run Single Test
```bash
npm run test -- -t "should handle rewatch"
```

### Debug in VS Code
Add to launch configuration:
```json
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["--inspect-brk", "--no-file-parallelism"],
  "console": "integratedTerminal"
}
```

### View Coverage
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

### Watch Mode with UI
```bash
npm run test:ui
```
Opens interactive dashboard for exploring test results.

---

## Performance Optimization

### Run Tests in Parallel (Default)
```bash
npm run test
```

### Run Single Threaded (Debugging)
```bash
npm run test -- --no-threads
```

### Run Only Changed Tests
```bash
npm run test:watch
# Vitest automatically runs only affected tests
```

### Generate Coverage Efficiently
```bash
npm run test:coverage -- --reporter=text
# Skip HTML generation for faster feedback
```

---

## Coverage Goals Checklist

- [ ] Overall coverage: 80%+ (target)
- [ ] Critical paths: 95%+ (CSV parsing, merging, analytics)
- [ ] Business logic: 100% (pure functions fully tested)
- [ ] Components: 80%+ (UI rendering and interactions)
- [ ] Error handling: 90%+ (all error paths tested)
- [ ] All 14 failing tests fixed
- [ ] No untested critical code

---

## Next Steps

1. **Read spec.md** - Understand full testing specification
2. **Run failing tests** - See what's broken: `npm test`
3. **Read contracts/** - Understand expected behavior
4. **Fix failing tests** - Start with data-merger (11 failures)
5. **Add missing coverage** - Fill gaps identified in coverage report
6. **Verify coverage** - Run `npm run test:coverage` and verify 80%+ goal
7. **Generate tasks** - Run `/speckit.tasks` for implementation tasks

---

## Support

For questions about:
- **Vitest API**: See [Vitest Documentation](https://vitest.dev)
- **Testing Library**: See [Testing Library Docs](https://testing-library.com)
- **This Project**: Check spec.md, research.md, and data-model.md

---

## Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| vitest.config.ts | Test runner configuration | ✅ Ready |
| vitest.setup.ts | Globals, mocks, cleanup | ✅ Ready |
| __tests__/fixtures/mock-csvs.ts | Test data constants | ✅ Ready |
| __tests__/unit/*.test.ts | Business logic tests | ⚠️ 11 failing |
| __tests__/integration/*.test.ts | Data flow tests | ⚠️ 7 failing |
| __tests__/e2e/*.spec.ts | User journey tests | 📝 To add |
| spec.md | Full specification | ✅ Complete |
| plan.md | Implementation plan | ✅ Complete |
| data-model.md | Test data structures | ✅ Complete |
