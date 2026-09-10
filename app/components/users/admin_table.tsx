import { useEffect } from "react";
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
import { useAdminStore } from "@/app/store/use_admin_store";
// adjust to your actual path

export function AdminsTable() {
  const navigate = useNavigate();
  const { admins, isLoading, error, fetchAdmins } = useAdminStore();

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading admins...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <TableRow
                key={admin.id}
                // onClick={() => navigate(`/portal/users/${admin.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {admin.name ?? "—"}
                </TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.roleName ?? "—"}</TableCell>
                <TableCell>
                  {new Date(admin.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No admins found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <PaginationOrders /> */}
    </>
  );
}
