import { Coins, Eye, MoreHorizontalIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useFlavorStore, type Flavors } from "../../../store/use_flavor_store";
import { PriceTiersSheet } from "../../price-tiers-sheet";
import { Can } from "../../can";
import { useNavigate } from "react-router";
import { capitalizeFirstOnly, cn } from "../../../lib/utils";
import fa from "zod/v4/locales/fa.cjs";

export function FlavorsTable() {
  const { fetchFlavors, flavors, fetchPriceTiers } = useFlavorStore();
  const navigate = useNavigate();

  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchFlavors();
  }, []);

  const navigateToEditPage = (flavorId: string) => {
    navigate(`/portal/products-all/${flavorId}`);
  };
  return (
    <div className="relative mt-4 overflow-hidden rounded-lg border p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flavors &&
            flavors.map((flavor: Flavors) => (
              <TableRow
                data-state={
                  selectedRowId === flavor.id ? "selected" : undefined
                }
                onClick={() =>
                  setSelectedRowId((prev) =>
                    prev === flavor.id ? undefined : flavor.id,
                  )
                }
                key={flavor.id}
              >
                <TableCell
                  className={cn(
                    selectedRowId === flavor.id &&
                      "border-blue-300 border ring-blue-400",
                  )}
                >
                  <img
                    draggable={false}
                    className="h-15 w-15"
                    src={flavor.image}
                    alt=""
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant={"link"}
                    className="cursor-pointer"
                    onClick={() => navigateToEditPage(String(flavor.id))}
                  >
                    {capitalizeFirstOnly(flavor.label)}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {/* PATCH /products/price-list/tiers → products/edit.
                            The kebab trigger stays: View Products is see-level. */}
                        <Can resource="products" action="edit">
                          <PriceTiersSheet flavorId={flavor.id}>
                            <DropdownMenuItem
                              // onClick={() => fetchPriceTiers(flavor.id)}
                              onSelect={(e) => {
                                e.preventDefault();
                                fetchPriceTiers(flavor.id);
                              }}
                            >
                              {" "}
                              <div className="flex items-center gap-2">
                                <Coins />
                                Edit Price List
                              </div>
                            </DropdownMenuItem>
                          </PriceTiersSheet>
                        </Can>
                        <DropdownMenuItem
                          onClick={() => navigateToEditPage(String(flavor.id))}
                        >
                          <div className="flex items-center gap-2">
                            <Eye /> <span>View Products</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
