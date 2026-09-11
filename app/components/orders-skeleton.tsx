import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "./ui/card"

// Matches `SummaryCard`: rounded-xl border bg-muted/40 p-3.
function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-3 sm:p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-2.5 w-24" />
    </div>
  )
}

// Matches `OrderTable` columns:
// Order | Customer | Status | Total | Country | Order date | Location | Action
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-2 border-b px-3 py-3 last:border-0 sm:gap-3 sm:px-4">
      <Skeleton className="h-3 w-14 shrink-0" />
      <Skeleton className="h-3 w-28 shrink-0" />
      <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
      <Skeleton className="hidden h-3 w-16 shrink-0 sm:block" />
      <Skeleton className="hidden h-3 w-12 shrink-0 md:block" />
      <Skeleton className="hidden h-3 w-20 shrink-0 lg:block" />
      <Skeleton className="hidden h-3 w-24 shrink-0 xl:block" />
      <Skeleton className="ml-auto h-8 w-8 shrink-0 rounded-md" />
    </div>
  )
}

// Matches `routes/orders/orders-all.tsx`:
// OrderStats (4 SummaryCards) → OrderFilterOptions → OrderTable (8 cols).
export function OrdersSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 p-3 sm:p-4">
      {/* Stats row — OrderStats: GH / US / EU / status orders */}
      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Filter bar — OrderFilterOptions: Export left, Search + Price select right */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-48 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-lg border p-2">
        <Card className="border-0 shadow-none">
          <CardHeader className="sr-only">
            <Skeleton className="h-3 w-20" />
          </CardHeader>
          <CardContent className="p-0">
            {/* Header: Order | Customer | Status | Total | Country | Order date | Location | Action */}
            <div className="flex items-center gap-2 border-b px-3 py-3 sm:gap-3 sm:px-4">
              <Skeleton className="h-3 w-14 shrink-0" />
              <Skeleton className="h-3 w-20 shrink-0" />
              <Skeleton className="h-3 w-16 shrink-0" />
              <Skeleton className="hidden h-3 w-16 shrink-0 sm:block" />
              <Skeleton className="hidden h-3 w-16 shrink-0 md:block" />
              <Skeleton className="hidden h-3 w-20 shrink-0 lg:block" />
              <Skeleton className="hidden h-3 w-20 shrink-0 xl:block" />
              <Skeleton className="ml-auto h-3 w-14 shrink-0" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
