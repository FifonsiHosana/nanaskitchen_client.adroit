import { useParams, useSearchParams } from "react-router"
import type { Country, Period } from "../types/period"
import { DEFAULT_PRICE_GROUP, type PriceGroupSlug } from "./price-groups"

const DEFAULT_PERIOD: Period = "this_week";
const DEFAULT_COUNTRY: Country = "GHS"

export function useAnalyticsParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { group } = useParams<{ group: string }>()
  const pricingGroup = (group as PriceGroupSlug) || DEFAULT_PRICE_GROUP



  const period = (searchParams.get("period") as Period) || DEFAULT_PERIOD
  const country = (searchParams.get("country") as Country) || DEFAULT_COUNTRY
  const customFrom = searchParams.get("from") || ""
  const customTo = searchParams.get("to") || ""

  const setPeriod = (p: Period) => {
    const next = new URLSearchParams(searchParams)
    next.set("period", p)
    next.set("page", "1")
    if (p !== "custom") {
      next.delete("from")
      next.delete("to")
    }
    setSearchParams(next, { replace: true })
  }

  const setCountry = (c: Country) => {
    const next = new URLSearchParams(searchParams)
    next.set("country", c)
    next.set("page", "1")
    setSearchParams(next, { replace: true })
  }

  const setCustomRange = (from: string, to: string) => {
    const next = new URLSearchParams(searchParams)
    next.set("period", "custom")
    next.set("from", from)
    next.set("to", to)
    next.set("page", "1")
    setSearchParams(next, { replace: true })
  }

  /** Build the query string fragment to append to API URLs */
  const periodQuery =
    period === "custom" && customFrom && customTo
      ? `from=${customFrom}&to=${customTo}`
      : `period=${period}`

  return {
    period,
    country,
    pricingGroup,
    customFrom,
    customTo,
    periodQuery,
    setPeriod,
    setCountry,
    setCustomRange,
  }
}
