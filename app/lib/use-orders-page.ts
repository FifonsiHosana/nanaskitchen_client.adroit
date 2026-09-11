import { useEffect } from "react"
import { useOrderParams } from "./useOrderParams"
import { useOrderStore, type statusType } from "../store/use-order-store"

export function useOrdersPage(status: statusType) {
  const { params } = useOrderParams()
  const { fetchOrders, orderStats, isLoading, isTableLoading, pageStatus } =
    useOrderStore()

  useEffect(() => {
    fetchOrders(status, params)
  }, [
    fetchOrders,
    status,
    params.pricingGroup,
    params.page,
    params.maxPrice,
    params.minPrice,
    params.country,
    params.period,
    params.search,
    params.customFrom,
    params.customTo,
    params.pageSize,
  ])

  useEffect(() => {
    useOrderStore.setState({ orders: [] })
  }, [pageStatus, params.pricingGroup])

  return { orderStats, isLoading, isTableLoading }
}
