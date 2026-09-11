import { GH, EU, US } from "country-flag-icons/react/3x2"
import { Package } from "lucide-react"
import { dateNormalize, fmt, PERIOD_LABELS, STATUS_CONFIG } from "../lib/utils"
import { useOrderStore, type orderStatsTypes, type statusType } from "../store/use-order-store"
import { SummaryCard } from "./summary-card"
import { useOrderParams } from "../lib/useOrderParams"

const OrderStats = ({ orderStats }: { orderStats: orderStatsTypes }) => {
  const {params} = useOrderParams();
  const {pageStatus} = useOrderStore();

const funnelStatus =
  pageStatus === "completed" ? "completed" : pageStatus === "awaiting_payment" ? "pending" : pageStatus === "delivered" ? "delivered" : null
  
  const periodSub = params.periodQuery.period
    ? PERIOD_LABELS[params?.periodQuery?.period || "all_time"]
    : params.periodQuery.from
      ? `${dateNormalize(params.periodQuery.from as string)} to ${dateNormalize(params.periodQuery.to as string)}`
      : PERIOD_LABELS[ "all_time"]
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      <SummaryCard
        label="GH orders"
        value={`${fmt(orderStats?.countries?.GH)}`}
        icon={GH}
        status={pageStatus}
        sub={periodSub}
      />
      <SummaryCard
        label="US orders"
        value={`${fmt(orderStats?.countries?.US)}`}
        icon={US}
        status={pageStatus}
        sub={periodSub}
      />
      <SummaryCard
        label="EU orders"
        value={`${fmt(orderStats?.countries?.EU)}`}
        icon={EU}
        status={pageStatus}
        sub={periodSub}
      />
      <SummaryCard
        label={`${pageStatus !== "all" ? STATUS_CONFIG[pageStatus].label : "Delivered"} orders`}
        value={`${fmt(funnelStatus ? orderStats?.[funnelStatus] : orderStats?.delivered)}`}
        icon={Package}
        status={pageStatus}
        sub={periodSub}
      />
    </div>
  )
}

export default OrderStats
