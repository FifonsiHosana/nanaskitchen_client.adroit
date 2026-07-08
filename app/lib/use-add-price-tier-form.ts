import { useState } from "react"
import { toast } from "sonner"
import { useCatalogStore } from "../store/use_catalog_store"
import type { PriceTierFormState } from "../components/price-tier-form-fields"

const INITIAL_STATE: PriceTierFormState = {
  currencyId: "",
  minCases: "0",
  maxCases: "0",
  amount: "",
  discount: "",
}

export function useAddPriceTierForm(
  productId: number,
  pricingGroupId: number,
  onAdded: () => void
) {
  const [form, setForm] = useState<PriceTierFormState>(INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const { createPriceTier } = useCatalogStore()

  const setField = <K extends keyof PriceTierFormState>(
    key: K,
    value: PriceTierFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }))

  async function handleSubmit() {
    if (!form.currencyId) return toast.error("Currency is required")
    if (!form.amount) return toast.error("Amount is required")

    setSubmitting(true)
    const ok = await createPriceTier({
      productId,
      pricingGroupId,
      currencyId: Number(form.currencyId),
      minCases: Number(form.minCases) || 0,
      maxCases: Number(form.maxCases) || 0,
      amount: form.amount,
      discount: form.discount || null,
    })
    setSubmitting(false)

    if (ok) {
      toast.success("Price tier added")
      setForm(INITIAL_STATE)
      onAdded()
    } else {
      toast.error("Failed to add price tier")
    }
  }

  return { form, setField, submitting, handleSubmit }
}
