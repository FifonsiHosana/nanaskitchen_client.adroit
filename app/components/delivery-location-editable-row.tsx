import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Field, FieldGroup } from "./ui/field"
import { Input } from "./ui/input"
import { Toggle } from "./ui/toggle"
import { deliveryLocationSchema, type DeliveryLocationFormValues } from "../lib/delivery-location-schema"
import type { DeliveryLocationRecord } from "../store/use_delivery_locations_store"
import { DeliveryLocationRowActions } from "./delivery-location-row-actions"

export function EditableRow({
  loc,
  index,
  onSave,
  onDelete,
}: {
  loc: DeliveryLocationRecord
  index: number
  onSave: (id: number, data: DeliveryLocationFormValues) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false)

  const defaults: DeliveryLocationFormValues = {
    location: loc.location,
    price: loc.price ?? 0,
    isFreeDelivery: loc.isFreeDelivery,
    discountPercentage: loc.discountPercentage ? Number(loc.discountPercentage) : null,
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<DeliveryLocationFormValues>({
    resolver: zodResolver(deliveryLocationSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    reset(defaults)
  }, [loc])

  const isFree = watch("isFreeDelivery")

  async function onSaveClick(data: DeliveryLocationFormValues) {
    await onSave(loc.id, data)
    setIsEditing(false)
  }

  return (
    <FieldGroup>
      <div className="grid grid-cols-5 gap-4">
        <Field className="col-span-2">
          <Input {...register("location")} id={`location-${index}`} disabled={!isEditing} />
        </Field>
        <Field>
          <Input {...register("price")} id={`price-${index}`} type="number" disabled={!isEditing || isFree} />
        </Field>
        <Field className="grid grid-cols-2 gap-2">
          <Input {...register("discountPercentage")} id={`discount-${index}`} type="number" disabled={!isEditing} />
          <Toggle
            variant="outline"
            pressed={isFree}
            disabled={!isEditing}
            onPressedChange={(v) => {
              setValue("isFreeDelivery", v, { shouldDirty: true })
              if (v) setValue("price", 0, { shouldDirty: true })
            }}
            className="data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:hover:bg-green-700"
          >
            Free
          </Toggle>
        </Field>
        <Field className="flex items-center justify-end">
          <div className="ml-2 flex gap-2">
            <DeliveryLocationRowActions
              isEditing={isEditing}
              isDirty={isDirty}
              onSave={handleSubmit(onSaveClick)}
              onCancel={() => {
                reset(defaults)
                setIsEditing(false)
              }}
              onEdit={() => setIsEditing(true)}
              onDelete={() => onDelete(loc.id)}
            />
          </div>
        </Field>
      </div>
    </FieldGroup>
  )
}
