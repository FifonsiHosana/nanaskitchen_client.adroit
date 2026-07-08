import CountryList from "country-list-with-dial-code-and-flag"
import { CircleFlag } from "react-circle-flags"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox"
import type { CountryRecord } from "../store/use_countries_store"

export function CountryCombobox({
  value,
  onChange,
  excludeCountries,
}: {
  value: string
  onChange: (value: string) => void
  excludeCountries: CountryRecord[]
}) {
  const items = (CountryList.getAll() || [])
    .filter(
      (c) =>
        !excludeCountries.some((existing) => existing.countryCode === c.code)
    )
    .map((c) => `${c.name} (${c.code})`)

  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={(val) => {
        onChange(val as string)
      }}
    >
      <ComboboxInput placeholder="Search countries..." />
      <ComboboxContent positionerClassName="z-[3000]">
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList className="z-[3000] max-h-60 overflow-y-auto">
          {(item) => (
            <ComboboxItem key={item} value={item} className={"z-[3000]"}>
              <div className="h-5 w-5">
                <CircleFlag
                  countryCode={
                    item.match(/\((\w{2})\)/)?.[1].toLowerCase() || ""
                  }
                  height={190}
                />
              </div>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
