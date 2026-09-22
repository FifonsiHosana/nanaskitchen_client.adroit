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
  // All param hooks run unconditionally (rules of hooks) — pick the one
  // matching `currentTable` below.
  const orderParams = useOrderParams();
  const feedbackParams = useFeedbackParams();
  const auditParams = useAuditParams();
  const shippingParams = useShippingParams();
  const customersParams = useCustomersParams();

  const { params, setParam } =
    currentTable === "orders"
      ? orderParams
      : currentTable === "feedback"
        ? feedbackParams
        : currentTable === "audit"
          ? auditParams
          : currentTable === "shipping"
            ? shippingParams
            : customersParams;

  // Guard against undefined/NaN totals (e.g. before the first fetch resolves).
  const safeTotal = Number.isFinite(totalPages)
    ? Math.max(1, Math.floor(totalPages))
    : 1;
  const safeCurrent = Number.isFinite(currentPage)
    ? Math.min(Math.max(1, Math.floor(currentPage)), safeTotal)
    : 1;
  const isFirst = safeCurrent <= 1;
  const isLast = safeCurrent >= safeTotal;

  return (
    <div className="">
      <Pagination>
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select
            value={String(params.pageSize)}
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
              onClick={(e) => {
                e.preventDefault();
                if (!isFirst) setParam("page", String(safeCurrent - 1));
              }}
              aria-disabled={isFirst}
              className={
                isFirst ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>

          {getPageNumbers(safeCurrent, safeTotal).map((page, i) => (
            <PaginationItem key={i}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={safeCurrent === page}
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
                if (!isLast) setParam("page", String(safeCurrent + 1));
              }}
              aria-disabled={isLast}
              className={
                isLast ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationOrders;
