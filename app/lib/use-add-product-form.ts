import { useState } from "react"
import { toast } from "sonner"
import { useCatalogStore } from "../store/use_catalog_store"

export interface AddProductFormState {
  title: string
  flavorId: string
  variantId: string
  isCase: boolean
  unitsPerCase: string
  length: string
  width: string
  height: string
  weight: string
  image: string
}

const INITIAL_STATE: AddProductFormState = {
  title: "",
  flavorId: "",
  variantId: "",
  isCase: false,
  unitsPerCase: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  image: "",
}

export function useAddProductForm(onDone: () => void) {
  const [form, setForm] = useState<AddProductFormState>(INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const { createProduct } = useCatalogStore()

  const setField = <K extends keyof AddProductFormState>(
    key: K,
    value: AddProductFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }))

  async function handleSubmit() {
    if (!form.title.trim()) return toast.error("Product name is required")
    if (!form.flavorId) return toast.error("Flavor is required")
    if (!form.variantId) return toast.error("Variant is required")

    setSubmitting(true)
    const ok = await createProduct({
      title: form.title.trim(),
      flavorId: Number(form.flavorId),
      variantId: Number(form.variantId),
      isCase: form.isCase,
      unitsPerCase: Number(form.unitsPerCase) || 0,
      length: Number(form.length) || 0,
      width: Number(form.width) || 0,
      height: Number(form.height) || 0,
      weight: Number(form.weight) || 0,
      image: form.image,
      images: form.image ? [form.image] : [],
    })
    setSubmitting(false)

    if (ok) {
      toast.success("Product created")
      setForm(INITIAL_STATE)
      onDone()
    } else {
      toast.error("Failed to create product")
    }
  }

  return { form, setField, submitting, handleSubmit }
}
