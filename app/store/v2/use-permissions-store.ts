// src/lib/permissions-store.ts
import { api } from "@/app/lib/axios_v2";
import { create } from "zustand";

export type Resource =
  | "orders"
  | "analytics"
  | "products"
  | "feedback"
  | "reviews"
  | "shipping"
  | "audit";
export type Action = "see" | "edit" | "delete";
export type PermissionsMap = Partial<Record<Resource, Record<Action, boolean>>>;

interface Role {
  id: number;
  name: string;
}

interface PermissionsState {
  permissions: PermissionsMap;
  roles: Role[];
  loaded: boolean;
  rolesLoaded: boolean;
  error: string | null;
  /** Full `{ [roleId]: PermissionsMap }` matrix for the admin editor. */
  matrix: Record<number, PermissionsMap>;
  matrixLoaded: boolean;

  fetchPermissions: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchMatrix: () => Promise<void>;
  updateRolePermissions: (
    roleId: number,
    matrix: PermissionsMap,
  ) => Promise<boolean>;
  can: (resource: Resource, action: Action) => boolean;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissions: {},
  roles: [],
  loaded: false,
  rolesLoaded: false,
  error: null,
  matrix: {},
  matrixLoaded: false,

  fetchPermissions: async () => {
    try {
      const res = await api.get("permissions/me");
      set({ permissions: res.data, loaded: true });
    } catch {
      set({ permissions: {}, loaded: true });
    }
  },

  fetchRoles: async () => {
    try {
      const res = await api.get("permissions/roles");
      set({ roles: res.data, rolesLoaded: true, error: null });
    } catch {
      set({ error: "Failed to load roles", rolesLoaded: true });
    }
  },

  fetchMatrix: async () => {
    try {
      const res = await api.get("permissions/matrix");
      set({ matrix: res.data, matrixLoaded: true, error: null });
    } catch {
      set({ error: "Failed to load role permissions", matrixLoaded: true });
    }
  },

  updateRolePermissions: async (roleId, matrix) => {
    try {
      const res = await api.put(`permissions/roles/${roleId}`, {
        permissions: matrix,
      });
      set((s) => ({
        matrix: { ...s.matrix, [roleId]: res.data.permissions },
        error: null,
      }));
      return true;
    } catch {
      set({ error: "Failed to save role permissions" });
      return false;
    }
  },

  can: (resource, action) => {
    return get().permissions[resource]?.[action] ?? false;
  },
}));
