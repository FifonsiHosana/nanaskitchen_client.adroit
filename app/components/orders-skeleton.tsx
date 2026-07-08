import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "./ui/card"

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-3 w-16 sm:w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-6 w-20 sm:h-7 sm:w-28" />
        <Skeleton className="h-2.5 w-12 sm:w-16" />
      </CardContent>
    </Card>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-2 border-b px-3 py-3 last:border-0 sm:gap-4 sm:px-6">
      <Skeleton className="h-4 w-4 shrink-0 rounded" />
      <Skeleton className="h-3 w-20 shrink-0 sm:w-24" />
      <Skeleton className="ml-auto h-3 w-24 shrink-0 sm:w-32" />
      <Skeleton className="hidden h-3 w-20 shrink-0 sm:block" />
      <Skeleton className="hidden h-5 w-20 shrink-0 rounded-full md:block" />
      <Skeleton className="hidden h-3 w-16 shrink-0 lg:block" />
      <Skeleton className="ml-auto h-6 w-6 shrink-0 rounded" />
    </div>
  )
}

export function OrdersSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 p-3 sm:p-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap justify-between gap-2">
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
  )
}
