import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  Users,
  UserCheck,
  Crown,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { api } from "~/lib/axios"
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
import type { Country } from "../types/period"
import { CURRENCY_SYMBOLS } from "../lib/utils"
import { CustomerAnalyticsSkeleton } from "../components/analytics-skeleton"
import { useAnalyticsParams } from "../lib/useAnalyticsParams"
import OrderFilterOptions from "../components/order-filter-options"
import PaginationOrders from "../components/pagination"
import { useCustomersParams } from "../lib/useCustomersParams"
import { useAnalyticsCustomersStore, useAnalyticsSalesStore } from "../store/use-analytics-store"

interface Segments {
  period: string
  total: number
  new: number
  returning: number
  vip: number
}
interface TopCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  country: string
  totalSpend: string
  totalOrders: number
}
interface Satisfaction {
  averageRating: string
  totalReviews: number
  distribution: Record<string, string>
}
interface Review {
  name: string
  comment: string
  rating: number
  createdAt: string
  productId: number
}
interface RepeatRate {
  period: string
  totalCustomers: number
  repeatCustomers: number
  repeatRate: number
}
interface CountryDist {
  country: string
  customerCount: number
}
interface OrderDist {
  bucket: string
  customerCount: number
}

const COUNTRY_COLORS: Record<string, string> = {
  GH: "var(--chart-1)",
  US: "var(--chart-2)",
  EU: "var(--chart-3)",
}
const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]
const SEGMENT_CONFIG = {
  new: { label: "New", color: "var(--chart-2)", icon: Users },
  returning: { label: "Returning", color: "var(--chart-3)", icon: UserCheck },
  vip: { label: "VIP", color: "var(--chart-4)", icon: Crown },
}
const chartConfig = {
  customerCount: { label: "Customers" },
  count: { label: "Reviews" },
}

const fmt = (n: string | number) =>
  Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })
const initials = (f: string, l: string) =>
  `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase()
const starColor = (r: number) =>
  r >= 4 ? "#4ade80" : r === 3 ? "#fb923c" : "#f87171"

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3 w-3"
          fill={i < rating ? starColor(rating) : "transparent"}
          stroke={i < rating ? starColor(rating) : "#d1d5db"}
        />
      ))}
    </div>
  )
}

function RepeatRing({
  rate,
  total,
  repeat,
}: {
  rate: number
  total: number
  repeat: number
}) {
  const r = 42,
    c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-28 w-28 items-center justify-center md:h-18 md:w-18">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth="12"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - rate / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col items-center">
          <p className="text-xl leading-none font-bold md:text-xs">{rate}%</p>
          <p className=" text-muted-foreground md:text-[8px]">
            repeat
          </p>
        </div>
      </div>
      <div className="flex w-full justify-around rounded-lg bg-muted/60 px-3 py-1.5">
        <div className="flex flex-col items-center">
          <p className="text-xs font-semibold">{fmt(total)}</p>
          <p className="Fre text-muted-foreground">Total</p>
        </div>
        <div className="mx-2 w-px bg-border" />
        <div className="flex flex-col items-center">
          <p className="text-xs font-semibold">{fmt(repeat)}</p>
          <p className="Fre text-muted-foreground">Repeat</p>
        </div>
      </div>
    </div>
  )
}

// Compact segment pill
function SegPill({
  label,
  value,
  pct,
  color,
  icon: Icon,
}: {
  label: string
  value: number
  pct: number
  color: string
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-md leading-tight font-semibold">{fmt(value)}</p>
          <p className="text-xs text-muted-foreground">{pct}%</p>
        </div>
      </div>
    </div>
  )
}

const AnalyticsCustomers = () => {

  const { params } = useCustomersParams()
  const {fetchAll,refetch,isLoading,data,totalCount} = useAnalyticsCustomersStore();

  const {seg,top} = data
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(totalCount / Number(params.pageSize || 20))
  
  useEffect(() => {
    fetchAll(params)
  }, [params.pricingGroup])
  useEffect(() => {
    refetch(params)
  }, [
    params.period,
    params.country,
    params.page,
    params.search,
    params.maxPrice,
    params.minPrice,
    params.pageSize,
    params.pricingGroup,
  ])

  if (isLoading) return <CustomerAnalyticsSkeleton />

  const total = seg?.total ?? 0
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0)

  return (
    <div className="flex flex-col gap-2 overflow-hidden p-3 md:h-[calc(100vh-3.5rem)]">
      {/* ── Row 1: 4 segment pills ── */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <div className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
              Total Customers
            </p>
            <p className="text-sm leading-tight font-medium">{fmt(total)}</p>
          </div>
        </div>
        {(["new", "returning", "vip"] as const).map((segm) => (
          <SegPill
            key={segm}
            label={SEGMENT_CONFIG[segm].label}
            value={seg?.[segm] ?? 0}
            pct={pct(seg?.[segm] ?? 0)}
            color={SEGMENT_CONFIG[segm].color}
            icon={SEGMENT_CONFIG[segm].icon}
          />
        ))}
      </div>
      <OrderFilterOptions location="customers" />

      {/* ── Row 2: 3-column main content ── */}
      <div className="grid min-h-0 flex-1 gap-2">
        {/* Col 1: Top customers table */}
        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 px-3 pt-2 pb-1">
            <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-7 pl-3 ">
                      Customer
                    </TableHead>
                    <TableHead className="h-7 Fre">Country</TableHead>
                    <TableHead className="h-7 text-right ">
                      Orders
                    </TableHead>
                    <TableHead className="h-7 pr-3 text-right ">
                      Spend
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top?.rows?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-4 text-center text-xs text-muted-foreground"
                      >
                        No data
                      </TableCell>
                    </TableRow>
                  ) : (
                    top?.rows?.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/40">
                        <TableCell className="py-1.5 pl-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted  font-semibold text-muted-foreground">
                              {initials(c.firstName, c.lastName)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {c.firstName} {c.lastName}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {c.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-1.5">
                          <span className="rounded bg-muted px-1.5 py-0.5  font-medium">
                            {c.country}
                          </span>
                        </TableCell>
                        <TableCell className="py-1.5 text-right  text-muted-foreground">
                          {c.totalOrders}
                        </TableCell>
                        <TableCell className="py-1.5 pr-3 text-right  font-semibold">
                          {CURRENCY_SYMBOLS[c.country]}
                          {fmt(c.totalSpend)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <PaginationOrders
          currentTable="customers"
          currentPage={currentPage}
          totalPages={totalPages}
        />
        {/* Col 3: Orders per customer bar */}
        {/* <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 px-3 pt-2 pb-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Orders / Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 px-2 pb-2">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={orderDist} margin={{ top: 16, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeOpacity={0.3} />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false}
                  tickMargin={4} tick={{ fontSize: 9 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9 }} width={28} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="customerCount" radius={[4, 4, 0, 0]}>
                  {orderDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default AnalyticsCustomers
