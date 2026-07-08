import { useOrderParams } from "../lib/useOrderParams"
import { STATUS_CONFIG } from "../lib/utils"

export function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  status = "none",
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  status?: string
}) {
  const { params } = useOrderParams()

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs leading-tight font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      <p className="truncate text-xl font-semibold sm:text-2xl">{value}</p>
      <div className="inline-flex items-center justify-between">
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        {!params.periodQuery.from &&
          !params.periodQuery.to &&
          status !== "all" &&
          status !== "none" && (
            <div
              className="inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: STATUS_CONFIG[status]?.color }}
            >
              { STATUS_CONFIG[status]?.label}
            </div>
          )}
      </div>
    </div>
  )
}
