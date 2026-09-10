import { useEffect } from "react"
import { PeriodSelect } from "../../components/period-select"

import {
  useWebAnalyticsStore,
  selectKPI,
  selectDailyChart,
  selectNewVsReturn,
  selectFunnel,
  // selectPeriod,
  selectLoading,
  selectError,
  selectChartGrouping,
} from "../../store/use-analytics-store"
import { KpiCards } from "../../components/kpi-cards"
import { NewVsReturningPanel } from "../../components/new-vs-returning-panel"
import { ConversionFunnelPanel } from "../../components/conversion-funnel-panel"
import { useAnalyticsParams } from "../../lib/useAnalyticsParams"
import { WebsiteAnalyticsSkeleton } from "../../components/analytics/google-analytics/website-analytics-loader"

export default function WebsiteAnalytics() {
  const setPeriod = useWebAnalyticsStore((s) => s.setPeriod)

  const { period, customFrom, customTo } = useAnalyticsParams()
  const fetchAnalytics = useWebAnalyticsStore((s) => s.fetchAnalytics)

  const kpi = useWebAnalyticsStore(selectKPI)
  const dailyChart = useWebAnalyticsStore(selectDailyChart)
  const newVsReturn = useWebAnalyticsStore(selectNewVsReturn)
  const funnel = useWebAnalyticsStore(selectFunnel)
  const chartGrouping = useWebAnalyticsStore(selectChartGrouping)
  const loading = useWebAnalyticsStore(selectLoading)
  const error = useWebAnalyticsStore(selectError)

  useEffect(() => {
    fetchAnalytics(period, customFrom, customTo)
  }, [period, customFrom, customTo])

  if (loading) return <WebsiteAnalyticsSkeleton />

  if (error) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-background">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 overflow-hidden bg-background p-6 ">
      {/* ── KPI Cards ── */}
      <KpiCards
        kpi={kpi}
        dailyChartData={dailyChart}
        chartGrouping={chartGrouping}
      />

      {/* ── Lower panels ── */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 md:grid-cols-2">
        <NewVsReturningPanel data={newVsReturn} />
        <ConversionFunnelPanel
          funnel={funnel}
          dailyChartData={dailyChart}
          chartGrouping={chartGrouping}
        />
      </div>
    </div>
  )
}
