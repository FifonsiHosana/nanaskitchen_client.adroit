import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import type { QuestionAnalytics } from "../store/use_feedback_store";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

const TYPE_META = {
  rating: { label: "Rating", icon: Star, color: "text-amber-500" },
  yes_no: { label: "Yes / No", icon: ThumbsUp, color: "text-green-500" },
  comment: { label: "Comment", icon: MessageSquare, color: "text-blue-500" },
};

const ratingChartConfig = {
  count: {
    label: "Responses",
    color: "var(--chart-star-1)",
  },
} satisfies ChartConfig;

const yesNoChartConfig = {
  yes: {
    label: "Yes",
    color: "var(--chart-yes)",
  },
  no: {
    label: "No",
    color: "var(--chart-no)",
  },
} satisfies ChartConfig;

function RatingCard({ q }: { q: QuestionAnalytics }) {
  const total = q.totalAnswers || 1;
  const avg =
    q.breakdown.reduce((s, b) => s + Number(b.answer) * b.count, 0) / total;

  const data = [5, 4, 3, 2, 1].map((star) => {
    const entry = q.breakdown.find((b) => Number(b.answer) === star);
    const count = entry ? entry.count : 0;
    return {
      star: `${star}★`,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{avg.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">/ 5 avg</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {total} responses
        </span>
      </div>

      <ChartContainer config={ratingChartConfig} className="h-40 w-full">
        <BarChart
          data={data}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
        >
          <YAxis
            dataKey="star"
            type="category"
            tickLine={false}
            axisLine={false}
            hide
          />
          <XAxis dataKey="count" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => (
                  <div className="flex w-full items-center justify-between gap-6">
                    <span className="text-muted-foreground">Responses</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({item.payload.percentage}%)
                      </span>
                    </div>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="count" fill="var(--chart-star-1)" radius={4}>
            <LabelList
              dataKey="percentage"
              position="right"
              offset={8}
              className="fill-muted-foreground font-semibold"
              fontSize={11}
              formatter={(v) => `${v}%`}
            />
            <LabelList
              dataKey="star"
              position="insideLeft"
              offset={8}
              className=" font-semibold"
              fontSize={11}
              fill="black"
              formatter={(v) => `${v}`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function YesNoCard({ q }: { q: QuestionAnalytics }) {
  const total = q.totalAnswers || 1;
  const yes =
    q.breakdown.find((b) => b.answer.toLowerCase() === "yes")?.count ?? 0;
  const no =
    q.breakdown.find((b) => b.answer.toLowerCase() === "no")?.count ?? 0;

  const data = [
    {
      label: "Yes",
      count: yes,
      percentage: Math.round((yes / total) * 100),
      fill: "var(--color-yes)",
    },
    {
      label: "No",
      count: no,
      percentage: Math.round((no / total) * 100),
      fill: "var(--color-no)",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{total} responses</span>
      </div>

      <ChartContainer config={yesNoChartConfig} className="mx-auto h-36 w-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name, item) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="font-medium text-foreground">{name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{value}</span>
                      <span className="text-xs text-muted-foreground">
                        ({item.payload.percentage}%)
                      </span>
                    </div>
                  </div>
                )}
              />
            }
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius={15}
            outerRadius={60}
            strokeWidth={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex justify-around text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2.5 w-2.5 rounded-full " />
          Yes: {yes} ({data[0].percentage}%)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2.5 w-2.5 rounded-full " />
          No: {no} ({data[1].percentage}%)
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
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.color}`} />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm font-medium leading-snug">
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
