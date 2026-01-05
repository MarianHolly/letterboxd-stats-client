/**
 * Utility to load sample/demo data from the mock folder
 * Converts base64-encoded CSV files to File objects
 */

export interface SampleDataLoadResult {
  success: boolean
  files?: File[]
  error?: string
  profile?: string
}

/**
 * Load sample data from the API
 * @param profile - Profile name (e.g., 'profile_01')
 * @returns Files ready to upload
 */
export async function loadSampleData(
  profile: string = 'profile_01'
): Promise<SampleDataLoadResult> {
  try {
    const response = await fetch(`/api/sample-data?profile=${encodeURIComponent(profile)}`)

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to load sample data: ${response.statusText}`,
      }
    }

    const data = await response.json()

    if (!data.files) {
      return {
        success: false,
        error: 'No files received from server',
      }
    }

    // Convert base64-encoded files to File objects
    const files: File[] = []

    for (const [filename, base64Content] of Object.entries(data.files)) {
      try {
        // Decode base64 to binary string
        const binaryString = atob(base64Content as string)
        // Convert binary string to Uint8Array
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        // Create File object
        const file = new File([bytes], filename, { type: 'text/csv' })
        files.push(file)
      } catch (error) {
        console.warn(`Failed to process ${filename}:`, error)
        // Continue with other files
      }
    }

    if (files.length === 0) {
      return {
        success: false,
        error: 'Could not parse any files',
      }
    }

    return {
      success: true,
      files,
      profile: data.profile,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error loading sample data',
    }
  }
}

/**
 * Get list of available sample datasets
 */
export const SAMPLE_DATASETS = [
  {
    id: 'profile_01',
    name: 'Contemporary Cinema',
    description: '1,656 films - Modern and classic movies with complete viewing history, comprehensive ratings, extensive watchlist, and marked favorites',
    stats: '1,656 watched • Diary included • Ratings & favorites',
  },
  {
    id: 'profile_02',
    name: 'Cinema Historian',
    description: '1,999 films - Spanning silent era to contemporary cinema with comprehensive viewing history, extensive watchlist, detailed ratings across all decades, and complete favorite selections',
    stats: '1,999 watched • Large watchlist • Comprehensive ratings',
  },
]
