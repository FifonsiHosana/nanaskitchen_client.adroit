import { useEffect } from "react";
import { Eye, Package, Palette } from "lucide-react";
import { SummaryCard } from "../../components/summary-card";
import FeedbackTable from "../../components/analytics/feedback/feedback-table";
import {
  useFeedbackStore,
  type SummaryItem,
} from "../../store/use_feedback_store";
import { useFeedbackParams } from "../../lib/useFeedbackParams";
import { HorizontalBarCard } from "@/app/components/analytics/feedback/attribution-chart";
import { PreferenceChart } from "@/app/components/analytics/feedback/preference-chart";

const analyticsFeedback = () => {
  const { params } = useFeedbackParams();
  const {
    summary,
    fetchFeedback,
    answersData,
    answersLoading,
    loading,
    fetchAnswersAnalytics,
  } = useFeedbackStore();

  useEffect(() => {
    fetchFeedback(params);
  }, [params.country, params.page, params.pageSize, params.pricingGroup]);

  useEffect(() => {
    fetchAnswersAnalytics();
  }, []);

  return (
    <div className="flex flex-col gap-2 overflow-hidden p-4">
      {/* Summary stat pills */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <SummaryCard
          label="Total responses"
          value={
            summary?.totalResponses != null
              ? String(summary.totalResponses)
              : "0"
          }
          icon={Palette}
          loading={loading}
        />
        <SummaryCard
          label="Top channel"
          value={summary?.topChannel ?? "N/A"}
          icon={Package}
          loading={loading}
        />
        <SummaryCard
          label="Top preference"
          value={summary?.topPreference ?? "N/A"}
          icon={Eye}
          loading={loading}
        />
      </div>

      {/* Attribution & preference breakdown */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <HorizontalBarCard
          title="How They Heard About Us"
          data={summary?.howTheyHeardAboutUs as SummaryItem[]}
        />
        <PreferenceChart
          title="What they like "
          data={summary?.whatTheyLike as SummaryItem[]}
        />
        <PreferenceChart
          title="Preference Chart "
          data={summary?.howTheyHeardAboutUs as SummaryItem[]}
        />
      </div>
      <FeedbackTable />
    </div>
  );
};

export default analyticsFeedback;
