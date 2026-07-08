import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { SingleImageUpload } from "./single-image-upload"
import { ProductFlavorVariantFields } from "./product-flavor-variant-fields"
import { ProductDimensionFields } from "./product-dimension-fields"
import type { Flavors } from "../store/use_flavor_store"
import type { Variant } from "../store/use_catalog_store"
import type { AddProductFormState } from "../lib/use-add-product-form"

export function AddProductFormFields({
  form,
  setField,
  flavors,
  variants,
}: {
  form: AddProductFormState
  setField: <K extends keyof AddProductFormState>(
    key: K,
    value: AddProductFormState[K]
  ) => void
  flavors: Flavors[]
  variants: Variant[]
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="product-title">Name</FieldLabel>
        <Input
          id="product-title"
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="e.g. 16 oz Green Shitor"
        />
      </Field>
      <ProductFlavorVariantFields
        flavors={flavors}
        variants={variants}
        flavorId={form.flavorId}
        variantId={form.variantId}
        onFlavorChange={(v) => setField("flavorId", v)}
        onVariantChange={(v) => setField("variantId", v)}
      />
      <Field className="flex flex-row items-center gap-2">
        <div className=" inline-flex justify-center items-center gap-2">
          <Checkbox
            id="product-is-case"
            checked={form.isCase}
            onCheckedChange={(c) => setField("isCase", Boolean(c))}
          />
          <FieldLabel htmlFor="product-is-case">
            This is a case (multi-unit) product
          </FieldLabel>
        </div>
      </Field>
      <ProductDimensionFields form={form} setField={setField} />
      <Field>
        <FieldLabel>Image</FieldLabel>
        <SingleImageUpload
          value={form.image}
          onUploaded={(url) => setField("image", url)}
        />
      </Field>
    </FieldGroup>
  )
}
