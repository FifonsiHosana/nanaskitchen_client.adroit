import { useEffect, useState } from "react"
import type { UseFormReset } from "react-hook-form"
import { isValidDraft } from "./price-tier-draft"
import {
  mapPriceTiersToFormShape,
  type PriceTierFormValues,
} from "./price-tier-form-schema"

export function usePriceTierDraft(
  flavorId: number,
  priceTier: any[],
  reset: UseFormReset<PriceTierFormValues>,
  isDirty: boolean,
  values: PriceTierFormValues
) {
  const [hasDraft, setHasDraft] = useState(false)
  const draftKey = `price-draft-${flavorId}`

  // Seed form from a valid draft, or fall back to fresh server data.
  useEffect(() => {
    if (!priceTier.length) return
    const raw = localStorage.getItem(draftKey)
    const draft = raw ? JSON.parse(raw) : null
    if (draft && isValidDraft(draft)) {
      reset(draft)
      setHasDraft(true)
    } else {
      if (raw) localStorage.removeItem(draftKey)
      setHasDraft(false)
      reset({ products: mapPriceTiersToFormShape(priceTier) })
    }
  }, [priceTier])

  // Autosave draft while the form is dirty.
  useEffect(() => {
    if (!isDirty) return
    localStorage.setItem(draftKey, JSON.stringify(values))
  }, [values, isDirty])

  const clearDraft = () => {
    localStorage.removeItem(draftKey)
    setHasDraft(false)
  }

  return { hasDraft, draftKey, clearDraft }
}
