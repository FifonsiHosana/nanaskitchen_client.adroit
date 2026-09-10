import { create } from "zustand";
import { api } from "~/lib/axios";
import type {
  RevenuePoint,
  ProductPoint,
  StatusPoint,
  Period,
  Country,
} from "../types/period";
import { useCustomersParams } from "../lib/useCustomersParams";

interface CountryPoint {
  country: string;
  orderCount: number;
  totalRevenue: string;
}
export type ChartGrouping = "date" | "month" | "hour";

export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  totalSpend: string;
  totalOrders: number;
}

interface RevenuePointCards extends RevenuePoint {}

type DeliveryPointData = {
  location: string;
  totalRevenue: number;
  orderCount: number;
};

interface DeliveryPoint {
  period: string;
  currency: string;
  data: DeliveryPointData[];
}

interface SalesData {
  revenueCards: RevenuePointCards[];
  revenue: RevenuePoint[];
  topProducts: ProductPoint[];
  statusData: StatusPoint[];
  orderCountry: CountryPoint[] | undefined;
  deletedOrders: string;
  deliveryLocations: DeliveryPoint;
}

interface CustomersData {
  seg: {
    period: string;
    total: number;
    new: number;
    returning: number;
    vip: number;
  } | null;
  top: { period: string; rows: Customer[]; total: number } | null;
}

interface AnalyticsSalesStore {
  data: SalesData;
  isLoading: boolean;
  isRefetching: boolean;

  fetchAll: (
    periodQuery: string,
    country: Country,
    pricingGroup?: string,
  ) => Promise<void>;
  refetch: (
    periodQuery: string,
    country: Country,
    pricingGroup?: string,
  ) => Promise<void>;
}

interface AnalyticsCustomersStore {
  data: CustomersData;
  isLoading: boolean;
  isRefetching: boolean;
  totalCount: number;
  fetchAll: (
    params: ReturnType<typeof useCustomersParams>["params"],
  ) => Promise<void>;
  refetch: (
    params: ReturnType<typeof useCustomersParams>["params"],
  ) => Promise<void>;
}

const EMPTY: SalesData = {
  revenueCards: [],
  revenue: [],
  topProducts: [],
  statusData: [],
  orderCountry: undefined,
  deletedOrders: "",
  deliveryLocations: {} as DeliveryPoint,
};

// At the top of use-analytics-store.ts — these must be MODULE-LEVEL constants
const DEFAULT_KPI: KPI = {
  sessions: 0,
  uniqueVisitors: 0,
  bounceRate: 0,
  avgEngagementTime: 0,
  engagedSessions: 0,
};

const DEFAULT_NVR: NewVsReturning = {
  new: 0,
  returning: 0,
  newPct: 0,
  returningPct: 0,
};

const DEFAULT_FUNNEL: Funnel = {
  visited: 0,
  cart: 0,
  checkout: 0,
  purchased: 0,
};

const EMPTY_ARRAY: never[] = []; // one stable empty array for everything

