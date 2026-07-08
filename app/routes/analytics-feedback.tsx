import { useEffect } from "react"
import { BaggageClaim, Eye, Package, Palette } from "lucide-react"
import { SummaryCard } from "../components/summary-card"
import FeedbackCard from "../components/feedback-card"
import FeedbackTable from "../components/feedback-table"
import { FeedbackAnswersPanel } from "../components/feedback-answers-panel"
import {
  useFeedbackStore,
  type Summary,
  type SummaryItem,
} from "../store/use_feedback_store"
import { useFeedbackParams } from "../lib/useFeedbackParams"

const analyticsFeedback = () => {
  const { params } = useFeedbackParams()
  const {
    summary,
    fetchFeedback,
    answersData,
    answersLoading,
    fetchAnswersAnalytics,
  } = useFeedbackStore()

  useEffect(() => {
    fetchFeedback(params)
  }, [params.country, params.page, params.pageSize, params.pricingGroup])

  useEffect(() => {
    fetchAnswersAnalytics()
  }, [])

  return (
    <div className="flex flex-col gap-4 overflow-hidden p-4">
      {/* Summary stat pills */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          label="Total responses"
          value={
            summary?.totalResponses != null
              ? String(summary.totalResponses)
              : "0"
          }
          icon={Palette}
        />
        <SummaryCard
          label="Top channel"
          value={summary?.topChannel ?? "N/A"}
          icon={Package}
        />
        <SummaryCard
          label="Top preference"
          value={summary?.topPreference ?? "N/A"}
          icon={Eye}
        />
        <SummaryCard label="Avg tags / response" value="" icon={BaggageClaim} />
      </div>
      

      {/* Attribution & preference breakdown */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <FeedbackCard
          summary={summary as Summary}
          specificSummary={summary?.howTheyHeardAboutUs as SummaryItem[]}
        />
        <FeedbackCard
          summary={summary as Summary}
          specificSummary={summary?.whatTheyLike as SummaryItem[]}
        />
      </div>
<FeedbackTable />
      {/* Feedback question answers */}
      {/* <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Feedback Question Responses
        </p>
        {answersLoading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          <FeedbackAnswersPanel data={answersData} />
        )}
      </div> */}
    </div>
  )
}

export default analyticsFeedback
