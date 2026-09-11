import {
  deliveryLocationSchema,
  type DeliveryLocationFormValues,
} from "@/app/lib/delivery-location-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import { cn } from "@/app/lib/utils";

export function AddRow({
  onAdd,
}: {
  onAdd: (data: DeliveryLocationFormValues) => Promise<void>;
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
  });

  const isFree = watch("isFreeDelivery");

  async function onSubmit(data: DeliveryLocationFormValues) {
    await onAdd(data);
    reset();
  }

  return (
    <TableRow className="bg-border hover:bg-border">
      <TableCell>
        <Input
          {...register("location")}
          placeholder="Enter location name"
          className={errors.location ? "border-red-500" : ""}
        />
      </TableCell>

      <TableCell>
        <Input
          {...register("price")}
          placeholder="Price (GHS)"
          type="number"
          step="any"
          disabled={isFree}
          className={errors.price ? "border-red-500" : ""}
        />
      </TableCell>
      <TableCell>
        <Input
          {...register("discountPercentage")}
          placeholder="Discount %"
          type="number"
          step="any"
        />
      </TableCell>
      <TableCell>
        <Toggle
          variant="outline"
          pressed={isFree}
          onPressedChange={(v) => {
            setValue("isFreeDelivery", v);
            if (v) setValue("price", 0);
          }}
          className="data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:hover:bg-green-700"
        >
          Free
        </Toggle>
      </TableCell>
      <TableCell className="flex items-center justify-end">
        <Button
          type="button"
          className={cn("bg-new h-8 w-8 rounded-full text-lg font-bold")}
          onClick={handleSubmit(onSubmit)}
        >
          +
        </Button>
      </TableCell>
    </TableRow>
  );
}
