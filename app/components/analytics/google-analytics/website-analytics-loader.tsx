import { cn } from "~/lib/utils"

// ── Base shimmer block ────────────────────────────────────────────────────────

function Shimmer({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}

// ── Skeleton for a single KPI stat card ──────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="flex h-45 flex-col overflow-hidden rounded-xl border bg-muted/50">
      {/* Label + value block */}
      <div className="flex shrink-0 flex-col gap-2 p-4 pb-2">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-7 w-32" />
        <Shimmer className="h-2.5 w-40" />
      </div>
      {/* Chart area */}
      <div className="flex min-h-0 flex-1 items-end gap-0.5 px-2 pb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Shimmer
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${30 + Math.sin(i * 1.2) * 20 + 20}%`,
              animationDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Skeleton for New vs Returning panel ──────────────────────────────────────

function NewVsReturningSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card p-5 shadow-sm">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-3 w-52" />
      </div>

      {/* Two stat blocks */}
      <div className="mt-auto flex items-end justify-between pt-8 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-200 dark:bg-blue-900" />
            <Shimmer className="h-2.5 w-8" />
          </div>
          <Shimmer className="h-9 w-20" />
          <Shimmer className="h-3 w-10" />
        </div>

        <div className="mx-4 h-12 w-[1px] bg-border" />

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Shimmer className="h-2.5 w-16" />
            <div className="h-2 w-2 rounded-full bg-emerald-200 dark:bg-emerald-900" />
          </div>
          <Shimmer className="h-9 w-20" />
          <Shimmer className="h-3 w-10 self-end" />
        </div>
      </div>

      {/* Progress bar */}
      <Shimmer className="h-2 w-full rounded-full" />
    </div>
  )
}

// ── Skeleton for Conversion Funnel panel ─────────────────────────────────────

function ConversionFunnelSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Title */}
      <div className="flex flex-col gap-2 p-5 pb-3">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-3 w-56" />
      </div>

      {/* Funnel steps */}
      <div className="grid grid-cols-4 border-y bg-muted/30 py-2">
        {["Visited", "Cart", "Checkout", "Purchased"].map((label, i) => (
          <div
            key={label}
            className={cn(
              "flex flex-col items-center gap-1.5 px-2",
              i !== 3 && "border-r border-border/50"
            )}
          >
            <Shimmer
              className="h-6 w-12"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <Shimmer
              className="h-2 w-10"
              style={{ animationDelay: `${i * 100 + 50}ms` }}
            />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex h-24 items-end px-0">
        <div className="relative h-full w-full overflow-hidden">
          {/* Fake area chart shape */}
          <svg
            viewBox="0 0 300 96"
            preserveAspectRatio="none"
            className="h-full w-full opacity-20"
          >
            <path
              d="M0,80 C40,60 80,30 120,45 C160,60 200,20 240,35 C260,42 280,38 300,30 L300,96 L0,96 Z"
              className="fill-primary"
            />
          </svg>
          <div className="absolute inset-0 animate-pulse bg-muted/40" />
        </div>
      </div>
    </div>
  )
}

// ── Main exported skeleton ────────────────────────────────────────────────────

export function WebsiteAnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6 overflow-hidden bg-background p-6 md:h-[calc(100vh-3.5rem)]">
      {/* ── KPI Cards ── */}
      <div className="grid shrink-0 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ animationDelay: `${i * 60}ms` }}>
            <StatCardSkeleton />
          </div>
        ))}
      </div>

      {/* ── Lower panels ── */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 md:grid-cols-2">
        <NewVsReturningSkeleton />
        <ConversionFunnelSkeleton />
      </div>
    </div>
  )
}
