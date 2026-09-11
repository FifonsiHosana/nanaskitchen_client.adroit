import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { cn, COUNTRY_LABELS, CURRENCY_SYMBOLS, fmt } from "@/app/lib/utils";
import type { Country } from "@/app/types/period";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useAnalyticsSalesStore } from "@/app/store/use-analytics-store";

type Props = {
  country: Country;
};

const TopProductsTable = ({ country }: Props) => {
  const { data } = useAnalyticsSalesStore();
  const { topProducts } = data;
  const [selectedRowId, setSelectedRowId] = useState<string | undefined>(
    undefined,
  );

  return (
    <Card className="relative w-full max-h-100 border rounded-md overflow-hidden flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="font-semibold uppercase">
          Top Products {COUNTRY_LABELS[country as Country]}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
        <Table noWrapper>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-7 pl-3 bg-card">#</TableHead>
              <TableHead className="h-7 bg-card">Product</TableHead>
              <TableHead className="h-7 text-right bg-card">Units</TableHead>
              <TableHead className="h-7 text-right bg-card">Orders</TableHead>
              {country !== "all" && (
                <TableHead className="h-7 pr-3 text-right bg-card">
                  Revenue
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-4 text-center text-muted-foreground"
                >
                  No data
                </TableCell>
              </TableRow>
            ) : (
              topProducts.map((p, i) => (
                <TableRow
                  key={p.productName}
                  className="hover:bg-muted/40"
                  data-state={
                    selectedRowId === p.productName ? "selected" : undefined
                  }
                  onClick={() =>
                    setSelectedRowId((prev) =>
                      prev === p.productName ? undefined : p.productName,
                    )
                  }
                >
                  <TableCell

                  // className="py-1 pl-3 font-semibold text-muted-foreground"
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    className={cn(
                      selectedRowId === p.productName &&
                        "border-blue-300 border ring-blue-400",
                    )}
                    // className="max-w-40 truncate py-1 font-medium"
                  >
                    {p.productName}
                  </TableCell>
                  <TableCell
                   className="py-1 text-right "
                   >
                    {fmt(p.totalQuantity)}
                  </TableCell>
                  <TableCell
                   className="py-1 text-right"
                   >
                    {p.totalOrders ?? "—"}
                  </TableCell>
                  {country !== "all" && (
                    <TableCell className="py-1 pr-3 text-right font-semibold">
                      {CURRENCY_SYMBOLS[country]}
                      {fmt(p.totalRevenue)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopProductsTable;
