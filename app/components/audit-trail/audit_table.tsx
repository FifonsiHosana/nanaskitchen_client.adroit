import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import PaginationOrders from "../pagination";
import { useEffect } from "react";
import { useAuditStore } from "@/app/store/v2/use-audit-log-store";
import { useAuditParams } from "@/app/lib/useAuditParams";
import { AuditActionBadge } from "./audit_badge";
import { Skeleton } from "~/components/ui/skeleton";

export function AuditTable() {
  const navigate = useNavigate();
  const { params } = useAuditParams();
  const { logs, totalPages, isLoading, error, fetchLogs } = useAuditStore();

  useEffect(() => {
    fetchLogs(params.page, params.pageSize);
  }, [params.page, params.pageSize]);

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && logs.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={`audit-loading-${i}`}>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-28" />
                </TableCell>
              </TableRow>
            ))
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-muted-foreground"
              >
                {error ?? "No audit logs found."}
              </TableCell>
            </TableRow>
          ) : (
            logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  <AuditActionBadge action={log.action} />
                </TableCell>
                <TableCell>{log.adminName ?? "Unknown"}</TableCell>
                <TableCell>{log.resourceId ?? "—"}</TableCell>
                <TableCell>{log.statusCode}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <PaginationOrders
        currentPage={params.page}
        currentTable="audit"
        totalPages={totalPages}
      />
    </div>
  );
}
