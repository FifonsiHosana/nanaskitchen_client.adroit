import type { ReactNode } from "react";
import { usePermission } from "~/hooks/use-permission";
import type { Action, Resource } from "~/store/v2/use-permissions-store";

interface CanProps {
  resource: Resource;
  action: Action;
  children: ReactNode;
  /** Rendered while permissions are loading or when denied. Defaults to null (omit). */
  fallback?: ReactNode;
}

/**
 * Omit `children` entirely unless `loaded && can(resource, action)`.
 * Prefer omission over disabling so view-only users never see a button
 * that would 403. Pass `fallback` only for loading skeletons.
 */
export function Can({ resource, action, children, fallback = null }: CanProps) {
  const { allowed, loaded } = usePermission(resource, action);
  if (!loaded) return <>{fallback}</>;
  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
