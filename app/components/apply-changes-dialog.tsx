import React, { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Checkbox } from "./ui/checkbox"
import { useFlavorStore } from "../store/use_flavor_store"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PRICE_GROUPS } from "../lib/price-groups"

export function ApplyChangesDialog({
  children,
  sourceFlavorId,
  onConfirmed,
}: {
  children: React.ReactNode
  sourceFlavorId: number
  onConfirmed?: () => void
}) {
  const {
    flavors,
    fetchFlavors,
    priceTier,
    applyPreview,
    previewLoading,
    previewApplyTiers,
    applyTiersToFlavors,
    clearPreview,
  } = useFlavorStore()

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"select" | "preview">("select")
  const [selectedFlavors, setSelectedFlavors] = useState<number[]>([])
  const [selectedGroups, setSelectedGroups] = useState<number[]>(PRICE_GROUPS.map((g) => g.id))

  useEffect(() => {
    if (open && flavors.length === 0) fetchFlavors()
  }, [open])

  const toggleFlavor = (id: number) =>
    setSelectedFlavors((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )

  const toggleGroup = (id: number) =>
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      // reset on close
      setStep("select")
      setSelectedFlavors([])
      setSelectedGroups(PRICE_GROUPS.map((g) => g.id))
      clearPreview()
    }
  }

  const handlePreview = async () => {
    if (selectedFlavors.length === 0) {
      toast.warning("Select at least one flavor to apply to")
      return
    }
    if (selectedGroups.length === 0) {
      toast.warning("Select at least one pricing group")
      return
    }
    await previewApplyTiers(sourceFlavorId, selectedFlavors, selectedGroups)
    setStep("preview")
  }

  const handleConfirm = async () => {
    try {
      await applyTiersToFlavors(sourceFlavorId, selectedFlavors, selectedGroups)
      toast.success("Pricing applied successfully!")
      setOpen(false)
      onConfirmed?.()
    } catch {
      toast.error("Failed to apply pricing")
    }
  }

  const currentFlavorId = priceTier[0]?.flavorId

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle>Apply changes to other flavors</DialogTitle>
              <DialogDescription>
                Select which flavors and pricing groups to copy these tiers to.
              </DialogDescription>
            </DialogHeader>

            {/* Flavor selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Flavors</p>
              {flavors.map((flavor) => {
                const isSource = flavor.id === currentFlavorId
                return (
                  <div
                    key={flavor.id}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`text-sm ${isSource ? "text-muted-foreground" : ""}`}
                    >
                      {flavor.label}
                      {isSource && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (source)
                        </span>
                      )}
                    </span>
                    <Checkbox
                      checked={isSource || selectedFlavors.includes(flavor.id)}
                      disabled={isSource}
                      onCheckedChange={() => toggleFlavor(flavor.id)}
                    />
                  </div>
                )
              })}
            </div>

            <div className="my-2 border-t" />

            {/* Pricing group selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Pricing Groups</p>
              {PRICE_GROUPS.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{group.label}</span>
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={() => toggleGroup(group.id)}
                  />
                </div>
              ))}
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handlePreview}
                disabled={
                  previewLoading ||
                  selectedFlavors.length === 0 ||
                  selectedGroups.length === 0
                }
              >
                {previewLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Preview changes
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Review changes</DialogTitle>
              <DialogDescription>
                These tiers will be updated across the selected flavors.
              </DialogDescription>
            </DialogHeader>

            {/* Preview diff */}
            <div className="max-h-80 space-y-4 overflow-y-auto pr-1 text-sm">
              {applyPreview?.preview.map((flavorPreview) => (
                <div key={flavorPreview.targetFlavorId}>
                  <p className="font-semibold">
                    {flavorPreview.targetFlavorLabel}
                  </p>
                  {flavorPreview.totalChanges === 0 ? (
                    <p className="text-xs text-muted-foreground">No changes</p>
                  ) : (
                    flavorPreview.variants
                      .filter((v) => v.hasAnyChange)
                      .map((variant) => (
                        <div
                          key={`${variant.variantId}-${variant.isCase}`}
                          className="mt-1 ml-2 space-y-1"
                        >
                          <p className="text-xs font-medium text-muted-foreground">
                            {variant.targetName ?? variant.sourceName}
                            {variant.isCase ? " (Case)" : ""}
                            {variant.targetMissing && (
                              <span className="ml-1 text-yellow-600">
                                · missing variant
                              </span>
                            )}
                          </p>
                          {variant.tierChanges
                            .filter((t) => t.willChange)
                            .map((tier, i) => (
                              <div
                                key={i}
                                className="ml-2 flex gap-2 text-xs text-muted-foreground"
                              >
                                <span>
                                  Currency {tier.currencyId}
                                  {(tier.minCases > 0 || tier.maxCases > 0) &&
                                    ` (${tier.minCases}-${tier.maxCases} cases)`}
                                  :
                                </span>
                                {tier.isNew ? (
                                  <span className="text-green-600">
                                    New → {tier.incoming.amount}
                                  </span>
                                ) : (
                                  <span>
                                    <span className="line-through">
                                      {tier.current?.amount}
                                    </span>{" "}
                                    →{" "}
                                    <span className="text-blue-600">
                                      {tier.incoming.amount}
                                    </span>
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      ))
                  )}
                </div>
              ))}
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button onClick={handleConfirm}>Confirm changes</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
