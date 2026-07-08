import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Field, FieldGroup } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Toggle } from "./ui/toggle"
import {
  deliveryLocationSchema,
  type DeliveryLocationFormValues,
} from "../lib/delivery-location-schema"

export function AddRow({
  onAdd,
}: {
  onAdd: (data: DeliveryLocationFormValues) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DeliveryLocationFormValues>({
    resolver: zodResolver(deliveryLocationSchema),
    defaultValues: {
      location: "",
      price: 0,
      isFreeDelivery: false,
      discountPercentage: null,
    },
  })

  const isFree = watch("isFreeDelivery")

  async function onSubmit(data: DeliveryLocationFormValues) {
    await onAdd(data)
    reset()
  }

  return (
    <FieldGroup className="flex items-center justify-center">
      <div className="grid grid-cols-5 gap-4">
        <Field className="col-span-2">
          <Input
            {...register("location")}
            placeholder="Location name"
            className={errors.location ? "border-red-500" : ""}
          />
        </Field>
        <Field>
          <Input
            {...register("price")}
            placeholder="Price (GHS)"
            type="number"
            step="any"
            disabled={isFree}
            className={errors.price ? "border-red-500" : ""}
          />
        </Field>
        <Field className="grid grid-cols-2 gap-2">
          <Input
            {...register("discountPercentage")}
            placeholder="Discount %"
            type="number"
            step="any"
          />
          <Toggle
            variant="outline"
            pressed={isFree}
            onPressedChange={(v) => {
              setValue("isFreeDelivery", v)
              if (v) setValue("price", 0)
            }}
            className="data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:hover:bg-green-700"
          >
            Free
          </Toggle>
        </Field>
        <Field className="flex items-center justify-end">
          <Button
            type="button"
            className="h-8 w-8 rounded-full text-lg font-bold"
            onClick={handleSubmit(onSubmit)}
          >
            +
          </Button>
        </Field>
      </div>
    </FieldGroup>
  )
}
