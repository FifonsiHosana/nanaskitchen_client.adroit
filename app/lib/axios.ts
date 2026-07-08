import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASEURL_LOCAL

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// Separate instance for refresh — bypasses the interceptor entirely
const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed to send the httpOnly refresh cookie
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error: Error) => Promise.reject(error)
)

let isRefreshing = false
let queue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (newToken: string) => {
  queue.forEach(({ resolve }) => resolve(newToken))
  queue = []
}

const rejectQueue = (error: unknown) => {
  queue.forEach(({ reject }) => reject(error))
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // Mark immediately to prevent other 401s racing through
    original._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      const { data } = await authApi.post("/auth/refresh")

      const newToken = data.accessToken
      localStorage.setItem("userToken", newToken)
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`
      processQueue(newToken)
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch (refreshError) {
      rejectQueue(refreshError)
      localStorage.removeItem("userToken")
      window.location.href = "/"
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
