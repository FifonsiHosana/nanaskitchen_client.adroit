import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useCountriesStore } from "@/app/store/use_countries_store";
import { CircleFlag } from "react-circle-flags";
import { Card } from "../ui/card";
import { cn } from "@/app/lib/utils";

const CountryTable = () => {
  const { countries } = useCountriesStore();
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined,
  );

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Flag</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Country Code</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Currency Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.length > 0 ? (
            countries.map((country) => (
              <TableRow
                key={country.id}
                data-state={
                  selectedRowId === country.id ? "selected" : undefined
                }
                onClick={() =>
                  setSelectedRowId((prev) =>
                    prev === country.id ? undefined : country.id,
                  )
                }
                className="cursor-pointer"
              >
                <TableCell className="text-xs flex justify-center">
                  <CircleFlag
                    countryCode={country.countryCode.toLowerCase()}
                    className="max-h-15"
                  />
                </TableCell>
                <TableCell
                  className={cn(
                    selectedRowId === country.id &&
                      "border-blue-300 border ring-blue-400",
                  )}
                >
                  {country.countryLabel ?? "—"}
                </TableCell>
                <TableCell>{country.countryCode}</TableCell>
                <TableCell>{country.currencyLabel ?? "—"}</TableCell>
                <TableCell>{country.currencyCode ?? "—"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No admins found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CountryTable;
