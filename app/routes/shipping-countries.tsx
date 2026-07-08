import { useEffect } from "react"
import { toast } from "sonner"
import { useCountriesStore } from "../store/use_countries_store"
import { AddCountryDialog } from "../components/add-country-dialog"
import { CountryRow } from "../components/country-row"

const ShippingCountries = () => {
  const { countries, fetchCountries, deleteCountry } = useCountriesStore()

  useEffect(() => {
    fetchCountries()
  }, [])

  async function handleDelete(id: number) {
    const ok = await deleteCountry(id)
    if (ok) {
      toast.success("Country removed")
    } else {
      toast.error("Failed to remove country")
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end">
        <AddCountryDialog countries={countries} />
      </div>
      <div className="space-y-2">
        {countries.map((country) => (
          <CountryRow
            key={country.id}
            country={country}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default ShippingCountries
