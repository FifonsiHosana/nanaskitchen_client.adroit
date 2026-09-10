import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "~/store/use_auth_store";
import {
  usePermissionsStore,
  type Resource,
} from "~/store/v2/use-permissions-store";
import { Skeleton } from "~/components/ui/skeleton";

/**
 * Map a `/portal/...` pathname to its RBAC resource.
 * Returns `null` for paths with no backend `requirePermission` counterpart
 * (users / user-roles) — those render ungated and are flagged in the
 * permissions audit rather than gated against a resource that doesn't exist.
 */
export function resourceForPortalPath(pathname: string): Resource | null {
  const seg = pathname.replace(/^\/portal\/?/, "");
  if (!seg || seg === "/") return null; // /portal welcome page: authenticated only
  if (seg.startsWith("anals")) return "analytics";
  if (seg.startsWith("orders")) return "orders";
  if (seg.startsWith("products")) return "products";
  if (seg.startsWith("reviews")) return "reviews";
  if (seg.startsWith("survey")) return "feedback";
  if (seg.startsWith("shipping")) return "shipping";
  if (seg.startsWith("audit")) return "audit";
  return null;
}

interface ProtectedRouteProps {
  resource: Resource;
  children: React.ReactNode;
}

/**
 * Gate a full page on `can(resource, "see")`.
 * - Unauthenticated → login (`/`).
 * - Permissions not yet loaded → skeleton (no premature redirect/flash).
 * - Denied → inline 403 with a back link (no redirect loop).
 */
export function ProtectedRoute({ resource, children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const loaded = usePermissionsStore((s) => s.loaded);
  const granted = usePermissionsStore(
    (s) => s.permissions[resource]?.["see"] ?? false,
  );

  // Session hydration resolves synchronously from localStorage, so after
  // `hasHydrated` an unauthenticated user can redirect immediately without
  // waiting for permissions (which are only fetched for valid sessions —
  // otherwise `loaded` would never resolve here). Authenticated users wait
  // for `loaded` so refresh never flashes a redirect or a 403.
  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-3 p-4" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!loaded) {
    return (
      <div className="flex flex-col gap-3 p-4" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!granted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold">No access</h1>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to view this section. Contact your
          administrator if you need access.
        </p>
        <a href="/portal" className="text-sm underline underline-offset-4">
          Back to dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
