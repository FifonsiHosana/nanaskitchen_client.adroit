import { create } from "zustand";
import axios from "axios";
import { api } from "../lib/axios_v2";

interface Admin {
  id: number;
  name: string | null;
  email: string;
  roleName: string | null;
  createdAt: string;
}

interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

interface AdminStore {
  admins: Admin[];
  isLoading: boolean;
  error: string | null;
  fetchAdmins: () => Promise<void>;
  createAdmin: (data: CreateAdminPayload) => Promise<boolean>;
  updateAdmin: (
    id: number,
    data: { name?: string; password?: string },
  ) => Promise<boolean>;
  deleteAdmin: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  admins: [],
  isLoading: false,
  error: null,

  fetchAdmins: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/user/admin");
      const raw: Array<Admin & { adminId?: number }> =
        response.data.admins ?? [];
      // Backend historically returned `adminId`; normalize to `id`.
      const admins = raw.map((a) => ({
        id: a.id ?? a.adminId ?? 0,
        name: a.name,
        email: a.email,
        roleName: a.roleName,
        createdAt: a.createdAt,
      }));
      set({ admins, isLoading: false });
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch admins";
      set({ error: message, isLoading: false });
    }
  },

  createAdmin: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/user/admin", data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create admin";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateAdmin: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/user/admin/${id}`, data);
      // Refresh the list so the table shows the new name immediately.
      const response = await api.get("/user/admin");
      const raw: Array<Admin & { adminId?: number }> =
        response.data.admins ?? [];
      const admins = raw.map((a) => ({
        id: a.id ?? a.adminId ?? 0,
        name: a.name,
        email: a.email,
        roleName: a.roleName,
        createdAt: a.createdAt,
      }));
      set({ admins, isLoading: false });
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update admin";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteAdmin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/user/admin/${id}`);
      set((state) => ({
        admins: state.admins.filter((a) => a.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete admin";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
