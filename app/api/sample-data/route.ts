import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

/**
 * GET /api/sample-data?profile=profile_01
 * Returns sample CSV files as base64-encoded strings
 */
export async function GET(request: NextRequest) {
  try {
    const profile = request.nextUrl.searchParams.get('profile') || 'profile_01'

    // Security: only allow specific profiles
    if (!profile.match(/^profile_\d+$/)) {
      return NextResponse.json(
        { error: 'Invalid profile name' },
        { status: 400 }
      )
    }

    const samplePath = path.join(process.cwd(), 'sample', profile)
    const files = [
      'watched.csv',
      'diary.csv',
      'ratings.csv',
      'films.csv',
      'watchlist.csv',
      'profile.csv',
    ]

    const data: Record<string, string> = {}

    for (const file of files) {
      try {
        const filePath = path.join(samplePath, file)
        const content = await readFile(filePath, 'utf-8')
        // Store as base64 to safely transmit CSV content
        data[file] = Buffer.from(content).toString('base64')
      } catch (error) {
        console.warn(`Could not read ${file}:`, error)
        // Continue if optional file is missing
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No sample data found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile, files: data })
  } catch (error) {
    console.error('Error reading sample data:', error)
    return NextResponse.json(
      { error: 'Failed to load sample data' },
      { status: 500 }
    )
  }
}
