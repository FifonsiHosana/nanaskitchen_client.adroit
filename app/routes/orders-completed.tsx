import OrderFilterOptions from "../components/order-filter-options"
import { OrdersSkeleton } from "../components/orders-skeleton"
import OrderStats from "../components/orders-stats"
import { OrderTable } from "../components/order-table"
import { useOrdersPage } from "../lib/use-orders-page"

const OrdersCompleted = () => {
  const { orderStats, isLoading } = useOrdersPage("completed")

  if (isLoading) {
    return <OrdersSkeleton />
  }

  return (
    <div className="p-4">
      <OrderStats orderStats={orderStats} />
      <OrderFilterOptions location="orders" />
      <OrderTable />
    </div>
  )
}

export default OrdersCompleted
