import { Field, FieldLabel } from "./ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { AddVariantDialog } from "./add-variant-dialog"
import type { Flavors } from "../store/use_flavor_store"
import type { Variant } from "../store/use_catalog_store"

export function ProductFlavorVariantFields({
  flavors,
  variants,
  flavorId,
  variantId,
  onFlavorChange,
  onVariantChange,
}: {
  flavors: Flavors[]
  variants: Variant[]
  flavorId: string
  variantId: string
  onFlavorChange: (v: string) => void
  onVariantChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel>Flavor</FieldLabel>
        <Select value={flavorId} onValueChange={onFlavorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select flavor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {flavors?.map((f) => (
                <SelectItem key={f.id} value={String(f.id)}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Variant</FieldLabel>
        <div className="flex gap-2">
          <Select value={variantId} onValueChange={onVariantChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {variants.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.variantName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <AddVariantDialog />
        </div>
      </Field>
    </div>
  )
}
