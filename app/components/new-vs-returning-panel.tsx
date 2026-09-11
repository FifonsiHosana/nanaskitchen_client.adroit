import { CardTitle } from "~/components/ui/card"
import type { NewVsReturning } from "../store/use-analytics-store"

interface NewVsReturningPanelProps {
  data: NewVsReturning
}

export function NewVsReturningPanel({ data }: NewVsReturningPanelProps) {
  return (
    <div className="transition-hover flex flex-col overflow-hidden rounded-xl border bg-card p-5 shadow-sm hover:shadow-md">
      <div>
        <CardTitle className="text-base font-bold">New vs. Returning</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Comparison of customer loyalty.
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> New
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {data.new.toLocaleString()}
          </p>
          <p className="text-sm font-semibold text-blue-500">↑ {data.newPct}%</p>
        </div>

        <div className="mx-4 h-12 w-[1px] bg-border" />

        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-2 text-xs font-medium text-muted-foreground">
            Returning <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {data.returning.toLocaleString()}
          </p>
          <p className="text-sm font-semibold text-emerald-400">
            {data.returningPct}%
          </p>
        </div>
      </div>

      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        <div style={{ width: `${data.newPct}%` }} className="bg-blue-500" />
        <div style={{ width: `${data.returningPct}%` }} className="bg-emerald-400" />
      </div>
    </div>
  )
}
