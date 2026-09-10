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

const chartConfig = {
  desktop: { label: "Desktop", color: "#534AB7" },
  mobile: { label: "Mobile", color: "#1D9E75" },
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
  // Hide axis tick labels when there are too many data points (daily view)
  const showTicks = dailyChartData.length <= 14;

  const tooltipLabelFormatter = (value: ReactNode) =>
    formatChartLabel(
      typeof value === "string" ? value : String(value ?? ""),
      chartGrouping,
    );

  return (
    <div className="grid shrink-0 gap-4 md:grid-cols-4">
      {/* 1. User Engagement — desktop vs mobile bars */}
      <StatCard
        label="User Engagement"
        description="Engaged vs total sessions ."
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
      </StatCard>

      {/* 2. Unique Visitors — area chart */}
      <StatCard
        label="Unique Visitors"
        description="Users visiting the platform."
        value={kpi.uniqueVisitors.toLocaleString()}
      >
        <ChartContainer config={chartConfig} className="flex-1 h-full w-full">
          <AreaChart
            data={dailyChartData}
            // margin={}
          >
            <defs>
              <linearGradient id="fillUnique">
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
              stroke="var(--color-mobile)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </StatCard>
      {/* 3. Total Sessions — bar chart */}
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
              fill="var(--color-desktop)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </StatCard>

      {/* 4. Bounce Rate — line chart */}
      <StatCard
        label="Bounce Rate"
        description="Single-page visits."
        value={`${kpi.bounceRate}%`}
      >
        <ChartContainer
          config={chartConfig}
          // className="aspect-auto h-full w-full"
        >
          <LineChart
            data={dailyChartData}
            // margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
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
      </StatCard>
    </div>
  );
}
