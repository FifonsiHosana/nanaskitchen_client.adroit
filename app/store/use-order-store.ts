import { create } from "zustand"
import { api } from "~/lib/axios"
import type { DataType } from "../types"
import type { useOrderParams } from "~/lib/useOrderParams"
import type { Period } from "../types/period"
import { toast } from "sonner"

export type statusType =
  | "all"
  | "completed"
  | "awaiting_payment"
  | "delivered"
  | "trash"

const KEEP_ROW_PAGES: statusType[] = ["all"]

export interface orderStatsTypes {
  delivered: number
  pending: number
  completed:number
  countries: {
    GH: number
    US: number
    EU: number
  }
}

interface orderStore {
  orders: DataType[]
  selectedOrder: DataType | null
  orderStats: orderStatsTypes
  totalCount: number
  statsPeriod: Period
  pageStatus: statusType
  locked: boolean
  toggleLockLoad: boolean
  isLoading: boolean
  isTableLoading: boolean
  error: string | null

  fetchOrders: (
    status: statusType,
    params: ReturnType<typeof useOrderParams>["params"]
  ) => Promise<void>
  deleteOrder: (id: string) => void
  updateOrderStatus: (id: string, status: string, params: ReturnType<typeof useOrderParams>["params"]) => void
  copyOrderLocation: (id: string) => void
  setStatsPeriod: (period: Period, status: statusType) => void
  toggleLock: () => void
  lockStatus: () => void
}

export const useOrderStore = create<orderStore>((set, get) => ({
  orders: [],
  statsPeriod: "this_month",
  pageStatus: "all",
  selectedOrder: null,
  orderStats: {
    delivered: 0,
    pending: 0,
    completed: 0,
    countries: { GH: 0, US: 0, EU: 0 },
  },
  totalCount: 0,
  locked: false,
  toggleLockLoad: false,
  isLoading: false,
  isTableLoading: false,
  error: null,

  fetchOrders: async (status, params) => {
    const isFirstLoad = get().orders.length === 0 && !get().error
    if (isFirstLoad) {
      set({ isLoading: true, error: null, pageStatus: status })
    } else {
      set({ isTableLoading: true, error: null, pageStatus: status })
    }
    try {      
      const { periodQuery, ...restParams } = params
 
      const [response, stats] = await Promise.all([
        api.get(`/orders/${status}`, {
          params: { ...restParams, ...periodQuery },
        }),
        api.get(`/stats/${status}`, {
          params: { ...periodQuery, pricingGroup: restParams.pricingGroup },
        }),
      ])
      
      set({
        orders: response.data.orders,
        totalCount: response.data.total,
        orderStats: stats.data,
        isLoading: false,
        isTableLoading: false,
      })
    } catch (error: any) {
      set({
        error: "Failed to fetch orders",
        isLoading: false,
        isTableLoading: false,
      })
    }
  },

  deleteOrder: async (id) => {
    set({ isTableLoading: true, error: null })
    try {
      await api.delete(`/orders/${id}`)
      // const keepRow = KEEP_ROW_PAGES.includes(get().pageStatus)
      set((state) => ({
        // orders: keepRow
        //   ? state.orders
        //   :
          orders: state.orders.filter((o) => o.id !== id),
        totalCount: state.totalCount - 1,
        isTableLoading: false,
      }))
    } catch (error) {
      set({ error: "Failed to delete order", isTableLoading: false })
    }
  },

  updateOrderStatus: async (id, status,params) => {

    set({ isTableLoading: true, error: null })
    try {
      await api.patch(`/orders/${id}/status`, { newStatus: status })
      await get().fetchOrders(get().pageStatus, params)
      const keepRow = KEEP_ROW_PAGES.includes(get().pageStatus)
      set((state) => ({
        orders: keepRow
          ? state.orders.map((o) => (o.id === id ? { ...o, status } : o))
          : state.orders.filter((o) => o.id !== id),
        totalCount: keepRow ? state.totalCount : state.totalCount - 1,
        isTableLoading: false,
      }))
    } catch (error) {
      set({ error: "Failed to update order", isTableLoading: false })
    }
  },

  copyOrderLocation: async (id) => {
    try {
      set((state) => ({
        selectedOrder: state.orders.find((o) => o.id === id),
      }))
    } catch (err) {
      console.error("Failed to copy location", err)
    }
  },

  setStatsPeriod: async (period, status) => {
    try {
      set({ statsPeriod: period })
      const stats = await api.get(`/stats/${status}`, { params: { period } })
      set({ orderStats: stats.data })
    } catch (error) {
      console.error(`Failed to fetch stats for period ${period}`, error)
    }
  },

  toggleLock: async () => {
    set({ toggleLockLoad: true, error: null })
    try {
      const locked = await api.get(`/orders/lock`)
      set({ toggleLockLoad: false, locked: locked.data.locked })
      locked.data.locked
        ? toast.info("orders locked")
        : toast.info("orders opened")
    } catch (error) {
      console.error("Failed to toggle orders lock", error)
    }
  },
  lockStatus: async () => {
    try {
      const locked = await api.get(`/orders/lock/status`)
      set({ locked: locked.data.locked })
    } catch (error) {
      console.error("Failed to fetch orders lock status", error)
    }
  }
}))
