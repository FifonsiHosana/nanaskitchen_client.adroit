import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/login.tsx"),
  route("portal", "routes/dashboard.tsx", [
    // Analytics
    route("anals-website", "routes/website-analytics.tsx"),
    route("anals/:group/sales", "routes/analytics-sales.tsx"),
    route("anals/:group/customers", "routes/analytics-customers.tsx"),
    route("anals/:group/feedback", "routes/analytics-feedback.tsx"),

    // Orders — scoped by pricing group (retailer/wholesaler/distributor)
    route("orders/:group/all", "routes/orders-all.tsx"),
    route("orders/:group/pending", "routes/orders-awaiting-payment.tsx"),
    route("orders/:group/completed", "routes/orders-completed.tsx"),
    route("orders/:group/delivered", "routes/orders-delivered.tsx"),
    route("orders/:group/trashed", "routes/orders-trashed.tsx"),
    // User Roles
    route("user-roles", "routes/user-roles-all.tsx"),
    route("user-roles-add", "routes/user-role-add.tsx"),
    route("user-roles/products/:ProductId", "routes/user-roles-products.tsx"),
    route(
      "user-roles/products/:productId/edit/:id",
      "routes/user-role-products-edit.tsx"
    ),
    // Products
    route("products-all/:flavorId", "routes/products-all.tsx"),
    route("products/:group", "routes/products-wholesale.tsx"),
    route("products-add", "routes/products-add.tsx"),
    route("products-all/edit/:id", "routes/product-edit.tsx"),
    route("products-flavors", "routes/products-flavors.tsx"),

    // Reviews
    route("reviews-all", "routes/reviews-all.tsx"),
    route("reviews-pending", "routes/reviews-pending.tsx"),
    route("reviews-approved", "routes/reviews-approved.tsx"),
    route("reviews-rejected", "routes/reviews-rejected.tsx"),
    // Feedback management
    route("feedback-questions", "routes/feedback-questions.tsx"),

    // Shipping
    route("shipping-countries", "routes/shipping-countries.tsx"),
    route(
      "shipping-delivery-locations",
      "routes/shipping-delivery-locations.tsx"
    ),
  ]),
] satisfies RouteConfig

