import { AddCountryDialog } from "@/app/components/shipping/add-country-dialog";
import { CountryRow } from "@/app/components/shipping/country-row";
import CountryTable from "@/app/components/shipping/country-table";
import { useCountriesStore } from "@/app/store/use_countries_store";
import { useEffect } from "react";
import { toast } from "sonner";

const ShippingCountries = () => {
  const { countries, fetchCountries, deleteCountry } = useCountriesStore();

  useEffect(() => {
    fetchCountries();
  }, []);

  async function handleDelete(id: number) {
    const ok = await deleteCountry(id);
    if (ok) {
      toast.success("Country removed");
    } else {
      toast.error("Failed to remove country");
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end gap-2">
        <AddCountryDialog countries={countries} />
      </div>
      <CountryTable />
    </div>
  );
};

export default ShippingCountries;
