# Implementation Plan: Data Storage & Persistence

**Feature**: Data Storage & Persistence (US2)
**Store**: `hooks/use-analytics-store.ts`
**Tests**: `__tests__/unit/analytics-store.test.ts`

---

## Technical Approach

### Store Architecture

Use **Zustand** with localStorage middleware to provide:
- Centralized state for dataset, analytics, and metadata
- Automatic persistence to browser localStorage
- Session-based design (ready for backend migration)
- Error handling for quota exceeded scenarios

### Store State Shape

```typescript
interface AnalyticsStore {
  // Data
  dataset: MovieDataset | null;
  analytics: AnalyticsOverview | null;
  uploadedFiles: File[];

  // State
  loading: boolean;
  error: string | null;

  // Actions
  uploadFiles: (files: File[]) => Promise<void>;
  clearData: () => void;
  removeFile: (filename: string) => Promise<void>;

  // Getters
  hasData: () => boolean;
  totalMovies: () => number;
}
```

### Persistence Strategy

1. **What to persist**:
   - `dataset` (MovieDataset)
   - `uploadedFiles` (list of filenames)
   - `lastUpdated` (timestamp)

2. **What NOT to persist**:
   - `loading` state
   - `error` messages (temporary)

3. **localStorage key**: `letterboxd-stats-store`
4. **Version**: 1 (for migration tracking)

### Processing Pipeline

```
User Action: Upload Files
    ↓
Action: uploadFiles(files: File[])
    ↓
Parse CSVs (via csv-parser)
    ↓
Merge data (via data-merger)
    ↓
Compute analytics (via analytics-engine)
    ↓
Store in Zustand state
    ↓
Zustand middleware → localStorage
    ↓
UI updates automatically
```

---

## Error Handling

| Scenario | User Message | Technical Handling |
|----------|---|---|
| localStorage full (>5-10MB) | "Data too large, clear browser storage" | Quota exceeded error, show warning |
| localStorage unavailable | "Browser storage disabled" | Graceful degradation, warn user |
| Corrupt persisted data | "Error loading saved data, resetting" | Clear and reinitialize |

### Quota Management

- Monitor at 80% usage: Show warning
- At 95%: Block uploads until user clears data
- On quota exceeded: Provide export option before clearing

---

## Performance Targets

- Store initialization: <10ms
- Data persistence: <100ms
- Data restoration: <50ms
- No blocking operations

---

## Testing Strategy

### Unit Tests (minimum 10 tests)

- **Store Initialization**:
  - Store initializes with default state
  - All actions are callable

- **Upload & Persistence**:
  - uploadFiles() parses and stores CSV data
  - Data persists to localStorage
  - lastUpdated timestamp is set

- **Data Restoration**:
  - Page refresh loads data from localStorage
  - Restored data matches original

- **Data Clearing**:
  - clearData() resets all state
  - localStorage is cleared

- **File Management**:
  - removeFile() removes one file
  - Analytics recomputed without removed file

- **Edge Cases**:
  - Quota exceeded handling
  - Empty store initialization
  - Concurrent uploads

---

## Files to Create

```
hooks/
└── use-analytics-store.ts

__tests__/
└── unit/
    └── analytics-store.test.ts
```

---

## Dependencies

- Zustand (already installed)
- T001-T011: Types, CSV parser, data merger, analytics engine

---

**Reference**: `.specify/app/plan.md` (section 1.2 - State Management)
