
import { FeedbackAnswersPanel } from "@/app/components/feedback-answers-panel";
import { FeedbackAnswersSkeleton } from "@/app/components/tables-skeleton";
import { useFeedbackStore } from "@/app/store/use_feedback_store";
import { useEffect } from "react";

const FeedbackResponses = () => {
  const { answersData, answersLoading, fetchAnswersAnalytics } =
    useFeedbackStore();
  useEffect(() => {
    fetchAnswersAnalytics();
  }, [fetchAnswersAnalytics]);

  if (answersLoading && answersData.length === 0) {
    return <FeedbackAnswersSkeleton />;
  }

  return (
    <div className="p-4">
      <FeedbackAnswersPanel data={answersData} />
    </div>
  );
};

export default FeedbackResponses;
