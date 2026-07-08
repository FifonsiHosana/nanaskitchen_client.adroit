// "use client"

// import { useEffect, useRef, useState } from "react"
// import { toast } from "sonner"
// import {
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Star,
//   StarIcon,
//   Search,
//   ThumbsUp,
//   ThumbsDown,
//   MessageSquare,
//   Loader2,
// } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
// import { Badge } from "~/components/ui/badge"
// import { Button } from "~/components/ui/button"
// import { Input } from "~/components/ui/input"
// import { Skeleton } from "~/components/ui/skeleton"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogMedia,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "~/components/ui/alert-dialog"
// import { SummaryCard } from "~/components/summary-card"
// import { useReviewsStore, type Review, type ReviewStatus } from "../store/use-reviews-store"

// // ─── Star Rating ─────────────────────────────────────────────────────────────
// function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {Array.from({ length: max }).map((_, i) => (
//         <StarIcon
//           key={i}
//           className={`h-3.5 w-3.5 ${
//             i < rating
//               ? "fill-amber-400 text-amber-400"
//               : "fill-muted text-muted-foreground/30"
//           }`}
//         />
//       ))}
//     </div>
//   )
// }

// // ─── Status Badge ────────────────────────────────────────────────────────────
// function StatusBadge({ status }: { status: ReviewStatus }) {
//   if (status === "approved")
//     return (
//       <Badge className="gap-1 ">
//         <CheckCircle2 className="h-3 w-3" />
//         Approved
//       </Badge>
//     )
//   if (status === "rejected")
//     return (
//       <Badge className="gap-1 ">
//         <XCircle className="h-3 w-3" />
//         Rejected
//       </Badge>
//     )
//   return (
//     <Badge className="gap-1">
//       <Clock className="h-3 w-3" />
//       Pending
//     </Badge>
//   )
// }

// // ─── Approve Dialog ──────────────────────────────────────────────────────────
// function ApproveDialog({ review }: { review: Review }) {
//   const { approveReview, isActionLoading } = useReviewsStore()
//   const busy = isActionLoading === review.id

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button
//           size="sm"
//           variant="outline"
//           className="h-8 gap-1.5 border-green-300/50 text-green-600 hover:bg-green-500/10 hover:text-green-600 dark:text-green-400"
//           disabled={busy}
//         >
//           {busy ? (
//             <Loader2 className="h-3.5 w-3.5 animate-spin" />
//           ) : (
//             <ThumbsUp className="h-3.5 w-3.5" />
//           )}
//           Approve
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent size="sm">
//         <AlertDialogHeader>
//           <AlertDialogMedia className="bg-green-500/10 text-green-600 dark:text-green-400">
//             <CheckCircle2 />
//           </AlertDialogMedia>
//           <AlertDialogTitle>Approve Review?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This will publish the review by{" "}
//             <strong>{review.customerName}</strong> on{" "}
//             <strong>{review.productName}</strong>. It will be visible to
//             customers.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             className="bg-green-600 text-white hover:bg-green-700"
//             onClick={async () => {
//               await approveReview(review.id)
//               toast.success("Review approved and published")
//             }}
//           >
//             Approve
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

// // ─── Reject Dialog ───────────────────────────────────────────────────────────
// function RejectDialog({ review }: { review: Review }) {
//   const { rejectReview, isActionLoading } = useReviewsStore()
//   const busy = isActionLoading === review.id

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button
//           size="sm"
//           variant="outline"
//           className="h-8 gap-1.5 border-red-300/50 text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
//           disabled={busy}
//         >
//           {busy ? (
//             <Loader2 className="h-3.5 w-3.5 animate-spin" />
//           ) : (
//             <ThumbsDown className="h-3.5 w-3.5" />
//           )}
//           Reject
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent size="sm">
//         <AlertDialogHeader>
//           <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
//             <XCircle />
//           </AlertDialogMedia>
//           <AlertDialogTitle>Reject Review?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This will hide the review by{" "}
//             <strong>{review.customerName}</strong>. It will not be visible to
//             customers. You can approve it later if needed.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             variant="destructive"
//             onClick={async () => {
//               await rejectReview(review.id)
//               toast.success("Review rejected")
//             }}
//           >
//             Reject
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

// // ─── Review Card ─────────────────────────────────────────────────────────────
// function ReviewCard({ review }: { review: Review }) {
//   const dateLabel = new Date(review.date).toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   })

//   const initials = review.customerName
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2)

//   return (
//     <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-3">
//         <div className="flex min-w-0 items-center gap-3">
//           {/* Avatar */}
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//             {initials}
//           </div>
//           <div className="min-w-0">
//             <p className="truncate text-sm font-medium leading-tight">
//               {review.customerName}
//             </p>
//           </div>
//         </div>
//         <StatusBadge status={review.status} />
//       </div>

//       {/* Product + rating */}
//       <div className="flex items-center gap-2">
//         {review.productImage && (
//           <img
//             src={review.productImage}
//             alt={review.productName}
//             className="h-8 w-8 shrink-0 rounded-md object-cover"
//           />
//         )}
//         <div className="min-w-0 flex-1">
//           <p className="truncate text-xs font-medium text-muted-foreground">
//             {review.productName}
//           </p>
//           <StarRating rating={review.rating} />
//         </div>
//         <span className="shrink-0 text-xs text-muted-foreground">{dateLabel}</span>
//       </div>

