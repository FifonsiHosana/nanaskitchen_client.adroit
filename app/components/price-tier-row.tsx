import { Input } from "./ui/input"

export function PriceTierRow({
  currency,
  amount,
  discount,
  isCase,
  unitInCase,
  isAmountDirty,
  isDiscountDirty,
  amountFieldName,
  discountFieldName,
  register,
}: {
  currency: string
  amount: number
  discount: number
  isCase: boolean
  unitInCase: number
  isAmountDirty: boolean
  isDiscountDirty: boolean
  amountFieldName: string
  discountFieldName: string
  register: any
}) {
  const finalPrice = amount - (discount * amount) / 100
  const finalCasePrice = amount * unitInCase
  const dirtyClass = "bg-destructive/20 border-destructive/40"

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <span className="text-sm text-muted-foreground">{currency}</span>
      <Input
        {...register(amountFieldName)}
        type="number"
        step="any"
        placeholder="Amount"
        className={isAmountDirty ? dirtyClass : ""}
      />
      <Input
        {...register(discountFieldName)}
        type="number"
        step="any"
        placeholder="Discount %"
        className={isDiscountDirty ? dirtyClass : ""}
      />
      <Input
        value={isNaN(finalPrice) ? "" : isCase ? finalCasePrice : finalPrice}
        disabled
      />
    </div>
  )
}
