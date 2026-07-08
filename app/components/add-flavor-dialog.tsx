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
import { SingleImageUpload } from "./single-image-upload"
import { useCatalogStore } from "../store/use_catalog_store"
import { useFlavorStore } from "../store/use_flavor_store"

export function AddFlavorDialog() {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [image, setImage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { createFlavor } = useCatalogStore()
  const { fetchFlavors } = useFlavorStore()

  async function handleSubmit() {
    if (!label.trim()) {
      toast.error("Flavor name is required")
      return
    }
    setSubmitting(true)
    const ok = await createFlavor({ label: label.trim(), image })
    setSubmitting(false)
    if (ok) {
      toast.success("Flavor created")
      setLabel("")
      setImage("")
      setOpen(false)
      await fetchFlavors()
    } else {
      toast.error("Failed to create flavor")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-1" /> Add Flavor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a flavor</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="flavor-label">Name</FieldLabel>
            <Input
              id="flavor-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Green Shitor"
            />
          </Field>
          <Field>
            <FieldLabel>Image</FieldLabel>
            <SingleImageUpload value={image} onUploaded={setImage} />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Create flavor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
