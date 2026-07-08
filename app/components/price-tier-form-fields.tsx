import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import type { Currency } from "../store/use_pricing_meta_store"

export interface PriceTierFormState {
  currencyId: string
  minCases: string
  maxCases: string
  amount: string
  discount: string
}

export function PriceTierFormFields({
  form,
  setField,
  currencies,
}: {
  form: PriceTierFormState
  setField: <K extends keyof PriceTierFormState>(
    key: K,
    value: PriceTierFormState[K]
  ) => void
  currencies: Currency[]
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Currency</FieldLabel>
        <Select
          value={form.currencyId}
          onValueChange={(v) => setField("currencyId", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencies.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.currencyLabel} ({c.currencyCode})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Min cases</FieldLabel>
          <Input
            type="number"
            step="any"
            value={form.minCases}
            onChange={(e) => setField("minCases", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Max cases</FieldLabel>
          <Input
            type="number"
            step="any"
            value={form.maxCases}
            onChange={(e) => setField("maxCases", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Amount</FieldLabel>
          <Input
            type="number"
            step="any"
            value={form.amount}
            onChange={(e) => setField("amount", e.target.value)}
            placeholder="0.00"
          />
        </Field>
        <Field>
          <FieldLabel>Discount %</FieldLabel>
          <Input
            type="number"
            step="any"
            value={form.discount}
            onChange={(e) => setField("discount", e.target.value)}
            placeholder="optional"
          />
        </Field>
      </div>
    </FieldGroup>
  )
}
