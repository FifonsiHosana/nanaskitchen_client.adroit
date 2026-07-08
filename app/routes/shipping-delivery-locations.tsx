import { useEffect } from "react"
import { toast } from "sonner"
import { cn } from "~/lib/utils"
import { useDeliveryLocationsStore } from "../store/use_delivery_locations_store"
import { Input } from "../components/ui/input"
import { EditableRow } from "../components/delivery-location-editable-row"
import { AddRow } from "../components/delivery-location-add-row"
import type { DeliveryLocationFormValues } from "../lib/delivery-location-schema"
import { useLocationSearch } from "../lib/use-location-search"

export function DeliveryLocationAdd({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { fetchLocations, locations, loading, error, addLocation, updateLocation, deleteLocation } =
    useDeliveryLocationsStore()
  const { search, setSearch, filteredLocations } = useLocationSearch(locations)

  useEffect(() => {
    fetchLocations()
  }, [])

  async function handleAdd(data: DeliveryLocationFormValues) {
    const ok = await addLocation({
      location: data.location,
      price: data.price,
      isFreeDelivery: data.isFreeDelivery,
      discountPercentage:
        data.discountPercentage != null ? String(data.discountPercentage) : null,
    })
    toast[ok ? "success" : "error"](
      ok ? "Delivery location added" : "Failed to add delivery location"
    )
  }

  async function handleSave(id: number, data: DeliveryLocationFormValues) {
    const ok = await updateLocation(id, {
      location: data.location,
      price: data.price,
      isFreeDelivery: data.isFreeDelivery,
      discountPercentage:
        data.discountPercentage != null ? String(data.discountPercentage) : null,
    })
    toast[ok ? "success" : "error"](
      ok ? "Delivery location updated" : "Failed to update delivery location"
    )
  }

  async function handleDelete(id: number) {
    const ok = await deleteLocation(id)
    toast[ok ? "success" : "error"](
      ok ? "Delivery location removed" : "Failed to remove delivery location"
    )
  }

  return (
    <div className="m-5 px-4">
      <div className="flex justify-end gap-2 pb-4">
        <Input
          placeholder="Search locations..."
          className="max-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="mb-2 grid grid-cols-5 gap-4 text-sm font-medium">
          <div className="col-span-2">Location</div>
          <div>Delivery Price (GHS)</div>
          <div>Delivery Discount %</div>
          <div>Actions</div>
        </div>

        <AddRow onAdd={handleAdd} />

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-red-500">Failed to load locations.</p>}
        {locations.length === 0 && loading === false && (
          <p className="text-sm text-muted-foreground">No locations yet.</p>
        )}
        {filteredLocations.map((loc, index) => (
          <EditableRow
            key={loc.id}
            loc={loc}
            index={index}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default DeliveryLocationAdd
