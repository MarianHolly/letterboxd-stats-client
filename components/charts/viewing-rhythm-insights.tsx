"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ViewingRhythmInsightsProps {
  insight: string
}

/**
 * Displays narrative insights about viewing rhythm
 * Shows a text summary describing the user's watching patterns
 */
export function ViewingRhythmInsights({ insight }: ViewingRhythmInsightsProps) {
  if (!insight) {
    return null
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-white/5 dark:to-white/10">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                Your Viewing Profile
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {insight}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
