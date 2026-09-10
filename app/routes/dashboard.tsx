import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { ModeToggle } from "~/components/mode-toggle";
import { OrderHeaderFilters } from "~/components/order-header-filters";
import { PeriodSelect } from "~/components/period-select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { WelcomePage } from "~/components/welcome-page";
import { useAnalyticsParams } from "~/lib/useAnalyticsParams";
import type { Country } from "../types/period";
import { Button } from "../components/ui/button";
import { SparklesIcon } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import {
  ProtectedRoute,
  resourceForPortalPath,
} from "../components/protected-route";
import { AdminRoute, isAdminOnlyPath } from "../components/admin-route";

const PATH_LABELS: Record<string, string> = {
  // sections
  anals: "Analytics",
  feedback: "Feedback",
  orders: "Orders",
  products: "Products",
  user: "User",
  shipping: "Shipping",
  flavors: "Flavors",
  // pricing groups
  retailer: "Retailer",
  wholesaler: "Wholesaler",
  distributor: "Distributor",
  // pages (dash-split legacy + new segment style)
  web: "Website",
  website: "Website",
  sales: "Sales",
  customers: "Customers",
  // feedback: "Feedback",
  all: "All",
  pending: "Pending",
  completed: "Completed",
  delivered: "Delivered",
  trashed: "Trashed",
  questions: "Questions",
};

const ANALYTICS_ROUTES = ["/portal/anals/"];

const WEBSITE_ANALYTICS_ROUTES = ["/portal/anals-website"];
const ORDER_ROUTES = ["/portal/orders/"];

function AnalyticsHeaderFilters() {
  const isSalesPage = location.pathname.startsWith("/portal/anals-sales");
  const {
    period,
    country,
    customFrom,
    customTo,
    setPeriod,
    setCountry,
    setCustomRange,
  } = useAnalyticsParams();

  return (
    <PeriodSelect
      value={period}
      onChange={setPeriod}
      country={country}
      setCountry={setCountry}
      customFrom={customFrom}
      customTo={customTo}
      onCustomRange={setCustomRange}
      // showAllCountry={!isSalesPage}
    />
  );
}
function WebsiteAnalyticsHeaderFilters() {
  const { period, customFrom, customTo, setPeriod, setCustomRange } =
    useAnalyticsParams();

  return (
    <PeriodSelect
      value={period}
      onChange={setPeriod}
      country={"all" as Country}
      setCountry={() => {}}
      customFrom={customFrom}
      customTo={customTo}
      onCustomRange={setCustomRange}
      showCountrySelect={false}
    />
  );
}

export default function Page() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const isRoot =
    location.pathname === "/portal" || location.pathname === "/portal/";
  const isAnalyticsPage = ANALYTICS_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  );
  const isOrderPage = ORDER_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  );
  const isWebAnalyticsPage = WEBSITE_ANALYTICS_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  );

  // segments = ["portal", section, ...rest]
  // New group routes: ["portal", "orders", "retailer", "all"]
  // Old dash routes:  ["portal", "orders-all"]
  const label = (seg: string) =>
    PATH_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);

  let crumbs: string[] = [];
  if (segments.length >= 4) {
    // e.g. /portal/orders/retailer/all  or  /portal/anals/retailer/sales
    crumbs = [label(segments[1]), label(segments[2]), label(segments[3])];
  } else {
    // legacy dash-split: "orders-all" → ["Orders", "All"]
    const parts = (segments[1] ?? "").split("-");
    crumbs = parts.map(label).filter(Boolean);
  }
  const isMobile = useIsMobile();
  // Central route guard: every /portal child page is gated on
  // `can(resource, "see")` derived from the current path, so direct URL
  // access respects the same permission as the sidebar. Paths without a
  // backend `requirePermission` counterpart (portal root, users/user-roles)
  // return null and render ungated (see permissions audit).
  const portalResource = resourceForPortalPath(location.pathname);
  // Admin-only pages (no backend `requirePermission` resource — enforced by
  // `requireAdmin` on the server and `AdminRoute` here).
  const adminOnly = isAdminOnlyPath(location.pathname);

  // const agent_api_key = import.meta.env.VITE_AGENT_API_KEY;
  // const agent_id = import.meta.env.VITE_AGENT_ID;
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://chatbotbackend-wheat.vercel.app/widget.js";
    script.defer = true;
    script.setAttribute(
      "data-chatbot-project",
      "2a6e76af-fd1b-4fcd-84bf-93c9f73d20ee",
    );
    script.setAttribute(
      "data-chatbot-host",
      "https://chatbotbackend-wheat.vercel.app",
    );
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Close on click outside (widget root has class "open" when visible)
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const widgetRoot = document.querySelector(".cbw");
      if (!widgetRoot || !widgetRoot.classList.contains("open")) return;

      const target = e.target as Node;
      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedInsideWidget = widgetRoot.contains(target);

      if (!clickedTrigger && !clickedInsideWidget) {
        window.Chatbot?.close();
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* <script
          src="https://app.a91i.com/widget.js"
          data-agent-id={agent_id}
          data-api-key={agent_api_key}
          async
        /> */}
        <style>{`.cbw-btn { display: none !important; }`}</style>
        <header className="flex min-h-14 flex-col justify-center gap-y-1.5 px-4 py-2 transition-[width,height] ease-linear md:h-12 md:flex-row md:items-center md:py-0">
          <div className="flex w-full justify-center md:hidden">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              {crumbs.at(-1) || "Dashboard"}
            </span>
          </div>

          <div className="inline-flex w-full items-center justify-between">
            <div className="relative z-1 flex items-center gap-2">
              <SidebarTrigger className="-ml-1 shrink-0 cursor-pointer" />
              <Breadcrumb className="hidden md:block">
                <BreadcrumbList className="flex-nowrap">
                  {isRoot ? (
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                  ) : (
                    crumbs.map((crumb, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {i < crumbs.length - 1 ? (
                            <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{crumb}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Right Side: Filters & Toggle */}
            <div className="flex items-center gap-2">
              <Button
                ref={triggerRef}
                onClick={() => window.Chatbot?.toggle()}
                variant="outline"
                className="cursor-pointer relative z-1"
              >
                {!isMobile && `Ama AI Analyst`} <SparklesIcon />
              </Button>
              {(isAnalyticsPage || isOrderPage || isWebAnalyticsPage) && (
                <div className="flex">
                  {isAnalyticsPage ? (
                    <AnalyticsHeaderFilters />
                  ) : isWebAnalyticsPage ? (
                    <WebsiteAnalyticsHeaderFilters />
                  ) : (
                    <OrderHeaderFilters />
                  )}
                </div>
              )}
              <div className="relative z-1">
                <ModeToggle />
              </div>
            </div>
          </div>
        </header>

        {isRoot ? (
          <WelcomePage />
        ) : adminOnly ? (
          <AdminRoute>
            <Outlet />
          </AdminRoute>
        ) : portalResource ? (
          <ProtectedRoute key={portalResource} resource={portalResource}>
            <Outlet />
          </ProtectedRoute>
        ) : (
          <Outlet />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
