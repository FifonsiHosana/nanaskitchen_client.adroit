import { create } from "zustand"
import { api } from "~/lib/axios"

export type ReviewStatus = "pending" | "approved" | "rejected"

export interface Review {
  id: string
  customerName: string
  productName: string
  productImage?: string
  rating: number
  comment: string
  status: ReviewStatus
  date: string
}

interface ReviewStats {
  pending: number
  approved: number
  rejected: number
  total: number
  avgRating: number
}

interface ReviewStore {
  reviews: Review[]
  stats: ReviewStats
  isLoading: boolean
  currentStatus: ReviewStatus | "all"
  isActionLoading: string | null
  error: string | null
  searchQuery: string

  fetchReviews: (status?: ReviewStatus | "all") => Promise<void>
  approveReview: (id: string) => Promise<void>
  rejectReview: (id: string) => Promise<void>
  setSearch: (q: string) => void
}

function computeStats(reviews: Review[]): ReviewStats {
  const pending = reviews.filter((r) => r.status === "pending").length
  const approved = reviews.filter((r) => r.status === "approved").length
  const rejected = reviews.filter((r) => r.status === "rejected").length
  const total = reviews.length
  const avgRating =
    total > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) /
        10
      : 0
  return { pending, approved, rejected, total, avgRating }
}

// Map API response shape → Review shape
// API returns: { sourceId, productName, productImage, name, comment, status, rating, date }
function mapApiReview(raw: any): Review {
  return {
    id: raw.sourceId ?? raw.id,
    customerName: raw.name ?? raw.customerName ?? "Anonymous",
    productName: raw.productName,
    productImage: raw.productImage,
    rating: raw.rating,
    comment: raw.comment ?? raw.body ?? "",
    status: raw.status,
    date: raw.date ?? raw.createdAt,
  }
}

export const useReviewsStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  stats: { pending: 0, approved: 0, rejected: 0, total: 0, avgRating: 0 },
  isLoading: false,
  isActionLoading: null,
  error: null,
  searchQuery: "",
  currentStatus:`all`,

  fetchReviews: async (status = "all") => {
    set({ isLoading: true, error: null })
    try {
      const params = status !== "all" ? { status } : {}
      const res = await api.get("/reviews", { params })
      const statRes = await api.get("/reviews")
      const reviewsStats: Review[] = (statRes.data as any[]).map(mapApiReview)
      const reviews: Review[] = (res.data as any[]).map(mapApiReview)
      set({ reviews, stats: computeStats(reviewsStats), isLoading: false ,currentStatus:status})
    } catch {
      set({ error: "Failed to load reviews", isLoading: false })
    }
  },

  approveReview: async (id) => {
    set({ isActionLoading: id })
    try {
      await api.patch(`/reviews/${id}/approve`)
      // const statRes = await api.get("/reviews")
      // const reviewsStats: Review[] = (statRes.data as any[]).map(mapApiReview)

      set((state) => {
        const reviews = state.reviews.map((r) =>
          r.id === id ? { ...r, status: "approved" as ReviewStatus } : r
        )
        get().fetchReviews(get().currentStatus)
        return { reviews, isActionLoading: null }
      })
    } catch {
      set({ isActionLoading: null })
    }
  },

  rejectReview: async (id) => {
    set({ isActionLoading: id })
          // const statRes = await api.get("/reviews")
          // const reviewsStats: Review[] = (statRes.data as any[]).map(
          //   mapApiReview
          // )
    try {
      await api.patch(`/reviews/${id}/reject`)
      set((state) => {
        const reviews = state.reviews.map((r) =>
          r.id === id ? { ...r, status: "rejected" as ReviewStatus } : r
        )
        get().fetchReviews(get().currentStatus)
        return { reviews, isActionLoading: null }
      })
    } catch {
      set({ isActionLoading: null })
    }
  },

  setSearch: (q) => set({ searchQuery: q }),
}))
