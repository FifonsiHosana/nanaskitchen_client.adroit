import { api } from "@/app/lib/axios_v2";
import { create } from "zustand";

interface AuditLog {
  id: number;
  action: string;
  resourceId: string | null;
  statusCode: number;
  createdAt: string;
  adminName: string | null;
  adminEmail: string | null;
}

interface AuditStore {
  logs: AuditLog[];
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchLogs: (page?: number, pageSize?: number) => Promise<void>;
}

export const useAuditStore = create<AuditStore>((set) => ({
  logs: [],
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchLogs: async (page, pageSize) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/audit-logs", {
        params: { page, pageSize },
      });
      set({
        logs: response.data.logs,
        totalPages: response.data.totalPages,
        isLoading: false,
      });
    } catch {
      set({ error: "Failed to load audit logs", isLoading: false });
    }
  },
}));