//       {/* Review content */}
//       <div className="space-y-1">
//         {/* <p className="text-sm font-semibold leading-snug">{review.}</p> */}
//         <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
//           {review.comment}
//         </p>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-2 pt-1">
//         {review.status !== "approved" && <ApproveDialog review={review} />}
//         {review.status !== "rejected" && <RejectDialog review={review} />}
//         {review.status !== "pending" && (
//           <span className="ml-auto text-xs text-muted-foreground">
//             {review.status === "approved" ? "Published" : "Hidden from customers"}
//           </span>
//         )}
//       </div>
//     </div>
//   )
// }

// // ─── Card Skeleton ────────────────────────────────────────────────────────────
// function ReviewCardSkeleton() {
//   return (
//     <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4">
//       <div className="flex items-center gap-3">
//         <Skeleton className="h-9 w-9 rounded-full" />
//         <div className="flex flex-col gap-1.5">
//           <Skeleton className="h-3 w-28" />
//           <Skeleton className="h-2.5 w-36" />
//         </div>
//         <Skeleton className="ml-auto h-5 w-20 rounded-full" />
//       </div>
//       <div className="flex gap-2">
//         <Skeleton className="h-8 w-8 rounded-md" />
//         <div className="flex flex-1 flex-col gap-1.5">
//           <Skeleton className="h-2.5 w-32" />
//           <Skeleton className="h-3 w-24" />
//         </div>
//       </div>
//       <div className="flex flex-col gap-1.5">
//         <Skeleton className="h-3.5 w-40" />
//         <Skeleton className="h-3 w-full" />
//         <Skeleton className="h-3 w-4/5" />
//         <Skeleton className="h-3 w-3/5" />
//       </div>
//       <div className="flex gap-2 pt-1">
//         <Skeleton className="h-8 w-24 rounded-md" />
//         <Skeleton className="h-8 w-24 rounded-md" />
//       </div>
//     </div>
//   )
// }

// // ─── Stat skeleton ────────────────────────────────────────────────────────────
// function StatSkeleton() {
//   return (
//     <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-3 sm:p-4">
//       <Skeleton className="h-3 w-20" />
//       <Skeleton className="h-7 w-14" />
//       <Skeleton className="h-2.5 w-24" />
//     </div>
//   )
// }

// // ─── Empty State ──────────────────────────────────────────────────────────────
// function EmptyState({ tab }: { tab: string }) {
//   const messages: Record<string, { icon: React.ReactNode; text: string }> = {
//     pending: {
//       icon: <Clock className="h-10 w-10 text-muted-foreground/40" />,
//       text: "No pending reviews — you're all caught up!",
//     },
//     approved: {
//       icon: <CheckCircle2 className="h-10 w-10 text-muted-foreground/40" />,
//       text: "No approved reviews yet.",
//     },
//     rejected: {
//       icon: <XCircle className="h-10 w-10 text-muted-foreground/40" />,
//       text: "No rejected reviews.",
//     },
//     all: {
//       icon: <MessageSquare className="h-10 w-10 text-muted-foreground/40" />,
//       text: "No reviews found.",
//     },
//   }
//   const msg = messages[tab] ?? messages.all
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-muted/10 py-16 text-center">
//       {msg.icon}
//       <p className="text-sm text-muted-foreground">{msg.text}</p>
//     </div>
//   )
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function ReviewsPage() {
//   const {
//     reviews,
//     stats,
//     isLoading,
//     searchQuery,
//     // activeTab,
//     fetchReviews,
//     setSearch,
//     // setActiveTab,
//   } = useReviewsStore()

//   const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

//   useEffect(() => {
//     fetchReviews()
//   }, [fetchReviews])

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     clearTimeout(searchRef.current)
//     searchRef.current = setTimeout(() => setSearch(e.target.value), 300)
//   }

//   // const filtered = reviews.filter((r) => {
//   //   const matchesTab = activeTab === "all" || r.status === activeTab
//   //   const q = searchQuery.toLowerCase()
//   //   const matchesSearch =
//   //     !q ||
//   //     r.customerName.toLowerCase().includes(q) ||
//   //     r.productName.toLowerCase().includes(q) ||
//   //     r.title.toLowerCase().includes(q) ||
//   //     r.body.toLowerCase().includes(q)
//   //   return matchesTab && matchesSearch
//   // })

//   return (
//     <div className="flex flex-col gap-4 p-4">

//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
//         {isLoading ? (
//           <>
//             <StatSkeleton />
//             <StatSkeleton />
//             <StatSkeleton />
//             <StatSkeleton />
//             <StatSkeleton />
//           </>
//         ) : (
//           <>
//             <SummaryCard
//               label="Total Reviews"
//               value={String(stats.total)}
//               icon={MessageSquare}
//               sub="All time"
//             />
//             <SummaryCard
//               label="Pending"
//               value={String(stats.pending)}
//               icon={Clock}
//               sub="Awaiting action"
//               trend={stats.pending > 0 ? "up" : undefined}
//             />
//             <SummaryCard
//               label="Approved"
//               value={String(stats.approved)}
//               icon={CheckCircle2}
//               sub="Published"
//               trend="up"
//             />
//             <SummaryCard
//               label="Rejected"
//               value={String(stats.rejected)}
//               icon={XCircle}
//               sub="Hidden"
//             />
//             <SummaryCard
//               label="Avg. Rating"
//               value={`${stats.avgRating} / 5`}
//               icon={Star}
//               sub="Across all reviews"
//               trend="up"
//             />
//           </>
//         )}
//       </div>

//       {/* ── Filters + Search ── */}
//       <div className="flex flex-wrap items-center justify-between gap-2">


//         <div className="relative">
//           <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search reviews…"
//             defaultValue={searchQuery}
//             onChange={handleSearch}
//             className="h-9 pl-8 text-sm"
//           />
//         </div>
//       </div>
// </div>
//   )
// }
