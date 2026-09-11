import { Skeleton } from "./ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Matches `ProductTable` (products mode) columns:
// Image | Name | Product Link | Weight | Stock | Visibility | Actions
function ProductRowSkeleton() {
  return (
    <TableRow>
      {/* Image */}
      <TableCell>
        <Skeleton className="h-16 w-16 rounded-lg" />
      </TableCell>
      {/* Name */}
      <TableCell>
        <Skeleton className="h-4 w-44" />
      </TableCell>
      {/* Product Link */}
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      {/* Weight */}
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      {/* Stock badge */}
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      {/* Visibility badge */}
      <TableCell>
        <Skeleton className="h-5 w-24 rounded-full" />
      </TableCell>
      {/* Action */}
      <TableCell>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-8 w-9 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  )
}

// Matches `ProductTable` layout: top nav row (Back + Storefront) + bordered table.
export function ProductsTableSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {/* Top nav row */}
      <div className="flex justify-between">
        <Skeleton className="mt-5 h-8 w-36 rounded-md" />
        <Skeleton className="mt-5 h-8 w-32 rounded-md" />
      </div>

      <div className="mt-2 overflow-hidden rounded-lg border p-2">
        <Table>
          <TableCaption>products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product Link</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <ProductRowSkeleton key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Compact variant for the user-role products table:
// Image | Name | Min. Quantity | Actions
export function UserRoleProductsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="mt-2 animate-pulse overflow-hidden rounded-lg border p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Min. Quantity</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-16 w-16 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-9 rounded-md" />
                  <Skeleton className="h-8 w-9 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
