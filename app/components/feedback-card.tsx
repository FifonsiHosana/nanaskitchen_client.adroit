import React from "react"
import { PercentageBar } from "./PercentageBar"
import { Card } from "./ui/card"
import {
  useFeedbackStore,
  type Summary,
  type SummaryItem,
} from "../store/use_feedback_store"
import { ChartTooltip, ChartTooltipContent } from "./ui/chart"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { ScrollArea } from "./ui/scroll-area"

const FeedbackCard = ({
  summary,
  specificSummary,
}: {
  summary: Summary
  specificSummary: SummaryItem[]
}) => {
  //ftest push
  return (
    <Card className="max-h-48 p-3">
      <p className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
        {summary?.howTheyHeardAboutUs === specificSummary
          ? "How they heard "
          : "What they like"}{" "}
        About Us
      </p>
      <ScrollArea max-h-38 className="overflow-auto">
        {specificSummary?.map((How) => (
          <div
            key={How?.label}
            className="grid grid-cols-2 items-center gap-2 py-0.5"
          >
            <p className="truncate text-sm">{How?.label}</p>

            <div className="flex gap-2 overflow-y-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PercentageBar percentage={How?.percentage} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{How?.count}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  )
}

export default FeedbackCard
