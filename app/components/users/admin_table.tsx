import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { Field, FieldLabel } from "~/components/ui/field";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/app/store/use_admin_store";
import { Skeleton } from "~/components/ui/skeleton";

interface AdminRow {
  id: number;
  name: string | null;
  email: string;
  roleName: string | null;
  createdAt: string;
}

function EditAdminDialog({ admin }: { admin: AdminRow }) {
  const { updateAdmin, isLoading } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(admin.name ?? "");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Reset fields every time the dialog opens for a (possibly different) row.
  useEffect(() => {
    if (open) {
      setName(admin.name ?? "");
      setPassword("");
      setFormError(null);
    }
  }, [open, admin]);

  async function handleSave() {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setFormError("Name must be at least 2 characters.");
      return;
    }
    if (password.trim().length > 0 && password.trim().length < 6) {
      setFormError("New password must be at least 6 characters.");
      return;
    }
    // No-op guard: nothing changed.
    if (
      trimmedName === (admin.name ?? "") &&
      password.trim().length === 0
    ) {
      setOpen(false);
      return;
    }

    setFormError(null);
    const payload: { name?: string; password?: string } = {};
    if (trimmedName !== (admin.name ?? "")) payload.name = trimmedName;
    if (password.trim().length > 0) payload.password = password.trim();

    const ok = await updateAdmin(admin.id, payload);
    if (!ok) {
      setFormError(
        useAdminStore.getState().error ?? "Failed to update admin.",
      );
      return;
    }
    toast.success(`Updated ${admin.email}`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 cursor-pointer">
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit {admin.email}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Change the display name and/or set a new password for{" "}
            <span className="font-medium text-foreground">{admin.email}</span>.
            Leave the password blank to keep the current one.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-1">
          <Field>
            <FieldLabel htmlFor={`admin-name-${admin.id}`}>Name</FieldLabel>
            <Input
              id={`admin-name-${admin.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="h-11"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`admin-password-${admin.id}`}>
              New password
            </FieldLabel>
            <Input
              id={`admin-password-${admin.id}`}
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current ••••••"
              className="h-11"
            />
          </Field>
          {formError && (
            <p className="text-sm font-medium text-destructive">{formError}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAdminDialog({ admin }: { admin: AdminRow }) {
  const { deleteAdmin } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const ok = await deleteAdmin(admin.id);
    setDeleting(false);
    if (!ok) {
      toast.error(
        useAdminStore.getState().error ?? "Failed to delete admin.",
      );
      return;
    }
    toast.success(`Deleted ${admin.email}`);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="h-8 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete {admin.email}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes{" "}
            <span className="font-medium text-foreground">
              {admin.name ?? admin.email} ({admin.email})
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AdminsTable() {
  const { admins, isLoading, error, fetchAdmins } = useAdminStore();

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  if (isLoading && admins.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-3 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-20" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-9 rounded-md" />
                  <Skeleton className="h-8 w-9 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (error && admins.length === 0) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <>
      {error && <p className="pb-2 text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  {admin.name ?? "—"}
                </TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.roleName ?? "—"}</TableCell>
                <TableCell>
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <EditAdminDialog admin={admin} />
                    <DeleteAdminDialog admin={admin} />
                  </div>
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
