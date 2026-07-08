import { create } from "zustand"
import { api } from "../lib/axios_v2"

export interface CountryRecord {
  id: number
  countryLabel: string
  countryCode: string
  currencyId: number | null
  currencyLabel: string | null
  currencyCode: string | null
}

interface CountriesStore {
  countries: CountryRecord[]
  loading: boolean
  error: string | null

  fetchCountries: () => Promise<void>
  addCountry: (country: {
    countryLabel: string
    countryCode: string
    currencyId: number
  }) => Promise<boolean>
  deleteCountry: (id: number) => Promise<boolean>
}

export const useCountriesStore = create<CountriesStore>((set, get) => ({
  countries: [],
  loading: false,
  error: null,

  fetchCountries: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/settings/countries")
      set({ countries: res.data.data })
    } catch {
      set({ error: "Failed to load countries" })
    } finally {
      set({ loading: false })
    }
  },

  addCountry: async (country) => {
    try {
      await api.post("/settings/countries", country)
      await get().fetchCountries()
      return true
    } catch {
      set({ error: "Failed to add country" })
      return false
    }
  },

  deleteCountry: async (id) => {
    try {
      await api.delete(`/settings/countries/${id}`)
      set((state) => ({ countries: state.countries.filter((c) => c.id !== id) }))
      return true
    } catch {
      set({ error: "Failed to delete country" })
      return false
    }
  },
}))
