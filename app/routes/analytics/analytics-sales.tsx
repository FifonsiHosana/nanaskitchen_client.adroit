import { useEffect, useMemo } from "react";

import {
  Package,
  DollarSign,
  ShoppingCart,
  LucideServerOff,
} from "lucide-react";
import { fmt } from "../../lib/utils";
import type { Country } from "../../types/period";

import { AnalyticsSkeleton } from "../../components/analytics-skeleton";
import { useAnalyticsSalesStore } from "../../store/use-analytics-store";
import { useAnalyticsParams } from "../../lib/useAnalyticsParams";
import TopProductsTable from "@/app/components/analytics/sales/top-products-table";
import RevenueAreaChart from "@/app/components/analytics/sales/revenue-area-chart";
import { SummaryCard } from "@/app/components/summary-card";
import { OrderLocationChart } from "@/app/components/analytics/sales/area-bar-chart";
import CountryOrdersChart from "@/app/components/analytics/sales/country-orders-chart";
import { Badge } from "@/app/components/ui/badge";

const AnalyticsSales = () => {
  const { period, country, periodQuery, pricingGroup } = useAnalyticsParams();
  const { data, isLoading, fetchAll, refetch } = useAnalyticsSalesStore();
  const { statusData, deletedOrders, revenueCards } = data;

  useEffect(() => {
    fetchAll(periodQuery, country as Country, pricingGroup);
  }, []);
  useEffect(() => {
    refetch(periodQuery, country as Country, pricingGroup);
  }, [period, country, periodQuery, pricingGroup]);

  const totalRevGHS = revenueCards
    .filter((r) => r.currency === "GHS")
    .reduce((s, r) => s + Number(r.totalRevenue), 0);
  const totalRevUSD = revenueCards
    .filter((r) => r.currency === "USD")
    .reduce((s, r) => s + Number(r.totalRevenue), 0);
  const totalRevEUR = revenueCards
    .filter((r) => r.currency === "EUR")
    .reduce((s, r) => s + Number(r.totalRevenue), 0);
  // const revenueByCountry = revenue.filter(r => r.currency === country)
  const delivered =
    statusData.find((s) => s.status === "delivered")?.count ?? 0;
  const completed =
    statusData.find((s) => s.status === "completed")?.count ?? 0;
  const pending =
    statusData.find((s) => s.status === "awaiting_payment")?.count ?? 0;

  console.log("completed", statusData);

  if (isLoading) return <AnalyticsSkeleton />;

  return (
    <div className="flex flex-col gap-2 overflow-hidden p-3  ">
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4">
        <SummaryCard
          icon={DollarSign}
          label="Revenue GHS"
          value={`₵${fmt(totalRevGHS)}`}
        />
        <SummaryCard
          label="Revenue USD"
          value={`$${fmt(totalRevUSD)}`}
          icon={DollarSign}
        />
        <SummaryCard
          label="Paid Orders"
          value={completed}
          icon={ShoppingCart}
        />
        <SummaryCard label="Delivered Orders" value={`${delivered}`} icon={Package} />
      </div>
      <div className="grid flex-1 min-h-0 grid-cols-1  gap-3 md:grid-cols-6">
        <div className="col-span-2 flex min-h-0 flex-col gap-3">
          <RevenueAreaChart
            totalRevGHS={totalRevGHS}
            totalRevUSD={totalRevUSD}
          />
        </div>

        <div className="col-span-2 flex min-h-0 flex-col gap-3">
          <OrderLocationChart />
        </div>
        <div className="col-span-2 flex min-h-0 flex-col gap-3">
          <CountryOrdersChart />
        </div>
      </div>

      <div className="w-full">
        <TopProductsTable country={country} />
      </div>
    </div>
  );
};

export default AnalyticsSales;
