import { create } from "zustand"
import { api } from "../lib/axios_v2"

export interface Flavors {
  id: number
  label: string
  image: string
}

interface pricingTiersMain {
  id: number
  amount: number
  currency: string
  discount: number | null
  currencyId: number
  groupName: string
  pricingGroupId: number
}

interface PricingTiers {
  ProductName: string
  ProductId: number
  flavorId: number
  flavorName: number
  isCase: boolean
  length: number | null
  width: number | null
  height: number | null
  unitsPerCase: number
  PricingTiers: pricingTiersMain[]
}

interface Tiers {
  id: number
  amount: string
  discount: string
}

// ── Preview types ─────────────────────────────────────────────────────────────
export interface TierChanges {
  currencyId: number
  minCases: number
  maxCases: number
  targetTierId: number | null
  current: { amount: string; discount: string | null } | null
  incoming: { amount: string; discount: string | null }
  willChange: boolean
  isNew: boolean
}

export interface VariantDiff {
  variantId: number
  isCase: boolean
  sourceProductId: number
  sourceName: string
  targetProductId: number | null
  targetName: string | null
  targetMissing: boolean
  tierChanges: TierChanges[]
  hasAnyChange: boolean
}

export interface FlavorPreview {
  targetFlavorId: number
  targetFlavorLabel: string
  variants: VariantDiff[]
  totalChanges: number
}

export interface ApplyPreview {
  sourceFlavorId: number
  sourceFlavorLabel: string
  priceGroupIds: number[]
  preview: FlavorPreview[]
}

interface FlavorStore {
  flavors: Flavors[]
  priceTier: PricingTiers[]
  priceTiersMain: pricingTiersMain[]
  applyPreview: ApplyPreview | null

  loading: boolean
  priceLoading: boolean
  previewLoading: boolean
  error: string | null

  fetchFlavors: () => Promise<void>
  fetchPriceTiers: (flavorId: number) => Promise<void>
  updatePriceTiers: (tiers: Tiers[]) => Promise<void>
  previewApplyTiers: (
    sourceFlavorId: number,
    targetFlavorIds: number[],
    priceGroupIds: number[]
  ) => Promise<void>
  applyTiersToFlavors: (
    sourceFlavorId: number,
    targetFlavorIds: number[],
    priceGroupIds: number[]
  ) => Promise<void>
  clearPreview: () => void
}

export const useFlavorStore = create<FlavorStore>((set) => ({
  flavors: [],
  priceTier: [],
  priceTiersMain: [],
  applyPreview: null,

  loading: false,
  priceLoading: false,
  previewLoading: false,
  error: null,

  fetchFlavors: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/products/flavors")
      set({ flavors: res.data.flavors })
    } catch {
      set({ error: "Failed to load flavors" })
    } finally {
      set({ loading: false })
    }
  },

  fetchPriceTiers: async (flavorId) => {
    set({ priceLoading: true, error: null })
    try {
      const res = await api.get(`/products/productByflavor/tiers/${flavorId}`)
      set({ priceTier: res.data.priceList })
    } catch {
      set({ error: "Failed to load price tiers" })
    } finally {
      set({ priceLoading: false })
    }
  },

  updatePriceTiers: async (tiers) => {
    set({ priceLoading: true, error: null })
    try {
      await api.patch(`/products/price-list/tiers`, { tiers })
    } catch {
      set({ error: "Failed to update tiers" })
    } finally {
      set({ priceLoading: false })
    }
  },

  // Calls preview for each priceGroupId and merges results
  previewApplyTiers: async (sourceFlavorId, targetFlavorIds, priceGroupIds) => {
    set({ previewLoading: true, error: null })
    try {
      const results = await Promise.all(
        priceGroupIds.map((groupId) =>
          api.get(`/products/price-list/tiers/preview-apply`, {
            params: {
              sourceFlavorId,
              targetFlavorIds: targetFlavorIds.join(","),
              priceGroupId: groupId,
            },
          })
        )
      )

      // Merge previews from all groups — combine variant diffs per flavor
      const mergedPreview: FlavorPreview[] = results[0].data.preview.map(
        (flavorPreview: FlavorPreview, fi: number) => ({
          ...flavorPreview,
          variants: flavorPreview.variants.map((variant, vi: number) => ({
            ...variant,
            tierChanges: priceGroupIds.flatMap(
              (_, gi) => results[gi].data.preview[fi].variants[vi].tierChanges
            ),
            hasAnyChange: priceGroupIds.some(
              (_, gi) => results[gi].data.preview[fi].variants[vi].hasAnyChange
            ),
          })),
          totalChanges: priceGroupIds.reduce(
            (sum, _, gi) => sum + results[gi].data.preview[fi].totalChanges,
            0
          ),
        })
      )

      set({
        applyPreview: {
          sourceFlavorId,
          sourceFlavorLabel: results[0].data.sourceFlavorLabel,
          priceGroupIds,
          preview: mergedPreview,
        },
      })
    } catch {
      set({ error: "Failed to load preview" })
    } finally {
      set({ previewLoading: false })
    }
  },

  // Calls apply for each priceGroupId
  applyTiersToFlavors: async (
    sourceFlavorId,
    targetFlavorIds,
    priceGroupIds
  ) => {
    set({ priceLoading: true, error: null })
    try {
      await Promise.all(
        priceGroupIds.map((priceGroupId) =>
          api.post(`/products/price-list/tiers/apply`, {
            sourceFlavorId,
            targetFlavorIds,
            priceGroupId,
          })
        )
      )
    } catch {
      set({ error: "Failed to apply tiers" })
    } finally {
      set({ priceLoading: false })
    }
  },

  clearPreview: () => set({ applyPreview: null }),
}))
