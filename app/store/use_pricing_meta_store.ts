import { create } from "zustand"
import { api } from "../lib/axios_v2"

export interface PricingGroup {
  id: number
  groupName: string
}

export interface Currency {
  id: number
  currencyLabel: string
  currencyCode: string
}

interface PricingMetaStore {
  pricingGroups: PricingGroup[]
  currencies: Currency[]
  loading: boolean
  error: string | null

  fetchPricingGroups: () => Promise<void>
  fetchCurrencies: () => Promise<void>
}

export const usePricingMetaStore = create<PricingMetaStore>((set) => ({
  pricingGroups: [],
  currencies: [],
  loading: false,
  error: null,

  fetchPricingGroups: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/products/catalog/pricing-groups")
      set({ pricingGroups: res.data.groups })
    } catch {
      set({ error: "Failed to load pricing groups" })
    } finally {
      set({ loading: false })
    }
  },

  fetchCurrencies: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/settings/currencies")
      set({ currencies: res.data.data })
    } catch {
      set({ error: "Failed to load currencies" })
    } finally {
      set({ loading: false })
    }
  },
}))
