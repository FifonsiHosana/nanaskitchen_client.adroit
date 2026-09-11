import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useFeedbackStore } from "../../../store/use_feedback_store";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import PaginationOrders from "../../pagination";
import { useFeedbackParams } from "../../../lib/useFeedbackParams";
import {
  CHANNEL_CONFIG,
  METRIC_CONFIG,
} from "../../../utils/analytics/feedback";
import { useState } from "react";
import { cn } from "@/app/lib/utils";

const FeedbackTable = () => {
  const { params } = useFeedbackParams();
  const { data, totalCount } = useFeedbackStore();
  const currentPage = Number(params.page) || 1;
  const totalPages = Math.ceil(
    (totalCount as number) / Number(params.pageSize || 20),
  );
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined,
  );
  return (
    <>
      <div className="relative no-scrollbar max-h-100 w-full overflow-y-auto rounded-md border">
        <Table noWrapper>
          <TableCaption>Customer Feedback.</TableCaption>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead className="w-30">Customer</TableHead>
              <TableHead>Attribution</TableHead>
              <TableHead>Preferences</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((feedbackDetail) => {
              return (
                <TableRow
                  key={feedbackDetail.id}
                  data-state={
                    selectedRowId === feedbackDetail.id ? "selected" : undefined
                  }
                  onClick={() =>
                    setSelectedRowId((prev) =>
                      prev === feedbackDetail.id
                        ? undefined
                        : feedbackDetail.id,
                    )
                  }
                >
                  <TableCell>
                    <Button
                      variant={"link"}
                      className="cursor-pointer hover:text-blue-500"
                    >
                      {feedbackDetail.orderId}
                    </Button>
                  </TableCell>
                  <TableCell
                    className={cn(
                      selectedRowId === feedbackDetail.id &&
                        "border-blue-300 border ring-blue-400",
                    )}
                  >
                    {String(feedbackDetail.customer.name)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {feedbackDetail.attribution.map((attribution) => {
                        const config = CHANNEL_CONFIG[attribution];
                        return (
                          <Badge
                            style={{
                              color: config?.color,
                              backgroundColor: config?.bgColor,
                            }}
                            // variant="default"
                          >
                            {attribution}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {feedbackDetail.preferences.map((preference) => {
                        const config = METRIC_CONFIG[preference];

                        return (
                          <Badge
                            style={{
                              color: config?.color,
                              backgroundColor: config?.bgColor,
                            }}
                            // variant="default"
                          >
                            {preference}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>{" "}
      <PaginationOrders
        currentTable="feedback"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default FeedbackTable;
