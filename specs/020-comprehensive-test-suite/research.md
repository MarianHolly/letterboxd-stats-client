# Research Findings: Comprehensive Test Suite

**Created**: 2026-01-05
**Status**: Complete - All clarifications resolved through specification and codebase analysis

## Executive Summary

Research confirms that Vitest is fully operational and the project's existing test infrastructure is ready for comprehensive expansion. All test dependencies are installed, configuration is complete, and patterns are established. No major technical blockers identified.

---

## Key Findings

### 1. Vitest Setup - VERIFIED OPERATIONAL ✅

**Decision**: Continue with Vitest 1.2.0 as primary test runner
**Rationale**:
- Already installed and configured in project
- Running successfully (175+ existing tests)
- Jest-compatible API enables easy migration from remaining Jest patterns
- jsdom environment properly configured for React Testing Library
- Coverage tools (@vitest/coverage-v8) installed and ready

**Alternatives Considered**:
- Jest: Already phased out in favor of Vitest (better ESM support, faster execution)
- Custom test framework: Unnecessary, Vitest provides everything needed

**Action Taken**: No changes needed. Use existing Vitest configuration.

---

### 2. Test Data Fixtures & Mocking - ESTABLISHED PATTERN ✅

**Decision**: Use mock CSV data in `__tests__/fixtures/mock-csvs.ts`
**Rationale**:
- Existing pattern already in place (MOCK_WATCHED_CSV, MOCK_DIARY_CSV, etc. defined)
- Fixtures are imported across 8+ test files
- Consistent test data ensures reproducibility
- Avoids file I/O and network dependencies

**Alternatives Considered**:
- Generate random test data: Reduces reproducibility
- Use real Letterboxd exports: Adds external dependency and file I/O
- Hard-code data in each test: Creates maintenance burden

**Action Taken**: Expand and document existing fixture patterns.

---

### 3. CSV Parsing & Validation - PAPA PARSE ✅

**Decision**: Papa Parse 5.5.3 is the canonical CSV parsing library
**Rationale**:
- Already installed as production dependency
- Well-tested and widely used for CSV parsing
- Handles edge cases (quoted fields, escaping, encoding)
- Observable in project imports across parser test files

**Alternatives Considered**:
- csv-parser npm package: Overkill for client-side, stream-based
- Custom regex parser: Fragile, doesn't handle edge cases well
- CSV libraries requiring Node APIs: Not suitable for browser environment

**Action Taken**: Verify Papa Parse usage in all CSV parser tests.

---

### 4. Data Merging Strategy - ZUSTAND + PURE FUNCTIONS ✅

**Decision**: Test pure data merging functions separately, then verify Zustand integration
**Rationale**:
- 11 failing tests in data-merger and profile-merger indicate integration issues
- Pure functions (no side effects) are easier to test and debug
- Zustand store tests verify persistence and state transitions separately
- Separation of concerns enables isolated testing of merging logic

**Alternatives Considered**:
- Test only through Zustand: Harder to isolate and debug failures
- Complex setup with localStorage mocks: Unnecessary, Zustand handles this

**Action Taken**: Split data merger tests into:
1. Pure function tests (input → output)
2. Zustand store integration tests (state updates + persistence)

---

### 5. React Component Testing - TESTING LIBRARY ✅

**Decision**: @testing-library/react 16.3 with queries, render, and fireEvent patterns
**Rationale**:
- Already installed and used in existing component tests (e.g., profile-feature.test.tsx)
- Testing Library philosophy: Test behavior, not implementation
- Complete suite of queries (getBy*, queryBy*, findBy*)
- Accessible by default (encourages accessible component design)

**Alternatives Considered**:
- Enzyme: Focuses on implementation details, deprecated approach
- Snapshot testing: Brittle, requires manual review of diffs
- Manual DOM manipulation: Verbose and error-prone

**Action Taken**: Standardize component tests on Testing Library patterns.

---

### 6. State Management Testing - ZUSTAND HOOKS ✅

**Decision**: Use renderHook from @testing-library/react for store testing
**Rationale**:
- renderHook pattern already used successfully in analytics-store.test.ts (27 passing tests)
- Properly tests hook behavior in isolation
- Can verify state updates, localStorage persistence, and error handling
- Familiar pattern to team

**Alternatives Considered**:
- Direct store instantiation: Doesn't test hook integration
- Redux: Unnecessary complexity for Zustand's lightweight approach
- Context API: Store already uses Zustand, no reason to change

**Action Taken**: Use proven renderHook pattern for remaining store tests.

---

### 7. E2E Testing Strategy - PLAYWRIGHT ✅

**Decision**: Focus E2E tests on 3 critical user journeys only (not comprehensive)
**Rationale**:
- Playwright 1.56.1 already installed as devDependency
- E2E tests have separate directory (__tests__/e2e/*.spec.ts) with Vitest exclusion
- Goal: Test critical paths (upload → analyze → clear), not exhaustive scenarios
- Reduces flakiness while covering essential flows

**Alternatives Considered**:
- Cypress: More opinionated, not necessary for MVP coverage
- Selenium: Verbose, slower, overkill for 3 critical journeys
- Unit tests only: Can't verify end-to-end workflows

**Action Taken**: Maintain 3 critical E2E tests, expand unit/integration coverage focus.

---

### 8. Coverage Measurement & Reporting ✅

**Decision**: Use @vitest/coverage-v8 with comprehensive reporting
**Rationale**:
- Already installed in devDependencies
- Vitest integration provides HTML, LCOV, JSON, and text reports
- v8 coverage engine is accurate and widely trusted
- Can track coverage metrics over time

**Alternatives Considered**:
- nyc/Istanbul: Additional tooling, Vitest integration preferred
- c8: Similar to Vitest's built-in support
- No coverage tracking: Undermines 80%+ coverage goal

**Action Taken**: Run coverage checks as part of test suite validation.

---

### 9. Handling Existing Failing Tests ✅

**Decision**: Fix failures in order: data-merger (11) → profile-merger (3) → profile-feature (7)
**Rationale**:
- Root cause appears to be data merging logic (rewatches, ratings, likes)
- Fixing data merging will likely resolve downstream failures in profile tests
- Isolate merging issues first before testing component behavior
- Tests already written and validated, just need implementation fixes

**Alternatives Considered**:
- Rewrite all tests: Assumes current test expectations are wrong
- Skip failing tests: Leaves bugs unfound
- Fix randomly: No clear dependency path

**Action Taken**: Prioritize data merger fixes as Phase 1 of implementation.

---

### 10. Mocking Strategy - HEAVY ISOLATION ✅

**Decision**: Mock localStorage, window APIs, and file I/O heavily for unit tests
**Rationale**:
- Constitution principle: Browser-first, client-side data (no external APIs)
- localStorage mocking already in place (vitest.setup.ts with vi.fn())
- Pure functions can be tested without mocking when possible
- Mocking makes tests deterministic and fast

**Alternatives Considered**:
- Integration tests with real localStorage: Slower, non-deterministic
- No mocking: Tests fail due to browser environment limitations
- Selective mocking: Inconsistent patterns across test suite

**Action Taken**: Standardize mocking approach in vitest.setup.ts.

---

## Test Coverage Analysis

### Current State (175+ tests)
- ✅ analytics-store.test.ts: 27 tests PASSING
- ✅ csv-parser.test.ts: 43 tests PASSING
- ✅ profile-parser.test.ts: 25 tests PASSING
- ✅ csv-to-analytics.test.ts: 20 tests PASSING
- ✅ analytics-engine.test.ts: 48 tests PASSING
- ❌ data-merger.test.ts: 43 tests (11 FAILING)
- ❌ profile-merger.test.ts: 20 tests (3 FAILING)
- ❌ profile-feature.test.tsx: 17 tests (7 FAILING)

### Coverage Gaps Identified
- Rewatch counting logic: Failing tests indicate issues with aggregation
- Profile merging: 3 failures suggest merging logic problems
- Component integration: 7 E2E test failures need investigation

### Missing Test Areas (To Be Added)
- Error boundary components and error state handling
- Empty state rendering when no data available
- Loading state animations and transitions
- Form validation on upload
- localStorage quota exceeded scenarios
- Responsive component behavior at different viewport sizes

---

## Best Practices to Implement

### 1. Test Organization
- Keep unit tests focused (one concern per test file)
- Use describe() blocks to group related tests
- Name tests with Given-When-Then pattern for clarity
- Separate happy path from error scenarios

### 2. Fixture Management
- Centralize mock data in `__tests__/fixtures/`
- Create factory functions for generating test data
- Version fixtures alongside tests (comment with reference CSV structure)
- Document assumptions about fixture contents

### 3. Assertion Clarity
- Use specific matchers (toBe, toEqual, toContain)
- Avoid overly broad assertions (expect(object).toBeDefined())
- Test one assertion per test when possible
- Use named test data to explain what's being tested

### 4. Setup & Cleanup
- Use beforeEach/afterEach for consistent state
- Clear mocks between tests (localStorage.clear())
- Restore state to known baseline
- Document why setup is needed

### 5. Error Testing
- Test both success and failure cases
- Verify error messages are user-friendly
- Test edge cases (empty files, missing columns, large files)
- Verify app recovers gracefully from errors

---

## Implementation Roadmap

### Phase 1: Fix Existing Failures (2-3 hours)
1. Investigate rewatch counting logic in data-merger
2. Fix rating/like assignment in profile-merger
3. Resolve component rendering issues in profile-feature
4. Verify all 175 tests pass

### Phase 2: Expand Critical Path Coverage (4-6 hours)
1. Add missing error handling tests
2. Add empty state component tests
3. Add localStorage edge case tests
4. Add loading state transition tests

### Phase 3: Add Component & E2E Coverage (3-4 hours)
1. Test all component variants
2. Test form validation
3. Test responsive behavior
4. Test critical E2E journeys

### Phase 4: Verify Coverage Goals (1-2 hours)
1. Run coverage report (target 80%+, critical 95%+)
2. Identify and fix coverage gaps
3. Document any intentional uncovered code
4. Commit test suite

---

## Conclusion

All technical decisions are validated by existing project patterns and dependencies. No research blockers remain. The team can proceed with implementation with high confidence that chosen technologies and approaches are sound.

**Next Step**: Proceed to Phase 1 design (data-model.md, contracts/, quickstart.md)
