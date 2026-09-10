import React, { useEffect } from "react"
import { useParams } from "react-router"
import { useProductStore } from "../../store/use-product-store"
import ProductForm from "../../components/product-form"
import { useProductStoreV2 } from "../../store/v2/use-product-store"

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>()
  const { fetchProduct, selectedProduct, isLoading } = useProductStoreV2()
  useEffect(() => {
    if (id) fetchProduct(Number(id))
  }, [id])
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Loading Product...
      </div>
    )
  }
  return (
    <>
      <ProductForm product={selectedProduct} />
    </>
  )
}

export default ProductEdit
