import { toast } from "sonner";
import { useOrderStore, type statusType } from "../store/use-order-store";
import { usePermission } from "../hooks/use-permission";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useOrderParams } from "../lib/useOrderParams";

const STATUS = [
  {
    value: "awaiting_payment",
    label: "Awaiting Payment",
    color: "var(--status-pending)",
    nextStatus: "completed",
    nextColor: "var(--status-delivered)",
  },
  {
    value: "completed",
    label: "Paid",
    color: "var(--status-completed)",
    nextStatus: "delivered",
    nextColor: "var(--status-completed)",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "var(--status-delivered)",
    nextColor: null,
    nextStatus: null,
  },
] as const;

const ChangeOrderOptions = ({
  id,
  status,
}: {
  id: string;
  status: statusType;
}) => {
  const { updateOrderStatus, selectedOrder } = useOrderStore();
  const { params } = useOrderParams();
  // PATCH /orders/:id/status requires orders/edit — omit the status
  // items entirely (never flash them) until permissions resolve.
  const { allowed: canEdit, loaded } = usePermission("orders", "edit");
  const filteredStatus = STATUS.filter(
    (item) => item.value == selectedOrder?.status,
  );

  if (!loaded || !canEdit) return null;

  return (
    <>
      {filteredStatus.map((item) => (
        <DropdownMenuItem
          key={item.value}
          style={{ "--hover-color": item.nextColor } as React.CSSProperties}
          className="focus:bg-(--hover-color)"
          onClick={async () => {
            await updateOrderStatus(id, item.nextStatus as statusType, params);
            toast.success(
              status === "all"
                ? `Order updated to ${item.nextStatus}`
                : `Order marked as ${item.nextStatus}`,
            );
          }}
        >
          {item.nextStatus}
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default ChangeOrderOptions;
