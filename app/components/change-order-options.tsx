import { toast } from "sonner"
import { useOrderStore, type statusType } from "../store/use-order-store"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { useOrderParams } from "../lib/useOrderParams"

const STATUS = [
  {
    value: "awaiting_payment",
    label: "Awaiting Payment",
    color: "hsl(var(--status-pending))",
    nextStatus: "completed",
    nextColor: "hsl(var(--status-completed))",
  },
  {
    value: "completed",
    label: "Completed",
    color: "hsl(var(--status-completed))",
    nextStatus: "delivered",
    nextColor: "hsl(var(--status-delivered))",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "hsl(var(--status-delivered))",
    nextColor: null,
    nextStatus: null,
  },
] as const

const ChangeOrderOptions = ({
  id,
  status,
}: {
  id: string
  status: statusType
}) => {
  const { updateOrderStatus, selectedOrder } = useOrderStore()
  const { params } = useOrderParams();
  const filteredStatus = STATUS.filter(
    (item) =>
      item.value == selectedOrder?.status 
    
  )

  return (
    <>
      {filteredStatus.map((item) => (
        <DropdownMenuItem
          key={item.value}
          style={{ "--hover-color": item.nextColor } as React.CSSProperties}
          className="focus:bg-(--hover-color)"
          onClick={async () => {
            await updateOrderStatus(id, item.nextStatus as statusType,params)
            toast.success(
              status === "all"
                ? `Order updated to ${item.nextStatus}`
                : `Order marked as ${item.nextStatus}`
            )
          }}
        >
          {item.nextStatus}
        </DropdownMenuItem>
      ))}
    </>
  )
}

export default ChangeOrderOptions
