import { CalendarDaysIcon, CalendarRange } from "lucide-react";
import { useState } from "react";
import { COUNTRY_LABELS, PERIOD_LABELS } from "../lib/utils";
import type { Country, Period } from "../types/period";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PeriodSelectProps {
  showAllCountry?: boolean;
  showCountrySelect?: boolean;
  value: Period;
  onChange: (p: Period) => void;
  country: Country;
  setCountry: (c: Country) => void;
  customFrom?: string;
  customTo?: string;
  onCustomRange?: (from: string, to: string) => void;
}

export function PeriodSelect({
  value,
  onChange,
  country,
  setCountry,
  customFrom = "",
  customTo = "",
  onCustomRange,
  showAllCountry = true,
  showCountrySelect = true,
}: PeriodSelectProps) {
  const [fromDate, setFromDate] = useState(customFrom);
  const [toDate, setToDate] = useState(customTo);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (fromDate && toDate) {
      onCustomRange?.(fromDate, toDate);
      setOpen(false);
    }
  };

  const displayLabel =
    value === "custom" && customFrom && customTo
      ? `${customFrom} - ${customTo}`
      : (PERIOD_LABELS[value] ?? value);

  return (
    <div className="flex flex-wrap gap-2">
      {/* Country filter */}
      {showCountrySelect && (
        <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(Object.keys(COUNTRY_LABELS) as Country[])
                .filter((c) => showAllCountry || c !== "all")
                .map((c) => (
                  <SelectItem key={c} value={c}>
                    {COUNTRY_LABELS[c]}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {/* Period filter */}
      <Select
        value={value === "custom" ? "custom" : value}
        onValueChange={(e) => {
          if (e !== "custom") {
            onChange(e as Period);
          } else {
            onChange("custom");
          }
        }}
      >
        <SelectTrigger className="w-35">
          <CalendarDaysIcon className="h-3.5 w-3.5 shrink-0" />
          <SelectValue>
            {value === "custom" ? "Custom Range" : PERIOD_LABELS[value]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(Object.keys(PERIOD_LABELS) as Period[])
              .filter((p) => p !== "custom")
              .map((p) => (
                <SelectItem key={p} value={p}>
                  {PERIOD_LABELS[p]}
                </SelectItem>
              ))}
            <SelectItem value="custom">
              <span className="flex items-center gap-1.5">
                <CalendarRange className="h-3.5 w-3.5" />
                Custom Range
              </span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Custom range popover — only visible when "custom" is selected */}
      {value === "custom" && onCustomRange && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <CalendarRange className="h-3.5 w-3.5" />
              {customFrom && customTo
                ? `${customFrom} – ${customTo}`
                : "Set dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="end">
            <div className="space-y-3">
              <p className="text-sm font-medium">Custom date range</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="date"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 flex-1 text-xs"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 flex-1 text-xs bg-new"
                  disabled={!fromDate || !toDate}
                  onClick={handleApply}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
