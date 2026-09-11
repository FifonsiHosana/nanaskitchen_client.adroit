"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts";
import { LucideServerOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "~/components/ui/chart";
import type { SummaryItem } from "@/app/store/use_feedback_store";

export interface BadgeConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const METRIC_CONFIG: Record<string, BadgeConfig> = {
  Price: {
    label: "Price Value",
    color: "var(--price)",
    bgColor: "var(--price-bg)",
  },
  Authenticity: {
    label: "Authenticity",
    color: "var(--authenticity)",
    bgColor: "var(--authenticity-bg)",
  },
  Taste: {
    label: "Taste Profile",
    color: "var(--taste)",
    bgColor: "var(--taste-bg)",
  },
  Quality: {
    label: "Product Quality",
    color: "var(--quality)",
    bgColor: "var(--quality-bg)",
  },
  "Social Media": {
    label: "Social Media",
    color: "var(--social-media)",
    bgColor: "var(--social-media-bg)",
  },
  "Word of Mouth": {
    label: "Word of Mouth",
    color: "var(--word-of-mouth)",
    bgColor: "var(--word-of-mouth-bg)",
  },
  "Event functions": {
    label: "Event Functions",
    color: "var(--event-functions)",
    bgColor: "var(--event-functions-bg)",
  },
};

interface PieChartCardProps {
  title: string;
  data: SummaryItem[];
}

export function PreferenceChart({ title, data }: PieChartCardProps) {
  const hasData = Boolean(data && data.length > 0);

  // Generate chartConfig directly from METRIC_CONFIG with dynamic fallbacks
  const chartConfig = useMemo(() => {
    if (!hasData) return {} satisfies ChartConfig;

    return data.reduce((config, item, i) => {
      const metric = METRIC_CONFIG[item.label];
      config[item.label] = {
        label: metric?.label || item.label,
        color: metric?.color || `hsl(var(--chart-${(i % 5) + 1}))`,
      };
      return config;
    }, {} as ChartConfig);
  }, [data, hasData]);

  return (
    <Card className="flex h-full flex-col border-border/60 shadow-sm">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center p-2 pt-0">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-40 w-full"
          >
            <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => (
                      <div className="flex w-full items-center justify-between gap-3 text-xs">
                        <span className="text-muted-foreground">
                          {METRIC_CONFIG[item.payload.label]?.label ||
                            item.payload.label}
                        </span>
                        <span className="font-semibold text-foreground">
                          {value} ({item.payload.percentage}%)
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
              >
                {data.map((entry, index) => {
                  const fillColor =
                    METRIC_CONFIG[entry.label]?.color ||
                    `hsl(var(--chart-${(index % 5) + 1}))`;

                  return (
                    <Cell
                      key={entry.label}
                      fill={fillColor}
                      stroke="transparent"
                    />
                  );
                })}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="label" />}
                className="mt-1 flex-wrap justify-center gap-x-3 gap-y-1 text-[10px]"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center text-muted-foreground">
            <LucideServerOff className="h-5 w-5 stroke-[1.5]" />
            <p className="text-xs font-medium">No Data Yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
