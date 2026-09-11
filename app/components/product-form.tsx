import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Control } from "react-hook-form";
import { set, string, z } from "zod";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { Card } from "../components/ui/card";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

import { api } from "../lib/axios";
import { toast } from "sonner";

import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { MultiImages } from "./image-upload";
import ProductPopover from "./product-popover";
import { usePermission } from "../hooks/use-permission";
import type { CountrySettings, ProductV2 } from "../store/v2/use-product-store";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { error: "Title must be at least 2 characters long" })
    .max(100),
  countrySettings: z.array(
    z.object({
      id: z.number(),
      stock: z.number(),
      visible: z.number(),
      countryName: z.string(),
    }),
  ),
  image: z
    .string()
    // .min(2, { error: "Image URL must be at least 2 characters long" })
    .max(400)
    .optional(),
  images: z.array(string()),
  length: z.coerce
    .number({ error: "Length must be a valid number" })
    .min(0, { error: "Length cannot be negative" }),
  width: z.coerce
    .number({ error: "Width must be a valid number" })
    .min(0, { error: "Width cannot be negative" }),
  height: z.coerce
    .number({ error: "Height must be a valid number" })
    .min(0, { error: "Height cannot be negative" }),
  weight: z.coerce
    .number({ error: "Weight must be a valid number" })
    .min(0, { error: "Weight cannot be negative" }),
  unitsPerCase: z.coerce
    .number({ error: "unitsPerCase must be a valid number" })
    .min(0, { error: "unitsPerCase cannot be negative" }),
});

// export interface Product {
//   id: number
//   image: string
//   images: [string]
//   title: string
//   // price: {
//   //   usd: string
//   //   ghs: string
//   //   eur: string
//   // }
//   weight: string
//   dimensions: {
//     length: string
//     width: string
//     height: string
//   }
//   outOfStockGH: boolean
//   outOfStockUS: boolean
//   outOfStockEU: boolean
//   visibleGH: boolean
//   visibleUS: boolean
//   visibleEU: boolean
//   // discounts: {
//   //   dollarDiscount: string
//   //   cediDiscount: string
//   //   euroDiscount: string
//   // }
//   version: number
// }

export type FormValues = z.infer<typeof formSchema>;

type UserFormProps = {
  onSuccess?: () => void;
  product?: ProductV2;
};

