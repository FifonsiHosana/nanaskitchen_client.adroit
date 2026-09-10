import axios from "axios";
import { create } from "zustand";
import { api } from "~/lib/axios";

interface Admin {
  name: string;
  email: string;
  roleId: number | null;
}

interface AuthStore {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** True once `hydrate()` has run (even with no session). Guards must wait
   *  for this before redirecting, or a refresh kicks out valid sessions. */
  hasHydrated: boolean;

  loginUser: (credentials: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasHydrated: false,

  loginUser: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", credentials);
      const { user, accessToken } = response.data;

      if (!user || !accessToken) {
        throw new Error("Invalid response structure from server");
      }

      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("userToken", accessToken);

      set({
        admin: user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Login failed";

      set({ error: message, isLoading: false, isAuthenticated: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    set({ admin: null, accessToken: null, isAuthenticated: false });
    window.location.href = "/";
  },

  hydrate: () => {
    const token = localStorage.getItem("userToken");
    const rawAdmin = localStorage.getItem("userInfo");

    if (!token || !rawAdmin) {
      set({ hasHydrated: true });
      return;
    }

    try {
      const admin: Admin = JSON.parse(rawAdmin);
      set({
        admin,
        accessToken: token,
        isAuthenticated: true,
        hasHydrated: true,
      });
    } catch {
      // corrupted localStorage — treat as logged out
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      set({ hasHydrated: true });
    }
  },
}));
