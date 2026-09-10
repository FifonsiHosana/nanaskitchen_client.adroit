import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";
import { Spinner } from "@/app/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  usePermissionsStore,
  type Action,
  type PermissionsMap,
  type Resource,
} from "@/app/store/v2/use-permissions-store";
import { useAuthStore } from "@/app/store/use_auth_store";
import { getUserInfo } from "@/app/lib/storage";
import { capitalizeFirstOnly, cn } from "@/app/lib/utils";

const ACTIONS: { key: Action; label: string }[] = [
  { key: "see", label: "See" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

function emptyFlags() {
  return { see: false, edit: false, delete: false };
}

/**
 * Admin-only role × permission editor (route itself is wrapped in
 * `AdminRoute`; the backend `requireAdmin` middleware enforces for real).
 * Resources render from fetched data — never a hardcoded list — so the
 * editor can't drift from what the backend actually stores.
 */
export default function RolesPermissionsPage() {
  const {
    roles,
    rolesLoaded,
    matrix,
    matrixLoaded,
    error,
    fetchRoles,
    fetchMatrix,
    fetchPermissions,
    updateRolePermissions,
  } = usePermissionsStore();
  const myRoleId =
    useAuthStore((s) => s.admin)?.roleId ??
    (getUserInfo() as { roleId?: number } | null)?.roleId ??
    null;

  const [selected, setSelected] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<number, PermissionsMap>>({});
  const [draftReady, setDraftReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!rolesLoaded) fetchRoles();
    if (!matrixLoaded) fetchMatrix();
  }, [rolesLoaded, matrixLoaded, fetchRoles, fetchMatrix]);

  useEffect(() => {
    if (rolesLoaded && matrixLoaded && !draftReady) {
      setDraft(structuredClone(matrix));
      setSelected((prev) => prev ?? roles[0]?.id ?? null);
      setDraftReady(true);
    }
  }, [rolesLoaded, matrixLoaded, draftReady, matrix, roles]);

  // Union of resources present in stored data, in first-seen order.
  const resources = useMemo(() => {
    const seen: Resource[] = [];
    for (const perms of Object.values(matrix)) {
      for (const r of Object.keys(perms) as Resource[]) {
        if (!seen.includes(r)) seen.push(r);
      }
    }
    return seen;
  }, [matrix]);

  if (!rolesLoaded || !matrixLoaded || !draftReady) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        <Spinner />
      </p>
    );
  }

  if (roles.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No roles found.
      </p>
    );
  }

  const roleId = selected ?? roles[0]!.id;
  const roleName = roles.find((r) => r.id === roleId)?.name ?? "";
  const roleDraft: PermissionsMap = draft[roleId] ?? {};
  const saved: PermissionsMap = matrix[roleId] ?? {};
  const isDirty = JSON.stringify(roleDraft) !== JSON.stringify(saved);

  function toggle(resource: Resource, action: Action, checked: boolean) {
    setDraft((prev) => {
      const current = { ...emptyFlags(), ...prev[roleId]?.[resource] };
      const next = { ...current, [action]: checked };
      // Keep the matrix meaningful: edit/delete imply see, and revoking
      // see clears edit/delete (the backend stores them independently).
      if ((action === "edit" || action === "delete") && checked)
        next.see = true;
      if (action === "see" && !checked) {
        next.edit = false;
        next.delete = false;
      }
      return { ...prev, [roleId]: { ...prev[roleId], [resource]: next } };
    });
  }

  function handleReset() {
    setDraft((prev) => ({ ...prev, [roleId]: structuredClone(saved) }));
  }

  async function handleSave() {
    setSaving(true);
    const ok = await updateRolePermissions(roleId, roleDraft);
    setSaving(false);
    if (!ok) {
      toast.error("Failed to save permissions");
      return;
    }
    toast.success(`Permissions saved for ${roleName}`);
    // Rebase the draft on the fresh server state (normalizes key order).
    setDraft((prev) => ({
      ...prev,
      [roleId]: structuredClone(
        usePermissionsStore.getState().matrix[roleId] ?? {},
      ),
    }));
    // Editing your own role takes effect immediately in this session.
    if (myRoleId != null && roleId === myRoleId) {
      await fetchPermissions();
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" />
        <h2 className="text-2xl font-semibold">Roles & Permissions</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Toggle what each role can see, edit, or delete. Changes apply on save.
      </p> */}

      <Tabs
        value={String(roleId)}
        onValueChange={(v) => setSelected(Number(v))}
      >
        <TabsList>
          {roles.map((role) => (
            <TabsTrigger
              key={role.id}
              value={String(role.id)}
              className="uppercase"
            >
              {role.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {resources.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No permission rows stored yet for any role.
        </p>
      ) : (
        <Card className="p-1">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-full">Resource</TableHead>
                {ACTIONS.map((a) => (
                  <TableHead key={a.key} className="text-center">
                    {a.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow
                  key={resource}
                  data-state={
                    selectedRowId === resource ? "selected" : undefined
                  }
                  onClick={() =>
                    setSelectedRowId((prev) =>
                      prev === resource ? undefined : resource,
                    )
                  }
                >
                  <TableCell
                    className={cn(
                      selectedRowId === resource &&
                        "border-blue-300 border ring-blue-400",
                    )}
                  >
                    {capitalizeFirstOnly(resource)}
                  </TableCell>
                  {ACTIONS.map((a) => (
                    <TableCell key={a.key} className="text-center">
                      <Switch
                        checked={
                          roleDraft[resource]?.[a.key] ??
                          saved[resource]?.[a.key] ??
                          false
                        }
                        onCheckedChange={(checked) =>
                          toggle(resource, a.key, checked)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={!isDirty || saving}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          className="bg-new cursor-pointer"
          disabled={!isDirty || saving}
          onClick={handleSave}
        >
          {saving ? "Saving…" : "Save permissions"}
        </Button>
      </div>
    </div>
  );
}
