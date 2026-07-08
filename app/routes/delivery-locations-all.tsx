import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

const deliveryLocationsAll = () => {
  return (
    <div className="p-4">
      {" "}
      <Table>
        <TableCaption>All locations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Location</TableHead>
            <TableHead className="text-center">Price/cost</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
        // className={isTableLoading ? "pointer-events-none opacity-60" : ""}
        >
          <TableCell>Accra</TableCell>
          <TableCell className="text-center">$40</TableCell>
          <TableCell className="text-right">edit/delete</TableCell>
        </TableBody>
      </Table>
    </div>
  )
}

export default deliveryLocationsAll