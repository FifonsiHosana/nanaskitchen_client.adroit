import { Skeleton } from "./ui/skeleton";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

 function ProductRowSkeleton() {
  return (
    <TableRow>
      {/* Image */}
      <TableCell>
        <Skeleton className="h-15 w-15 rounded-xl" />
      </TableCell>
      {/* Name */}
      <TableCell>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      {/* Price */}
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      {/* Weight */}
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      {/* Dimensions */}
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>{" "}
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>{" "}
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      {/* Action */}
      <TableCell>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  )
}
export function ProductsTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Table className="">
      <TableCaption>products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>USD</TableHead>
          <TableHead>GHS</TableHead>
          <TableHead>EUR</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <ProductRowSkeleton key={i} />
        ))}
      </TableBody>
    </Table>
  )
}
 
