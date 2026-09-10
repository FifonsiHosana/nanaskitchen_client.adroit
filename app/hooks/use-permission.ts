import {
  usePermissionsStore,
  type Action,
  type Resource,
} from "~/store/v2/use-permissions-store";

/**
 * Component-level permission check subscribed to `usePermissionsStore`.
 * Returns `loaded && permissions[resource]?.[action]`.
 * Matches the store's `can()` semantics without drifting from it.
 */
export function usePermission(resource: Resource, action: Action) {
  const loaded = usePermissionsStore((s) => s.loaded);
  const granted = usePermissionsStore(
    (s) => s.permissions[resource]?.[action] ?? false,
  );
  return { allowed: loaded && granted, loaded };
}
