import { useParams, useSearchParams } from "react-router"
import type { Period } from "../types/period"
import { DEFAULT_PRICE_GROUP, type PriceGroupSlug } from "./price-groups"

const DEFAULT_PARAMS = {
  sort: "date",
  country: "all",
  page: "1",
  pageSize: "10",
  minPrice: "",
  maxPrice: "",
  search: "",
  period: "this_week",
  customFrom: "",
  customTo: "",
};

export function useOrderParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { group } = useParams<{ group: string }>()
  const pricingGroup = (group as PriceGroupSlug) || DEFAULT_PRICE_GROUP
  const period = (searchParams.get("period") || DEFAULT_PARAMS.period) as Period
  const customFrom = searchParams.get("customFrom") || DEFAULT_PARAMS.customFrom
  const customTo = searchParams.get("customTo") || DEFAULT_PARAMS.customTo

  const params = {
    pricingGroup,
    search: searchParams.get("search") ?? DEFAULT_PARAMS.search,
    sort: searchParams.get("sort") || DEFAULT_PARAMS.sort,
    country: searchParams.get("country") || DEFAULT_PARAMS.country,
    page: Number(searchParams.get("page") || DEFAULT_PARAMS.page),
    pageSize: Number(searchParams.get("pageSize") || DEFAULT_PARAMS.pageSize),
    minPrice: searchParams.get("minPrice") || DEFAULT_PARAMS.minPrice,
    maxPrice: searchParams.get("maxPrice") || DEFAULT_PARAMS.maxPrice,
    period,
    customFrom,
    customTo,
    periodQuery:
      period === "custom" && customFrom && customTo
        ? { from: customFrom, to: customTo }
        : period === "this_week"
          ? {}
          : { period },
  };

  const setParam = (key: keyof typeof DEFAULT_PARAMS, value: string) => {
    const next = new URLSearchParams(searchParams)
    next.set(key, value)
    if (key !== "page") next.set("page", "1")
    if (key === "period" && value !== "custom") {
      next.delete("customFrom")
      next.delete("customTo")
    }
    setSearchParams(next, { replace: true })
  }

  const setParams = (updates: Partial<typeof DEFAULT_PARAMS>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => next.set(k, v))
    if (!("page" in updates)) next.set("page", "1")
    setSearchParams(next, { replace: true })
  }

  const setCustomRange = (from: string, to: string) => {
    const next = new URLSearchParams(searchParams)
    next.set("period", "custom")
    next.set("customFrom", from)
    next.set("customTo", to)
    next.set("page", "1")
    setSearchParams(next, { replace: true })
  }

  return { params, setParam, setParams, setCustomRange }
}