export const useAnalyticsSalesStore = create<AnalyticsSalesStore>((set) => ({
  data: EMPTY,
  isLoading: true,
  isRefetching: false,

  fetchAll: async (periodQuery, country = "GHS", pricingGroup) => {
    set({ isLoading: true });
    try {
      const curr = country;
      const pgParam = pricingGroup ? `&pricingGroup=${pricingGroup}` : "";
      const [rev, products, status, orderCountry, topDeliveryLocations] =
        await Promise.all([
          api.get(
            `/analytics/sales/revenue?${periodQuery}&currency=${curr}${pgParam}`,
          ),
          api.get(
            `/analytics/sales/top-products?${periodQuery}&currency=${curr}${pgParam}`,
          ),
          api.get(
            `/analytics/sales/order-status?${periodQuery}&currency=${curr}${pgParam}`,
          ),
          api.get(`/analytics/sales/order-country?${periodQuery}`),
          api.get(
            `/analytics/sales/delivery-locations?${periodQuery}&currency=${curr}${pgParam}`,
          ),
        ]);
      set({
        data: {
          revenueCards: rev.data.data,
          revenue: rev.data.data,
          topProducts: products.data.data,
          statusData: status.data.data,
          orderCountry: orderCountry.data.data,
          deletedOrders: status.data.deletedOrders?.[0]?.count ?? "",
          deliveryLocations: topDeliveryLocations.data,
        },
        isLoading: false,
      });
    } catch (e) {
      console.error("sales analytics fetch error:", e);
      set({ isLoading: false });
    }
  },

  refetch: async (periodQuery, country, pricingGroup) => {
    set({ isRefetching: true });
    try {
      const curr = country;
      const pgParam = pricingGroup ? `&pricingGroup=${pricingGroup}` : "";
      const [
        revcards,
        rev,
        products,
        status,
        orderCountry,
        topDeliveryLocations,
      ] = await Promise.all([
        api.get(`/analytics/sales/revenue?${periodQuery}${pgParam}`),
        api.get(
          `/analytics/sales/revenue?${periodQuery}${country !== "all" ? `&currency=${curr}` : ""}${pgParam}`,
        ),
        api.get(
          `/analytics/sales/top-products?${periodQuery}${country !== "all" ? `&currency=${curr}` : ""}${pgParam}`,
        ),
        api.get(
          `/analytics/sales/order-status?${periodQuery}${country !== "all" ? `&currency=${curr}` : ""}${pgParam}`,
        ),
        api.get(`/analytics/sales/order-country?${periodQuery}${pgParam}`),
        api.get(
          `/analytics/sales/delivery-locations?${periodQuery}${country !== "all" ? `&currency=${curr}` : ""}${pgParam}`,
        ),
      ]);
      set({
        data: {
          revenue: rev.data.data,
          revenueCards: revcards.data.data,
          topProducts: products.data.data,
          statusData: status.data.data,
          orderCountry: orderCountry.data.data,
          deletedOrders: status.data.deletedOrders?.[0]?.count ?? "",
          deliveryLocations: topDeliveryLocations.data,
        },
        isRefetching: false,
      });
    } catch (e) {
      console.error("sales analytics refetch error:", e);
      set({ isRefetching: false });
    }
  },
}));

export const useAnalyticsCustomersStore = create<AnalyticsCustomersStore>(
  (set) => ({
    totalCount: 0,
    data: { seg: null, top: null },
    isLoading: true,
    isRefetching: false,

    fetchAll: async (params) => {
      set({ isLoading: true });
      try {
        const { periodQuery, ...restParams } = params;
        // const curr = country || "GHS"
        const [seg, top] = await Promise.all([
          api.get(`/analytics/customers/segments`, {
            params: { ...periodQuery, pricingGroup: restParams.pricingGroup },
          }),
          api.get(`/analytics/customers/top`, {
            params: { ...restParams, ...periodQuery },
          }),
        ]);

        set({
          data: {
            seg: seg.data,
            top: top.data,
          },
          totalCount: top.data.total,
          isLoading: false,
        });
      } catch (e) {
        console.error("sales analytics fetch error:", e);
        set({ isLoading: false });
      }
    },

    refetch: async (params) => {
      set({ isRefetching: true });
      try {
        const { periodQuery, country, ...restParams } = params;
        // const curr = country || "GHS"
        const [seg, top] = await Promise.all([
          api.get(`/analytics/customers/segments`, {
            params: { ...periodQuery, currency: country, ...restParams },
          }),
          api.get(`/analytics/customers/top`, {
            params: { ...restParams, country, ...periodQuery },
          }),
        ]);
        set({
          data: {
            seg: seg.data,
            top: top.data,
          },
          totalCount: top.data.total,
          isLoading: false,
          isRefetching: false,
        });
      } catch (e) {
        console.error("sales analytics refetch error:", e);
        set({ isRefetching: false });
      }
    },
  }),
);

type PeriodKey =
  | "revPeriod"
  | "countryPeriod"
  | "productPeriod"
  | "statusPeriod"
  | "avgPeriod";

