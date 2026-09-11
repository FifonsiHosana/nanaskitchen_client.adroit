import { create } from "zustand"
import { api } from "~/lib/axios"
import { toast } from "sonner"

interface Customer {
  name: string
  email: string
  phone: string
  country: string
}

interface FeedbackRecord {
  id: number
  orderId: number
  customer: Customer
  attribution: string[]
  preferences: string[]
}

export interface SummaryItem {
  label: string
  count: number
  percentage: number
}

export interface Summary {
  totalResponses: number
  topChannel: string | null
  topPreference: string | null
  howTheyHeardAboutUs: SummaryItem[]
  whatTheyLike: SummaryItem[]
}

export interface AnswerBreakdown {
  answer: string
  count: number
}

export interface QuestionAnalytics {
  questionId: number
  question: string
  questionType: "rating" | "comment" | "yes_no"
  totalAnswers: number
  breakdown: AnswerBreakdown[]
}

export interface FeedbackQuestion {
  id: number
  question: string
  questionType: "rating" | "comment" | "yes_no"
  isActive: boolean
  createdAt: string
  answerCount: number
}

interface FeedbackParams {
  country?: string
  page?: number
  pageSize?: number
  period?: string
  from?: string
  to?: string
  pricingGroup?: string
}

interface FeedbackStore {
  summary: Summary | null
  data: FeedbackRecord[]
  loading: boolean
  error: string | null
  totalCount: number | null
  fetchFeedback: (params?: FeedbackParams) => Promise<void>

  // Answers analytics
  answersData: QuestionAnalytics[]
  answersLoading: boolean
  fetchAnswersAnalytics: () => Promise<void>
}

interface FeedbackQuestionsStore {
  questions: FeedbackQuestion[]
  loading: boolean
  fetchQuestions: () => Promise<void>
  createQuestion: (question: string, questionType: FeedbackQuestion["questionType"]) => Promise<boolean>
  toggleActive: (id: number, isActive: boolean) => Promise<void>
  deleteQuestion: (id: number) => Promise<void>
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  summary: null,
  data: [],
  loading: false,
  error: null,
  totalCount: null,
  answersData: [],
  answersLoading: false,

  fetchFeedback: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/analytics/customer/feedback", { params })
      set({
        summary: res.data.summary,
        data: res.data.data,
        totalCount: res.data.total,
      })
    } catch (err) {
      set({ error: "Failed to load customer feedback" })
    } finally {
      set({ loading: false })
    }
  },

  fetchAnswersAnalytics: async () => {
    set({ answersLoading: true })
    try {
      const res = await api.get("/analytics/customer/feedback-answers")
      set({ answersData: res.data.data })
    } catch {
      // silently fail — no active questions is a valid state
    } finally {
      set({ answersLoading: false })
    }
  },
}))

export const useFeedbackQuestionsStore = create<FeedbackQuestionsStore>((set, get) => ({
  questions: [],
  loading: false,

  fetchQuestions: async () => {
    set({ loading: true })
    try {
      const res = await api.get("/analytics/feedback-questions")
      set({ questions: res.data.data })
    } finally {
      set({ loading: false })
    }
  },

  createQuestion: async (question, questionType) => {
    try {
      await api.post("/analytics/feedback-questions", { question, questionType })
      await get().fetchQuestions()
      toast.success("Question created")
      return true
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to create question")
      return false
    }
  },

  toggleActive: async (id, isActive) => {
    // Optimistic update
    set((s) => ({
      questions: s.questions.map((q) => (q.id === id ? { ...q, isActive } : q)),
    }))
    try {
      await api.patch(`/analytics/feedback-questions/${id}`, { isActive })
    } catch {
      // Revert
      set((s) => ({
        questions: s.questions.map((q) => (q.id === id ? { ...q, isActive: !isActive } : q)),
      }))
      toast.error("Failed to update question")
    }
  },

  deleteQuestion: async (id) => {
    try {
      await api.delete(`/analytics/feedback-questions/${id}`)
      set((s) => ({ questions: s.questions.filter((q) => q.id !== id) }))
      toast.success("Question deleted")
    } catch {
      toast.error("Failed to delete question")
    }
  },
}))
