import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import { Check, Edit, Trash } from "lucide-react"

export function DeliveryLocationRowActions({
  isEditing,
  isDirty,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: {
  isEditing: boolean
  isDirty: boolean
  onSave: () => void
  onCancel: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  if (isEditing) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-8 w-8 rounded border",
            isDirty
              ? "border-green-500 text-green-600 hover:bg-green-50"
              : "cursor-not-allowed opacity-40"
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
    )
  }

  return (
    <>
      <Button type="button" variant="outline" className="h-8 w-8 rounded" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button type="button" variant="destructive" className="h-8 w-8 rounded" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </>
  )
}
