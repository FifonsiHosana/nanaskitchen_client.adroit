// A draft is only usable if it matches the shape we currently expect
// (e.g. it must include productId per product, added when AddPriceTierDialog
// was introduced). Older drafts saved before that change are discarded.
export function isValidDraft(draft: unknown): draft is {
  products: Array<{
    productId: number
    pricingTiers: Array<{ id: number }>
  }>
} {
  if (!draft || typeof draft !== "object") return false
  const products = (draft as any).products
  if (!Array.isArray(products)) return false
  return products.every(
    (p: any) =>
      typeof p.productId === "number" &&
      Array.isArray(p.pricingTiers) &&
      p.pricingTiers.every((t: any) => typeof t.id === "number")
  )
}

export interface TierUpdate {
  id: number
  amount?: string
  discount?: string | null
}

// Build a PATCH payload containing only the tiers the user actually edited.
// Discount of null/empty is sent as null, never the string "null".
export function buildDirtyTierUpdates(
  products: Array<{
    pricingTiers: Array<{ id: number; amount: number; discount: number | null }>
  }>,
  dirtyFields: any
): TierUpdate[] {
  const updates: TierUpdate[] = []

  products.forEach((product, pIndex) => {
    product.pricingTiers.forEach((tier, tIndex) => {
      const dirty = dirtyFields?.products?.[pIndex]?.pricingTiers?.[tIndex]
      if (!dirty?.amount && !dirty?.discount) return

      const update: TierUpdate = { id: tier.id }
      if (dirty.amount) update.amount = String(tier.amount)
      if (dirty.discount) {
        update.discount =
          tier.discount === null || Number.isNaN(tier.discount)
            ? null
            : String(tier.discount)
      }
      updates.push(update)
    })
  })

  return updates
}
