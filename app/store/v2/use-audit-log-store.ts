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
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchLogs: (page?: number, pageSize?: number) => Promise<void>;
}

let requestId = 0;

export const useAuditStore = create<AuditStore>((set) => ({
  logs: [],
  totalCount: 0,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchLogs: async (page = 1, pageSize = 25) => {
    const current = ++requestId;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/audit-logs", {
        params: { page, pageSize },
      });
      // Ignore stale responses from earlier page requests.
      if (current !== requestId) return;
      const totalCount = Number(response.data.total ?? 0);
      const serverTotalPages = Number(response.data.totalPages);
      const effectivePageSize = Number(response.data.pageSize ?? pageSize);
      const totalPages = Number.isFinite(serverTotalPages)
        ? Math.max(1, serverTotalPages)
        : Math.max(1, Math.ceil(totalCount / (effectivePageSize || 1)));
      set({
        logs: response.data.logs ?? [],
        totalCount,
        totalPages,
        isLoading: false,
      });
    } catch {
      if (current !== requestId) return;
      set({ error: "Failed to load audit logs", isLoading: false });
    }
  },
}));
