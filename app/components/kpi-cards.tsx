import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { ReactNode } from "react";
import { StatCard } from "./analytics/google-analytics/stat-card";
import type {
  ChartGrouping,
  KPI,
  DailyChartPoint,
} from "../store/use-analytics-store";
import { formatChartLabel } from "../lib/chartUtils";

// Harmonized Chart Config mapped to theme CSS variables
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--color-chart-2)" },
  mobile: { label: "Mobile", color: "var(--color-chart-1)" },
  bounce: { label: "Bounce Rate", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

interface KpiCardsProps {
  kpi: KPI;
  dailyChartData: DailyChartPoint[];
  chartGrouping: ChartGrouping;
}

export function KpiCards({
  kpi,
  dailyChartData,
  chartGrouping,
}: KpiCardsProps) {
  const showTicks = dailyChartData.length <= 14;

  const tooltipLabelFormatter = (value: ReactNode) =>
    formatChartLabel(
      typeof value === "string" ? value : String(value ?? ""),
      chartGrouping,
    );

  return (
    <div className="grid shrink-0 gap-4 md:grid-cols-4">
      {/* 1. User Engagement — High contrast split representing primary vs secondary devices */}
      <StatCard
        label="User Engagement"
        description="Engaged vs total sessions."
        value={`${kpi.engagedSessions.toLocaleString()} / ${kpi.sessions.toLocaleString()}`}
      >
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full"
        >
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
              fill="var(--color-chart-2)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="mobile"
              fill="var(--color-chart-2)"
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ChartContainer>
      </StatCard>

      {/* 2. Unique Visitors — Trustworthy Deep Navy area chart for user volume */}
      <StatCard
        label="Unique Visitors"
        description="Users visiting the platform."
        value={kpi.uniqueVisitors.toLocaleString()}
      >
        <ChartContainer config={chartConfig} className="flex-1 h-full w-full">
          <AreaChart data={dailyChartData}>
            <defs>
              <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              hide={showTicks}
              height={showTicks ? undefined : 0}
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
              stroke="var(--color-chart-2)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </StatCard>

      <StatCard
        label="Total Sessions"
        description="Sessions within the period."
        value={kpi.sessions.toLocaleString()}
      >
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full"
        >
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
              fill="var(--color-chart-2)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </StatCard>

      {/* 4. Bounce Rate — Cautionary warm red line to signals drop-offs/bounce */}
      <StatCard
        label="Bounce Rate"
        description="Single-page visits."
        value={`${kpi.bounceRate}%`}
      >
        <ChartContainer config={chartConfig}>
          <LineChart data={dailyChartData}>
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
            <Line
              dataKey="desktop"
              stroke="var(--color-destructive)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </StatCard>
    </div>
  );
}
