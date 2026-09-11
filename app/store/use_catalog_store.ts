import { create } from "zustand"
import { api } from "../lib/axios_v2"

export interface Variant {
  id: number
  variantName: string
  titleTag: string
}

interface CatalogStore {
  variants: Variant[]
  loading: boolean
  error: string | null

  fetchVariants: () => Promise<void>

  createFlavor: (data: { label: string; image?: string }) => Promise<boolean>
  createVariant: (data: { variantName: string; titleTag?: string }) => Promise<boolean>
  createProduct: (data: Record<string, unknown>) => Promise<boolean>
  createPriceTier: (data: Record<string, unknown>) => Promise<boolean>
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  variants: [],
  loading: false,
  error: null,

  fetchVariants: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/products/catalog/variants")
      set({ variants: res.data.variants })
    } catch {
      set({ error: "Failed to load variants" })
    } finally {
      set({ loading: false })
    }
  },

  createFlavor: async (data) => {
    try {
      await api.post("/products/catalog/flavors", data)
      return true
    } catch {
      set({ error: "Failed to create flavor" })
      return false
    }
  },

  createVariant: async (data) => {
    try {
      await api.post("/products/catalog/variants", data)
      await get().fetchVariants()
      return true
    } catch {
      set({ error: "Failed to create variant" })
      return false
    }
  },

  createProduct: async (data) => {
    try {
      await api.post("/products/catalog/products", data)
      return true
    } catch {
      set({ error: "Failed to create product" })
      return false
    }
  },

  createPriceTier: async (data) => {
    try {
      await api.post("/products/catalog/price-tiers", data)
      return true
    } catch {
      set({ error: "Failed to add price tier" })
      return false
    }
  },
}))
