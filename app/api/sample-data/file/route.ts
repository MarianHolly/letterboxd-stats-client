import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

/**
 * GET /api/sample-data/file?name=watched.csv&profile=profile_01
 * Returns a single CSV file for download
 */
export async function GET(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('name')
    const profile = request.nextUrl.searchParams.get('profile') || 'profile_01'

    // Validate inputs
    if (!filename) {
      return NextResponse.json(
        { error: 'Missing filename parameter' },
        { status: 400 }
      )
    }

    // Security: validate filename is a CSV
    if (!filename.endsWith('.csv') || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    // Security: only allow specific profiles
    if (!profile.match(/^profile_\d+$/)) {
      return NextResponse.json(
        { error: 'Invalid profile name' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'mock', profile, filename)

    try {
      const content = await readFile(filePath, 'utf-8')

      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } catch (error) {
      return NextResponse.json(
        { error: `File not found: ${filename}` },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error serving sample file:', error)
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    )
  }
}
