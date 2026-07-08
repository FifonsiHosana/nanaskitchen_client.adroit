import { LoaderIcon, Lock, LockOpenIcon, Trash2Icon, TrashIcon } from "lucide-react"
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
import type React from "react"

export function OrdersLockDialog({
children
}: {

  children:React.ReactNode
}) {
const { toggleLockLoad, toggleLock, locked } = useOrderStore()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          variant="destructive"
        > */}
        {children}
        {/* </DropdownMenuItem> */}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              locked
                ? `bg-green-600/10 text-green-600 dark:bg-green-600/20 dark:text-green-600`
                : `bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive`
            }
          >
            {/* <Trash2Icon /> */}
            {locked ? <LockOpenIcon /> : <Lock />}
          </AlertDialogMedia>
          <AlertDialogTitle>
            {locked ? "Open " : "Lock "}Orders
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will {locked && "un"}lock users' ability to make orders.
            Are you absolutely sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          {locked ? (
            <AlertDialogAction
              onClick={toggleLock}
              className="bg-green-200 text-green-600"
            >
              unlock orders
              {toggleLockLoad ? (
                <LoaderIcon
                  role="status"
                  aria-label="Loading"
                  className={"size-4 animate-spin"}
                />
              ) : (
                <LockOpenIcon />
              )}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={toggleLock}
              className=""
              variant={"destructive"}
            >
              Lock orders
              {toggleLockLoad ? (
                <LoaderIcon
                  role="status"
                  aria-label="Loading"
                  className={"size-4 animate-spin"}
                />
              ) : (
                <Lock />
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}