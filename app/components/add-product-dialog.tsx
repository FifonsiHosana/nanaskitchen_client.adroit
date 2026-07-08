import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { AddProductFormFields } from "./add-product-form-fields"
import { useFlavorStore } from "../store/use_flavor_store"
import { useCatalogStore } from "../store/use_catalog_store"
import { useAddProductForm } from "../lib/use-add-product-form"

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
  const { flavors, fetchFlavors } = useFlavorStore()
  const { variants, fetchVariants } = useCatalogStore()
  const { form, setField, submitting, handleSubmit } = useAddProductForm(() =>
    setOpen(false)
  )

  useEffect(() => {
    if (!open) return
    if (flavors.length === 0) fetchFlavors()
    fetchVariants()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
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
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
