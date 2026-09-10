import { clsx, type ClassValue } from "clsx";
import type { SyntheticEvent } from "react";
import { twMerge } from "tailwind-merge";
import type { Country, Period } from "../types/period";
import type { DataType } from "../types";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; textColor: string }
> = {
  awaiting_payment: {
    label: "Pending",
    color: "var(--status-pending)",
    textColor: "var(--status-pending-text)",
  },
  completed: {
    label: "Paid",
    color: "var(--status-completed)",
    textColor: "var(--status-completed-text)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--status-delivered)",
    textColor: "var(--status-delivered-text)",
  },
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "₵",
  USD: "$",
  EUR: "€",
  Ghana: "₵",
  US: "$",
  "United States of America (the)": "$",
  "United States": "$",
  EU: "€",
  NO: "€",
  DE: "€",
  FR: "€",
  IT: "€",
  ES: "€",
  NL: "€",
};

export const addCurrencySymbol = (currency: string | null, total: string) => {
  if (!currency) return total;
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";
  return `${symbol}${total}`;
};

export const getPageNumbers = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const pages: (number | "ellipsis")[] = [];

  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push("ellipsis");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
};

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  this_week: "This Week",
  this_month: "This Month",
  last_month: "Last Month",
  this_year: "This Year",
  last_year: "Last Year",
  all_time: "All Time",
  custom: "Custom Range",
};

export const COUNTRY_LABELS: Record<Country, string> = {
  EUR: "Europe",
  GHS: "Ghana",
  USD: "USA",
  all: "All Countries",
};
export const COUNTRY_LABELS_REVERSE = {
  EUR: "EUR",
  GHS: "GHS",
  USD: " USD",
};
export const COUNT = {
  EUR: "EUR",
  GHS: "GHS",
  USD: " USD",
};

// export const user = localStorage.getItem("userInfo")

export const STATUS_COLORS: Record<string, string> = {
  delivered: "hsl(var(--status-delivered))",
  awaiting_payment: "hsl(var(--status-pending))",
  completed: "hsl(var(--status-completed))",
  trash: "",
};

export const PIE_COLORS = [
  "#4ade80",
  "#60a5fa",
  "#fb923c",
  "#f87171",
  "#a78bfa",
];

export const fmt = (n: string | number) =>
  Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

export const shortDate = (d: string) => {
  const parts = d.split("-");
  return parts.length === 2 ? d : `${parts[1]}/${parts[2]}`;
};

export const CHART_COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  violet: "#8b5cf6",
  orange: "#f97316",
  teal: "#06b6d4",
  lime: "#84cc16",
  indigo: "#6366f1",
  amber: "#f59e0b",
} as const;

// ordered palette for sequential use (charts with multiple series)
export const CHART_PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.violet,
  CHART_COLORS.orange,
  CHART_COLORS.teal,
  CHART_COLORS.lime,
  CHART_COLORS.indigo,
  CHART_COLORS.amber,
];

// shadcn ChartConfig format
export const chartConfig = {
  blue: { label: "Blue", color: CHART_COLORS.blue },
  green: { label: "Green", color: CHART_COLORS.green },
  violet: { label: "Violet", color: CHART_COLORS.violet },
  orange: { label: "Orange", color: CHART_COLORS.orange },
  teal: { label: "Teal", color: CHART_COLORS.teal },
  lime: { label: "Lime", color: CHART_COLORS.lime },
  indigo: { label: "Indigo", color: CHART_COLORS.indigo },
  amber: { label: "Amber", color: CHART_COLORS.amber },
};

// semantic assignments — use these instead of raw colors for consistency
export const SEMANTIC_COLORS = {
  revenue: CHART_COLORS.green,
  orders: CHART_COLORS.blue,
  average: CHART_COLORS.orange,
  products: CHART_COLORS.violet,
  customers: CHART_COLORS.teal,
  returning: CHART_COLORS.indigo,
  vip: CHART_COLORS.amber,
  GHS: CHART_COLORS.green,
  USD: CHART_COLORS.blue,
  EUR: CHART_COLORS.violet,
  GH: CHART_COLORS.green,
  US: CHART_COLORS.blue,
  EU: CHART_COLORS.violet,
};

export const dateNormalize = (dateString: string) => {
  // const dateString = "2023-03-16";

  try {
    const dateObj = new Date(dateString);

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date format");
    }
    const normalDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return normalDate;
  } catch (error) {
    console.log(error);
    return dateString;
  }
};

export const handleCopy = async (selectedOrder: string, item: string) => {
  try {
    await navigator.clipboard.writeText(selectedOrder);
    toast.info(`Copied ${item}`);
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error(`Failed to copy:{err}`);
  }
};
export const CURRENCY_COLORS: Record<string, string> = {
  GHS: "var(--chart-1)",
  USD: "var(--chart-2)",
  Unknown: "#a3a3a3",
};

export function capitalizeFirstOnly(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
