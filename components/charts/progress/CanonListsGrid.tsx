"use client"

import { useCanonProgress } from "@/hooks/use-canon-progress"
import { CanonListCard } from "./CanonListCard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function CanonListsGrid() {
  const canonData = useCanonProgress()

  if (!canonData) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Canon Lists Progress</CardTitle>
          <CardDescription>Track your progress on famous movie lists</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-sm text-muted-foreground">
              Upload your data to see progress
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { lists } = canonData

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {lists.map((list) => (
        <CanonListCard key={list.listId} progress={list} />
      ))}
    </div>
  )
}
