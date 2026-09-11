import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  Lock,
  LockOpenIcon,
  LoaderIcon,
  CogIcon,
} from "lucide-react";
import { useAuthStore } from "../store/use_auth_store";
import { Button } from "./ui/button";
import { useOrderStore } from "../store/use-order-store";
import { usePermission } from "../hooks/use-permission";
import { OrdersLockDialog } from "./orders-lock-dialog";
import { useEffect, useState } from "react";
import { SettingsModal } from "./SettingsModal";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    // avatar: string
  };
}) {
  const { isMobile, open, openMobile } = useSidebar();
  const { logout } = useAuthStore();
  const { toggleLockLoad, toggleLock, locked, lockStatus } = useOrderStore();
  // Locking/unlocking orders hits GET /lock (orders/edit) — omit the
  // control entirely until permissions resolve so it never flashes.
  const { allowed: canEditOrders, loaded: permsLoaded } = usePermission(
    "orders",
    "edit",
  );

  useEffect(() => {
    lockStatus();
  }, []);

  const [openSettings, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {permsLoaded && canEditOrders && (
          <OrdersLockDialog>
            <div className="mb-4 flex flex-col justify-center">
              {locked ? (
                <Button
                  // onClick={toggleLock}
                  className="bg-green-200 text-green-600"
                >
                  {open || openMobile ? "open orders" : ""}

                  {toggleLockLoad ? (
                    <LoaderIcon
                      role="status"
                      aria-label="Loading"
                      className={"size-4 animate-spin"}
                    />
                  ) : (
                    <LockOpenIcon />
                  )}
                </Button>
              ) : (
                <Button
                  // onClick={toggleLock}
                  className=""
                  variant={"destructive"}
                >
                  {open || openMobile ? "Close Orders" : ""}
                  {toggleLockLoad ? (
                    <LoaderIcon
                      role="status"
                      aria-label="Loading"
                      className={"size-4 animate-spin"}
                    />
                  ) : (
                    <Lock />
                  )}
                </Button>
              )}
            </div>
          </OrdersLockDialog>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg">
                  {/* {`${user.name.split(" ")[0][0]}${user.name.split(" ")[1][0]}`} */}
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">
                    {/* {`${user.name.split(" ")[0][0]}${user.name.split(" ")[1][0]}`}
                     */}
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setOpen(true)}
              }
            >
              <>
                
                <CogIcon />
                Settings
                <SettingsModal open={openSettings} onOpenChange={setOpen} />
               
               
              </>
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
