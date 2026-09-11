import type React from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import PriceTiersDetails from "./price-tiers-details";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useFlavorStore } from "../store/use_flavor_store";
import { ScrollArea } from "./ui/scroll-area";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ApplyChangesDialog } from "./apply-changes-dialog";

import type { PriceGroupSlug } from "../lib/price-groups";
import { PRICE_GROUPS } from "../lib/price-groups";
import { usePermission } from "../hooks/use-permission";

type TabValue = PriceGroupSlug;

export function PriceTiersSheet({
  flavorId,
  children,
}: {
  flavorId: number;
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabValue>("retailer");
  const { fetchPriceTiers, priceTier } = useFlavorStore();

  const [isDirty, setIsDirty] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const revertRef = useRef<() => void>(() => {});
  // All pricing writes (PATCH /products/price-list/tiers,
  // POST /products/price-list/tiers/apply) require products/edit.
  // The edit toolbar is omitted — never flashed — until permissions resolve.
  const { allowed: canEditTiers, loaded: permsLoaded } = usePermission(
    "products",
    "edit",
  );

  // Called after apply succeeds — refetch to reflect any server-side changes
  const handleApplyConfirmed = async () => {
    await fetchPriceTiers(flavorId);
    toast.success("Tiers refreshed after apply");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="data-[side=right]:w-full">
        <SheetHeader className="flex items-center">
          <SheetTitle>{priceTier[0]?.flavorName} Price Tiers</SheetTitle>
          <SheetDescription asChild>
            <>
              <div>
                <Tabs
                  defaultValue="retailer"
                  onValueChange={(v) => setActiveTab(v as TabValue)}
                >
                  <TabsList>
                    {PRICE_GROUPS.map((group) => (
                      <TabsTrigger key={group.slug} value={group.slug}>
                        {group.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </>
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] w-full p-4">
          <PriceTiersDetails
            flavorId={flavorId}
            activeTab={activeTab}
            onDirtyChange={setIsDirty}
            onDraftChange={setHasDraft}
            onRevert={
              ((fn: () => void) => {
                revertRef.current = fn;
              }) as unknown as () => void
            }
          />
        </ScrollArea>

        <SheetFooter className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-4">
            {hasDraft && (
              <p className="px-2 text-center text-xs text-yellow-600">
                * Unsaved draft restored *
              </p>
            )}

            {(isDirty || hasDraft) && permsLoaded && canEditTiers && (
              <SheetClose>
                <Button variant="ghost" onClick={() => revertRef.current()}>
                  Revert changes
                </Button>
              </SheetClose>
            )}

            {/* Save for just this flavor */}
            {permsLoaded && canEditTiers && (
              <Button
                type="submit"
                form="price-tiers-form"
                disabled={!isDirty && !hasDraft}
              >
                Save
              </Button>
            )}

            {/* Apply to other flavors */}
            {permsLoaded && canEditTiers && (
              <ApplyChangesDialog
                sourceFlavorId={flavorId}
                onConfirmed={handleApplyConfirmed}
              >
                <Button
                  disabled={!isDirty && !hasDraft}
                  variant="outline"
                  type="button"
                  // className="bg-new"
                >
                  Apply to others
                </Button>
              </ApplyChangesDialog>
            )}

            <SheetClose asChild>
              <Button onClick={() => revertRef.current()} variant="destructive">
                Cancel
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
