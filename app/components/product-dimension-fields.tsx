import { Field, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import type { AddProductFormState } from "../lib/use-add-product-form"

export function ProductDimensionFields({
  form,
  setField,
}: {
  form: AddProductFormState
  setField: <K extends keyof AddProductFormState>(
    key: K,
    value: AddProductFormState[K]
  ) => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Field>
          <FieldLabel>Length</FieldLabel>
          <Input
            value={form.length}
            onChange={(e) => setField("length", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Width</FieldLabel>
          <Input
            value={form.width}
            onChange={(e) => setField("width", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Height</FieldLabel>
          <Input
            value={form.height}
            onChange={(e) => setField("height", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Weight</FieldLabel>
          <Input
            value={form.weight}
            onChange={(e) => setField("weight", e.target.value)}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>Units per case</FieldLabel>
        <Input
          step="any"
          type="number"
          value={form.unitsPerCase}
          onChange={(e) => setField("unitsPerCase", e.target.value)}
        />
      </Field>
    </>
  )
}
