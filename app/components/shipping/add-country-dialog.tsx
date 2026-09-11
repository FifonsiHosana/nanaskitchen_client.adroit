import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CountryCombobox } from "./country-combobox";
import { usePermission } from "../../hooks/use-permission";
import {
  useCountriesStore,
  type CountryRecord,
} from "../../store/use_countries_store";
import { usePricingMetaStore } from "../../store/use_pricing_meta_store";

export function AddCountryDialog({
  countries,
}: {
  countries: CountryRecord[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addCountry } = useCountriesStore();
  const { currencies, fetchCurrencies } = usePricingMetaStore();
  // POST /shipping/add-country requires shipping/edit — omit the trigger
  // entirely (never flash it) until permissions resolve.
  const { allowed: canEdit, loaded } = usePermission("shipping", "edit");

  useEffect(() => {
    if (open && currencies.length === 0) fetchCurrencies();
  }, [open]);

  async function handleSubmit() {
    const code = selectedCountry.match(/\((\w{2})\)/)?.[1];
    const label = selectedCountry.replace(/\s*\(\w{2}\)\s*$/, "").trim();
    if (!code || !label) return toast.error("Select a country");
    if (!currencyId) return toast.error("Select a currency");

    setSubmitting(true);
    const ok = await addCountry({
      countryLabel: label,
      countryCode: code,
      currencyId: Number(currencyId),
    });
    setSubmitting(false);

    if (ok) {
      toast.success("Country added");
      setSelectedCountry("");
      setCurrencyId("");
      setOpen(false);
    } else {
      toast.error("Failed to add country");
    }
  }

  if (!loaded || !canEdit) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-new">
          <Plus className="mr-1" /> Add Country
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a shipping country</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Country</FieldLabel>
            <CountryCombobox
              value={selectedCountry}
              onChange={setSelectedCountry}
              excludeCountries={countries}
            />
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>

            <Select value={currencyId} onValueChange={setCurrencyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="z-200">
                <SelectGroup>
                  {currencies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.currencyLabel} ({c.currencyCode})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            // className="bg-new"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add country"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
