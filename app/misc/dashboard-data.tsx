import { useFlavorStore } from "../store/use_flavor_store";
import { capitalizeWords } from "../lib/utils";
import {
  ChartPie,
  ShoppingBasket,
  Package,
  Star,
  Plane,
  Footprints,
  User,
  UserCircle,
} from "lucide-react";
import { PRICE_GROUPS } from "../lib/price-groups";
import type { NavSubGroupData } from "../components/nav-sub-group";

await useFlavorStore.getState().fetchFlavors();

const orderGroups: NavSubGroupData[] = PRICE_GROUPS.map((g) => ({
  title: g.label,
  items: [
    { title: "All Orders", url: `orders/${g.slug}/all` },
    { title: "Awaiting Payment", url: `orders/${g.slug}/pending` },
    { title: "Paid", url: `orders/${g.slug}/completed` },
    { title: "Delivered", url: `orders/${g.slug}/delivered` },
  ],
}));

const flavorGroups: NavSubGroupData[] = [
  {
    title: "flavorGroups",
    items: useFlavorStore.getState().flavors.map((g) => ({
      title: capitalizeWords(g.label),
      url: `products-all/${g.id}`,
    })),
  },
];

// Each price group exposes the same analytics sub-pages, scoped by /:group/.
const analyticsGroups: NavSubGroupData[] = PRICE_GROUPS.map((g) => ({
  title: g.label,
  items: [
    { title: "Sales", url: `anals/${g.slug}/sales` },
    { title: "Customers", url: `anals/${g.slug}/customers` },
    { title: "Feedback", url: `anals/${g.slug}/feedback` },
  ],
}));

type SubPage = "sales" | "customers" | "feedback";

const SUB_PAGE_LABELS: Record<SubPage, string> = {
  sales: "Sales",
  customers: "Customers",
  feedback: "Feedback",
};

const makeSubPageGroup = (page: SubPage): NavSubGroupData => ({
  title: SUB_PAGE_LABELS[page],
  items: PRICE_GROUPS.map((g) => ({
    title: g.label,
    url: `anals/${g.slug}/${page}`,
  })),
});

const navDev = [
  {
    title: "Users",
    url: "users",
    icon: <UserCircle />,
    items: [{ title: "Users", url: "users" }],
  },
  {
    title: "Audit Trail",
    url: "audit-trail",
    icon: <Footprints />,
    items: [{ title: "Trail", url: "audit-trail" }],
  },
];

const navMain = [
  {
    title: "Analytics",
    url: "anals/retailer/sales",
    icon: <ChartPie />,
    items: [
      {
        title: "Sales",
        url: `anals/retailer/sales`,
        groups: makeSubPageGroup("sales").items,
      },
      {
        title: "Customers",
        url: `anals/retailer/customers`,
        groups: makeSubPageGroup("customers").items,
      },
      {
        title: "Feedback",
        url: `anals/retailer/feedback`,
        groups: makeSubPageGroup("feedback").items,
      },
      { title: "Google Analytics", url: "anals-website" },
      {
        title: "Feedback Questions",
        url: "feedback-questions",
      },
    ],
    groups: analyticsGroups,
  },
  {
    title: "Orders",
    url: `orders/${PRICE_GROUPS[0].slug}/all`,
    icon: <ShoppingBasket />,
    items: orderGroups[0].items,
  },
  {
    title: "Products",
    url: "products-flavors",
    icon: <Package />,
    isActive: true,
    items: [
      {
        title: "Flavors",
        url: "products-flavors",
      },
      ...flavorGroups[0].items.map((item) => ({
        title: item.title,
        url: item.url,
      })),
      { title: "Add A Product", url: "products-add" },
    ],
  },
  {
    title: "Reviews",
    url: "reviews-all",
    icon: <Star />,
    items: [
      {
        title: "All Reviews",
        url: "reviews-pending",
        groups: [
          { title: "Pending", url: "reviews-pending" },
          { title: "Approved", url: "reviews-approved" },
          { title: "Rejected", url: "reviews-rejected" },
          { title: "All reviews", url: "reviews-all" },
        ],
      },
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
    url: "shipping-countries",
    icon: <Plane />,
    items: [
      { title: "Countries", url: "shipping-countries" },
      { title: "Delivery locations", url: "shipping-delivery-locations" },
    ],
  },
];

// export const navByRole: Record<Role, NavItem[]> = {
//   sys_admin: sysAdminNav,
//   org_admin: orgAdminNav,
//   dash_admin: dashAdminNav,
//   employee: staffNav,
//   guest: guestNav,
// };
