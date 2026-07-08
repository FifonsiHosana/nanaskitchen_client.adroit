export type Period =
"all_time"
  | "today"
  | "this_week"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "custom"

export type Country = "GHS" | "USD" | "EUR" |"all"

export interface CustomDateRange {
  from: string // ISO date string YYYY-MM-DD
  to: string   // ISO date string YYYY-MM-DD
}

export interface RevenuePoint {
  period: string
  totalRevenue: string
  orderCount: number
  currency: string
}
export interface CountryPoint {
  country: string
  totalOrders: number
  totalRevenue: string
}
export interface ProductPoint {
  productName: string
  totalRevenue: string
  totalQuantity: string
  totalOrders?: number
}
export interface StatusPoint {
  status: string
  count: number
}
export interface AvgOrderPoint {
  period: string
  avgOrderValue: string
  totalOrders: number
}
