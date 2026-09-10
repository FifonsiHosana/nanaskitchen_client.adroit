import { CalendarDaysIcon, CalendarRange } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useOrderParams } from "~/lib/useOrderParams";
import { PERIOD_LABELS } from "~/lib/utils";
import type { Period } from "~/types/period";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";

const ORDER_PERIOD_KEYS = (Object.keys(PERIOD_LABELS) as Period[]).filter(
  (period) => period !== "custom" && period !== "all_time",
);

export function OrderHeaderFilters() {
  const { params, setParam, setCustomRange } = useOrderParams();
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(params.customFrom);
  const [toDate, setToDate] = useState(params.customTo);

  const handleApply = () => {
    if (fromDate && toDate) {
      setCustomRange(fromDate, toDate);
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={params.country}
        onValueChange={(v) => setParam("country", v)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="GH">Ghana</SelectItem>
            <SelectItem value="US">USA</SelectItem>
            <SelectItem value="EU">Europe</SelectItem>
            <SelectItem value="all">All Countries</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={params.period}
        onValueChange={(v) => setParam("period", v as Period)}
      >
        <SelectTrigger
          className={`h-8 ${params.period === `custom` && "w-40"}`}
        >
          <CalendarDaysIcon className="h-3 w-3 shrink-0" />
          <SelectValue placeholder="This month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="this_week"></SelectItem>
            {ORDER_PERIOD_KEYS.map((p) => (
              <SelectItem key={p} value={p}>
                {PERIOD_LABELS[p]}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {params.period === "custom" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <CalendarRange className="h-3 w-3" />
              {params.customFrom && params.customTo
                ? `${params.customFrom} - ${params.customTo}`
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
                  variant="outline"
                  className="h-8 flex-1 text-xs"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 flex-1 text-xs"
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
