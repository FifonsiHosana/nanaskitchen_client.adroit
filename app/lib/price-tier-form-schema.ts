import { z } from "zod"
import { PRICE_GROUPS, type PriceGroupSlug } from "./price-groups"

export const priceTierFormSchema = z.object({
  products: z.array(
    z.object({
      productId: z.number(),
      name: z.string(),
      isCase: z.boolean(),
      unitInCase: z.number(),
      pricingTiers: z.array(
        z.object({
          id: z.number(),
          currency: z.string(),
          amount: z.preprocess((val) => Number(val), z.number()),
          discount: z.preprocess(
            (val) => (val === "" ? null : Number(val)),
            z.number().nullable()
          ),
          pricingGroupId: z.number(),
        })
      ),
    })
  ),
})

export type PriceTierFormValues = z.infer<typeof priceTierFormSchema>

export type PriceGroupTab = PriceGroupSlug

// Derived from the single source of truth in lib/price-groups.ts
export const TAB_GROUP_MAP = Object.fromEntries(
  PRICE_GROUPS.map((g) => [g.slug, g.id])
) as Record<PriceGroupTab, number>

export const mapPriceTiersToFormShape = (
  data: any[]
): PriceTierFormValues["products"] =>
  data.map((p) => ({
    productId: p.ProductId,
    name: p.ProductName,
    isCase: p.isCase,
    unitInCase: p.unitsPerCase,
    pricingTiers: p.PricingTiers.map((tier: any) => ({
      id: tier.id,
      currency: tier.currency,
      amount: tier.amount,
      discount: tier.discount,
      pricingGroupId: tier.pricingGroupId,
    })),
  }))
