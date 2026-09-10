import { create } from "zustand";
import { api } from "../lib/axios_v2";
import { useShippingParams } from "../lib/useShippingParams";

export interface DeliveryLocationRecord {
  id: number;
  location: string;
  price: number | null;
  isFreeDelivery: boolean;
  discountPercentage: string | null;
}

export interface DeliveryLocationInput {
  location: string;
  price: number;
  isFreeDelivery: boolean;
  discountPercentage: string | null;
}

interface DeliveryLocationsStore {
  locations: DeliveryLocationRecord[];
  loading: boolean;
  error: string | null;
  totalCount: number;

  fetchLocations: (
    params: ReturnType<typeof useShippingParams>["params"],
  ) => Promise<void>;
  addLocation: (
    data: DeliveryLocationInput,
    params: ReturnType<typeof useShippingParams>["params"],
  ) => Promise<boolean>;
  updateLocation: (
    id: number,
    data: Partial<DeliveryLocationInput>,
  ) => Promise<boolean>;
  deleteLocation: (
    id: number,
    params?: ReturnType<typeof useShippingParams>["params"],
  ) => Promise<boolean>;
}
export const useDeliveryLocationsStore = create<DeliveryLocationsStore>(
  (set, get) => ({
    locations: [],
    loading: false,
    error: null,
    totalCount: 0,

    fetchLocations: async (params) => {
      set({ loading: true, error: null });
      try {
        // Flat query params — the backend reads req.query.page/pageSize/search.
        const res = await api.get("/shipping/delivery-locations", {
          params: {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
          },
        });
        set({
          locations: res.data.locations ?? [],
          totalCount: res.data.total?.[0]?.count ?? 0,
        });
      } catch {
        set({ error: "Failed to load delivery locations" });
      } finally {
        set({ loading: false });
      }
    },

    addLocation: async (data, params) => {
      try {
        await api.post("/shipping/delivery-locations", data);
        await get().fetchLocations(params);
        return true;
      } catch {
        set({ error: "Failed to add delivery location" });
        return false;
      }
    },

    updateLocation: async (id, data) => {
      try {
        const res = await api.patch(`/shipping/delivery-locations/${id}`, data);
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? res.data.location : loc,
          ),
        }));
        return true;
      } catch {
        set({ error: "Failed to update delivery location" });
        return false;
      }
    },

    deleteLocation: async (id, params) => {
      try {
        await api.delete(`/shipping/delivery-locations/${id}`);
        if (params) {
          // Refetch so totalCount (and the page contents) stay correct.
          await get().fetchLocations(params);
        } else {
          set((state) => ({
            locations: state.locations.filter((loc) => loc.id !== id),
          }));
        }
        return true;
      } catch {
        set({ error: "Failed to delete delivery location" });
        return false;
      }
    },
  }),
);
