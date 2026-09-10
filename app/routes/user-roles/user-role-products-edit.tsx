import React, { use, useEffect } from "react"
import { Field, FieldGroup, FieldLabel } from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { useRolesStore } from "../../store/use_roles_store"
import { useNavigate, useParams } from "react-router"
import { string, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "../../lib/axios"
import { toast } from "sonner"

const UserRoleProductsEdit = () => {
  const { fetchUserRoleProductsPrices, userRoleProductsPrices, isLoading } =
    useRolesStore()

  const navigate = useNavigate()

  const { id, productId } = useParams<{ id: string; productId: string }>()

  // console.log(userRoleProductsPrices)

  useEffect(() => {
    fetchUserRoleProductsPrices(Number(id), Number(productId))
  }, [id, productId])

  const formSchema = z.object({
    dollarPrice: z.coerce.string().min(0),
    cediPrice: z.coerce.string().min(0),
    euroPrice: z.coerce.string().min(0),
    dollarDiscount: z.coerce
      .number({ error: "Dollar discount must be a number" })
      .min(0, "Dollar discount cannot be negative"),
    cediDiscount: z.coerce
      .number({ error: "Cedi discount must be a number" })
      .min(0, "Cedi discount cannot be negative"),
    euroDiscount: z.coerce
      .number({ error: "Euro discount must be a number" })
      .min(0, "Euro discount cannot be negative"),
    minQuantity: z.coerce
      .number({ error: "Minimum quantity must be a number" })
      .min(1, "Minimum quantity must be at least 1")
      .max(50, "Minimum quantity cannot exceed 50"),
  })

  type FormValues = z.infer<typeof formSchema>

  type UserFormProps = {
    onSuccess?: () => void
  }

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    watch,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const minQuantityWatch = watch("minQuantity")

  const totalDollarPrice =
    Number(userRoleProductsPrices.dollarPrice) * Number(minQuantityWatch)

  const totalCediPrice =
    Number(userRoleProductsPrices.cediPrice) * Number(minQuantityWatch)

  const totalEuroPrice =
    Number(userRoleProductsPrices.euroPrice) * Number(minQuantityWatch)

  useEffect(() => {
    if (userRoleProductsPrices) {
      setValue("dollarPrice", String(totalDollarPrice))
      setValue("cediPrice", String(Number(totalCediPrice)))
      setValue("euroPrice", String(Number(totalEuroPrice)))
      setValue("dollarDiscount", Number(userRoleProductsPrices.dollarDiscount))
      setValue("cediDiscount", Number(userRoleProductsPrices.cediDiscount))
      setValue("euroDiscount", Number(userRoleProductsPrices.euroDiscount))
      setValue("minQuantity", Number(userRoleProductsPrices.minQuantity))
    }
  }, [userRoleProductsPrices])

  async function onSubmit(data: FormValues) {
    // console.log("clicked")

    if (!isDirty) {
      toast("No changes were made.")
      return
    }

    const changes = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        data[key as keyof FormValues],
      ])
    )

    try {
      await api.patch(`/user-roles/${id}/price/edit`, changes)

      toast("Product saved successfully.")

      // navigate("")
    } catch (error: any) {
      console.error("submit error:", error)

      toast(error?.response?.data?.message ?? "Failed to save product.")
    }
  }

  return (
    <div>
      <div className="space-y-4 p-8">
        {!isLoading ? (
          <Card className="p-4">
            <h2 className="text-2xl font-semibold">Edit user role product</h2>

            <FieldGroup>
              <form
                className="grid gap-4"
                onSubmit={handleSubmit(onSubmit, (errors) => {
                  Object.values(errors).forEach((error) => {
                    toast.error(error?.message)
                  })
                })}
              >
                <div className="grid gap-4 md:grid-cols-5">
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="form-name" className="text-lg">
                      {userRoleProductsPrices?.productName}
                    </FieldLabel>
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="form-name" className="flex">
                      {/* <span>Min qtty:</span> */}
                      <p>Min qtty:</p>
                      <Input
                        {...register("minQuantity")}
                        placeholder="Minimum quantity"
                      />
                    </FieldLabel>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="form-name">Dollar price</FieldLabel>
                    <Input
                      // {...register("dollarPrice")}
                      value={totalDollarPrice}
                      placeholder="Dollar price"
                      disabled
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="form-name">Cedi price</FieldLabel>
                    <Input
                      // {...register("cediPrice")}
                      value={totalCediPrice}
                      placeholder="Cedi price"
                      disabled
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="form-name">Euro price</FieldLabel>
                    <Input
                      // {...register("euroPrice")}
                      value={totalEuroPrice}
                      placeholder="Euro price"
                      disabled
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="form-name">Dollar discount</FieldLabel>
                    <Input
                      {...register("dollarDiscount")}
                      placeholder="Dollar discount"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="form-name">Cedi discount</FieldLabel>
                    <Input
                      {...register("cediDiscount")}
                      placeholder="Cedi discount"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="form-name">Euro discount</FieldLabel>
                    <Input
                      {...register("euroDiscount")}
                      placeholder="Euro discount"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-5 gap-5">
                  <Button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer"
                    type="button"
                  >
                    cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer">
                    Submit
                  </Button>
                </div>
              </form>
            </FieldGroup>
          </Card>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}

export default UserRoleProductsEdit
