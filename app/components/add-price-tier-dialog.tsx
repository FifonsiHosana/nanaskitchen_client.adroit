import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { PriceTierFormFields } from "./price-tier-form-fields";
import { usePermission } from "../hooks/use-permission";
import { usePricingMetaStore } from "../store/use_pricing_meta_store";
import { useAddPriceTierForm } from "../lib/use-add-price-tier-form";

export function AddPriceTierDialog({
  productId,
  productName,
  pricingGroupId,
  onAdded,
}: {
  productId: number;
  productName: string;
  pricingGroupId: number;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { currencies, fetchCurrencies } = usePricingMetaStore();
  const { form, setField, submitting, handleSubmit } = useAddPriceTierForm(
    productId,
    pricingGroupId,
    () => {
      setOpen(false);
      onAdded();
    },
  );
  // POST /products/catalog/price-tiers requires products/edit — omit the
  // trigger entirely (never flash it) until permissions resolve.
  const { allowed: canEdit, loaded } = usePermission("products", "edit");

  useEffect(() => {
    if (open && currencies.length === 0) fetchCurrencies();
  }, [open]);

  if (!loaded || !canEdit) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Plus className="mr-1 size-3.5" /> Add tier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add price tier — {productName}</DialogTitle>
        </DialogHeader>
        <PriceTierFormFields
          form={form}
          setField={setField}
          currencies={currencies}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button  type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            className="bg-new"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
