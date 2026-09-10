
import { FeedbackAnswersPanel } from "@/app/components/feedback-answers-panel";
import { useFeedbackStore } from "@/app/store/use_feedback_store";
import { useEffect } from "react";

const FeedbackResponses = () => {
  const { answersData, fetchAnswersAnalytics } = useFeedbackStore();
  useEffect(() => {
    fetchAnswersAnalytics();
  }, [fetchAnswersAnalytics]);

  return (
    <div className="p-4">
      <FeedbackAnswersPanel data={answersData} />
    </div>
  );
};

export default FeedbackResponses;
