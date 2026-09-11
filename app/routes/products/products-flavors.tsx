import { FlavorsTable } from "../../components/analytics/feedback/flavors-table"
import { AddFlavorDialog } from "../../components/add-flavor-dialog"
import { AddProductDialog } from "../../components/add-product-dialog"
import { FlavorsTableSkeleton } from "../../components/tables-skeleton"
import { useFlavorStore } from "../../store/use_flavor_store"

const products = () => {
  const { flavors, loading } = useFlavorStore()

  if (loading && flavors.length === 0) {
    return <FlavorsTableSkeleton />
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end gap-2">
        <AddFlavorDialog />
        <AddProductDialog />
      </div>
      <FlavorsTable />
    </div>
  )
}

export default products
