"use client"

import { TrendingUp } from "lucide-react"
import { PolarGrid, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import type { RadialPoint } from "../store/use-analytics-store"

export const description = "A radial chart with a grid"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartRadialGrid({ data }: { data: RadialPoint[] }) {
  return (
    <Card className="flex h-full min-h-0 flex-col">
      <CardHeader className="items-center px-4 pt-3 pb-0">
        <CardTitle className="text-sm">Website activity</CardTitle>
        <CardDescription className="text-xs">This month</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto h-full">
          <RadialBarChart data={chartData} innerRadius={17} outerRadius={50}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="visitors" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 px-4 pb-3 text-xs">
        <div className="flex items-center gap-1 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-3 w-3" />
        </div>
        <div className="leading-none text-muted-foreground">Last 6 months</div>
      </CardFooter>
    </Card>
  )
}  
