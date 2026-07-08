import { Trash2Icon, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import type { statusType } from "../store/use-order-store"
import { useOrderStore } from "../store/use-order-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { DropdownMenuItem } from "./ui/dropdown-menu"

export function AlertDialogDestructive({
  id,
  status,
}: {
  id: string
  status: statusType
}) {
  const { deleteOrder } = useOrderStore()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          variant="destructive"
        >
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Order?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this Order. Are you sure you want to
            proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              deleteOrder(id)
              toast.success(
                status === "all" || status === "trash"
                  ? "Order moved to trash"
                  : "Order deleted"
              )
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
