import OrderFilterOptions from "@/app/components/order-filter-options";
import { OrderTable } from "@/app/components/order-table";
import { OrdersSkeleton } from "@/app/components/orders-skeleton";
import OrderStats from "@/app/components/orders-stats";
import { useOrdersPage } from "@/app/lib/use-orders-page";


const OrdersTrashed = () => {
  const { orderStats, isLoading, isTableLoading } = useOrdersPage("trash")

  if (isLoading && !isTableLoading) {
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

export default OrdersTrashed
