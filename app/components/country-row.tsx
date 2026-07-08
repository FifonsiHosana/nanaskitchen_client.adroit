import { CircleFlag } from "react-circle-flags"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"
import type { CountryRecord } from "../store/use_countries_store"

export function CountryRow({
  country,
  onDelete,
}: {
  country: CountryRecord
  onDelete: (id: number) => void
}) {
  return (
    <div className="mb-2 flex w-full max-w-md items-center justify-between gap-3 rounded border p-2 md:w-1/2">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 shrink-0">
          <CircleFlag
            countryCode={country.countryCode.toLowerCase()}
            height={190}
          />
        </div>
        <span className="text-sm">
          {country.countryLabel} ({country.countryCode})
          {country.currencyCode && (
            <span className="ml-2 text-muted-foreground">
              {country.currencyCode}
            </span>
          )}
        </span>
      </div>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete(country.id)}
      >
        <Trash className="size-4" />
      </Button>
    </div>
  )
}
