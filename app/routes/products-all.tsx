import React from "react"
import { ProductTable } from "../components/product-table"
import { useProductStore } from "../store/use-product-store"
import { ProductsTableSkeleton } from "../components/products-skeleton-loader"
import { FlavorsTable } from "../components/flavors-table"

const products = () => {
  return (
    <div className="p-4">
      <ProductTable />
    </div>
  )
}

export default products
