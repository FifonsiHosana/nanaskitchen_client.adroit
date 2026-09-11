"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Globe,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { Can } from "./can";
import { NoPermissionDialog } from "./no-permission-dialog";
import { ProductsTableSkeleton } from "./products-skeleton-loader";
import { Badge } from "./ui/badge";
import { useRolesStore } from "../store/use_roles_store";
import {
  useProductStoreV2,
  type CountrySettings,
} from "../store/v2/use-product-store";
import { cn } from "../lib/utils";

function countryVisibility(countrySettings: CountrySettings[] = []) {
  if (!countrySettings.length) return false;

  const visibleCountries = countrySettings.filter((s) => s.visible);
  const allVisible = visibleCountries.length === countrySettings.length;
  const someVisible = visibleCountries.length > 0;

  if (allVisible || someVisible) return true;
  return false;
}

function VisibilityBadge({
  countrySettings,
}: {
  countrySettings: CountrySettings[];
}) {
  const visibleCountries = countrySettings.filter((s) => s.visible);
  const allVisible = visibleCountries.length === countrySettings.length;
  const someVisible = visibleCountries.length > 0;

  if (allVisible)
    return <Badge className="bg-teal-500 text-teal-50">All visible</Badge>;

  if (someVisible) {
    const regions = visibleCountries.map((s) => s.countryName).join(", ");
    return (
      <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
        {regions}
      </Badge>
    );
  }

  return (
    <Badge className="bg-gray-700 text-gray-50 dark:bg-gray-850 dark:text-gray-300">
      None visible
    </Badge>
  );
}

