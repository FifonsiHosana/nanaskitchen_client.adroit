import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "./ui/card"
import { TableRowSkeleton } from "./orders-skeleton"

// Matches `SummaryCard` (summary-card.tsx): rounded-xl border bg-muted/40 p-3.
function SummaryCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-3 sm:p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-2.5 w-28" />
    </div>
  )
}

function ChartCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`flex min-h-60 flex-col ${className}`}>
      <CardHeader className="shrink-0 pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <Skeleton className="h-full min-h-40 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

// Matches `routes/analytics/analytics-sales.tsx`:
// 4 SummaryCards → 3 chart cards (md:grid-cols-6, col-span-2 each) → TopProductsTable.
export function AnalyticsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 overflow-hidden p-3">
      {/* Summary row */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      {/* Charts row — 3 equal cards on md+ */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-6">
        <div className="col-span-2 flex min-h-0 flex-col">
          <ChartCardSkeleton />
        </div>
        <div className="col-span-2 flex min-h-0 flex-col">
          <ChartCardSkeleton />
        </div>
        <div className="col-span-2 flex min-h-0 flex-col">
          <ChartCardSkeleton />
        </div>
      </div>

      {/* Top products table */}
      <Card className="w-full">
        <CardHeader className="shrink-0">
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="ml-auto h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Matches `routes/analytics/analytics-customers.tsx`:
// 4 SummaryCards → filter bar → customers table (Customer/Country/Orders/Spend).
export function CustomerAnalyticsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 overflow-hidden p-3">
      {/* Segment pills */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      {/* Main card with filter + table */}
      <Card className="flex min-h-0 flex-col">
        {/* OrderFilterOptions row: export left, search + select right */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2 pt-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-48 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>

        {/* Table header: Customer | Country | Orders | Spend */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="ml-auto h-3 w-14" />
          <Skeleton className="h-3 w-16" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-3 py-2.5 last:border-0"
          >
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2.5 w-40" />
            </div>
            <Skeleton className="h-5 w-14 rounded" />
            <Skeleton className="ml-auto h-3 w-10" />
            <Skeleton className="h-3 w-16" />
          </div>
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

// Matches `routes/analytics/analytics-feedback.tsx`:
// 3 SummaryCards → 3 breakdown charts → FeedbackTable.
export function FeedbackAnalyticsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 overflow-hidden p-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      {/* Attribution & preference breakdown */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>

      {/* Feedback table: Order ID | Customer | Attribution | Preferences */}
      <Card>
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-3 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-28" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="ml-auto h-5 w-24 rounded-full" />
          </div>
        ))}
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
