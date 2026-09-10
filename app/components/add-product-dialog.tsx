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
import { AddProductFormFields } from "./add-product-form-fields";
import { usePermission } from "../hooks/use-permission";
import { useFlavorStore } from "../store/use_flavor_store";
import { useCatalogStore } from "../store/use_catalog_store";
import { useAddProductForm } from "../lib/use-add-product-form";

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { flavors, fetchFlavors } = useFlavorStore();
  const { variants, fetchVariants } = useCatalogStore();
  const { form, setField, submitting, handleSubmit } = useAddProductForm(() =>
    setOpen(false),
  );
  // POST /products/catalog/products requires products/edit — omit the
  // trigger entirely (never flash it) until permissions resolve.
  const { allowed: canEdit, loaded } = usePermission("products", "edit");

  useEffect(() => {
    if (!open) return;
    if (flavors.length === 0) fetchFlavors();
    fetchVariants();
  }, [open]);

  if (!loaded || !canEdit) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-new">
          <Plus className="mr-1" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl no-scrollbar">
        <DialogHeader>
          <DialogTitle>Add a product</DialogTitle>
        </DialogHeader>
        <AddProductFormFields
          form={form}
          setField={setField}
          flavors={flavors}
          variants={variants}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            // className="bg-new"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
