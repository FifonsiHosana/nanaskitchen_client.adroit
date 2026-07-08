import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { useFeedbackStore } from "../store/use_feedback_store"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import PaginationOrders from "./pagination"
import { useFeedbackParams } from "../lib/useFeedbackParams"

const FeedbackTable = () => {
  const { params } = useFeedbackParams()
  const { data, totalCount } = useFeedbackStore()
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(
    (totalCount as number) / Number(params.pageSize || 20)
  )
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
            {data.map((feedbackDetail) => (
              <TableRow key={feedbackDetail.orderId}>
                <TableCell className="">
                  <Button
                    variant={"link"}
                    className="cursor-pointer hover:text-blue-500"
                  >
                    {feedbackDetail.orderId}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  {String(feedbackDetail.customer.name)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {feedbackDetail.attribution.map((attribution) => (
                      <Badge variant="default">{attribution}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {feedbackDetail.preferences.map((preference) => (
                      <Badge variant="default">{preference}</Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>{" "}
      <PaginationOrders
        currentTable="feedback"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  )
}

export default FeedbackTable
