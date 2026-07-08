import { AddPriceTierDialog } from "./add-price-tier-dialog"
import { PriceTierRow } from "./price-tier-row"

interface TierField {
  id: number
  currency: string
  pricingGroupId: number
}

interface ProductField {
  productId: number
  name: string
  isCase: boolean
  unitInCase: number
  pricingTiers: TierField[]
}

export function PriceTierProductRow({
  field,
  index,
  pricingGroupId,
  register,
  dirtyFields,
  products,
  onTierAdded,
}: {
  field: ProductField
  index: number
  pricingGroupId: number
  register: any
  dirtyFields: any
  products: any
  onTierAdded: () => void
}) {
  // Preserve the real array index so form field paths and watch reads stay aligned
  const visibleTiers = field.pricingTiers
    .map((tier, realIndex) => ({ tier, realIndex }))
    .filter(({ tier }) => tier.pricingGroupId === pricingGroupId)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{field.name}</p>
        <AddPriceTierDialog
          productId={field.productId}
          productName={field.name}
          pricingGroupId={pricingGroupId}
          onAdded={onTierAdded}
        />
      </div>

      {visibleTiers.map(({ tier, realIndex }) => (
        <PriceTierRow
          key={tier.id}
          currency={tier.currency}
          amount={products?.[index]?.pricingTiers?.[realIndex]?.amount || 0}
          discount={products?.[index]?.pricingTiers?.[realIndex]?.discount || 0}
          isCase={field.isCase}
          unitInCase={field.unitInCase}
          isAmountDirty={Boolean(
            dirtyFields.products?.[index]?.pricingTiers?.[realIndex]?.amount
          )}
          isDiscountDirty={Boolean(
            dirtyFields.products?.[index]?.pricingTiers?.[realIndex]?.discount
          )}
          amountFieldName={`products.${index}.pricingTiers.${realIndex}.amount`}
          discountFieldName={`products.${index}.pricingTiers.${realIndex}.discount`}
          register={register}
        />
      ))}
    </div>
  )
}
