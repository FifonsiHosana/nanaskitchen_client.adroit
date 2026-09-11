import { Area, AreaChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import { CardTitle } from "~/components/ui/card"
import type {
  ChartGrouping,
  Funnel,
  DailyChartPoint,
} from "../store/use-analytics-store"
import { formatChartLabel } from "../lib/chartUtils"

const chartConfig = {
  desktop: { label: "Desktop", color: "#534AB7" },
  mobile: { label: "Mobile", color: "#1D9E75" },
} satisfies ChartConfig

interface ConversionFunnelPanelProps {
  funnel: Funnel
  dailyChartData: DailyChartPoint[]
  chartGrouping: ChartGrouping
}

export function ConversionFunnelPanel({
  funnel,
  dailyChartData,
  chartGrouping,
}: ConversionFunnelPanelProps) {
const steps = [
  { label: "Page Views", value: funnel.visited },
  { label: "Sessions", value: funnel.cart },
  { label: "Engaged", value: funnel.checkout },
  { label: "Conversions", value: funnel.purchased },
]

  const tooltipLabelFormatter = (value: string) =>
    formatChartLabel(value, chartGrouping)

  // Drop-off percentages between steps
  const dropOffs = steps.map((step, i) => {
    if (i === 0 || steps[0].value === 0) return null
    return Math.round((step.value / steps[0].value) * 100)
  })

  return (
    <div className="transition-hover flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md">
      <div className="p-5 pb-2">
        <CardTitle className="text-base font-bold">Conversion Funnel</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Drop-off rates from landing to purchase.
        </p>
      </div>

      <div className="grid grid-cols-4 border-y bg-muted/30 py-1 text-center text-xs">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className={i !== 3 ? "border-r border-border/50" : ""}
          >
            <p className="text-lg font-bold">{s.value.toLocaleString()}</p>
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {s.label}
            </p>

          </div>
        ))}
      </div>

      <div className="mt-auto h-24 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={dailyChartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              hide={true}
              tickFormatter={tooltipLabelFormatter}
              tick={{ fontSize: 9 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  // formatter={(value, name) => [
                  //   value.toLocaleString(),
                  //   name === "desktop" ? "Desktop" : "Mobile",
                  // ]}
                />
              }
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="url(#colorFunnel)"
              stroke="var(--color-desktop)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
