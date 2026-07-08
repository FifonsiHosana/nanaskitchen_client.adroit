import { create } from "zustand"
import { api } from "~/lib/axios"

interface Admin {
  name: string
  email: string
} //change user to admin

interface AuthStore {
  admin: Admin | null
  accessToken: string | null
  isLoading: boolean
  error: string | null

  loginUser: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  accessToken: null,
  isLoading: false,
  error: null,

  loginUser: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post("/auth/login", credentials)
      const { user, accessToken } = response.data

      if (!user || !accessToken) {
        throw new Error("Invalid response structure from server")
      }

      localStorage.setItem("userInfo", JSON.stringify(user))
      localStorage.setItem("userToken", accessToken)

      set({ admin: user, accessToken, isLoading: false })
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      })
    }
  },

  logout: () => {
    localStorage.removeItem("userInfo")
    localStorage.removeItem("userToken")
    set({ admin: null, accessToken: null })
    window.location.href = "/"
  },
}))
