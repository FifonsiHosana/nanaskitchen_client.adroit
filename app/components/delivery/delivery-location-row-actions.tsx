import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Check, Edit, Trash } from "lucide-react";
import { usePermission } from "../../hooks/use-permission";

export function DeliveryLocationRowActions({
  isEditing,
  isDirty,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: {
  isEditing: boolean;
  isDirty: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // PUT /shipping/delivery-locations/:id → shipping/edit,
  // DELETE /shipping/delivery-locations/:id → shipping/delete.
  // Gated controls are omitted (never flashed) until permissions resolve.
  const { allowed: canEdit, loaded: editLoaded } = usePermission(
    "shipping",
    "edit",
  );
  const { allowed: canDelete, loaded: deleteLoaded } = usePermission(
    "shipping",
    "delete",
  );
  const permsLoaded = editLoaded && deleteLoaded;

  if (!permsLoaded) return null;

  if (isEditing) {
    // Without edit there is no way to enter edit mode, so a view-only user
    // only ever sees Cancel here — render nothing instead of a lone Cancel.
    if (!canEdit) return null;
    return (
      <>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-8 w-8 rounded border",
            isDirty
              ? "border-green-500 text-green-600 hover:bg-green-50"
              : "cursor-not-allowed opacity-40",
          )}
          disabled={!isDirty}
          onClick={onSave}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-8 w-8 rounded text-xs text-muted-foreground"
          onClick={onCancel}
        >
          ✕
        </Button>
      </>
    );
  }

  if (!canEdit && !canDelete) return null;

  return (
    <>
      {canEdit && (
        <Button
          type="button"
          variant="outline"
          className="h-8 w-8 rounded"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {canDelete && (
        <Button
          type="button"
          variant="destructive"
          className="h-8 w-8 rounded"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
