import { create } from "zustand"
import { api } from "~/lib/axios"

// interface Customer {
//   name: string
//   email: string
//   phone: string
//   country: string
// }

// interface FeedbackRecord {
//   id: number
//   orderId: number
//   customer: Customer
//   attribution: string[]
//   preferences: string[]
// }

// interface SummaryItem {
//   label: string
//   count: number
//   percentage: number
// }

// interface Summary {
//   totalResponses: number
//   topChannel: string | null
//   topPreference: string | null
//   howTheyHeardAboutUs: SummaryItem[]
//   whatTheyLike: SummaryItem[]
// }

interface LocationRecord {
  id: string
  location: string
  price: number
}

// interface CountryRecord {
//   id: string
//   country_label: string
//   country_code: string
//   // currency_label:string
// }
interface CountryRecord {
  id: number
  countryCode: string
  country: string
  currency: string
}

interface LocationStore {
  locations: LocationRecord[]
  countries: CountryRecord[]
  loading: boolean
  error: string | null
  fetchLocations: () => Promise<void>
  fetchCountries: () => Promise<void>

  //country
  addCountry: (country: {
    country_label: string
    country_code: string
  }) => Promise<void>
  deleteCountry: (countryId: string) => Promise<void>

  //Location
  addLocation: (location: { location: string; price: number }) => Promise<void>
  updateLocation: (
    locationId?: string,
    location?: {
      location: string
      price: number
    }
  ) => Promise<void>
  deleteLocation: (locationId: string) => Promise<void>
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  countries: [],
  loading: false,
  error: null,

  fetchLocations: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/shipping/delivery-locations")
      set({ locations: res.data })
    } catch (err) {
      set({ error: "Failed to load delivery locations" })
    } finally {
      set({ loading: false })
    }
  },
  fetchCountries: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/shipping/countries")
      set({ countries: res.data.countries })
    } catch (error) {
      set({ error: "Failed to load countries" })
    } finally {
      set({ loading: false })
    }
  },
  addCountry: async (country) => {
    await api.post("/shipping/add-country", country)
    set((state) => ({
      countries: [...state.countries, country],
    }))
  },
  deleteCountry: async (countryId) => {
    await api.delete(`/shipping/countries/${countryId}`)
    set((state) => ({
      countries: state.countries.filter((c) => c.id !== Number(countryId)),
    }))
  },
  addLocation: async (location) => {},
  updateLocation: async (locationId, location) => {},
  deleteLocation: async (locationId) => {},
}))
