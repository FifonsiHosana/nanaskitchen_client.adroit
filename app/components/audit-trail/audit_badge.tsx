import { getAuditActionConfig } from "@/app/lib/audit-utils";
import { cn } from "@/app/lib/utils";

const COLOR_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  red: "bg-red-50 text-red-700 border-red-200",
  gray: "bg-gray-50 text-gray-700 border-gray-200",
};

export function AuditActionBadge({ action }: { action: string }) {
  const { label, color, icon: Icon } = getAuditActionConfig(action);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-bold",
        COLOR_CLASSES[color] ?? COLOR_CLASSES.gray,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