function StockBadge({
  countrySettings,
}: {
  countrySettings: CountrySettings[];
}) {
  const outOfStock = countrySettings.filter((s) => s.stock);
  const allOut = outOfStock.length === countrySettings.length;
  const someOut = outOfStock.length > 0;
  console.log(countrySettings);

  if (allOut) return <Badge variant="destructive">Out of stock</Badge>;

  if (someOut) {
    const regions = outOfStock.map((s) => s.countryName).join(", ");
    return (
      <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
        Out: {regions}
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="bg-stable text-stable-text">
      In stock
    </Badge>
  );
}

export function ProductTable({
  tableType = "products",
}: {
  tableType?: string;
}) {
  const { isLoading, getProducts, products } = useProductStoreV2();
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined,
  );

  const {
    fetchUserRoleProducts,
    userRoleProducts,
    roles,
    deleteUserRoleProducts,
  } = useRolesStore();

  const { ProductId } = useParams<{ ProductId: string }>();

  const { flavorId } = useParams<{ flavorId: string }>();

  const isProductsTable = tableType === "products";

  useEffect(() => {
    if (isProductsTable) {
      getProducts(Number(flavorId));
    } else {
      fetchUserRoleProducts(Number(ProductId));
    }
  }, [isProductsTable, ProductId, flavorId]);

  const navigate = useNavigate();

  const navigateToEditPage = (id: string) => {
    navigate(`/portal/products-all/edit/${id}`);
  };

  return (
    <>
      <div className="flex justify-between">
        <Button
          variant={"link"}
          className="mt-5 underline underline-offset-4 cursor-pointer"
          onClick={() => navigate("/portal/products-flavors")}
        >
          <ArrowLeft />
          Back To Flavors
        </Button>
        <Link to="https://nanaskitchen.net/" target="_blank">
          <Button
            variant="link"
            className="mt-5 hover:text-blue-500 underline underline-offset-4 cursor-pointer"
          >
            Visit Storefront
            <Globe />
          </Button>
        </Link>
      </div>

      <div className="mt-2 overflow-hidden rounded-lg border p-2">
        {isLoading ? (
          <div className="p-4">
            <ProductsTableSkeleton />
          </div>
        ) : (
          <Table>
            <TableCaption>
              {isProductsTable ? "All products." : ` products.`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                {isProductsTable ? (
                  <>
                    <TableHead>Product Link</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Visibility</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Min. Quantity</TableHead>
                  </>
                )}
                <Can resource="products" action="edit">
                  <TableHead className="text-center">Actions</TableHead>
                </Can>
              </TableRow>
            </TableHeader>
            {isProductsTable ? (
              <TableBody>
                {products?.map((product) => (
                  <TableRow
                    data-state={
                      selectedRowId === product.id ? "selected" : undefined
                    }
                    onClick={() =>
                      setSelectedRowId((prev) =>
                        prev === product.id ? undefined : product.id,
                      )
                    }
                    key={product.id}
                  >
                    {/* cell 1 */}

                    <TableCell>
                      <div className="h-16 w-16 overflow-hidden rounded-lg border object-contain">
                        <img
                          className="h-full w-full object-cover"
                          src={product.image}
                          alt={product.title}
                        />
                      </div>
                    </TableCell>
                    {/* cell 2 */}
                    <TableCell
                      className={cn(
                        selectedRowId === product.id &&
                          "border-blue-300 border ring-blue-400",
                      )}
                    >
                      {" "}
                      {product.title.length > 50
                        ? product.title.slice(0, 50) + "..."
                        : product.title}
                    </TableCell>
                    {isProductsTable ? (
                      <>
                        <TableCell className="text-left ">
                          {product.sourceId ? (
                            <Button
                              className="text-blue-500"
                              variant="link"
                              asChild
                            >
                              <Link
                                className=""
                                target="_blank"
                                rel="noopener noreferrer"
                                to={`https://nanaskitchen.net${
                                  countryVisibility(
                                    product.countrySettings as CountrySettings[],
                                  )
                                    ? `/product-details/${product.sourceId}?pricingGroupId=${product.isCase ? 2 : 1}`
                                    : ""
                                }`}
                              >
                                {countryVisibility(
                                  product.countrySettings as CountrySettings[],
                                )
                                  ? `See Product`
                                  : `visit Storefront`}
                                {countryVisibility(
                                  product.countrySettings as CountrySettings[],
                                ) ? (
                                  <ArrowUpRight />
                                ) : (
                                  <Globe />
                                )}
                              </Link>
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-sm ">
                          {product.weight ? `${product.weight} oz` : "—"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <StockBadge
                            countrySettings={product.countrySettings}
                          />
                        </TableCell>
                        <TableCell>
                          <VisibilityBadge
                            countrySettings={product.countrySettings}
                          />
                        </TableCell>
                      </>
                    ) : null}
                    {/* cell 6 */}
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {/* PATCH /products/update/:id requires products/edit */}
                        <Can resource="products" action="edit">
                          <Button
                            onClick={() =>
                              navigateToEditPage(String(product.id))
                            }
                            className="h-8 cursor-pointer"
                            variant="outline"
                            size="sm"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Can>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                {userRoleProducts?.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>
                      <div className="h-16 w-16 overflow-hidden rounded-lg border object-contain">
                        <img
                          className="h-full w-full object-cover"
                          src={product.productImage}
                          alt={product.productName}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {/* {product.productName} */}
                      {product.productName.length > 30
                        ? product.productName.slice(0, 30) + "..."
                        : product.productName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {product.dollarDiscount
                        ? `$${product.dollarDiscount}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {product.cediDiscount ? `₵${product.cediDiscount}` : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {product.euroDiscount ? `€${product.euroDiscount}` : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.minQuantity
                        ? `${product.minQuantity} units`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() =>
                            navigateToEditPage(String(product.productId))
                          }
                          className="h-8 cursor-pointer"
                          variant="outline"
                          size="sm"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <NoPermissionDialog>
                          <Button
                            className="h-8 cursor-pointer"
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              deleteUserRoleProducts(
                                product.id,
                                Number(ProductId),
                              )
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </NoPermissionDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        )}
      </div>
    </>
  );
}
