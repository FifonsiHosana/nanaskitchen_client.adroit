import React from "react";
import { Card } from "../../ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  children: React.ReactNode;
}

export function StatCard({
  label,
  value,
  description,
  children,
}: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-muted/50 p-4 pb-2">
      <div className="">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {children && <div className=" mt-7 h-full w-full ">{children}</div>}
    </div>
  );
}
