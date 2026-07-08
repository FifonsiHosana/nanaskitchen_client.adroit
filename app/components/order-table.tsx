"use client"

import { Skeleton } from "~/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { useOrderParams } from "../lib/useOrderParams"
import { addCurrencySymbol, dateNormalize, STATUS_CONFIG } from "../lib/utils"
import { useOrderStore } from "../store/use-order-store"
import { OrdersDropdown } from "./orders-table-dropdown"
import PaginationOrders from "./pagination"
import { useState } from "react"
import { Button } from "./ui/button"
import { OrderDetails } from "./order-details"
import { Spinner } from "./ui/spinner"
import type { DataType } from "../types"

export function OrderTable() {
  const { params } = useOrderParams()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<DataType | null>(null)

  const { orders, totalCount, isLoading, isTableLoading, pageStatus } =
    useOrderStore()

  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(totalCount / Number(params.pageSize || 20))

  return (
    <div className="relative mt-4 overflow-hidden rounded-lg border p-2">
      {/* Single instance, lifted outside the table entirely */}
      <OrderDetails
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedOrder={selectedOrder}
      />

      <Table>
        <TableCaption>All orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Order date</TableHead>
            <TableHead className="text-center">Location</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          className={isTableLoading ? "pointer-events-none opacity-60" : ""}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={`order-loading-${index}`}>
                <TableCell colSpan={8}>
                  <Skeleton className="h-9 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              // No more <OrderDetails> here
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Button
                    onClick={() => {
                      setSelectedOrder(order)
                      setDetailsOpen(true)
                    }}
                    className="cursor-pointer hover:text-blue-500"
                    variant={"link"}
                  >
                    {order.id}
                  </Button>
                </TableCell>
                <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                <TableCell className="text-left">
                  <div
                    className="inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        pageStatus === "trash"
                          ? STATUS_CONFIG[pageStatus]?.color
                          : STATUS_CONFIG[order.status]?.color,
                    }}
                  >
                    {pageStatus === "trash"
                      ? STATUS_CONFIG[pageStatus]?.label
                      : STATUS_CONFIG[order.status]?.label}
                  </div>
                </TableCell>
                <TableCell>
                  {addCurrencySymbol(order.currency, order.total)}
                </TableCell>
                <TableCell>{order.country_code}</TableCell>
                <TableCell>{dateNormalize(order.date.split(" ")[0])}</TableCell>
                <TableCell className="text-center">
                  {order.deliveryLocation ?? "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <OrdersDropdown
                    pageStatus={pageStatus}
                    id={order.id}
                    status={pageStatus}
                    orderId={order.orderId}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-10 text-center text-muted-foreground"
              >
                No orders found for the current filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isTableLoading && !isLoading && (
        <div className="pointer-events-none absolute inset-x-5 top-5 flex justify-center p-3">
          <div className="rounded-full border bg-background/95 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <div className="flex items-center gap-2">
              <Spinner className="size-4" /> Updating orders...
            </div>
          </div>
        </div>
      )}

      <PaginationOrders
        currentTable="orders"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}
