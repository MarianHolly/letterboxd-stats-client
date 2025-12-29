/**
 * Simple component to display user's progress on canon movie lists
 * Shows list name and completion percentage
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useCanonProgress } from '@/hooks/use-canon-progress'

export function CanonProgress() {
  const canonData = useCanonProgress()

  if (!canonData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Canon Lists Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upload your data to see your progress on famous movie lists.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { lists, overallStats } = canonData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canon Lists Progress</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your completion rate across {overallStats.totalLists} famous movie lists
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall stats */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Completion</span>
              <span className="text-2xl font-bold">{overallStats.averageCompletion.toFixed(1)}%</span>
            </div>
          </div>

          {/* Individual lists */}
          <div className="space-y-3">
            {lists.map((list) => (
              <div key={list.listId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{list.listTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {list.watchedCount} / {list.totalMovies} movies
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{list.completionPercentage.toFixed(1)}%</p>
                  </div>
                </div>
                <Progress value={list.completionPercentage} className="h-2" />
              </div>
            ))}
          </div>

          {/* Summary stats */}
          {overallStats.mostCompleted && overallStats.leastCompleted && (
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border p-4">
              <div>
                <p className="text-xs text-muted-foreground">Most Completed</p>
                <p className="text-sm font-medium">{overallStats.mostCompleted.listTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {overallStats.mostCompleted.completionPercentage.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Least Completed</p>
                <p className="text-sm font-medium">{overallStats.leastCompleted.listTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {overallStats.leastCompleted.completionPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
