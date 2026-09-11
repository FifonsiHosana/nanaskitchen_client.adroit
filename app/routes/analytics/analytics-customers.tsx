import { useEffect, useState } from "react";
import { Users, UserCheck, Crown } from "lucide-react";

import { Card } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn, CURRENCY_SYMBOLS } from "../../lib/utils";
import { CustomerAnalyticsSkeleton } from "../../components/analytics-skeleton";
import OrderFilterOptions from "../../components/order-filter-options";
import PaginationOrders from "../../components/pagination";
import { useCustomersParams } from "../../lib/useCustomersParams";
import { useAnalyticsCustomersStore } from "../../store/use-analytics-store";
import { SummaryCard } from "@/app/components/summary-card";

const SEGMENT_CONFIG = {
  new: { label: "New", color: "var(--chart-2)", icon: Users },
  returning: { label: "Returning", color: "var(--chart-3)", icon: UserCheck },
  vip: { label: "VIP", color: "var(--chart-4)", icon: Crown },
};

const fmt = (n: string | number) =>
  Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
const initials = (f: string, l: string) =>
  `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();
// const starColor = (r: number) =>
//   r >= 4 ? "#4ade80" : r === 3 ? "#fb923c" : "#f87171";

const AnalyticsCustomers = () => {
  const { params } = useCustomersParams();
  const { fetchAll, refetch, isLoading, data, totalCount } =
    useAnalyticsCustomersStore();

  const { seg, top } = data;

  const currentPage = Number(params.page) || 1;
  const totalPages = Math.ceil(totalCount / Number(params.pageSize || 20));
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchAll(params);
  }, [params.pricingGroup]);
  useEffect(() => {
    refetch(params);
  }, [
    params.period,
    params.country,
    params.page,
    params.search,
    params.maxPrice,
    params.minPrice,
    params.pageSize,
    params.pricingGroup,
  ]);

  if (isLoading) return <CustomerAnalyticsSkeleton />;

  const total = seg?.total ?? 0;
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);

  return (
    <div className="flex flex-col gap-2 overflow-hidden p-3 md:h-[calc(100vh-3.5rem)]">
      {/* ── Row 1: 4 segment pills ── */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <SummaryCard
          label={"Total Customers"}
          value={fmt(total)}
          icon={Users}
        />
        {(["new", "returning", "vip"] as const).map((segm) => (
          <SummaryCard
            key={segm}
            label={SEGMENT_CONFIG[segm].label}
            value={String(fmt(seg?.[segm] ?? 0))}
            sub={`${pct(seg?.[segm] ?? 0)}%`}
            icon={SEGMENT_CONFIG[segm].icon}
          />
        ))}
      </div>

      {/* ── Row 2: 3-column main content ── */}
      <div className="grid min-h-0 flex-1 gap-2">
        {/* Col 1: Top customers table */}
        <Card className="flex min-h-0 flex-col">
          <div className="px-2">
            <OrderFilterOptions location="customers" />
          </div>

          <div className="relative no-scrollbar max-h-100 w-full overflow-y-auto">
            <Table noWrapper>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-7 pl-3 ">Customer</TableHead>
                  <TableHead className="h-7 Fre">Country</TableHead>
                  <TableHead className="h-7 text-right ">Orders</TableHead>
                  <TableHead className="h-7 pr-3 text-right ">Spend</TableHead>
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
                  top?.rows?.map((c) => {
                    return (
                      <TableRow
                        key={c.id}
                        className="hover:bg-muted/40"
                        data-state={
                          selectedRowId === c.id ? "selected" : undefined
                        }
                        onClick={() =>
                          setSelectedRowId((prev) =>
                            prev === c.id ? undefined : c.id,
                          )
                        }
                      >
                        <TableCell
                          // className="py-1.5 pl-3"
                          className={cn(
                            selectedRowId === c.id &&
                              "border-blue-300 border ring-blue-400",
                          )}
                        >
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {/* </CardContent> */}
        </Card>
        <PaginationOrders
          currentTable="customers"
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AnalyticsCustomers;
