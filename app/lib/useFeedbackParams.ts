import { useParams, useSearchParams } from "react-router"
import type { Period } from "../types/period"
import { DEFAULT_PRICE_GROUP, type PriceGroupSlug } from "./price-groups"

const DEFAULT_CUSTOMER_PARAMS = {
  country: "all",
  page: "1",
  pageSize: "10",
}

export function useFeedbackParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { group } = useParams<{ group: string }>()
  const pricingGroup = (group as PriceGroupSlug) || DEFAULT_PRICE_GROUP

  const params = {
    pricingGroup,
    country: searchParams.get("country") || DEFAULT_CUSTOMER_PARAMS.country,
    page: Number(searchParams.get("page") || DEFAULT_CUSTOMER_PARAMS.page),
    pageSize: Number(
      searchParams.get("pageSize") || DEFAULT_CUSTOMER_PARAMS.pageSize
    ),
  }

  const setParam = (
    key: keyof typeof DEFAULT_CUSTOMER_PARAMS,
    value: string
  ) => {
    const next = new URLSearchParams(searchParams)
    next.set(key, value)
    if (key !== "page") next.set("page", "1")
    setSearchParams(next, { replace: true })
  }

  const setParams = (updates: Partial<typeof DEFAULT_CUSTOMER_PARAMS>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => next.set(k, v))
    if (!("page" in updates)) next.set("page", "1")
    setSearchParams(next, { replace: true })
  }

  return { params, setParam, setParams }
}
