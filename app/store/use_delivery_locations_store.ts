import { create } from "zustand"
import { api } from "../lib/axios_v2"

export interface DeliveryLocationRecord {
  id: number
  location: string
  price: number | null
  isFreeDelivery: boolean
  discountPercentage: string | null
}

export interface DeliveryLocationInput {
  location: string
  price: number
  isFreeDelivery: boolean
  discountPercentage: string | null
}

interface DeliveryLocationsStore {
  locations: DeliveryLocationRecord[]
  loading: boolean
  error: string | null

  fetchLocations: () => Promise<void>
  addLocation: (data: DeliveryLocationInput) => Promise<boolean>
  updateLocation: (
    id: number,
    data: Partial<DeliveryLocationInput>
  ) => Promise<boolean>
  deleteLocation: (id: number) => Promise<boolean>
}

export const useDeliveryLocationsStore = create<DeliveryLocationsStore>(
  (set, get) => ({
    locations: [],
    loading: false,
    error: null,

    fetchLocations: async () => {
      set({ loading: true, error: null })
      try {
        const res = await api.get("/shipping/delivery-locations")
        set({ locations: res.data.locations })
      } catch {
        set({ error: "Failed to load delivery locations" })
      } finally {
        set({ loading: false })
      }
    },

    addLocation: async (data) => {
      try {
        await api.post("/shipping/delivery-locations", data)
        await get().fetchLocations()
        return true
      } catch {
        set({ error: "Failed to add delivery location" })
        return false
      }
    },

    updateLocation: async (id, data) => {
      try {
        const res = await api.patch(`/shipping/delivery-locations/${id}`, data)
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? res.data.location : loc
          ),
        }))
        return true
      } catch {
        set({ error: "Failed to update delivery location" })
        return false
      }
    },

    deleteLocation: async (id) => {
      try {
        await api.delete(`/shipping/delivery-locations/${id}`)
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id),
        }))
        return true
      } catch {
        set({ error: "Failed to delete delivery location" })
        return false
      }
    },
  })
)
