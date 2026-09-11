import { useEffect, useState } from "react";
import { Plus, Trash2, MessageSquare, Star, ThumbsUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  useFeedbackQuestionsStore,
  useFeedbackStore,
  type FeedbackQuestion,
} from "../store/use_feedback_store";
import { FeedbackAnswersPanel } from "../components/analytics/feedback/feedback-answers-panel";
import { Spinner } from "../components/ui/spinner";
import { Card } from "../components/ui/card";

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

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end items-end">
        {/* <div>
          <h2 className="text-base font-semibold">Feedback Questions</h2>
          <p className="text-xs text-muted-foreground">
            Manage the questions shown to customers. Only active questions collect
            answers and appear in analytics.
          </p>
        </div> */}
        <AddQuestionDialog />
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading…
        </p>
      ) : questions.length === 0 ? (
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
                      <Switch
                        checked={q.isActive}
                        onCheckedChange={(checked) =>
                          toggleActive(q.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteQuestion(q.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
