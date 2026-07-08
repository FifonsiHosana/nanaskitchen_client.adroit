import { Coins, Eye, MoreHorizontalIcon, Trash } from "lucide-react"
import { useEffect } from "react"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { useFlavorStore, type Flavors } from "../store/use_flavor_store"
import { PriceTiersSheet } from "./price-tiers-sheet"
import { useNavigate } from "react-router"

export function FlavorsTable() {
  const { fetchFlavors, flavors, fetchPriceTiers } = useFlavorStore()

  const navigate = useNavigate()

  useEffect(() => {
    fetchFlavors()
  }, [])

  const navigateToEditPage = (flavorId: string) => {
    navigate(`/portal/products-all/${flavorId}`)
  }
  return (
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
            <TableRow key={flavor.id}>
              <TableCell className="font-medium">
                <img className="h-15 w-15" src={flavor.image} alt="" />
              </TableCell>
              <TableCell>{flavor.label}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <PriceTiersSheet flavorId={flavor.id}>
                    <Button
                      className="h-8 w-8 cursor-pointer"
                      variant={"secondary"}
                      onClick={() => fetchPriceTiers(flavor.id)}
                    >
                      <Coins />
                    </Button>
                  </PriceTiersSheet>
                  <Button
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => navigateToEditPage(String(flavor.id))}
                  >
                    <Eye />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Country Settings</DropdownMenuItem>
                      {/* <DropdownMenuItem>Duplicate</DropdownMenuItem> */}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
