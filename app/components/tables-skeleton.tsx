import { Skeleton } from "~/components/ui/skeleton";
import { Card } from "~/components/ui/card";

function PaginationSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <Skeleton className="h-3 w-32" />
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  );
}

// ─── Users (AdminsTable + users.tsx) ─────────────────────────────────────────
// Layout: Create button (self-end) + Card max-w-4xl with
// Name | Email | Role | Created | Actions.
export function UsersTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex animate-pulse flex-col items-center justify-start gap-4 p-4">
      <Skeleton className="h-9 w-32 self-end rounded-md" />
      <Card className="w-full max-w-4xl p-4">
        <div className="flex items-center gap-2 border-b px-2 py-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-2 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-9 rounded-md" />
              <Skeleton className="h-8 w-9 rounded-md" />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Audit trail (audit.tsx + AuditTable) ────────────────────────────────────
// Layout: Card max-w-4xl with Action | Admin | Resource | Status | Date.
export function AuditTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="flex animate-pulse flex-col items-center justify-start gap-4 p-4">
      <Card className="w-full max-w-4xl p-4">
        <div className="flex items-center gap-2 border-b px-2 py-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="ml-auto h-3 w-28" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-2 py-3 last:border-0"
          >
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="ml-auto h-3 w-28" />
          </div>
        ))}
        <PaginationSkeleton />
      </Card>
    </div>
  );
}

// ─── User roles (user-roles-all.tsx) ─────────────────────────────────────────
// Layout: Table with User Role | Actions (Edit + Delete).
export function RolesTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse p-4">
      <div className="overflow-hidden rounded-lg border">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mx-auto h-3 w-16" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-32" />
            <div className="mx-auto flex gap-2">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Roles & permissions (roles-permissions.tsx) ─────────────────────────────
// Layout: Tabs + Card table Resource | See | Edit | Delete + Reset/Save.
export function RolesPermissionsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <Card className="p-1">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="ml-auto h-3 w-10" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-12" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="ml-auto h-5 w-9 rounded-full" />
            <Skeleton className="h-5 w-9 rounded-full" />
            <Skeleton className="h-5 w-9 rounded-full" />
          </div>
        ))}
      </Card>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
    </div>
  );
}

// ─── Flavors (products-flavors.tsx) ──────────────────────────────────────────
// Layout: Add buttons (justify-end) + bordered table Image | Title | Actions.
export function FlavorsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="relative mt-4 overflow-hidden rounded-lg border p-2">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-3 py-2.5 last:border-0"
          >
            <Skeleton className="h-15 w-15 rounded-md" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="ml-auto h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shipping countries (shipping-countries.tsx) ─────────────────────────────
// Layout: Add button (justify-end) + Card table
// Flag | Country | Country Code | Currency | Currency Code.
export function CountriesTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <Card className="py-0">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Skeleton className="mx-auto h-3 w-10" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="mx-auto h-8 w-8 rounded-full" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Delivery locations (shipping-delivery-locations.tsx) ────────────────────
// Layout: Add button + Card with search input + table
// Location | Price | Discount % | Free Delivery | Actions + pagination.
export function DeliveryLocationsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse p-4">
      <div className="flex justify-end pb-3">
        <Skeleton className="h-9 w-44 rounded-md" />
      </div>
      <Card className="relative w-full overflow-y-auto border pb-0">
        <div className="mr-4 flex place-self-end">
          <Skeleton className="h-9 w-48 rounded-md" />
        </div>
        <div className="mt-2 flex items-center gap-2 border-y px-4 py-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-5 w-9 rounded-full" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
        <div className="px-2 py-1">
          <PaginationSkeleton />
        </div>
      </Card>
    </div>
  );
}

// ─── Feedback questions (feedback-questions.tsx) ─────────────────────────────
// Layout: Add button (justify-end) + Card table
// Question | Type | Responses | Active | Actions.
export function FeedbackQuestionsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex animate-pulse flex-col gap-4 p-4">
      <div className="flex items-end justify-end">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <Card className="p-1">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Skeleton className="h-3 w-40 flex-1" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-8" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-64 flex-1" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-5 w-9 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Feedback answers (feedback-responses.tsx) ───────────────────────────────
// Layout: grid cards (question header + chart body).
export function FeedbackAnswersSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="animate-pulse p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <Card key={i} className="flex flex-col gap-0 p-0">
            <div className="flex flex-row items-start gap-2 px-4 pt-3 pb-2">
              <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-1 h-5 w-16 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-2 px-4 pb-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Generic form (user-create.tsx, products-add/edit) ───────────────────────
// Layout: centered Card max-w-xl with icon header + stacked fields.
export function FormPageSkeleton() {
  return (
    <div className="flex w-full animate-pulse justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-xl p-6">
        <div className="flex flex-row items-center gap-3 pb-6">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-72" />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
        <Skeleton className="mt-4 h-11 w-full rounded-md" />
      </Card>
    </div>
  );
}
