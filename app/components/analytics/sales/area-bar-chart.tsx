"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { LucideServerOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { useAnalyticsSalesStore } from "@/app/store/use-analytics-store";

interface DeliveryPointData {
  location: string;
  totalRevenue: number | string;
  orderCount: number | string;
}

interface DeliveryPoint {
  period: string;
  currency: string;
  data: DeliveryPointData[];
}

const chartConfig = {
  totalRevenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function OrderLocationChart() {
  const { data } = useAnalyticsSalesStore();
  const topDeliveryLocations = data.deliveryLocations as DeliveryPoint;

  // Decimal columns can come back as strings from the API — normalize once
  // here rather than trusting the wire type.
  const chartData =
    topDeliveryLocations?.data?.map((row) => ({
      location: row.location,
      totalRevenue: Number(row.totalRevenue),
    })) ?? [];

  const RevenueLabel = ({ x, y, width, value }: any) => {
    const location = String(value);

    let label = location;

    if (width < 60) {
      label = `${location.slice(0, 4)}...`;
    } else if (width < 100) {
      label = `${location.slice(0, 8)}...`;
    } else if (width < 150) {
      label = `${location.slice(0, 12)}...`;
    }

    return (
      <text
        x={x + 8}
        y={y}
        dy={15}
        fill=""
        className="font-bold fill-gray-900"
        fontSize={12}
      >
        {label}
      </text>
    );
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Top delivery locations by revenue</CardTitle>
        <CardDescription>
          {/* {topDeliveryLocations?.currency ?? "All currencies"} */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length !== 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData} layout="vertical">
              <XAxis type="number" dataKey="totalRevenue" hide />
              <YAxis
                dataKey="location"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={900}
                hide
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                className=""
                dataKey="totalRevenue"
                fill="var(--color-totalRevenue)"
                radius={5}
              >
                <LabelList
                  dataKey="location"
                  position="insideBottomLeft"
                  offset={8}
                  className="fill-white font-bold"
                  fill="white"
                  fontSize={12}
                  content={<RevenueLabel />}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex justify-center items-center gap-2 p-10 text-lg text-gray-500">
            No Data Yet
            <LucideServerOff />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
