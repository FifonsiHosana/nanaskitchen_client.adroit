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
      set({ admins: response.data.admins, isLoading: false });
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

  clearError: () => set({ error: null }),
}));
