import React from "react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import logoDark from "~/assets/nana-logo-dark.png"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const formSchema = z.object({
  location: z.string(),
  price: z.number(),
})

export interface deliveryLocation {
  location: string
  price: number
}

type FormValues = z.infer<typeof formSchema>

export function deliveryLocationAdd({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const navigate = useNavigate()

  async function onSubmit(data: FormValues) {}

  const location = useLocation()

  return (
    <div className="px-4">
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit(onSubmit, (errors) =>
          console.log("validation errors:", errors)
        )}
        {...props}
      >
        {" "}
        <div className="mx-4 flex items-center justify-center px-4">
          <div className="object-contain"></div>
        </div>
        <FieldGroup>
          <div className="grid gap-4 grid-cols-5">
            <Field className="col-span-2">
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input {...register("location")} id="location" required />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="price">Price</FieldLabel>
              </div>
              <Input {...register("price")} id="price" required />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="price">Area</FieldLabel>
              </div>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="-200">Within Accra</SelectItem>
                    <SelectItem value="200-500">Outside Accra</SelectItem>
                    <SelectItem value="500-1000">International</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              {" "}
              {/* <div className="flex items-center">
                <FieldLabel htmlFor="">...</FieldLabel>
              </div> */}
              <div className="m-7.5">
                <Button className="h-6 w-6 rounded-full">
                  {" "}
                  +
                </Button>
              </div>
            </Field>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

export default deliveryLocationAdd
