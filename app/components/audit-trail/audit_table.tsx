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

export function AuditTable() {
  const navigate = useNavigate();
  const { params } = useAuditParams();
  const { logs, totalPages, isLoading, error, fetchLogs } = useAuditStore();

  useEffect(() => {
    fetchLogs(params.page, params.pageSize);
  }, [params.page, params.pageSize]);

  return (
    <>
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
          {isLoading && <p className="text-center">Loading...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {logs?.map((log) => (
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
          ))}
        </TableBody>
      </Table>
      <PaginationOrders
        currentPage={params.page}
        currentTable="audit"
        totalPages={totalPages}
      />
    </>
  );
}
