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
import { Skeleton } from "../ui/skeleton";

const CountryTable = () => {
  const { countries, loading } = useCountriesStore();
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined,
  );

  if (loading && countries.length === 0) {
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
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

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
