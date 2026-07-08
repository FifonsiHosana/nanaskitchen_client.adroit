import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import { StatCard } from "./stat-card"
import type {
  ChartGrouping,
  KPI,
  DailyChartPoint,
} from "../store/use-analytics-store"
import { formatChartLabel } from "../lib/chartUtils"

const chartConfig = {
  desktop: { label: "Desktop", color: "#534AB7" },
  mobile: { label: "Mobile", color: "#1D9E75" },
} satisfies ChartConfig

interface KpiCardsProps {
  kpi: KPI
  dailyChartData: DailyChartPoint[]
  chartGrouping: ChartGrouping
}

export function KpiCards({
  kpi,
  dailyChartData,
  chartGrouping,
}: KpiCardsProps) {
  // Hide axis tick labels when there are too many data points (daily view)
  const showTicks = dailyChartData.length <= 14

  const tooltipLabelFormatter = (value: string) =>
    formatChartLabel(value, chartGrouping)

  return (
    <div className="grid shrink-0 gap-4 md:grid-cols-4">
      {/* 1. User Engagement — desktop vs mobile bars */}
      <StatCard
        label="User Engagement"
        description="Engaged vs total sessions ."
        value={`${kpi.engagedSessions.toLocaleString()} / ${kpi.sessions.toLocaleString()}`}
      >
        <div className="mt-4 h-15 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={dailyChartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                hide={showTicks}
                tickFormatter={tooltipLabelFormatter}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={tooltipLabelFormatter} />
                }
              />
              <Bar
                dataKey="desktop"
                fill="var(--color-desktop)"
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar
                dataKey="mobile"
                fill="var(--color-mobile)"
                radius={[2, 2, 0, 0]}
                opacity={0.5}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </StatCard>

      {/* 2. Unique Visitors — area chart */}
      <StatCard
        label="Unique Visitors"
        description="Users visiting the platform."
        value={kpi.uniqueVisitors.toLocaleString()}
      >
        <div className="mt-4 h-15 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              data={dailyChartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                hide={showTicks}
                tickFormatter={tooltipLabelFormatter}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={tooltipLabelFormatter} />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillUnique)"
                stroke="var(--color-mobile)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </StatCard>

      {/* 3. Total Sessions — bar chart */}
      <StatCard
        label="Total Sessions"
        description="Sessions within the period."
        value={kpi.sessions.toLocaleString()}
      >
        <div className="mt-4 h-15 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={dailyChartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                hide={showTicks}
                tickFormatter={tooltipLabelFormatter}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={tooltipLabelFormatter} />
                }
              />
              <Bar
                dataKey="desktop"
                fill="var(--color-desktop)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </StatCard>

      {/* 4. Bounce Rate — line chart */}
      <StatCard
        label="Bounce Rate"
        description="Single-page visits."
        value={`${kpi.bounceRate}%`}
      >
        <div className="mt-4 h-15 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              data={dailyChartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                hide={showTicks}
                tickFormatter={tooltipLabelFormatter}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={tooltipLabelFormatter}
                    // formatter={(value) => [`${value}`, "Sessions"]}
                  />
                }
              />
              <Line
                dataKey="desktop"
                stroke="#D85A30"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </StatCard>
    </div>
  )
}
