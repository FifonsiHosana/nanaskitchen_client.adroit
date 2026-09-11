import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"

export function NoPermissionDialog({children}:{children:React.ReactNode}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline">Show Dialog</Button> */}
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            You don't have required permissions for this action
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please contact your administrator for assistance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <AlertDialogFooter className="flex items-center justify-center"> */}
          <div className="flex items-center justify-center">
            {/* <AlertDialogCancel>Close</AlertDialogCancel> */}
            {/* <Button variant={"default"}> */}
              <AlertDialogCancel variant={"default"}>Close</AlertDialogCancel>
              {/* </Button> */}
          </div>
          {/* <AlertDialogAction>Allow</AlertDialogAction> */}
        {/* </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  )
}
