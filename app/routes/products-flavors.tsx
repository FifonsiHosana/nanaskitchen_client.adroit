import { FlavorsTable } from "../components/flavors-table"
import { AddFlavorDialog } from "../components/add-flavor-dialog"
import { AddProductDialog } from "../components/add-product-dialog"

const products = () => {
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