interface AnalyticsStore {
  revPeriod: Period;
  countryPeriod: Period;
  productPeriod: Period;
  statusPeriod: Period;
  avgPeriod: Period;
  setPeriod: (key: PeriodKey, value: Period) => void;
  setAllPeriods: (periods: Partial<Record<PeriodKey, Period>>) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  revPeriod: "this_month",
  countryPeriod: "this_month",
  productPeriod: "this_month",
  statusPeriod: "this_month",
  avgPeriod: "this_month",
  setPeriod: (key, value) => set((state) => ({ ...state, [key]: value })),
  setAllPeriods: (periods) => set((state) => ({ ...state, ...periods })),
}));

export interface KPI {
  sessions: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgEngagementTime: number;
  engagedSessions: number;
}

export interface DailyChartPoint {
  date: string;
  desktop: number;
  mobile: number;
}

export interface NewVsReturning {
  new: number;
  returning: number;
  newPct: number;
  returningPct: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
}

export interface Funnel {
  visited: number;
  cart: number;
  checkout: number;
  purchased: number;
}

export interface RadialPoint {
  month: string;
  sessions: number;
  users: number;
}

export interface AnalyticsResponse {
  period: Period;
  chartGrouping: ChartGrouping;
  kpi: KPI;
  dailyChartData: DailyChartPoint[];
  newVsReturning: NewVsReturning;
  trafficSources: TrafficSource[];
  funnel: Funnel;
  radialData: RadialPoint[];
}

interface AnalyticsState {
  // Data
  data: AnalyticsResponse | null;
  period: Period;
  customFrom: string | null;
  customTo: string | null;

  // UI state
  loading: boolean;
  error: string | null;

  // Actions
  setPeriod: (period: Period) => void;
  setCustomRange: (from: string, to: string) => void;
  fetchAnalytics: (
    period?: string,
    customFrom?: string,
    customTo?: string,
  ) => Promise<void>;
  reset: () => void;
}

export const useWebAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Initial state
  data: null,
  period: "last_year",
  customFrom: null,
  customTo: null,
  loading: false,
  error: null,

  setPeriod: (period) => {
    set({ period });
    get().fetchAnalytics();
  },

  setCustomRange: (from, to) => {
    set({ period: "custom", customFrom: from, customTo: to });
    get().fetchAnalytics();
  },

  fetchAnalytics: async (
    period?: string,
    customFrom?: string,
    customTo?: string,
  ) => {
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams({ period: period ?? "this_week" });
      if (period === "custom" && customFrom && customTo) {
        params.set("from", customFrom);
        params.set("to", customTo);
      }

      const res = await api.get(`/analytics/website?${params.toString()}`);
      set({ data: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err?.message ?? "Failed to load analytics data",
        loading: false,
      });
    }
  },

  reset: () =>
    set({
      data: null,
      period: "this_month",
      customFrom: null,
      customTo: null,
      loading: false,
      error: null,
    }),
}));

export const selectKPI = (s: AnalyticsState) => s.data?.kpi ?? DEFAULT_KPI;
export const selectDailyChart = (s: AnalyticsState) =>
  s.data?.dailyChartData ?? EMPTY_ARRAY;
export const selectNewVsReturn = (s: AnalyticsState) =>
  s.data?.newVsReturning ?? DEFAULT_NVR;
export const selectTraffic = (s: AnalyticsState) =>
  s.data?.trafficSources ?? EMPTY_ARRAY;
export const selectFunnel = (s: AnalyticsState) =>
  s.data?.funnel ?? DEFAULT_FUNNEL;
export const selectRadial = (s: AnalyticsState) =>
  s.data?.radialData ?? EMPTY_ARRAY;
// export const selectPeriod = (s: AnalyticsState) => s.period
export const selectLoading = (s: AnalyticsState) => s.loading;
export const selectError = (s: AnalyticsState) => s.error;
export const selectChartGrouping = (s: AnalyticsState) =>
  s.data?.chartGrouping ?? ("date" as ChartGrouping);
