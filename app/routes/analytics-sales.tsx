import { useEffect, useMemo } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  LabelList,
  Cell,
} from "recharts"
import { Package, DollarSign, ShoppingCart } from "lucide-react"
import {
  chartConfig,
  fmt,
  SEMANTIC_COLORS,
  STATUS_COLORS,
  STATUS_CONFIG,
  dateNormalize,
  COUNTRY_LABELS,
  CURRENCY_SYMBOLS,
} from "../lib/utils"
import type { Country } from "../types/period"
import { ChartCard } from "../components/chart-card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { AnalyticsSkeleton } from "../components/analytics-skeleton"
import { useAnalyticsSalesStore } from "../store/use-analytics-store"
import { useAnalyticsParams } from "../lib/useAnalyticsParams"

const RADIAL_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]
const CURRENCY_COLORS: Record<string, string> = {
  GHS: "#50C878",
  USD: "#3b82f6",
  Unknown: "#a3a3a3",
}

// Compact stat pill — no card overhead, just a tight inline block
function StatPill({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm leading-tight font-semibold">{value}</p>
      </div>
    </div>
  )
}

const AnalyticsSales = () => {
  const { period, country, periodQuery, pricingGroup } = useAnalyticsParams()
  const { data, isLoading, fetchAll, refetch } = useAnalyticsSalesStore()
  const {
    revenue,
    topProducts,
    statusData,
    orderCountry,
    deletedOrders,
    revenueCards,
  } = data

  useEffect(() => {
    fetchAll(periodQuery, country as Country, pricingGroup)
  }, [])
  useEffect(() => {
    refetch(periodQuery, country as Country, pricingGroup)
  }, [period, country, periodQuery, pricingGroup])

  const totalRevGHS = revenueCards
    .filter((r) => r.currency === "GHS")
    .reduce((s, r) => s + Number(r.totalRevenue), 0)
  const totalRevUSD = revenueCards
    .filter((r) => r.currency === "USD")
    .reduce((s, r) => s + Number(r.totalRevenue), 0)
  const totalRevEUR = revenueCards
    .filter((r) => r.currency === "EUR")
    .reduce((s, r) => s + Number(r.totalRevenue), 0)
  // const revenueByCountry = revenue.filter(r => r.currency === country)
  const delivered = statusData.find((s) => s.status === "delivered")?.count ?? 0

  const pivotedRevenue = useMemo(() => {
    const map = new Map<string, Record<string, unknown>>()
    const allCurrencies = Array.from(
      new Set(revenue.map((r) => r.currency ?? "Unknown"))
    )
    for (const row of revenue) {
      const key = row.period
      if (!map.has(key))
        map.set(key, {
          period: key,
          ...Object.fromEntries(allCurrencies.map((c) => [c, 0])),
        })
      const currencyKey = row.currency ?? "Unknown"
      map.get(key)![currencyKey] = Number(row.totalRevenue)
    }

    return Array.from(map.values())
  }, [revenue])

  const currencies = useMemo(() => {
    const set = new Set(revenue.map((r) => r.currency ?? "Unknown"))
    return Array.from(set)
  }, [revenue])

  const revenueChartConfig = useMemo(() => {
    return Object.fromEntries(
      currencies.map((currency) => [
        currency,
        {
          label: currency,
          color: CURRENCY_COLORS[currency] ?? "#888",
        },
      ])
    )
  }, [currencies])

  const isAllCountries = country === "all" // adjust to your sentinel value
  const chartData = isAllCountries ? pivotedRevenue : revenue
  // console.log(revenue);

  if (isLoading) return <AnalyticsSkeleton />

  return (
    // Full-height grid that fills the remaining viewport below the header
    <div className="flex flex-col gap-2 overflow-hidden p-3 md:h-[calc(100vh-3.5rem)]">
      {/* ── Row 1: 4 stat pills — fixed height ── */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <StatPill
          label="Revenue GHS"
          value={`₵${fmt(totalRevGHS)}`}
          icon={DollarSign}
        />
        <StatPill
          label="Revenue USD"
          value={`$${fmt(totalRevUSD)}`}
          icon={DollarSign}
        />
        <StatPill
          label="Revenue EUR"
          value={`€${fmt(totalRevEUR)}`}
          icon={ShoppingCart}
        />
        <StatPill
          label="Delivered / Cancelled"
          value={`${delivered} / ${deletedOrders}`}
          icon={Package}
        />
      </div>

      {/* ── Row 2 + 3: main content fills remaining space ── */}
      {/* 3-column grid: left narrow col, centre wide col, right narrow col */}
      <div className="grid min-h-0 flex-1 gap-2 md:grid-cols-[1fr_2fr_1fr]">
        {/* ── Col 1: Order Status radial ── */}
        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 px-3 pt-3 pb-1">
            <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col justify-between px-3 pb-3">
            <div className="min-h-0 flex-1">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <RadialBarChart
                  data={statusData}
                  innerRadius="20%"
                  outerRadius="85%"
                  startAngle={90}
                  endAngle={-270}
                  barSize={18}
                >
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                      />
                    }
                  />
                  <RadialBar
                    dataKey="count"
                    background={{ fill: "var(--muted)" }}
                    cornerRadius={4}
                  >
                    {statusData.map((entry, i) => (
                      <Cell
                        key={entry.status}
                        fill={
                          STATUS_COLORS[
                            entry.status as keyof typeof STATUS_COLORS
                          ]
                        }
                      />
                    ))}
                  </RadialBar>
                </RadialBarChart>
              </ChartContainer>
            </div>
            {/* Compact legend */}
            <div className="flex shrink-0 flex-col gap-1 pt-1">
              {statusData.map((entry, i) => (
                <div
                  key={entry.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          STATUS_COLORS[
                            entry.status as keyof typeof STATUS_COLORS
                          ] ?? RADIAL_COLORS[i % RADIAL_COLORS.length],
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {STATUS_CONFIG[entry.status]?.label ?? entry.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold">
                    {entry.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Col 2: Revenue chart (top) + Top Products table (bottom) ── */}
        <div className="flex min-h-0 flex-col gap-2">
          {/* Top Products compact table */}
          <Card className="flex min-h-0 flex-4 flex-col">
            <CardHeader className="shrink-0 px-3">
              <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Top Products {COUNTRY_LABELS[country as Country]}
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
              <div className="no-scrollbar h-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-7 pl-3 text-[10px]">#</TableHead>
                      <TableHead className="h-7 text-[10px]">Product</TableHead>
                      <TableHead className="h-7 text-right text-[10px]">
                        Units
                      </TableHead>
                      <TableHead className="h-7 text-right text-[10px]">
                        Orders
                      </TableHead>
                      {country !== "all" && (
                        <TableHead className="h-7 pr-3 text-right text-[10px]">
                          Revenue
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-4 text-center text-xs text-muted-foreground"
                        >
                          No data
                        </TableCell>
                      </TableRow>
                    ) : (
                      topProducts.map((p, i) => (
                        <TableRow
                          key={p.productName}
                          className="hover:bg-muted/40"
                        >
                          <TableCell className="py-1 pl-3 text-[10px] font-semibold text-muted-foreground">
                            {i + 1}
                          </TableCell>
                          <TableCell className="max-w-40 truncate py-1 text-xs font-medium">
                            {p.productName}
                          </TableCell>
                          <TableCell className="py-1 text-right text-[10px] text-muted-foreground">
                            {fmt(p.totalQuantity)}
                          </TableCell>
                          <TableCell className="py-1 text-right text-[10px] text-muted-foreground">
                            {p.totalOrders ?? "—"}
                          </TableCell>
                          {country !== "all" && (
                            <TableCell className="py-1 pr-3 text-right text-xs font-semibold">
                              {CURRENCY_SYMBOLS[country]}
                              {fmt(p.totalRevenue)}
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {/* Revenue area chart */}
          <Card className="flex min-h-0 flex-5 flex-col">
            <CardHeader className="shrink-0 px-3 pt-3 pb-1">
              <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Revenue Over Time {COUNTRY_LABELS[country as Country]}
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 px-2 pb-2">
              <ChartContainer
                className="h-full w-full"
                config={revenueChartConfig}
              >
                <AreaChart
                  // data={revenueByCountry}
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <YAxis
                    yAxisId="left"
                    // dataKey={totalRevGHS}
                    domain={["auto", "auto"]}
                    hide
                  />
                  <YAxis
                    yAxisId="right"
                    // dataKey={totalRevUSD}
                    domain={["auto", "auto"]}
                    orientation="right"
                    hide
                  />
                  <CartesianGrid vertical={false} strokeOpacity={0.3} />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    hide={true}
                    tickFormatter={dateNormalize}
                    tick={{ fontSize: 9 }}
                  />
                  {/* <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(l: unknown) =>
                          dateNormalize(String(l ?? ""))
                        }
                        formatter={(val, name) => [
                          `${fmt(val as number)} `,
                          name,
                        ]}
                        indicator="dot"
                      />
                    }
                  /> */}
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
                  {/* <Area
                    className="mb-5 pb-5"
                    dataKey="totalRevenue"
                    type="monotone"
                    fill="var(--color-GHS)"
                    fillOpacity={0.35}
                    stroke="var(--color-GHS)"
                    strokeWidth={2}
                    stackId="a"
                  /> */}

                  {isAllCountries ? (
                    currencies.map((currency) => (
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
                        // stackId="a"
                      />
                    ))
                  ) : (
                    <Area
                      dataKey="totalRevenue"
                      type="monotone"
                      yAxisId={country === "USD" ? "left" : "right"}
                      stroke={CURRENCY_COLORS[country] ?? "#888"}
                      fillOpacity={0.35}
                      fill={CURRENCY_COLORS[country] ?? "#888"}
                      strokeWidth={2}
                      stackId="a"
                    />
                  )}
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Col 3: Orders by Country bar chart ── */}
        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 px-3 pt-3 pb-1">
            <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Orders by Country
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 px-2 pb-2">
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <BarChart
                data={orderCountry}
                margin={{ top: 16, right: 4, left: -8, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeOpacity={0.3} />
                <XAxis
                  dataKey="country"
                  tickLine={false}
                  tickMargin={6}
                  axisLine={false}
                  tickFormatter={(v) => v.slice(0, 2)}
                  tick={{ fontSize: 10 }}
                />
                <YAxis dataKey="orderCount" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="orderCount"
                  fill="var(--color-chart-2)"
                  radius={6}
                >
                  <LabelList
                    position="top"
                    offset={8}
                    className="fill-foreground"
                    fontSize={10}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsSales
