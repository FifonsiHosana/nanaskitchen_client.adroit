import { useMemo } from "react";
import { LabelList, Cell, PieChart, Pie } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../ui/chart";
import { LucideServerOff } from "lucide-react";
import { useAnalyticsSalesStore } from "@/app/store/use-analytics-store";

// Maps the raw country string coming from the API to a CSS-safe slug.
// Anything not in this map falls back to "other" (gray).
const COUNTRY_KEY: Record<string, string> = {
  "United States": "us",
  Ghana: "ghana",
  Europe: "europe",
};

const chartConfig = {
  orderCount: {
    label: "Orders",
  },
  us: {
    label: "United States",
    color: "var(--chart-2)",
  },
  ghana: {
    label: "Ghana",
    color: "var(--chart-1)",
  },
  europe: {
    label: "Europe",
    color: "#6B4E8E",
  },
  other: {
    label: "Other",
    color: "#94A3B8",
  },
} satisfies ChartConfig;

const CountryOrdersChart = () => {
  const { data } = useAnalyticsSalesStore();
  const { orderCountry } = data;

  const chartData = useMemo(
    () =>
      orderCountry?.map((entry) => ({
        ...entry,
        countryKey: COUNTRY_KEY[entry.country] ?? "other",
      })) ?? [],
    [orderCountry],
  );

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Orders by Country</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>

      <CardContent>
        {chartData.length !== 0 ? (
          <div className="h-full w-full">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="orderCount"
                  nameKey="countryKey"
                  innerRadius={30}
                  strokeWidth={4}
                  className="font-bold"
                >
                  <LabelList
                    dataKey="country"
                    className="fill-white font-bold"
                    stroke="none"
                    fontSize={10}
                    formatter={(v) => String(v ?? "").slice(0, 3)}
                  />
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.countryKey}
                      fill={`var(--color-${entry.countryKey})`}
                    />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="countryKey" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex justify-center gap-2 p-10 text-lg text-gray-500">
            <LucideServerOff />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryOrdersChart;
