export default DeliveryLocationAdd;
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";

import { useDeliveryLocationsStore } from "@/app/store/use_delivery_locations_store";
import type { DeliveryLocationFormValues } from "@/app/lib/delivery-location-schema";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { Card } from "@/app/components/ui/card";
import PaginationOrders from "@/app/components/pagination";
import { EditableRow } from "@/app/components/delivery/delivery-location-editable-row";
import { AddRow } from "@/app/components/delivery/delivery-location-add-row";
import { Input } from "@/app/components/ui/input";
import { useShippingParams } from "@/app/lib/useShippingParams";
import { Can } from "@/app/components/can";

export function DeliveryLocationAdd({}: {
  // locations: DeliveryLocationRecord[];
  onSave: (id: number, data: DeliveryLocationFormValues) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const {
    fetchLocations,
    locations,
    loading,
    error,
    totalCount,
    addLocation,
    updateLocation,
    deleteLocation,
  } = useDeliveryLocationsStore();

  const [addDelivery, setAddDelivery] = useState(false);
  // console.log(totalCount);

  const { params, setParam } = useShippingParams();
  const pageSize = Number(params.pageSize) || 25;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Number(params.page) || 1, totalPages);

  // Server-side search: debounced into the `search` URL param (which resets
  // to page 1). Filtering runs on the backend across all rows, not just the
  // loaded page.
  const [searchInput, setSearchInput] = useState(params.search);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setParam("search", value), 400);
  }

  useEffect(() => {
    fetchLocations(params);
  }, [params.page, params.pageSize, params.search]);

  // Self-heal stale URLs (e.g. bookmarked page 5 after rows were deleted):
  // step the URL back into range once the true total is known.
  useEffect(() => {
    if (!loading && totalCount > 0 && Number(params.page) > totalPages) {
      setParam("page", String(totalPages));
    }
  }, [loading, totalCount, params.page, totalPages, setParam]);

  async function handleAdd(data: DeliveryLocationFormValues) {
    const ok = await addLocation(
      {
        location: data.location,
        price: data.price,
        isFreeDelivery: data.isFreeDelivery,
        discountPercentage:
          data.discountPercentage != null
            ? String(data.discountPercentage)
            : null,
      },
      params,
    );

    toast[ok ? "success" : "error"](
      ok ? "Delivery location added" : "Failed to add delivery location",
    );
  }

  async function handleSave(id: number, data: DeliveryLocationFormValues) {
    const ok = await updateLocation(id, {
      location: data.location,
      price: data.price,
      isFreeDelivery: data.isFreeDelivery,
      discountPercentage:
        data.discountPercentage != null
          ? String(data.discountPercentage)
          : null,
    });
    toast[ok ? "success" : "error"](
      ok ? "Delivery location updated" : "Failed to update delivery location",
    );
  }

  async function handleDelete(id: number) {
    // Deleting the last row of a page > 1 would strand the user on an empty
    // page: step back instead (the page change triggers the refetch).
    const isLastOnPage = locations.length === 1 && currentPage > 1;
    const ok = isLastOnPage
      ? await deleteLocation(id)
      : await deleteLocation(id, params);
    if (ok && isLastOnPage) setParam("page", String(currentPage - 1));
    toast[ok ? "success" : "error"](
      ok ? "Delivery location removed" : "Failed to remove delivery location",
    );
  }

  const isMobile = useIsMobile();
  return (
    <div className="p-4">
      <div className="flex justify-end pb-3 ">
        {/* POST /shipping/delivery-locations requires shipping/edit */}
        <Can resource="shipping" action="edit">
          <Button
            onClick={() => setAddDelivery(!addDelivery)}
            className={`cursor-pointer ${addDelivery ? `bg-destructive` : `bg-new`}`}
          >
            {isMobile
              ? `Add`
              : addDelivery
                ? `Cancel`
                : `Add Delivery Location`}
            {!addDelivery && <PlusIcon />}
          </Button>
        </Can>
      </div>
      <Card className="rounded-xl pb-0 relative no-scrollbar w-full overflow-y-auto border ">
        <Input
          placeholder="Search locations..."
          className="max-w-48 flex place-self-end mr-4"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <Table noWrapper>
          <TableHeader className="sticky top-0 z-10 bg-card border-t">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-50">Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount %</TableHead>
              <TableHead>Free Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && locations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : error && locations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-red-500"
                >
                  Failed to load locations.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {locations.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No locations yet.
                    </TableCell>
                  </TableRow>
                )}
                {addDelivery && (
                  <Can resource="shipping" action="edit">
                    <AddRow onAdd={handleAdd} />
                  </Can>
                )}
                {locations.map((loc, index) => (
                  <EditableRow
                    key={loc.id}
                    loc={loc}
                    index={index}
                    onSave={handleSave}
                    onDelete={handleDelete}
                  />
                ))}
              </>
            )}
          </TableBody>
        </Table>
        <div className="pb-1 py-1">
          <PaginationOrders
            currentPage={currentPage}
            currentTable="shipping"
            totalPages={totalPages}
          />
        </div>
      </Card>
    </div>
  );
}
