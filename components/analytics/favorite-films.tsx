'use client'

import type { UserProfile, Movie } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRating } from '@/lib/utils'

// ============================================================================
// FAVORITE FILMS COMPONENT
// ============================================================================

interface FavoriteFilmsProps {
  profile: UserProfile | undefined
  watchedMovies: Movie[] | undefined
  isLoading?: boolean
}

export function FavoriteFilms({
  profile,
  watchedMovies,
  isLoading = false,
}: FavoriteFilmsProps) {
  // No profile or favorite films
  if (!profile || !profile.favoriteFilms || profile.favoriteFilms.length === 0) {
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Favorite Films
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {profile.favoriteFilms.length} film{profile.favoriteFilms.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(4, profile.favoriteFilms.length) }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded" />
          ))}
        </div>
      </section>
    )
  }

  // Find watched movies for favorite films
  const getFavoriteMovieData = (uri: string) => {
    return watchedMovies?.find((m) => m.id === uri)
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Favorite Films
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {profile.favoriteFilms.length} film{profile.favoriteFilms.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Favorite Films Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.favoriteFilms.map((film) => {
          const movieData = getFavoriteMovieData(film.uri)

          return (
            <div
              key={film.uri}
              className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 overflow-hidden transition-all hover:border-slate-300 dark:hover:border-white/20 hover:shadow-sm"
            >
              {/* Film Poster Placeholder / Movie Title */}
              <div className="aspect-[2/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center p-4">
                <div className="text-center space-y-2">
                  {movieData?.title ? (
                    <>
                      <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-3">
                        {movieData.title}
                      </p>
                      {movieData.year && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          ({movieData.year})
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500">
                      <p className="text-2xl mb-2">🎬</p>
                      <p className="text-xs">Film #{profile.favoriteFilms.indexOf(film) + 1}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Film Info */}
              <div className="p-4 space-y-3">
                {/* Title (if not shown in poster area) */}
                {!movieData?.title && film.title && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {film.title}
                    </p>
                  </div>
                )}

                {/* Rating if available */}
                {(movieData?.rating || film.rating) && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {formatRating(movieData?.rating || film.rating)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ 5.0</span>
                  </div>
                )}

                {/* Watch Status */}
                {movieData || film.watched !== undefined ? (
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                    <p className="text-xs font-medium">
                      {movieData || film.watched ? (
                        <span className="text-emerald-600 dark:text-emerald-400">✓ Watched</span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">Not watched</span>
                      )}
                    </p>
                  </div>
                ) : null}

                {/* Rewatch Badge */}
                {movieData?.rewatch && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    <span>↻</span> Rewatch
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Info about Favorite Films */}
      {watchedMovies && (
        <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {(() => {
              const watchedCount = profile.favoriteFilms.filter(
                (f) => getFavoriteMovieData(f.uri)
              ).length
              const unwatchedCount = profile.favoriteFilms.length - watchedCount

              if (watchedCount === profile.favoriteFilms.length) {
                return `You've watched all ${watchedCount} favorite film${watchedCount !== 1 ? 's' : ''}! 🎉`
              }
              if (unwatchedCount > 0) {
                return `${unwatchedCount} favorite film${unwatchedCount !== 1 ? 's' : ''} not yet watched`
              }
              return null
            })()}
          </p>
        </div>
      )}
    </section>
  )
}
