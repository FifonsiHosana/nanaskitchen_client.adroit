import type { Resource } from "~/store/v2/use-permissions-store";
import { PRICE_GROUPS } from "./price-groups";

/** Sidebar nav node tagged with the RBAC resource that gates it. */
export interface NavItem {
  title: string;
  /** Path relative to `/portal/`, matching a real route in `app/routes.ts`. */
  url?: string;
  resource: Resource;
  children?: NavItem[];
}

export interface FlavorLabel {
  id: number;
  label: string;
}

function capitalizeWords(value: string) {
  return value
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Shared helper: one child per price group for each named sub-page.
function bySubPage(
  resource: Resource,
  subPages: { title: string; urlFor: (slug: string) => string }[],
): NavItem[] {
  return subPages.map(({ title, urlFor }) => ({
    title,
    resource,
    children: PRICE_GROUPS.map((g) => ({
      title: g.label,
      url: urlFor(g.slug),
      resource,
    })),
  }));
}

/**
 * Build the full sidebar tree. `flavors` injects the dynamic per-flavor
 * product pages (`products-all/:flavorId`, route `products-all/:flavorId`).
 * Every node's `url` matches a real route in `app/routes.ts`.
 */
export function buildNavItems(flavors: FlavorLabel[] = []): NavItem[] {
  return [
    {
      title: "Analytics",
      url: "anals/retailer/sales",
      resource: "analytics",
      children: [
        ...bySubPage("analytics", [
          { title: "Sales", urlFor: (slug) => `anals/${slug}/sales` },
          { title: "Customers", urlFor: (slug) => `anals/${slug}/customers` },
          { title: "Feedback", urlFor: (slug) => `anals/${slug}/feedback` },
        ]),
        {
          title: "Google Analytics",
          url: "anals-website",
          resource: "analytics",
        },
      ],
    },
    {
      title: "Orders",
      url: `orders/${PRICE_GROUPS[0].slug}/all`,
      resource: "orders",
      children: bySubPage("orders", [
        { title: "All Orders", urlFor: (slug) => `orders/${slug}/all` },
        {
          title: "Awaiting Payment",
          urlFor: (slug) => `orders/${slug}/pending`,
        },
        { title: "Paid", urlFor: (slug) => `orders/${slug}/completed` },
        { title: "Delivered", urlFor: (slug) => `orders/${slug}/delivered` },
      ]),
    },
    {
      title: "Products",
      url: "products-flavors",
      resource: "products",
      children: [
        { title: "Flavors", url: "products-flavors", resource: "products" },
        ...flavors.map((f) => ({
          title: capitalizeWords(f.label),
          url: `products-all/${f.id}`,
          resource: "products" as Resource,
        })),
        { title: "Add A Product", url: "products-add", resource: "products" },
      ],
    },
    {
      title: "Reviews",
      url: "reviews-all",
      resource: "reviews",
      children: [
        { title: "Pending", url: "reviews-pending", resource: "reviews" },
        { title: "Approved", url: "reviews-approved", resource: "reviews" },
        { title: "Rejected", url: "reviews-rejected", resource: "reviews" },
        { title: "All reviews", url: "reviews-all", resource: "reviews" },
      ],
    },
    {
      title: "Survey",
      url: "survey-questions",
      resource: "feedback",
      children: [
        { title: "Questions", url: "survey-questions", resource: "feedback" },
        { title: "Responses", url: "survey-responses", resource: "feedback" },
      ],
    },
    {
      title: "Shipping",
      url: "shipping-countries",
      resource: "shipping",
      children: [
        {
          title: "Countries",
          url: "shipping-countries",
          resource: "shipping",
        },
        {
          title: "Delivery locations",
          url: "shipping-delivery-locations",
          resource: "shipping",
        },
      ],
    },
    {
      title: "Audit Trail",
      url: "audit-trail",
      resource: "audit",
      children: [{ title: "Trail", url: "audit-trail", resource: "audit" }],
    },
  ];
}