export default function ProductForm({ product }: UserFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    watch,
    getValues,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countrySettings: [],
      images: [],
      image: "",
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      unitsPerCase: 0,
    },
  });

  console.log("isDirty", isDirty);
  console.log("dirtyFields", dirtyFields);

  useEffect(() => {
    if (product) {
      setValue("title", product.productTitle);
      setValue("image", product.mainImage);
      setValue("length", Number(product.length));
      setValue("width", Number(product.width));
      setValue("height", Number(product.height));
      setValue("weight", Number(product?.weight));
      // setValue("outOfStockGH", product?.outOfStockGH)
      // setValue("outOfStockUS", product?.outOfStockUS)
      // setValue("outOfStockEU", product?.outOfStockEU)
      // setValue("visibleGH", product?.visibleGH)
      // setValue("visibleUS", product?.visibleUS)
      // setValue("visibleEU", product?.visibleEU)
      setValue("images", product.images);
      setValue("images", product.images);
      setValue("unitsPerCase", product.unitsPerCase);
      setValue("countrySettings", product.countrySettings);
    }
  }, [product, setValue]);

  console.log(dirtyFields);

  async function onSubmit(data: FormValues) {
    if (!isDirty) {
      toast("No changes were made.");
      return;
    }

    const changes = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        data[key as keyof FormValues],
      ]),
    );
    console.log(changes);

    data.image = data.images?.[0] ?? "";

    try {
      if (product) {
        console.log(changes);

        await api.patch(
          `/products/update/${Number(product.productId)}`,
          changes,
        );
      } else {
        await api.post("/products/create", data);
      }

      toast("Product saved successfully.");

      // navigate(`/portal/products-all/${product?.flavorId}`)
      navigate(-1);
    } catch (error: any) {
      console.error("submit error:", error);
      toast(error?.response?.data?.message ?? "Failed to save product.");
    }
  }

  const navigate = useNavigate();
  // const outOfStockGH = watch("outOfStockGH")

  const imagesWatch = watch("images");
  // const outOfStockUS = watch("outOfStockUS")
  // const outOfStockEU = watch("outOfStockEU")
  // const visibleGH = watch("visibleGH")
  // const visibleUS = watch("visibleUS")
  // const visibleEU = watch("visibleEU")
  console.log(dirtyFields);

  const removeExistingImage = async (url: string) => {
    try {
      setValue(
        "images",
        imagesWatch.filter((img) => img !== url),
        { shouldDirty: true },
      );
      // await api.delete(`/image`)
    } catch (error) {}
  };

  const { fields } = useFieldArray({
    control: control,
    name: "countrySettings",
  });

  // PATCH /products/update/:id and POST /products/create require
  // products/edit. View-only users get disabled fields and no submit, so a
  // form they reach for viewing can never 403 on submit. `allowed` is false
  // until permissions resolve, so nothing flashes enabled first.
  const { allowed: canEditProduct } = usePermission("products", "edit");

  // console.log(fields)

  return (
    <div className="space-y-4 p-8">
      {/* <h1 className="text-4xl font-bold">Product Form</h1> */}
      <Card className="p-4">
        <h2 className="text-2xl font-semibold">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <FieldGroup>
          <form
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit, (errors) => {
              Object.values(errors).forEach((error) => {
                toast.error(error?.message);
                console.log(error);
              });
            })}
          >
            {!canEditProduct && (
              <p className="text-sm text-muted-foreground">
                View only — you don&apos;t have permission to edit products.
              </p>
            )}
            <fieldset disabled={!canEditProduct} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-5">
                <Field className="col-span-2">
                  <FieldLabel htmlFor="form-name">Product Name</FieldLabel>

                  <Input
                    className="col-span-2"
                    {...register("title")}
                    placeholder="Product Name"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="form-name">Units Per Case</FieldLabel>
                  <Input
                    {...register("unitsPerCase")}
                    placeholder="Units Per Case"
                  />
                </Field>

                <ProductPopover
                  control={control}
                  type="visible"
                  fields={fields}
                  watch={watch}
                />
                <ProductPopover
                  control={control}
                  fields={fields}
                  type={"stock"}
                  watch={watch}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
                <Field>
                  <FieldLabel htmlFor="form-name">Length</FieldLabel>
                  <Input {...register("length")} placeholder="Length" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="form-name">Width</FieldLabel>
                  <Input {...register("width")} placeholder="Width" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="form-name">Height</FieldLabel>

                  <Input {...register("height")} placeholder="Height" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="form-name">Weight</FieldLabel>
                  <Input {...register("weight")} placeholder="Weight" />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="form-name">Images</FieldLabel>
                <MultiImages
                  setValue={setValue}
                  getValues={getValues}
                  imagesWatch={imagesWatch}
                  removeExistingImage={removeExistingImage}
                  product={product}
                />
              </Field>
              {/* <div className="flex gap-4"> */}
              {/* <div className="h-25 w-25 overflow-hidden rounded-xl border object-contain">
                <img
                  className="object cover h-full w-full"
                  src={product?.image}
                />
              </div> */}
              {/* {product?.images?.map((image) => (
                <div className="h-25 w-25 overflow-hidden rounded-xl border object-contain">
                  <img className="object cover h-full w-full" src={image} />
                </div>
              ))}
            </div> */}
              {/* <Input {...register("image")} placeholder="Image URL" /> */}
              {/* </Field> */}
              {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="form-name">Dollar Price</FieldLabel>
                <Input
                  {...register("dollarPrice")}
                  placeholder="Dollar Price"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-name">Cedi Price</FieldLabel>
                <Input {...register("cediPrice")} placeholder="Cedi Price" />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-name">Euro Price</FieldLabel>
                <Input {...register("euroPrice")} placeholder="Euro Price" />
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
            </div> */}
            </fieldset>
            <div className="md:grid md:grid-cols-5 flex gap-5">
              <Button
                onClick={() => navigate(-1)}
                className="cursor-pointer"
                type="button"
                // variant={"destructive"}
              >
                cancel
              </Button>
              {canEditProduct && (
                <Button
                  disabled={!isDirty}
                  type="submit"
                  className="cursor-pointer bg-new"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </FieldGroup>
      </Card>
    </div>
  );
}
