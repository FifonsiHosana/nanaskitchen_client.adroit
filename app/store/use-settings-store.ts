// store/useSettingsStore.ts

import { create } from "zustand"
import { api } from "../lib/axios_v2"

export interface Currency {
  id: number
  currencyLabel: string
  currencyCode?: string
}

export interface Country {
  id: number
  currencyId: number | null
  countryLabel?: string | null
  countryCode?: string | null
}

interface SettingsState {
  currencies: Currency[]
  countries: Country[]
  isLoading: boolean
  error: string | null

  setError: (error: string | null) => void
  clearError: () => void

  fetchCurrencies: () => Promise<void>
  createCurrency: (payload: Partial<Currency>) => Promise<Currency>
  updateCurrency: (id: number, payload: Partial<Currency>) => Promise<Currency>
  deleteCurrency: (id: number) => Promise<void>

  fetchCountries: () => Promise<void>
  createCountry: (payload: Partial<Country>) => Promise<Country>
  updateCountry: (id: number, payload: Partial<Country>) => Promise<Country>
  deleteCountry: (id: number) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  currencies: [],
  countries: [],
  isLoading: false,
  error: null,

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // ─── CURRENCIES ───────────────────────────────

  fetchCurrencies: async () => {
    set({ isLoading: true, error: null })

    try {
      const res = await api.get("settings/currencies")

      set({
        currencies: res.data.data,
      })
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch currencies",
      })
    } finally {
      set({ isLoading: false })
    }
  },

  createCurrency: async (payload) => {
    const res = await api.post("settings/currencies", payload)

    const currency = res.data.data

    set((state) => ({
      currencies: [...state.currencies, currency],
    }))

    return currency
  },

  updateCurrency: async (id, payload) => {
    const res = await api.put(`settings/currencies/${id}`, payload)

    const currency = res.data.data

    set((state) => ({
      currencies: state.currencies.map((c) => (c.id === id ? currency : c)),
    }))

    return currency
  },

  deleteCurrency: async (id) => {
    await api.delete(`settings/currencies/${id}`)

    set((state) => ({
      currencies: state.currencies.filter((c) => c.id !== id),

      countries: state.countries.map((country) =>
        country.currencyId === Number(id)
          ? {
              ...country,
              currencyId: null,
              currencyLabel: null,
              currencyCode: null,
            }
          : country
      ),
    }))
  },

  // ─── COUNTRIES ────────────────────────────────

  fetchCountries: async () => {
    set({ isLoading: true, error: null })

    try {
      const res = await api.get("settings/countries")

      set({
        countries: res.data.data,
      })
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch countries",
      })
    } finally {
      set({ isLoading: false })
    }
  },

  createCountry: async (payload) => {
    const res = await api.post("settings/countries", payload)

    const country = res.data.data

    set((state) => ({
      countries: [...state.countries, country],
    }))

    return country
  },

  updateCountry: async (id, payload) => {
    const res = await api.put(`settings/countries/${id}`, payload)

    const country = res.data.data

    set((state) => ({
      countries: state.countries.map((c) => (c.id === id ? country : c)),
    }))

    return country
  },

  deleteCountry: async (id) => {
    await api.delete(`settings/countries/${id}`)

    set((state) => ({
      countries: state.countries.filter((c) => c.id !== id),
    }))
  },
}))
