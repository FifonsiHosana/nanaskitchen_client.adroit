import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { PercentageBar } from "../../PercentageBar";
import type { QuestionAnalytics } from "../../../store/use_feedback_store";

const TYPE_META = {
  rating: { label: "Rating", icon: Star, color: "text-amber-500" },
  yes_no: { label: "Yes / No", icon: ThumbsUp, color: "text-green-500" },
  comment: { label: "Comment", icon: MessageSquare, color: "text-blue-500" },
};

function RatingCard({ q }: { q: QuestionAnalytics }) {
  const total = q.totalAnswers || 1;
  const avg =
    q.breakdown.reduce((s, b) => s + Number(b.answer) * b.count, 0) / total;

  return (
    <>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{avg.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">/ 5 avg</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {total} responses
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {[5, 4, 3, 2, 1].map((star) => {
          const entry = q.breakdown.find((b) => Number(b.answer) === star);
          const pct = entry ? Math.round((entry.count / total) * 100) : 0;
          return (
            <div
              key={star}
              className="grid grid-cols-[24px_1fr_28px] items-center gap-2"
            >
              <span className="text-right text-xs ">
                {star}★
              </span>
              <PercentageBar percentage={pct} />
              <span className="text-right text-[10px] text-muted-foreground">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function YesNoCard({ q }: { q: QuestionAnalytics }) {
  const total = q.totalAnswers || 1;
  const yes =
    q.breakdown.find((b) => b.answer.toLowerCase() === "yes")?.count ?? 0;
  const no =
    q.breakdown.find((b) => b.answer.toLowerCase() === "no")?.count ?? 0;
  const yesPct = Math.round((yes / total) * 100);
  const noPct = Math.round((no / total) * 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>{total} responses</span>
      </div>
      <div className="flex h-5 w-full overflow-hidden rounded-full">
        <div
          className="bg-green-500 transition-all"
          style={{ width: `${yesPct}%` }}
        />
        <div
          className="bg-red-400 transition-all"
          style={{ width: `${noPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          Yes ({yes}) {yesPct}%
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
          No ({no}) {noPct}%
        </span>
      </div>
    </div>
  );
}

function CommentCard({ q }: { q: QuestionAnalytics }) {
  const recent = q.breakdown.slice(0, 6);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">
        {q.totalAnswers} response{q.totalAnswers !== 1 ? "s" : ""}
      </span>
      {recent.map((b, i) => (
        <p
          key={i}
          className="rounded-md bg-muted/60 px-3 py-1.5 text-xs leading-snug"
        >
          "{b.answer}"
        </p>
      ))}
      {q.totalAnswers > 6 && (
        <p className="text-center text-[10px] text-muted-foreground">
          +{q.totalAnswers - 6} more
        </p>
      )}
    </div>
  );
}

export function FeedbackAnswersPanel({ data }: { data: QuestionAnalytics[] }) {
  if (data.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No active questions with responses yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((q) => {
        const meta = TYPE_META[q.questionType];
        const Icon = meta.icon;
        return (
          <Card key={q.questionId} className="flex flex-col gap-0 p-0">
            <CardHeader className="flex flex-row items-start gap-2 px-4 pt-3 pb-2">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0`} />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm leading-snug font-medium">
                  {q.question}
                </CardTitle>
                <Badge variant="outline" className="mt-1 text-[10px]">
                  {meta.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {q.questionType === "rating" && <RatingCard q={q} />}
              {q.questionType === "yes_no" && <YesNoCard q={q} />}
              {q.questionType === "comment" && <CommentCard q={q} />}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
