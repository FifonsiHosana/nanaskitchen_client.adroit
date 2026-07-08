import { FieldGroup } from "./ui/field"
import { toast } from "sonner"
import { PriceTierProductRow } from "./price-tier-product-row"
import { TAB_GROUP_MAP, type PriceGroupTab } from "../lib/price-tier-form-schema"
import { usePriceTiersForm } from "../lib/use-price-tiers-form"

interface Props {
  flavorId: number
  activeTab: PriceGroupTab
  onDirtyChange: (dirty: boolean) => void
  onDraftChange: (hasDraft: boolean) => void
  onRevert: (fn: () => void) => void
}

const PriceTiersDetails = ({
  flavorId,
  activeTab,
  onDirtyChange,
  onDraftChange,
  onRevert,
}: Props) => {
  const {
    register,
    handleSubmit,
    dirtyFields,
    fields,
    products,
    priceLoading,
    onSubmit,
    handleTierAdded,
  } = usePriceTiersForm(flavorId, onDirtyChange, onDraftChange, onRevert)

  if (priceLoading)
    return (
      <div className="flex h-full w-full items-center justify-center p-4 text-sm text-muted-foreground">
        Loading...
      </div>
    )

  const pricingGroupId = TAB_GROUP_MAP[activeTab]
  const visibleFields = fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) =>
      field.pricingTiers.some((tier) => tier.pricingGroupId === pricingGroupId)
    )

  return (
    <FieldGroup>
      <form
        id="price-tiers-form"
        className="grid gap-4 px-4"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          Object.values(errors).forEach((error: any) =>
            toast.error(error?.message)
          )
        })}
      >
        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
          <span>Currency</span>
          <span>Amount</span>
          <span>Discount %</span>
          <span>Final Price</span>
        </div>

        {visibleFields.map(({ field, index }) => (
          <PriceTierProductRow
            key={field.id}
            field={field}
            index={index}
            pricingGroupId={pricingGroupId}
            register={register}
            dirtyFields={dirtyFields}
            products={products}
            onTierAdded={handleTierAdded}
          />
        ))}
      </form>
    </FieldGroup>
  )
}

export default PriceTiersDetails
