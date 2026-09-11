import { useEffect, useState } from "react";
import { Plus, Trash2, MessageSquare, Star, ThumbsUp } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "recharts";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  useFeedbackQuestionsStore,
  useFeedbackStore,
  type FeedbackQuestion,
} from "@/app/store/use_feedback_store";
import { Card } from "@/app/components/ui/card";
import { Can } from "@/app/components/can";
import { FeedbackQuestionsSkeleton } from "@/app/components/tables-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

const TYPE_META: Record<
  FeedbackQuestion["questionType"],
  {
    label: string;
    icon: React.ElementType;
    variant: "default" | "secondary" | "outline";
  }
> = {
  rating: { label: "Rating", icon: Star, variant: "default" },
  yes_no: { label: "Yes / No", icon: ThumbsUp, variant: "secondary" },
  comment: { label: "Comment", icon: MessageSquare, variant: "outline" },
};

function AddQuestionDialog() {
  const { createQuestion } = useFeedbackQuestionsStore();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] =
    useState<FeedbackQuestion["questionType"]>("rating");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!question.trim()) return;
    setSaving(true);
    const ok = await createQuestion(question.trim(), questionType);
    setSaving(false);
    if (ok) {
      setQuestion("");
      setQuestionType("rating");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-new cursor-pointer ">
          <Plus className="mr-1 " /> Add Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New feedback question</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Question</Label>
            <Input
              placeholder="e.g. How would you rate your experience?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Type</Label>
            <Select
              value={questionType}
              onValueChange={(v) =>
                setQuestionType(v as FeedbackQuestion["questionType"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="rating">Rating (1-5 stars)</SelectItem>
                  <SelectItem value="yes_no">Yes / No</SelectItem>
                  <SelectItem value="comment">Comment (free text)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={saving || !question.trim()}>
            {saving ? "Saving…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function FeedbackQuestionsPage() {
  const { questions, loading, fetchQuestions, toggleActive, deleteQuestion } =
    useFeedbackQuestionsStore();
  const {
    summary,
    fetchFeedback,
    answersData,
    answersLoading,
    fetchAnswersAnalytics,
  } = useFeedbackStore();

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading && questions.length === 0) {
    return <FeedbackQuestionsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end items-end">
        {/* POST /analytics/feedback-questions requires feedback/edit */}
        <Can resource="feedback" action="edit">
          <AddQuestionDialog />
        </Can>
      </div>
      {questions.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No questions yet. Add one to get started.
        </p>
      ) : (
        <Card className="p-1">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-full">Question</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="text-right">Responses</TableHead>
                <TableHead className="">Active</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) => {
                const meta = TYPE_META[q.questionType];
                const Icon = meta.icon;
                return (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.question}</TableCell>
                    <TableCell>
                      <Badge
                        variant={meta.variant}
                        className="gap-1 text-[10px]"
                      >
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {q.answerCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {/* PATCH /analytics/feedback-questions/:id → feedback/edit */}
                      <Can resource="feedback" action="edit">
                        <Switch
                          checked={q.isActive}
                          onCheckedChange={(checked) =>
                            toggleActive(q.id, checked)
                          }
                        />
                      </Can>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* DELETE /analytics/feedback-questions/:id → feedback/delete */}
                      <Can resource="feedback" action="delete">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteQuestion(q.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Can>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
