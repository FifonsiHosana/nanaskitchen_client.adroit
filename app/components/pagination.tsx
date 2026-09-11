import { getPageNumbers } from "../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "./ui/pagination";
import { useOrderParams } from "../lib/useOrderParams";
import { useCustomersParams } from "../lib/useCustomersParams";
import { Field, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFeedbackParams } from "../lib/useFeedbackParams";
import { useAuditParams } from "../lib/useAuditParams";
import { useShippingParams } from "../lib/useShippingParams";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  currentTable: string;
};

const PaginationOrders = ({
  currentPage,
  totalPages,
  currentTable,
}: PaginationProps) => {
  const { params, setParam, setParams } =
    currentTable === "orders"
      ? useOrderParams()
      : currentTable === "feedback"
        ? useFeedbackParams()
        : currentTable === "audit"
          ? useAuditParams()
          : currentTable === "shipping"
            ? useShippingParams()
            : useCustomersParams();
  return (
    <div className="">
      <Pagination>
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select
            defaultValue={String(params.pageSize)}
            onValueChange={(value) => setParam("pageSize", value)}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setParam("page", String(currentPage - 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {getPageNumbers(currentPage, totalPages).map((page, i) => (
            <PaginationItem key={i}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setParam("page", String(page));
                  }}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                setParam("page", String(currentPage + 1));
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationOrders;
