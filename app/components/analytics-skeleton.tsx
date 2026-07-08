import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "./ui/card"
import { TableRowSkeleton } from "./orders-skeleton"

function PillSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-2 sm:gap-2.5 sm:px-3">
      <Skeleton className="h-6 w-6 shrink-0 rounded-md sm:h-7 sm:w-7" />
      <div className="min-w-0 flex-1 space-y-1">
        <Skeleton className="h-2 w-12 sm:w-16" />
        <Skeleton className="h-3 w-16 sm:h-3.5 sm:w-24" />
      </div>
    </div>
  )
}

function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`flex min-h-0 flex-col ${className}`}>
      <CardHeader className="shrink-0 px-3 pt-2 pb-1">
        <Skeleton className="h-2.5 w-24" />
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-3 pb-3">
        <Skeleton className="h-full w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] animate-pulse flex-col gap-2 overflow-hidden p-3">
      {/* Stat pills row */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <PillSkeleton />
        <PillSkeleton />
        <PillSkeleton />
        <PillSkeleton />
      </div>

      {/* Main grid — stacks on mobile, 3-col on lg */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[1fr_2fr_1fr]">
        <CardSkeleton className="hidden lg:flex" />

        <div className="flex min-h-0 flex-col gap-2">
          <CardSkeleton className="flex-[5]" />
          <CardSkeleton className="flex-[4]" />
        </div>

        <CardSkeleton className="hidden lg:flex" />
      </div>
    </div>
  )
}

export function CustomerAnalyticsSkeleton() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] animate-pulse flex-col gap-2 overflow-hidden p-3">
      {/* Segment pills */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <PillSkeleton />
        <PillSkeleton />
        <PillSkeleton />
        <PillSkeleton />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="">
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <div className="flex gap-2">
          {" "}
          <Skeleton className="ml-auto h-9 w-24 rounded-md" />
          <Skeleton className="ml-auto h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="grid min-h-0 flex-1 gap-2">
        <Card>
          {/* Header */}
          <div className="flex items-center gap-2 border-b px-3 py-3 sm:gap-4 sm:px-6">
            <Skeleton className="h-3 w-4 shrink-0 rounded" />
            <Skeleton className="h-3 w-20 shrink-0" />
            <Skeleton className="ml-auto h-3 w-28 shrink-0" />
            <Skeleton className="hidden h-3 w-16 shrink-0 sm:block" />
            <Skeleton className="hidden h-3 w-16 shrink-0 md:block" />
            <Skeleton className="hidden h-3 w-16 shrink-0 lg:block" />
            <Skeleton className="ml-auto h-3 w-8 shrink-0" />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Skeleton className="h-3 w-32" />
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-md" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
