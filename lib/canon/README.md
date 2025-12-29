# Canon Lists Feature

This module enables comparison of user's watched movies against famous curated movie lists (Canon lists).

## Overview

Canon lists are prestigious film collections like:
- **IMDb Top 250** - Most popular films on IMDb
- **Oscar Best Picture Winners** - Academy Award winners
- **Cannes Palme d'Or Winners** - Cannes Film Festival top prize
- **AFI's 100 Years...100 Movies** - American Film Institute's greatest films
- **Letterboxd Top 250** - Highest rated on Letterboxd

## Architecture

### Data Flow

```
Markdown Lists → Build Script → TypeScript Data → Matcher → Progress Hook → UI Component
(docs/playlists)  (convert)     (lib/canon/lists.ts) (match)  (calculate)    (display)
```

### Files

- **`types.ts`** - TypeScript interfaces for canon lists
- **`lists.ts`** - Auto-generated canon list data (DO NOT EDIT)
- **`matcher.ts`** - Movie matching logic (title + year fuzzy matching)
- **`index.ts`** - Barrel exports

### External Files

- **`scripts/convert-playlists.ts`** - Build script to convert markdown → TypeScript
- **`hooks/use-canon-progress.ts`** - React hook for progress calculation
- **`components/charts/canon-progress.tsx`** - UI component

## Usage

### Adding a New Canon List

1. Create markdown file in `docs/playlists/`:

```markdown
List Title: My Custom List
List Short Version: Custom List
List URL: https://letterboxd.com/user/list/my-list/

Movies:
- The Godfather (1972)
- Pulp Fiction (1994)
- ...
```

2. Run the build script:

```bash
npm run generate:canon-lists
```

3. The list will automatically appear in the UI!

### Using in Components

```tsx
import { useCanonProgress } from '@/hooks/use-canon-progress'

function MyComponent() {
  const canonData = useCanonProgress()

  if (!canonData) return <p>No data</p>

  return (
    <div>
      <p>Average: {canonData.overallStats.averageCompletion}%</p>
      {canonData.lists.map(list => (
        <div key={list.listId}>
          {list.listTitle}: {list.completionPercentage}%
        </div>
      ))}
    </div>
  )
}
```

### Getting List Info (Without User Data)

```tsx
import { useCanonListsInfo } from '@/hooks/use-canon-progress'

function ListsOverview() {
  const info = useCanonListsInfo()

  return (
    <p>We track {info.totalLists} canon lists</p>
  )
}
```

## How Matching Works

Movies are matched using:

1. **Year Matching** - Exact year match (or ±1 year tolerance)
2. **Title Normalization** - Remove articles (The, A, An), special characters
3. **Fuzzy Matching** - 85%+ similarity threshold using character bigrams

### Example

User Movie: `The Godfather (1972)`
Canon Movie: `Godfather (1972)`

→ **MATCH** (normalized titles are identical after removing "The")

## Data Structure

### CanonProgress

```typescript
{
  listId: 'imdb_top_250',
  listTitle: 'IMDb Top 250',
  totalMovies: 250,
  watchedCount: 180,
  completionPercentage: 72.0,
  watchedMovies: Movie[],
  unwatchedMovies: CanonMovie[]
}
```

### CanonComparison

```typescript
{
  lists: CanonProgress[],
  overallStats: {
    totalLists: 5,
    averageCompletion: 45.8,
    mostCompleted: CanonProgress,
    leastCompleted: CanonProgress
  }
}
```

## Performance

- **Lists data**: ~800 movies across 5 lists, bundled at build time
- **Matching**: O(n×m) where n=user movies, m=canon movies
- **Caching**: Results memoized via `useMemo`
- **Storage**: Zero impact (lists are static, not in localStorage)

## Maintenance

### Updating Lists

To update an existing list (e.g., new Oscar winners):

1. Edit the markdown file in `docs/playlists/`
2. Run `npm run generate:canon-lists`
3. Commit both the markdown and the generated `lists.ts`

### Regenerating Data

The `lists.ts` file is auto-generated. To regenerate:

```bash
npm run generate:canon-lists
```

This should be run:
- When adding/updating markdown files
- Before building for production
- Can be added to pre-build hooks if desired
