import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("portal", "routes/dashboard.tsx", [
    // Analytics
    route("anals-website", "routes/analytics/website-analytics.tsx"),
    route("anals/:group/sales", "routes/analytics/analytics-sales.tsx"),
    route("anals/:group/customers", "routes/analytics/analytics-customers.tsx"),
    route("anals/:group/feedback", "routes/analytics/analytics-feedback.tsx"),

    // Orders — scoped by pricing group (retailer/wholesaler/distributor)
    route("orders/:group/all", "routes/orders/orders-all.tsx"),
    route("orders/:group/pending", "routes/orders/orders-awaiting-payment.tsx"),
    route("orders/:group/completed", "routes/orders/orders-completed.tsx"),
    route("orders/:group/delivered", "routes/orders/orders-delivered.tsx"),
    route("orders/:group/trashed", "routes/orders/orders-trashed.tsx"),
    // User Roles
    route("user-roles", "routes/user-roles/user-roles-all.tsx"),
    route("roles-permissions", "routes/user-roles/roles-permissions.tsx"),
    route("user-roles-add", "routes/user-roles/user-role-add.tsx"),
    route(
      "user-roles/products/:ProductId",
      "routes/user-roles/user-roles-products.tsx",
    ),
    route("users", "routes/user-roles/users.tsx"),
    route("users/create", "routes/user-roles/user-create.tsx"),
    route(
      "user-roles/products/:productId/edit/:id",
      "routes/user-roles/user-role-products-edit.tsx",
    ),
    // Products
    route("products-all/:flavorId", "routes/products/products-all.tsx"),
    route("products/:group", "routes/products/products-wholesale.tsx"),
    route("products-add", "routes/products/products-add.tsx"),
    route("products-all/edit/:id", "routes/products/product-edit.tsx"),
    route("products-flavors", "routes/products/products-flavors.tsx"),

    // Reviews
    route("reviews-all", "routes/reviews/reviews-all.tsx"),
    route("reviews-pending", "routes/reviews/reviews-pending.tsx"),
    route("reviews-approved", "routes/reviews/reviews-approved.tsx"),
    route("reviews-rejected", "routes/reviews/reviews-rejected.tsx"),

    // Feedback management
    route("survey-questions", "routes/feedback/feedback-questions.tsx"),
    route("survey-responses", "routes/feedback/feedback-responses.tsx"),

    // Shipping
    route("shipping-countries", "routes/shipping/shipping-countries.tsx"),
    route(
      "shipping-delivery-locations",
      "routes/shipping/shipping-delivery-locations.tsx",
    ),

    //trail
    route("audit-trail", "routes/trail/audit.tsx"),
  ]),
] satisfies RouteConfig;
