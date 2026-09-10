"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  StarIcon,
  Search,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { SummaryCard } from "~/components/summary-card";
import {
  useReviewsStore,
  type Review,
  type ReviewStatus,
} from "../store/use-reviews-store";
import { ScrollArea } from "~/components/ui/scroll-area";
import { usePermission } from "../hooks/use-permission";

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReviewStatus }) {
  if (status === "approved")
    return (
      <Badge className="gap-1 bg-(--status-approve)">
        <CheckCircle2 className="h-3 w-3" />
        Approved
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge className="bg-(--out-of-stock) gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="gap-1 bg-(--status-pending-review)">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  );
}

// ─── Approve Dialog ──────────────────────────────────────────────────────────
function ApproveDialog({ review }: { review: Review }) {
  const { approveReview, isActionLoading } = useReviewsStore();
  const busy = isActionLoading === review.id;
  // PATCH /reviews/:id/approve requires reviews/edit — omit until resolved.
  const { allowed: canEdit, loaded } = usePermission("reviews", "edit");

  if (!loaded || !canEdit) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          style={{ background: "var(--status-approve)" }}
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 cursor-pointer text-white hover:text-white"
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ThumbsUp className="h-3.5 w-3.5" />
          )}
          Approve
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-green-500/10 text-green-600 dark:text-green-400">
            <CheckCircle2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Approve Review?</AlertDialogTitle>
          <AlertDialogDescription>
            This will publish the review by{" "}
            <strong>{review.customerName}</strong> on{" "}
            <strong>{review.productName}</strong>. It will be visible to
            customers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-(--status-approve)"
            onClick={async () => {
              await approveReview(review.id);
              toast.success("Review approved and published");
            }}
          >
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Reject Dialog ───────────────────────────────────────────────────────────
function RejectDialog({ review }: { review: Review }) {
  const { rejectReview, isActionLoading } = useReviewsStore();
  const busy = isActionLoading === review.id;
  // PATCH /reviews/:id/reject requires reviews/edit — omit until resolved.
  const { allowed: canEdit, loaded } = usePermission("reviews", "edit");

  if (!loaded || !canEdit) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="h-8 gap-1.5 cursor-pointer"
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ThumbsDown className="h-3.5 w-3.5" />
          )}
          Reject
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
            <XCircle />
          </AlertDialogMedia>
          <AlertDialogTitle>Reject Review?</AlertDialogTitle>
          <AlertDialogDescription>
            This will hide the review by <strong>{review.customerName}</strong>.
            It will not be visible to customers. You can approve it later if
            needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={async () => {
              await rejectReview(review.id);
              toast.success("Review rejected");
            }}
          >
            Reject
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const dateLabel = new Date(review.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  // Hide the whole action footer when approve/reject are gated out.
  const { allowed: canEditReviews, loaded: permsLoaded } = usePermission(
    "reviews",
    "edit",
  );
  const showActions = permsLoaded && canEditReviews;

  const initials = review.customerName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-xs ">
      {/* 1. Header Section (Fixed Height) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm leading-tight font-semibold text-foreground">
              {review.customerName}
            </p>
          </div>
        </div>
        <StatusBadge status={review.status} />
      </div>

      {/* 2. Product Info (Fixed Height) */}
      <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-2">
        {review.productImage ? (
          <img
            src={review.productImage}
            alt={review.productName}
            className="h-10 w-10 shrink-0 rounded-md border bg-background object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-[10px]">
            N/A
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            {review.productName}
          </p>
          <StarRating rating={review.rating} />
        </div>
        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
          {dateLabel}
        </span>
      </div>

      {/* 3. Review Comment (Flexible but Constrained) */}
      {/* Setting a max-height and using ScrollArea keeps all cards the same height */}
      <div className="flex-1">
        <ScrollArea className="h-24 pr-3 text-sm leading-relaxed text-muted-foreground italic">
          "{review.comment}"
        </ScrollArea>
      </div>

      {/* 4. Action Footer (Always Pinned to Bottom) */}
      {showActions && (
        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-4">
          <div className="flex items-center gap-2">
            {review.status !== "approved" && <ApproveDialog review={review} />}
            {review.status !== "rejected" && <RejectDialog review={review} />}
          </div>

          {review.status !== "pending" && (
            <span className="text-[11px] font-medium text-muted-foreground">
              {review.status === "approved" ? "● Published" : "○ Hidden"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Card Skeleton ────────────────────────────────────────────────────────────
function ReviewCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2.5 w-36" />
        </div>
        <Skeleton className="ml-auto h-5 w-20 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-2.5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

// ─── Stat Skeleton ────────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-3 sm:p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-14" />
      <Skeleton className="h-2.5 w-24" />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ status }: { status: ReviewStatus | "all" }) {
  const messages: Record<string, { icon: React.ReactNode; text: string }> = {
    pending: {
      icon: <Clock className="h-10 w-10 text-muted-foreground/40" />,
      text: "No pending reviews — you're all caught up!",
    },
    approved: {
      icon: <CheckCircle2 className="h-10 w-10 text-muted-foreground/40" />,
      text: "No approved reviews yet.",
    },
    rejected: {
      icon: <XCircle className="h-10 w-10 text-muted-foreground/40" />,
      text: "No rejected reviews.",
    },
    all: {
      icon: <MessageSquare className="h-10 w-10 text-muted-foreground/40" />,
      text: "No reviews found.",
    },
  };
  const msg = messages[status] ?? messages.all;
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-muted/10 py-16 text-center">
      {msg.icon}
      <p className="text-sm text-muted-foreground">{msg.text}</p>
    </div>
  );
}

// ─── Reviews Page (shared) ────────────────────────────────────────────────────
interface ReviewsPageProps {
  status: ReviewStatus | "all";
}

export function ReviewsPage({ status }: ReviewsPageProps) {
  const {
    reviews,
    stats,
    isLoading,
    searchQuery,
    fetchReviews,
    setSearch,
    rejectReview,
    approveReview,
  } = useReviewsStore();

  const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchReviews(status);
  }, [fetchReviews, status]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => setSearch(e.target.value), 300);
  };

  const filtered = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      r.customerName.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <SummaryCard
              label="Total Reviews"
              value={String(stats.total)}
              icon={MessageSquare}
              sub="All Time"
            />
            <SummaryCard
              label="Pending"
              value={String(stats.pending)}
              icon={Clock}
              sub="Awaiting action"
              // trend={stats.pending > 0 ? "up" : undefined}
            />
            <SummaryCard
              label="Approved"
              value={String(stats.approved)}
              icon={CheckCircle2}
              sub="Published"
              // trend="up"
            />
            <SummaryCard
              label="Rejected"
              value={String(stats.rejected)}
              icon={XCircle}
              sub="Hidden"
            />
            <SummaryCard
              label="Avg. Rating"
              value={`${stats.avgRating} / 5`}
              icon={Star}
              sub="Across all reviews"
              // trend="up"
            />
          </>
        )}
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews…"
            defaultValue={searchQuery}
            onChange={handleSearch}
            className="h-9 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState status={status} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
