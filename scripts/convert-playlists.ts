/**
 * Build script to convert markdown playlists to TypeScript
 * Reads docs/playlists/*.md and generates lib/canon/lists.ts
 */

import * as fs from 'fs'
import * as path from 'path'

interface ParsedList {
  id: string
  title: string
  shortTitle: string
  sourceUrl: string
  movies: Array<{ title: string; year: number }>
}

/**
 * Parse a single markdown file into a CanonList structure
 */
function parseMarkdownList(filePath: string): ParsedList | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n').map(line => line.trim())

    // Extract metadata from first 3 lines
    const titleLine = lines.find(l => l.startsWith('List Title:'))
    const shortTitleLine = lines.find(l => l.startsWith('List Short Version:'))
    const urlLine = lines.find(l => l.startsWith('List URL:'))

    if (!titleLine || !shortTitleLine || !urlLine) {
      console.error(`❌ Missing metadata in ${filePath}`)
      return null
    }

    const title = titleLine.replace('List Title:', '').trim()
    const shortTitle = shortTitleLine.replace('List Short Version:', '').trim()
    const sourceUrl = urlLine.replace('List URL:', '').trim()

    // Generate ID from filename, converting to valid JavaScript identifier
    const filename = path.basename(filePath, '.md')
    // Convert to snake_case: remove special chars, replace spaces/hyphens with underscores
    const id = filename
      .toLowerCase()
      .replace(/[^a-z0-9\s\-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/[\s\-]+/g, '_') // Replace spaces/hyphens with underscores
      .replace(/^(\d)/, 'LIST_$1') // If starts with number, prefix with LIST_

    // Parse movies (format: "- Movie Title (Year)")
    const movieLines = lines.filter(l => l.startsWith('- ') && l.includes('(') && l.includes(')'))
    const movies: Array<{ title: string; year: number }> = []

    for (const line of movieLines) {
      // Extract title and year using regex
      const match = line.match(/^- (.+?) \((\d{4})\)$/)
      if (match) {
        const movieTitle = match[1].trim()
        const year = parseInt(match[2], 10)
        movies.push({ title: movieTitle, year })
      }
    }

    if (movies.length === 0) {
      console.error(`❌ No movies found in ${filePath}`)
      return null
    }

    return { id, title, shortTitle, sourceUrl, movies }
  } catch (err) {
    console.error(`❌ Error parsing ${filePath}:`, err)
    return null
  }
}

/**
 * Generate TypeScript code for all canon lists
 */
function generateTypeScriptFile(lists: ParsedList[]): string {
  const imports = `import type { CanonList } from './types'`

  const listsCode = lists.map(list => {
    const moviesArray = list.movies
      .map(m => `  { title: ${JSON.stringify(m.title)}, year: ${m.year} }`)
      .join(',\n')

    return `export const ${list.id.toUpperCase()}: CanonList = {
  id: '${list.id}',
  title: ${JSON.stringify(list.title)},
  shortTitle: ${JSON.stringify(list.shortTitle)},
  sourceUrl: ${JSON.stringify(list.sourceUrl)},
  totalMovies: ${list.movies.length},
  movies: [
${moviesArray}
  ]
}`
  }).join('\n\n')

  const allListsExport = `export const ALL_CANON_LISTS: CanonList[] = [
  ${lists.map(l => l.id.toUpperCase()).join(',\n  ')}
]`

  const statsExport = `export const CANON_STATS = {
  totalLists: ${lists.length},
  totalMovies: ${lists.reduce((sum, l) => sum + l.movies.length, 0)},
  lists: {
${lists.map(l => `    '${l.id}': ${l.movies.length}`).join(',\n')}
  }
}`

  return `${imports}

/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from docs/playlists/*.md by scripts/convert-playlists.ts
 * Run: npm run generate:canon-lists
 */

${listsCode}

${allListsExport}

${statsExport}
`
}

/**
 * Main execution
 */
function main() {
  console.log('🎬 Converting markdown playlists to TypeScript...\n')

  const playlistsDir = path.join(process.cwd(), 'docs', 'playlists')
  const outputFile = path.join(process.cwd(), 'lib', 'canon', 'lists.ts')

  // Read all markdown files
  const files = fs.readdirSync(playlistsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(playlistsDir, f))

  console.log(`📂 Found ${files.length} markdown files`)

  // Parse each file
  const parsedLists: ParsedList[] = []
  for (const file of files) {
    console.log(`📄 Parsing ${path.basename(file)}...`)
    const parsed = parseMarkdownList(file)
    if (parsed) {
      parsedLists.push(parsed)
      console.log(`   ✅ ${parsed.title} (${parsed.movies.length} movies)`)
    }
  }

  if (parsedLists.length === 0) {
    console.error('\n❌ No valid playlists found')
    process.exit(1)
  }

  // Generate TypeScript file
  console.log(`\n📝 Generating TypeScript file...`)
  const tsContent = generateTypeScriptFile(parsedLists)

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write file
  fs.writeFileSync(outputFile, tsContent, 'utf-8')

  console.log(`✅ Generated ${outputFile}`)
  console.log(`\n📊 Summary:`)
  console.log(`   • ${parsedLists.length} lists`)
  console.log(`   • ${parsedLists.reduce((sum, l) => sum + l.movies.length, 0)} total movies`)
  console.log(`\n✨ Done!`)
}

main()
