import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";
import {
  COUNTRY_LABELS,
  CURRENCY_COLORS,
  dateNormalize,
} from "@/app/lib/utils";
import type { Country } from "@/app/types/period";
import { useAnalyticsParams } from "@/app/lib/useAnalyticsParams";
import { useAnalyticsSalesStore } from "@/app/store/use-analytics-store";
import { LucideServerOff } from "lucide-react";

// totalRevGHS / totalRevUSD props are unused by the chart itself now —
// remove from Props if nothing else in this component needs them.
type Props = { totalRevGHS: number; totalRevUSD: number };

const RevenueAreaChart = ({}: Props) => {
  const { country } = useAnalyticsParams();
  const { data } = useAnalyticsSalesStore();
  const { revenue } = data;

  const currencies = useMemo(() => {
    const set = new Set(revenue.map((r) => r.currency ?? "Unknown"));
    return Array.from(set);
  }, [revenue]);

  const pivotedRevenue = useMemo(() => {
    const map = new Map<string, Record<string, unknown>>();
    for (const row of revenue) {
      const key = row.period;
      if (!map.has(key))
        map.set(key, {
          period: key,
          ...Object.fromEntries(currencies.map((c) => [c, 0])),
        });
      const currencyKey = row.currency ?? "Unknown";
      const value = row.totalRevenue == null ? 0 : Number(row.totalRevenue);
      map.get(key)![currencyKey] = value;
    }

    return Array.from(map.values()).sort((a, b) =>
      String(a.period).localeCompare(String(b.period)),
    );
  }, [revenue, currencies]);

  // Normalize the raw (single-country) rows too — totalRevenue can be a
  // string or null straight from the API.
  const normalizedRevenue = useMemo(() => {
    return revenue
      .map((row) => ({
        ...row,
        totalRevenue: row.totalRevenue == null ? 0 : Number(row.totalRevenue),
      }))
      .sort((a, b) => String(a.period).localeCompare(String(b.period)));
  }, [revenue]);

  const revenueChartConfig = useMemo(() => {
    return Object.fromEntries(
      currencies.map((currency) => [
        currency,
        {
          label: currency,
          color: CURRENCY_COLORS[currency] ?? "#888",
        },
      ]),
    );
  }, [currencies]);

  const isAllCountries = country === "all";
  const chartData = isAllCountries ? pivotedRevenue : normalizedRevenue;
  const isSinglePoint = chartData.length === 1;
  console.log(chartData);
  console.log(isSinglePoint);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Orders by location in Ghana</CardTitle>
      </CardHeader>

      <CardContent>
        {chartData.length === 1 ? (
          // Single data point
          <div className="flex h-full flex-col items-center justify-center gap-1 p-10">
            <span className="text-sm text-muted-foreground">
              {dateNormalize(String(chartData[0].period))}
            </span>

            <span className="text-2xl font-semibold">
              {isAllCountries
                ? currencies
                    .map(
                      (currency) =>
                        `${currency} ${
                          (chartData[0] as Record<string, unknown>)[currency] ??
                          0
                        }`,
                    )
                    .join(" · ")
                : `${country} ${chartData[0].totalRevenue ?? 0}`}
            </span>
          </div>
        ) : chartData.length > 1 ? (
          // Multiple data points — show chart
          <div className="h-full w-full">
            <ChartContainer
              className="h-full w-full"
              config={revenueChartConfig}
            >
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <YAxis
                  yAxisId="left"
                  domain={["auto", "auto"]}
                  tickLine={false}
                  axisLine={false}
                  tick={false}
                  width={60}
                >
                  <Label
                    value="Revenue"
                    angle={-90}
                    position="insideLeft"
                    style={{
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                      textAnchor: "middle",
                    }}
                  />
                </YAxis>

                <CartesianGrid vertical={false} strokeOpacity={0.3} />

                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={dateNormalize}
                  tick={{ fontSize: 9 }}
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(l: unknown) =>
                        dateNormalize(String(l ?? ""))
                      }
                      indicator="dot"
                    />
                  }
                />

                {isAllCountries ? (
                  currencies.map((currency: string) => (
                    <Area
                      key={currency}
                      yAxisId={currency === "GHS" ? "left" : "right"}
                      dataKey={currency}
                      type="monotone"
                      baseValue={0}
                      fill={CURRENCY_COLORS[currency] ?? "#888"}
                      fillOpacity={0.35}
                      stroke={CURRENCY_COLORS[currency] ?? "#888"}
                      strokeWidth={2}
                    />
                  ))
                ) : (
                  <Area
                    dataKey="totalRevenue"
                    type="monotone"
                    yAxisId={country === "GHS" ? "left" : "right"}
                    baseValue={0}
                    stroke={CURRENCY_COLORS[country] ?? "#888"}
                    fill={CURRENCY_COLORS[country] ?? "#888"}
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            </ChartContainer>
          </div>
        ) : (
          // No data
          <div className="flex items-center justify-center gap-2 p-10 text-lg text-gray-500">
            No Data Yet
            <LucideServerOff />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueAreaChart;
