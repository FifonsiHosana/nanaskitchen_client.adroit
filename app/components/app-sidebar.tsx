"use client";

import * as React from "react";

import { NavMain, type NavNode } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import logoDark from "~/assets/nana-logo-dark.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSkeleton,
  SidebarRail,
} from "~/components/ui/sidebar";
import {
  ChartPie,
  ShoppingBasket,
  Package,
  Star,
  Plane,
  Footprints,
  MessageSquareQuote,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { getUserInfo } from "../lib/storage";
import { buildNavItems, type NavItem } from "../lib/nav-items";
import { useFlavorStore } from "../store/use_flavor_store";
import { useAuthStore } from "../store/use_auth_store";
import { usePermissionsStore } from "../store/v2/use-permissions-store";
import { useIsAdmin } from "../hooks/use-is-admin";

const NAV_ICONS: Record<string, React.ReactNode> = {
  Analytics: <ChartPie />,
  Orders: <ShoppingBasket />,
  Products: <Package />,
  Reviews: <Star />,
  Survey: <MessageSquareQuote />,
  Shipping: <Plane />,
  "Audit Trail": <Footprints />,
};

function filterNavBySee(
  items: NavItem[],
  canSee: (item: NavItem) => boolean,
): NavNode[] {
  const out: NavNode[] = [];
  for (const item of items) {
    if (!canSee(item)) continue;
    const children = item.children
      ? filterNavBySee(item.children, canSee)
      : undefined;
    // Drop headers whose entire subtree is gated out (no empty groups).
    if (item.children && (!children || children.length === 0)) continue;
    out.push({
      title: item.title,
      url: item.url,
      icon: NAV_ICONS[item.title],
      children,
    });
  }
  return out;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const flavors = useFlavorStore((s) => s.flavors);
  const fetchFlavors = useFlavorStore((s) => s.fetchFlavors);
  const can = usePermissionsStore((s) => s.can);
  const loaded = usePermissionsStore((s) => s.loaded);
  // Subscribe to the permissions map so the nav re-renders when it resolves.
  const permissions = usePermissionsStore((s) => s.permissions);
  // Admin tab: role names resolve via the backend roles list; the tab only
  // renders once roles are loaded so it never flashes for non-admins.
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const rolesLoaded = usePermissionsStore((s) => s.rolesLoaded);
  const fetchRoles = usePermissionsStore((s) => s.fetchRoles);
  const { isAdmin } = useIsAdmin();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (flavors.length === 0) fetchFlavors();
  }, [flavors.length, fetchFlavors]);

  React.useEffect(() => {
    if (isAuthenticated && !rolesLoaded) fetchRoles();
  }, [isAuthenticated, rolesLoaded, fetchRoles]);

  const navMain = React.useMemo(
    () =>
      filterNavBySee(buildNavItems(flavors), (item) =>
        can(item.resource, "see"),
      ),
    // `permissions` re-runs the filter once `fetchPermissions()` resolves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flavors, permissions, loaded],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center object-cover">
          <img draggable={false} className="w-23" src={logoDark} alt="logo" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {!loaded ? (
          <SidebarGroup>
            <SidebarMenu>
              {Array.from({ length: 6 }).map((_, i) => (
                <SidebarMenuSkeleton key={i} showIcon />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <>
            <NavMain items={navMain} />
            {rolesLoaded && isAdmin && (
              <NavMain
                items={[
                  {
                    title: "Audit Trail",
                    url: "audit-trail",
                    icon: <Footprints />,
                  },
                  {
                    title: "Users",
                    url: "users",
                    icon: <UserCircle />,
                  },
                  {
                    title: "Roles & Permissions",
                    url: "roles-permissions",
                    icon: <ShieldCheck />,
                  },
                ]}
              />
            )}
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            mounted
              ? getUserInfo()
              : { name: "Admin", email: "email@gmail.com" }
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
