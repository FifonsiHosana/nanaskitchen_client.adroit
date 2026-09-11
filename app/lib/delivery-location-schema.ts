import { z } from "zod"

export const deliveryLocationSchema = z.object({
  location: z.string().min(1, "Required"),
  price: z.coerce.number().min(0, "Must be 0 or more"),
  isFreeDelivery: z.boolean(),
  discountPercentage: z.coerce
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional(),
})

export type DeliveryLocationFormValues = z.infer<typeof deliveryLocationSchema>
