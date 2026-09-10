import { useEffect, useState } from "react";
import {
  ArchiveRestore,
  Eye,
  LocationEditIcon,
  MoreHorizontal,
  PencilIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useOrderStore, type statusType } from "../store/use-order-store";
import { usePermission } from "../hooks/use-permission";
import ChangeOrderOptions from "./change-order-options";
import { OrderDetails } from "./order-details";
import { AlertDialogDestructive } from "./order-delete-dialog";

export function OrdersDropdown({
  id,
  pageStatus,
  status,
  orderId,
}: {
  pageStatus: statusType;
  id: string;
  status: statusType;
  orderId: string;
}) {
  const { selectedOrder, copyOrderLocation, updateOrderStatus } =
    useOrderStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Status changes PATCH /orders/:id/status (orders/edit). The submenu
  // trigger is omitted — not just emptied — when edit is not granted.
  const { allowed: canEditOrders, loaded: permsLoaded } = usePermission(
    "orders",
    "edit",
  );
  const showStatusMenu =
    permsLoaded && canEditOrders && selectedOrder?.status !== "delivered";

  useEffect(() => {
    // console.log(selectedOrder)
  }, [selectedOrder]);

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          copyOrderLocation(id);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuItem
              disabled={
                !selectedOrder?.location ||
                selectedOrder.location === "null" ||
                selectedOrder.location.includes("null")
              }
              onClick={() => {
                if (
                  !selectedOrder?.location ||
                  selectedOrder.location === "null"
                )
                  return;
                navigator.clipboard.writeText(selectedOrder.location);
                toast.success("GPS location copied to clipboard");
              }}
            >
              <LocationEditIcon />
              Copy GPS location
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setDetailsOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
              View order details
            </DropdownMenuItem>
            <OrderDetails
              open={detailsOpen}
              onOpenChange={setDetailsOpen}
              selectedOrder={selectedOrder}
            />
            {showStatusMenu && (
              <>
                <DropdownMenuSubTrigger>
                  <PencilIcon className="h-4 w-4" />
                  Change order status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <ChangeOrderOptions id={orderId} status={status} />
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </>
            )}
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
          {pageStatus === "trash" ? (
            <DropdownMenuItem
              className=""
              onClick={() => updateOrderStatus(id, "recover")}
            >
              <ArchiveRestore className="h-4 w-4" />
              Recover from trash
            </DropdownMenuItem>
          ) : (
            <AlertDialogDestructive id={id} status={status} />
          )}
        </DropdownMenuGroup> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
