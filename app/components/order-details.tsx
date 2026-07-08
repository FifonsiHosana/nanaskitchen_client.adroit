import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Button } from "./ui/button"
import { useOrderStore } from "../store/use-order-store"
import { Avatar } from "./ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import {
  addCurrencySymbol,
  CURRENCY_SYMBOLS,
  dateNormalize,
  handleCopy,
  STATUS_CONFIG,
} from "../lib/utils"
import { Home, Mail, Mailbox, Phone } from "lucide-react"
import type { DataType } from "../types"

export function OrderDetails({
  open,
  onOpenChange,
  selectedOrder,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedOrder: DataType | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* <SheetTrigger asChild>{children}</SheetTrigger> */}
      <SheetContent>
        {selectedOrder && (
          <>
            <SheetHeader>
              <SheetTitle>Order {selectedOrder.id}</SheetTitle>
              {/* <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription> */}
            </SheetHeader>

            <div className="mx-4 flex justify-between gap-2">
              <span
                className={`rounded-md px-2 py-0.5 font-medium`}
                style={{
                  backgroundColor: STATUS_CONFIG[selectedOrder.status]?.color,
                }}
              >
                {STATUS_CONFIG[selectedOrder.status]?.label}
              </span>
              <span className="text-xs text-gray-400">
                {dateNormalize(selectedOrder.date.split(" ")[0])}
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <Avatar
                size={"lg"}
                className="flex size-full items-center justify-center rounded-full bg-muted text-lg text-muted-foreground group-data-[size=sm]/avatar:text-xs"
              >
                {selectedOrder.firstName.slice(0, 1).toUpperCase()}
                {selectedOrder.lastName.slice(0, 1).toUpperCase()}
              </Avatar>
              <span className="mt-3 text-sm font-medium">
                {selectedOrder.firstName + " " + selectedOrder.lastName}
              </span>
            </div>
            <div className="flex justify-center gap-4 px-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => handleCopy(selectedOrder.email, "email address")}
                    className="cursor-pointer"
                  >
                    <Avatar
                      style={{ backgroundColor: "#f4f3ec" }}
                      size={"lg"}
                      // icon={<MailFilled style={{ color: "#1b1b1c" }} />}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <Mail className="text-[#1b1b1c]" />
                      </div>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{selectedOrder.email}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => handleCopy(selectedOrder.phone,"phone number")}
                    className="cursor-pointer"
                  >
                    <Avatar
                      style={{ backgroundColor: "#f4f3ec" }}
                      size={"lg"}
                      // icon={<PhoneFilled style={{ color: "#1b1b1c" }} />}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <Phone className="text-[#1b1b1c]" />
                      </div>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{selectedOrder.phone}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => handleCopy(selectedOrder.zip_code,"zip code")}
                    className="cursor-pointer"
                  >
                    <Avatar
                      style={{ backgroundColor: "#f4f3ec" }}
                      size={"lg"}
                      // icon={<CopyCell text={selectedOrder.email} />}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <Mailbox className="text-[#1b1b1c]" />
                      </div>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  zip code: {selectedOrder.zip_code}{" "}
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="ml-4 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Order items
            </span>
            {/* Order items */}
            <div className="no-scrollbar overflow-y-auto px-4">
              <div>
                <div className="mt-3 flex flex-col gap-3">
                  {selectedOrder.orderItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100"></div>
                      <div>
                        <p className="text-xs leading-tight font-medium">
                          {item.itemName} x{item.itemQuantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          {addCurrencySymbol(
                            selectedOrder.currency,
                            item.itemPrice.toString()
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* pricing details */}
              </div>
            </div>

            <SheetFooter>
              {/* <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose> */}
              <div className="">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-normal">subtotal:</span>
                  <span className="text-xs font-normal">
                    {addCurrencySymbol(
                      selectedOrder.currency,
                      selectedOrder.subtotal
                    )}
                  </span>
                </div>{" "}
                {selectedOrder.delivery &&
                  !selectedOrder.delivery.startsWith("0.00") && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-normal">delivery:</span>
                      <span className="text-xs font-normal">
                        {addCurrencySymbol(
                          selectedOrder.currency,
                          selectedOrder.delivery
                        )}
                      </span>
                    </div>
                  )}
                {selectedOrder.shipping &&
                  !selectedOrder.shipping.startsWith("0.00") && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-normal">shipping:</span>
                      <span className="text-xs font-normal">
                        {addCurrencySymbol(
                          selectedOrder.currency,
                          selectedOrder.shipping
                        )}
                      </span>
                    </div>
                  )}
                {selectedOrder.packagingFee &&
                  selectedOrder.packagingFee != 0.0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-normal">packaging:</span>
                      <span className="text-xs font-normal">
                        {addCurrencySymbol(
                          selectedOrder.currency,
                          selectedOrder.packagingFee.toString()
                        )}
                      </span>
                    </div>
                  )}
                {selectedOrder.trackingNumber &&
                  !selectedOrder.trackingNumber.startsWith("0.00") && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-normal">
                        tracking number:
                      </span>
                      <span className="text-xs font-normal">
                        {selectedOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                {selectedOrder.label &&
                  !selectedOrder.label.startsWith("0.00") && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-normal">label Url:</span>
                      <span className="text-xs font-normal">
                        {selectedOrder.label}
                      </span>
                    </div>
                  )}
                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span className="font-normal">Total:</span>
                  <span className="font-normal">
                    {addCurrencySymbol(
                      selectedOrder.currency,
                      selectedOrder.total
                    )}
                  </span>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

// export default function OrderDetails({children}: {children: React.ReactNode}) {
//   return (
//     <>
//       <Popover>
//         <PopoverTrigger asChild>{children}</PopoverTrigger>
//         <PopoverContent onSelect={(e) => e.preventDefault()}>

//         </PopoverContent>
//       </Popover>
//     </>
//   )
// }
