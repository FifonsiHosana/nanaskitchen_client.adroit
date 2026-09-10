import { useAuthStore } from "~/store/use_auth_store";
import { usePermissionsStore } from "~/store/v2/use-permissions-store";
import { getUserInfo } from "~/lib/storage";

/**
 * True when the current user belongs to the `admin` role. Role names come
 * from the backend roles list (single source of truth) — only the well-known
 * `admin` role name is matched, never a hardcoded permission matrix.
 * The real enforcement lives in the backend `requireAdmin` middleware; this
 * hook only decides whether to show admin UI.
 */
export function useIsAdmin() {
  const admin = useAuthStore((s) => s.admin);
  const roles = usePermissionsStore((s) => s.roles);
  const rolesLoaded = usePermissionsStore((s) => s.rolesLoaded);
  const storedRoleId = (getUserInfo() as { roleId?: number } | null)?.roleId;
  const roleId = admin?.roleId ?? storedRoleId ?? null;
  const isAdmin =
    rolesLoaded &&
    roleId != null &&
    roles.some((r) => r.id === roleId && r.name === "admin");
  return { isAdmin, loaded: rolesLoaded };
}
