"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { LucideServerOff } from "lucide-react";
import type { SummaryItem } from "@/app/store/use_feedback_store";
import { CHANNEL_CONFIG } from "@/app/utils/analytics/feedback";


const chartConfig = {
  count: {
    label: "Responses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface HorizontalBarCardProps {
  title: string;
  data: SummaryItem[];
}

export function HorizontalBarCard({ title, data }: HorizontalBarCardProps) {
  const hasData = data && data.length > 0;

  return (
    <Card className="flex h-full flex-col border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center px-4 pb-4 pt-0">
        {hasData ? (
          <ChartContainer config={chartConfig}>
            <BarChart
              data={data}
              layout="vertical"
              accessibilityLayer
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                hide
                dataKey="label"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={110}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v: string) =>
                  v.length > 16 ? `${v.slice(0, 16)}…` : v
                }
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                // cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex w-full items-center justify-between gap-6">
                        <span className="text-muted-foreground">Responses</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {value}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({item.payload.percentage}%)
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-desktop)" radius={4}>
                {data.map((entry) => {
                  const color =
                    CHANNEL_CONFIG[entry.label]?.bgColor || "var(--chart-2)";
                  return <Cell key={`cell-${entry.label}`} fill={color} />;
                })}
                <LabelList
                  dataKey="percentage"
                  position="insideRight"

                  offset={10}
                  className="fill-muted-foreground font-bold"
                  fontSize={11}
                  formatter={(v) => `${v}%`}
                />
                <LabelList
                  dataKey="label"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)  font-bold"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            <LucideServerOff className="h-8 w-8 stroke-[1.5]" />
            <p className="text-sm font-medium">No Data Available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
