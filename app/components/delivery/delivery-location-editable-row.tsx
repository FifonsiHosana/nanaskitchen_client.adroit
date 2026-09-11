import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { z } from "zod";

import { DeliveryLocationRowActions } from "./delivery-location-row-actions";
import { TableCell, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import {
  deliveryLocationSchema,
  type DeliveryLocationFormValues,
} from "@/app/lib/delivery-location-schema";
import type { DeliveryLocationRecord } from "@/app/store/use_delivery_locations_store";
import { cn } from "@/app/lib/utils";

export function EditableRow({
  loc,
  index,
  onSave,
  onDelete,
}: {
  loc: DeliveryLocationRecord;
  index: number;
  onSave: (id: number, data: DeliveryLocationFormValues) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined,
  );

  const defaults: DeliveryLocationFormValues = {
    location: loc.location,
    price: loc.price ?? 0,
    isFreeDelivery: loc.isFreeDelivery,
    discountPercentage: loc.discountPercentage
      ? Number(loc.discountPercentage)
      : null,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<
    z.input<typeof deliveryLocationSchema>,
    unknown,
    z.output<typeof deliveryLocationSchema>
  >({
    resolver: zodResolver(deliveryLocationSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [loc]);

  const isFree = watch("isFreeDelivery");

  async function onSaveClick(data: DeliveryLocationFormValues) {
    await onSave(loc.id, data);
    setIsEditing(false);
  }

  return (
    <TableRow
      data-state={
        isEditing || selectedRowId === loc.id ? "selected" : undefined
      }
      onClick={() =>
        setSelectedRowId((prev) => (prev === loc.id ? undefined : loc.id))
      }
      key={loc.id}
    >
      <TableCell
        className={cn(
          selectedRowId === loc.id && "border-blue-300 border ring-blue-400",
        )}
      >
        <Input
          {...register("location")}
          id={`location-${index}`}
          disabled={!isEditing}
        />
      </TableCell>
      <TableCell>
        <Input
          {...register("price")}
          id={`price-${index}`}
          type="number"
          disabled={!isEditing || isFree}
        />
      </TableCell>
      <TableCell>
        <Input
          {...register("discountPercentage")}
          id={`discount-${index}`}
          type="number"
          disabled={!isEditing}
        />
      </TableCell>
      <TableCell>
        <Toggle
          variant="outline"
          pressed={isFree}
          disabled={!isEditing}
          onPressedChange={(v) => {
            setValue("isFreeDelivery", v, { shouldDirty: true });
            if (v) setValue("price", 0, { shouldDirty: true });
          }}
          className="data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:hover:bg-green-700"
        >
          Free
        </Toggle>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <DeliveryLocationRowActions
            isEditing={isEditing}
            isDirty={isDirty}
            onSave={handleSubmit(() => onSaveClick)}
            onCancel={() => {
              reset(defaults);
              setIsEditing(false);
            }}
            onEdit={() => setIsEditing(true)}
            onDelete={() => onDelete(loc.id)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
