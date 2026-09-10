import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "~/store/use_auth_store";
import { usePermissionsStore } from "~/store/v2/use-permissions-store";
import { useIsAdmin } from "~/hooks/use-is-admin";
import { Skeleton } from "~/components/ui/skeleton";

/** Portal paths only admins may open. Kept explicit: these pages have no
 *  backend `requirePermission` resource, so `resourceForPortalPath` can't
 *  cover them — the backend `requireAdmin` middleware is the real guard. */
export function isAdminOnlyPath(pathname: string) {
  return pathname.startsWith("/portal/roles-permissions");
}

/**
 * Gate a page on admin role.
 * - Session/roles not yet resolved → skeleton (no premature redirect/flash).
 * - Unauthenticated → login (`/`).
 * - Non-admin → inline 403 (no redirect loop).
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const rolesLoaded = usePermissionsStore((s) => s.rolesLoaded);
  const fetchRoles = usePermissionsStore((s) => s.fetchRoles);
  const { isAdmin, loaded } = useIsAdmin();

  useEffect(() => {
    if (isAuthenticated && !rolesLoaded) fetchRoles();
  }, [isAuthenticated, rolesLoaded, fetchRoles]);

  if (!hasHydrated || !loaded) {
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

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold">Admins only</h1>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to manage roles. Contact your
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
