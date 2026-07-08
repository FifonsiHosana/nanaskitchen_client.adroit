import React, { useEffect } from "react"
import { ProductTable } from "../components/product-table"
import { api } from "../lib/axios"
import { useNavigate, useParams } from "react-router"
import { useRolesStore } from "../store/use_roles_store"
import { Button } from "../components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"

const UserRolesProducts = () => {
  const { ProductId } = useParams<{ ProductId: string }>()

  const navigate = useNavigate()

  const {
    fetchRole,
    userRole,
    getUnassignedProducts,
    unassignedProducts,
    addUnassignedProduct,
  } = useRolesStore()

  useEffect(() => {
    fetchRole(ProductId as string)
    getUnassignedProducts(Number(ProductId))
  }, [ProductId])

  return (
    <div className="p-4">
      <div className="flex justify-between">
        {userRole && (
          <h2 className="mb-4 text-2xl tracking-wide uppercase">{userRole}</h2>
        )}
        <div>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>

      <ProductTable tableType="user-roles" />
      
      {/* popover- add product to role */}
      <div className="mt-4 flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              Add Product
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-h-35 overflow-y-auto" align="end">
            <div className="flex flex-col gap-2">
              {unassignedProducts.length > 0 ? (
                unassignedProducts?.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    size="sm"
                    className="items flex min-h-14 justify-start gap-2"
                    onClick={() =>
                      addUnassignedProduct(Number(ProductId), product.id)
                    }
                  >
                    {/* <div className="h-10 w-10 rounded-lg bg-gray-400">
                    <img src={product.image} alt={product.title} />
                  </div> */}
                    <div className="h-10 w-10 overflow-hidden rounded-lg border object-contain">
                      <img
                        className="object cover h-full w-full"
                        src={product.image}
                        alt={product.title}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-start">
                        {product.title.split("Black")[1]
                          ? product.title.split("Black")[1]
                          : product.title.split("oz")[1]}
                      </span>
                      <span className="text-start text-xs font-light">
                        ¢{product.cediPrice} | ${product.dollarPrice} | €
                        {product.euroPrice}
                      </span>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="p-2 text-center">
                  All products assigned
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default UserRolesProducts
