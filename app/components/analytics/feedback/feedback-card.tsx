import { Card } from "../../ui/card";
import {

  type Summary,
  type SummaryItem,
} from "../../../store/use_feedback_store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";


const FeedbackCard = ({
  summary,
  specificSummary,
}: {
  summary: Summary;
  specificSummary: SummaryItem[];
}) => {
  return (
    <Card className="max-h-48 p-3">
      <p className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
        {summary?.howTheyHeardAboutUs === specificSummary
          ? "How they heard "
          : "What they like"}{" "}
        About Us
      </p>
      {specificSummary?.map((How) => (
        <div key={How?.label} className="flex justify-between gap-2 ">
          <p className="">{How?.label}</p>
          <div className="flex">
            <div className="">{How?.percentage ?? 0}%</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex"></div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{How?.count}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default FeedbackCard;
