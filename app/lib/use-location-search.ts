import { useMemo, useState } from "react"
import type { DeliveryLocationRecord } from "../store/use_delivery_locations_store"

export function useLocationSearch(locations: DeliveryLocationRecord[]) {
  const [search, setSearch] = useState("")

  const filteredLocations = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return locations
    return locations.filter((loc) => loc.location.toLowerCase().includes(term))
  }, [locations, search])

  return { search, setSearch, filteredLocations }
}
