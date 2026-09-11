// Pricing groups mirror the `PricingGroups` table seeded in
// server/src/priceGroupSeed.ts (retailer, wholesaler, distributor).
// `slug` is used in URLs, `id` matches the seed insert order (1-indexed).

export type PriceGroupSlug = "retailer" | "wholesaler" | "distributor"

export interface PriceGroup {
  slug: PriceGroupSlug
  label: string
  id: number
}

export const PRICE_GROUPS: PriceGroup[] = [
  { slug: "retailer", label: "Retailer", id: 1 },
  { slug: "wholesaler", label: "Wholesaler", id: 2 },
  { slug: "distributor", label: "Distributor", id: 3 },
]

export const DEFAULT_PRICE_GROUP: PriceGroupSlug = "retailer"

export function isPriceGroupSlug(value: string): value is PriceGroupSlug {
  return PRICE_GROUPS.some((g) => g.slug === value)
}

export function priceGroupLabel(slug: string): string {
  return PRICE_GROUPS.find((g) => g.slug === slug)?.label ?? slug
}

export function priceGroupId(slug: string): number | undefined {
  return PRICE_GROUPS.find((g) => g.slug === slug)?.id
}
