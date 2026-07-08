import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useFlavorStore } from "../store/use_flavor_store"
import {
  priceTierFormSchema,
  type PriceTierFormValues,
} from "./price-tier-form-schema"
import { usePriceTierDraft } from "./use-price-tier-draft"
import { buildDirtyTierUpdates } from "./price-tier-draft"

export function usePriceTiersForm(
  flavorId: number,
  onDirtyChange: (dirty: boolean) => void,
  onDraftChange: (hasDraft: boolean) => void,
  onRevert: (fn: () => void) => void
) {
  const { fetchPriceTiers, priceTier, priceLoading, updatePriceTiers } =
    useFlavorStore()

  const form = useForm<PriceTierFormValues>({
    resolver: zodResolver(priceTierFormSchema),
    defaultValues: { products: [] },
  })
  const { register, handleSubmit, reset, watch, control, formState } = form
  const { isDirty, dirtyFields } = formState

  const { fields } = useFieldArray({ control, name: "products" })
  const products = watch("products")
  const values = watch()

  useEffect(() => {
    fetchPriceTiers(flavorId)
  }, [flavorId])

  const { hasDraft, clearDraft } = usePriceTierDraft(
    flavorId,
    priceTier,
    reset,
    isDirty,
    values
  )

  useEffect(() => onDraftChange(hasDraft), [hasDraft])
  useEffect(() => onDirtyChange(isDirty), [isDirty])

  const handleRevert = async () => {
    try {
      await fetchPriceTiers(flavorId)
      clearDraft()
      toast.info("Reverted to saved values")
    } catch {
      toast.error("Revert to saved values failed")
    }
  }

  useEffect(() => {
    onRevert(handleRevert)
  }, [])

  const onSubmit = async (data: PriceTierFormValues) => {
    const tiers = buildDirtyTierUpdates(data.products, dirtyFields)
    if (tiers.length === 0) {
      toast.info("No changes to save")
      return
    }
    try {
      await updatePriceTiers(tiers)
      clearDraft()
      reset(data, { keepValues: true })
      toast.success("Price tiers saved!")
    } catch {
      toast.error("Failed to save")
    }
  }

  const handleTierAdded = () => {
    if (hasDraft) {
      clearDraft()
      toast.info("Draft cleared — a new tier was added")
    }
    fetchPriceTiers(flavorId)
  }

  return {
    register,
    handleSubmit,
    dirtyFields,
    fields,
    products,
    priceLoading,
    onSubmit,
    handleTierAdded,
  }
}
