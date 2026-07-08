"use client"

import * as React from "react"

import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import logoDark from "~/assets/nana-logo-dark.png"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar"
import {
  ChartPie,
  ShoppingBasket,
  Package,
  Star,
  UserRoundCog,
  LucideTruck,
  PlaneTakeoff,
  Plane,
} from "lucide-react"
import { getUserInfo } from "../lib/storage"
import { PRICE_GROUPS } from "../lib/price-groups"
import type { NavSubGroupData } from "./nav-sub-group"

// Each price group exposes the same order sub-pages, scoped by /:group/.
const orderGroups: NavSubGroupData[] = PRICE_GROUPS.map((g) => ({
  title: g.label,
  items: [
    { title: "All Orders", url: `orders/${g.slug}/all` },
    { title: "Awaiting Payment", url: `orders/${g.slug}/pending` },
    { title: "Completed", url: `orders/${g.slug}/completed` },
    { title: "Delivered", url: `orders/${g.slug}/delivered` },
  ],
}))

// Each price group exposes the same analytics sub-pages, scoped by /:group/.
const analyticsGroups: NavSubGroupData[] = PRICE_GROUPS.map((g) => ({
  title: g.label,
  items: [
    { title: "Sales", url: `anals/${g.slug}/sales` },
    { title: "Customers", url: `anals/${g.slug}/customers` },
    { title: "Feedback", url: `anals/${g.slug}/feedback` },
  ],
}))

const data = {
  navMain: [
    {
      title: "Analytics",
      url: "anals-website",
      icon: <ChartPie />,
      isActive: true,
      items: [
        { title: "Website", url: "anals-website" },
        { title: "Feedback Questions", url: "feedback-questions" },
      ],
      groups: analyticsGroups,
    },
    {
      title: "Orders",
      url: `orders/${PRICE_GROUPS[0].slug}/all`,
      icon: <ShoppingBasket />,
      groups: orderGroups,
    },
    {
      title: "Products",
      url: "products-flavors",
      icon: <Package />,
      items: [
        { title: "Flavors", url: "products-flavors" },
        { title: "Add A Product", url: "products-add" },
      ],
      // groups: PRICE_GROUPS.filter((g) => g.slug !== "retailer").map((g) => ({
      //   title: g.label,
      //   items: [{ title: "Products", url: `products/${g.slug}` }],
      // })),
    },
    {
      title: "Reviews",
      url: "reviews-all",
      icon: <Star />,
      items: [
        { title: "Pending", url: "reviews-pending" },
        { title: "Approved", url: "reviews-approved" },
        { title: "Rejected", url: "reviews-rejected" },
        { title: "All reviews", url: "reviews-all" },
      ],
    },
    // {
    //   title: "User roles",
    //   url: "user-roles",
    //   icon: <UserRoundCog />,
    //   items: [
    //     { title: "All user roles", url: "user-roles" },
    //     // { title: "Add a user role", url: "user-roles-add" },
    //   ],
    // },
    {
      title: "Shipping",
      url: "delivery-locations",
      icon: <Plane />,
      items: [
        { title: "Countries", url: "shipping-countries" },
        { title: "Delivery locations", url: "shipping-delivery-locations" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center object-cover">
          <img draggable={false} className="w-23" src={logoDark} alt="logo" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
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
  )
}
