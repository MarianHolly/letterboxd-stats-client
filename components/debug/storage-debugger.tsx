"use client"

import { useState, useEffect } from "react"

/**
 * Debug component to inspect localStorage
 * Shows uploaded files, movie count, and sample data
 */
export function StorageDebugger() {
  const [data, setData] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('letterboxd-analytics-store')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setData(parsed)
        } catch (e) {
          setData({ error: 'Failed to parse localStorage' })
        }
      } else {
        setData({ error: 'No data in localStorage' })
      }
    }
  }, [])

  if (!data) return null

  const state = data?.state
  const uploadedFiles = state?.uploadedFiles || []
  const movies = state?.dataset?.watched || []
  const firstMovie = movies[0]
  const error = state?.error

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition"
      >
        {isOpen ? 'Close' : 'Debug'} Storage
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg shadow-lg p-4 text-xs font-mono overflow-auto max-h-96">
          <div className="space-y-4">
            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded p-2">
                <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">
                  ⚠️ Upload Error:
                </h3>
                <p className="text-red-700 dark:text-red-300 break-words whitespace-normal">
                  {error}
                </p>
              </div>
            )}

            {/* Uploaded Files */}
            <div>
              <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-1">
                Uploaded Files:
              </h3>
              {uploadedFiles.length === 0 ? (
                <p className="text-red-600">❌ No files uploaded</p>
              ) : (
                <ul className="space-y-1">
                  {uploadedFiles.map((file: string) => (
                    <li key={file} className="text-green-600">
                      ✓ {file}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Movie Count */}
            <div>
              <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-1">
                Movies Loaded:
              </h3>
              <p>{movies.length} movies</p>
            </div>

            {/* First Movie Sample */}
            {firstMovie && (
              <div>
                <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-1">
                  First Movie Sample:
                </h3>
                <div className="space-y-1 bg-slate-100 dark:bg-slate-800 p-2 rounded">
                  <p>Title: {firstMovie.title}</p>
                  <p>Year: {firstMovie.year}</p>
                  <p>
                    watchedDate:{' '}
                    <span className={firstMovie.watchedDate ? 'text-green-600' : 'text-red-600'}>
                      {firstMovie.watchedDate ? new Date(firstMovie.watchedDate).toISOString().split('T')[0] : '❌ MISSING'}
                    </span>
                  </p>
                  <p>
                    dateMarkedWatched:{' '}
                    {firstMovie.dateMarkedWatched
                      ? new Date(firstMovie.dateMarkedWatched).toISOString().split('T')[0]
                      : '❌ MISSING'}
                  </p>
                  <p>Rating: {firstMovie.rating || 'Not rated'}</p>
                  <p>Rewatch: {firstMovie.rewatch ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}

            {/* Movies with watchedDate */}
            <div>
              <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-1">
                Movies with watchedDate:
              </h3>
              <p>
                {movies.filter((m: any) => m.watchedDate).length} of {movies.length}
              </p>
            </div>

            {/* hasDiaryData check */}
            <div>
              <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-1">
                hasDiaryData would be:
              </h3>
              <p className={uploadedFiles.includes('diary') ? 'text-green-600' : 'text-red-600'}>
                {uploadedFiles.includes('diary') ? '✓ TRUE' : '❌ FALSE'}
              </p>
            </div>

            {/* Raw JSON */}
            <details className="border-t border-slate-200 dark:border-white/10 pt-2">
              <summary className="cursor-pointer font-bold text-purple-600 dark:text-purple-400">
                Raw JSON
              </summary>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 overflow-auto max-h-40 text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}
