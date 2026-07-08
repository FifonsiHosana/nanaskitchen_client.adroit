import { useState } from "react"
import { toast } from "sonner"
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
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { useCatalogStore } from "../store/use_catalog_store"

export function AddVariantDialog() {
  const [open, setOpen] = useState(false)
  const [variantName, setVariantName] = useState("")
  const [titleTag, setTitleTag] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { createVariant } = useCatalogStore()

  async function handleSubmit() {
    if (!variantName.trim()) {
      toast.error("Variant name is required")
      return
    }
    setSubmitting(true)
    const ok = await createVariant({
      variantName: variantName.trim(),
      titleTag,
    })
    setSubmitting(false)
    if (ok) {
      toast.success("Variant created")
      setVariantName("")
      setTitleTag("")
      setOpen(false)
    } else {
      toast.error("Failed to create variant")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Plus className="mr-1" /> Add Variant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a variant</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="variant-name">Name</FieldLabel>
            <Input
              id="variant-name"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="e.g. With Bag & Package"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="variant-tag">Title tag</FieldLabel>
            <Input
              id="variant-tag"
              value={titleTag}
              onChange={(e) => setTitleTag(e.target.value)}
              placeholder="e.g. with bag and packaging"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Create variant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
